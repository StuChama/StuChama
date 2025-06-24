const axios = require('axios');
const pool = require('../db/pool');

const formatPhone = (num) => num.replace(/^0/, '254');

const stkPush = async (req, res) => {
  const { phone, amount, user_id, group_id, goal_id, fine_id } = req.body;
  console.log('[🔔 STK Request Body]', req.body);

  const parsedAmount = parseInt(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: 'Invalid amount value' });
  }

  if (!phone || !amount || !user_id || !group_id) {
    console.log('[⛔ Missing Core Fields]', { phone, amount, user_id, group_id });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const isFinePayment = !goal_id && fine_id;

  try {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const tokenRes = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const accessToken = tokenRes.data.access_token;
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const stkPayload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: parsedAmount,
      PartyA: formatPhone(phone),
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formatPhone(phone),
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `CHAMA-${group_id}`,
      TransactionDesc: isFinePayment ? 'Chama Fine Payment' : 'Chama Contribution'
    };

    const stkRes = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const mpesaCode = stkRes.data.CheckoutRequestID;

    if (isFinePayment) {
      // 🔁 Update fine(s) only — no transactions or contributions
      if (fine_id === 'all') {
        await pool.query(
          `UPDATE fines SET status = 'Paid'
           WHERE group_id = $1 AND user_id = $2 AND status = 'Unpaid'`,
          [group_id, user_id]
        );
      } else {
        await pool.query(
          `UPDATE fines SET status = 'Paid'
           WHERE fine_id = $1 AND user_id = $2`,
          [fine_id, user_id]
        );
      }
    } else {
      // 💰 Normal contribution — insert into transactions and contributions
      await pool.query(
        `INSERT INTO transactions (user_id, group_id, mpesa_code, amount, status, goal_id)
         VALUES ($1, $2, $3, $4, 'Success', $5)`,
        [user_id, group_id, mpesaCode, parsedAmount, goal_id]
      );

      await pool.query(
        `INSERT INTO contributions (goal_id, user_id, amount)
         VALUES ($1, $2, $3)`,
        [goal_id, user_id, parsedAmount]
      );
    }

    return res.status(200).json({
      message: 'STK Push sent and payment recorded',
      checkoutRequestID: mpesaCode
    });
  } catch (error) {
    console.error('[❌ STK PUSH ERROR]', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to initiate STK push' });
  }
};

module.exports = {
  stkPush
};
