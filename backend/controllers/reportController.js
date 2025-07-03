const PDFDocument = require('pdfkit');
const pool = require('../db/pool');

exports.generateTransactionReport = async (req, res) => {
  const { group_id } = req.query;

  if (!group_id) {
    return res.status(400).json({ error: 'group_id is required' });
  }

  try {
    const result = await pool.query(
      `SELECT u.full_name AS member_name, t.mpesa_code, t.amount, t.status, t.transaction_date
       FROM transactions t
       JOIN users u ON u.user_id = t.user_id
       WHERE t.group_id = $1
       ORDER BY t.transaction_date DESC`,
      [group_id]
    );

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // === 1. Response Headers ===
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=transaction_report.pdf');
    doc.pipe(res);

    // === 2. Title ===
    doc.fontSize(18).text('Chama Transaction Report', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(12).text(`Group ID: ${group_id}`, { align: 'center' });
    doc.moveDown(1);

    // === 3. Constants ===
    const rowHeight = 25;
    let y = 130;

    const drawTableHeader = () => {
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('Member', 50, y)
        .text('MPESA Code', 170, y)
        .text('Amount', 310, y)
        .text('Status', 390, y)
        .text('Date', 460, y);
      doc.moveTo(50, y + 18).lineTo(550, y + 18).stroke();
      y += 30;
    };

    drawTableHeader(); // Initial header
    doc.font('Helvetica').fontSize(11);

    // === 4. Table Rows ===
    for (const row of result.rows) {
      if (y > 750) {
        doc.addPage();
        y = 50;
        drawTableHeader();
      }

      doc
        .text(row.member_name, 50, y)
        .text(row.mpesa_code, 170, y)
        .text(`KES ${row.amount}`, 310, y)
        .text(row.status, 390, y)
        .text(new Date(row.transaction_date).toLocaleDateString(), 460, y);

      y += rowHeight;
    }

    doc.end();

  } catch (error) {
    console.error('❌ Failed to generate PDF report:', error);
    res.status(500).json({ error: 'Could not generate report' });
  }
};
