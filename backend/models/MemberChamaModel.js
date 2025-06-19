// models/MemberChamaModel.js

const pool = require('../db/pool');

class MemberChamaModel {
  /**
   * Get group details by ID
   */
  static async getGroupDetails(group_id) {
    try {
      const result = await pool.query(
        'SELECT * FROM groups WHERE group_id = $1',
        [group_id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching group details:', error);
      throw error;
    }
  }

  /**
   * Get fines for a specific member in a group
   */
  static async getMemberFines(group_id, user_id) {
    try {
      const result = await pool.query(
        'SELECT * FROM fines WHERE group_id = $1 AND user_id = $2',
        [group_id, user_id]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching member fines:', error);
      throw error;
    }
  }

  /**
   * Get group progress based on contributions and goal
   */
  static async getGroupProgress(group_id) {
    try {
      const goalResult = await pool.query(
        `SELECT g.goal_name, g.target_amount, g.deadline,
                COALESCE(SUM(c.amount), 0) as total_contributed
         FROM goals g
         LEFT JOIN contributions c ON g.goal_id = c.goal_id
         WHERE g.group_id = $1
         GROUP BY g.goal_id`,
        [group_id]
      );
      return goalResult.rows;
    } catch (error) {
      console.error('Error fetching group progress:', error);
      throw error;
    }
  }

  /**
   * Get contributions by a specific member in a group
   */
  static async getMemberContributions(group_id, user_id) {
    try {
      const result = await pool.query(
        `SELECT c.contribution_id, c.amount, c.contributed_at, g.goal_name
         FROM contributions c
         JOIN goals g ON c.goal_id = g.goal_id
         WHERE g.group_id = $1 AND c.user_id = $2
         ORDER BY c.contributed_at DESC`,
        [group_id, user_id]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching member contributions:', error);
      throw error;
    }
  }
}

module.exports = MemberChamaModel;
