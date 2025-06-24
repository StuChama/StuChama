const pool = require('../db/pool');

class TreasurerChamaModel {
    static async getGroupById(group_id) {
        try {
            const result = await pool.query(
                `SELECT * FROM groups WHERE group_id = $1`,
                [group_id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching group:', error);
            throw error;
        }
    }

    static async getGroupTransactions(group_id) {
        try {
            const result = await pool.query(
                `SELECT t.transaction_id, u.full_name AS member_name, t.mpesa_code, t.amount, t.status, t.transaction_date
                 FROM transactions t
                 JOIN users u ON t.user_id = u.user_id
                 WHERE t.group_id = $1
                 ORDER BY t.transaction_date DESC`,
                [group_id]
            );
            return result.rows;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    }

    static async verifyTransaction(transaction_id) {
        try {
            const result = await pool.query(
                `UPDATE transactions SET status = 'verified' WHERE transaction_id = $1 RETURNING *`,
                [transaction_id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error verifying transaction:', error);
            throw error;
        }
    }

    static async getMyFines(group_id, user_id) {
        try {
            const result = await pool.query(
                `SELECT * FROM fines WHERE group_id = $1 AND user_id = $2`,
                [group_id, user_id]
            );
            return result.rows;
        } catch (error) {
            console.error('Error fetching fines:', error);
            throw error;
        }
    }

    static async getChamaRules(group_id) {
        try {
            const result = await pool.query(
                `SELECT * FROM rules WHERE group_id = $1`,
                [group_id]
            );
            return result.rows;
        } catch (error) {
            console.error('Error fetching rules:', error);
            throw error;
        }
    }

    static async addNotification(user_id, message) {
        try {
            const result = await pool.query(
                `INSERT INTO notifications (user_id, message, status, created_at)
                 VALUES ($1, $2, 'unread', NOW())
                 RETURNING *`,
                [user_id, message]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error adding notification:', error);
            throw error;
        }
    }
}

module.exports = TreasurerChamaModel;
