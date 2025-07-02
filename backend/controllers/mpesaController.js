// backend/controllers/mpesaController.js

const axios = require('axios');
const pool  = require('../db/pool');

// In‐memory cache for the OAuth token
let accessToken = '';

/** Fetch (and cache) M-Pesa OAuth token */
async function getAccessToken() {
  if (accessToken) return accessToken;
  const creds = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const resp = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${creds}` } }
  );
  if (!resp.data.access_token) {
    throw new Error('Failed to get M-Pesa access token');
  }
  accessToken = resp.data.access_token;
  return accessToken;
}

/** Create timestamp in YYYYMMDDhhmmss */
function getTimestamp() {
  return new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14);
}

/** Build STK password */
function getPassword(timestamp) {
  return Buffer.from(
    process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
  ).toString('base64');
}

/**
 * Initiate an STK Push (Auto M-Pesa)
 * Records a PENDING row in `transactions` but does not update fines/contributions yet.
 */
exports.stkPush = async (req, res) => {
  const { phone, amount, user_id, group_id, goal_id, fine_id } = req.body;
  const parsedAmount = parseFloat(amount);
  if (!phone || !user_id || !group_id || isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  try {
    const token     = await getAccessToken();
    const timestamp = getTimestamp();
    const password  = getPassword(timestamp);

    // For testing you can override with MPESA_TEST_AMOUNT
    const stkAmount = process.env.MPESA_TEST_AMOUNT
      ? parseFloat(process.env.MPESA_TEST_AMOUNT)
      : parsedAmount;

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password:          password,
      Timestamp:         timestamp,
      TransactionType:   'CustomerPayBillOnline',
      Amount:            stkAmount,
      PartyA:            phone.replace(/^0/, '254'),
      PartyB:            process.env.MPESA_SHORTCODE,
      PhoneNumber:       phone.replace(/^0/, '254'),
      CallBackURL:       process.env.MPESA_CALLBACK_URL,
      AccountReference:  `CHAMA-${group_id}`,
      TransactionDesc:   fine_id ? 'Chama Fine Payment' : 'Chama Contribution'
    };

    const stkRes = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResponseCode,
      ResponseDescription
    } = stkRes.data;

    // Persist as Pending
    await pool.query(
      `INSERT INTO transactions
         (user_id, group_id, goal_id, fine_id, mpesa_code, amount, status)
       VALUES ($1,$2,$3,$4,$5,$6,'Pending')`,
      [user_id, group_id, goal_id || null, fine_id || null, CheckoutRequestID, parsedAmount]
    );

    // Return the M-Pesa push response back to frontend
    return res.json({
      MerchantRequestID,
      CheckoutRequestID,
      ResponseCode,
      ResponseDescription
    });
  } catch (err) {
    console.error('[STK PUSH ERROR]', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to initiate STK Push' });
  }
};

/**
 * Callback endpoint for M-Pesa to notify of transaction result.
 * Updates the `transactions` row to Success/Failed, then on Success
 * updates fines or inserts a contribution.
 */
exports.mpesaCallback = async (req, res) => {
  res.status(200).json({ Received: true }); // ack Safaricom immediately

  try {
    const cb = req.body.Body.stkCallback;
    const checkoutID = cb.CheckoutRequestID;
    const resultCode = Number(cb.ResultCode);
    const status     = resultCode === 0 ? 'Success' : 'Failed';

    // 1) Flip the transaction status
    await pool.query(
      `UPDATE transactions
          SET status = $1,
              transaction_date = NOW()
        WHERE mpesa_code = $2`,
      [status, checkoutID]
    );

    if (status !== 'Success') {
      console.log(`M-Pesa callback failed or cancelled: ${resultCode}`);
      return;
    }

    // 2) Fetch the transaction to know goal_id vs. fine_id
    const txRes = await pool.query(
      `SELECT user_id, group_id, goal_id, fine_id, amount
         FROM transactions
        WHERE mpesa_code = $1`,
      [checkoutID]
    );
    if (!txRes.rowCount) {
      console.warn('Unknown transaction in callback:', checkoutID);
      return;
    }
    const { user_id, group_id, goal_id, fine_id, amount } = txRes.rows[0];

    // 3a) If fine payment, mark fine(s) as Paid
    if (fine_id) {
      if (fine_id === 'all') {
        await pool.query(
          `UPDATE fines
              SET status = 'Paid'
            WHERE group_id = $1
              AND user_id = $2
              AND status = 'Unpaid'`,
          [group_id, user_id]
        );
      } else {
        await pool.query(
          `UPDATE fines
              SET status = 'Paid'
            WHERE fine_id = $1
              AND user_id = $2`,
          [fine_id, user_id]
        );
      }
    }
    // 3b) Otherwise it's a contribution
    else if (goal_id) {
      await pool.query(
        `INSERT INTO contributions (goal_id, user_id, amount)
         VALUES ($1,$2,$3)`,
        [goal_id, user_id, amount]
      );
    }
  } catch (err) {
    console.error('[M-PESA CALLBACK ERROR]', err);
  }
};

/**
 * Query the status of an STK Push (pollable endpoint).
 * Reads the numeric ResultCode and updates transactions accordingly.
 */
exports.queryPaymentStatus = async (req, res) => {
  const { checkoutRequestID } = req.body;
  if (!checkoutRequestID) {
    return res.status(400).json({ error: 'Missing checkoutRequestID' });
  }

  try {
    const token     = await getAccessToken();
    const timestamp = getTimestamp();
    const password  = getPassword(timestamp);

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password:          password,
      Timestamp:         timestamp,
      CheckoutRequestID: checkoutRequestID
    };

    const resp = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      payload,
      { headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }}
    );

    const data       = resp.data;
    const resultCode = Number(data.ResultCode);
    const status     = resultCode === 0 ? 'Success' : 'Failed';

    // Update the transaction status
    await pool.query(
      `UPDATE transactions
          SET status = $1,
              transaction_date = NOW()
        WHERE mpesa_code = $2`,
      [status, checkoutRequestID]
    );

    // On success, insert into contributions or mark fines
    if (status === 'Success') {
      const txRes = await pool.query(
        `SELECT user_id, group_id, goal_id, fine_id, amount
           FROM transactions
          WHERE mpesa_code = $1`,
        [checkoutRequestID]
      );
      if (txRes.rowCount === 1) {
        const { user_id, goal_id, fine_id, amount } = txRes.rows[0];
        if (fine_id) {
          await pool.query(
            `UPDATE fines SET status = 'Paid' WHERE fine_id = $1 AND user_id = $2`,
            [fine_id, user_id]
          );
        } else if (goal_id) {
          await pool.query(
            `INSERT INTO contributions (goal_id, user_id, amount) VALUES ($1,$2,$3)`,
            [goal_id, user_id, amount]
          );
        }
      }
    }

    return res.json({
      message:    data.ResultDesc,
      resultCode: data.ResultCode,
      status
    });
  } catch (err) {
    console.error('[STK PUSH QUERY ERROR]', err.response?.data || err.message);
    return res.status(502).json({ error: 'Failed to query payment status' });
  }
};
