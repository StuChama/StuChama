// models/ChairpersonChamaModel.js

const pool = require('../db/pool');

class ChairpersonChamaModel {
  // Get chama by ID
  static async getChamaById(group_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM groups WHERE group_id = $1`,
        [group_id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching chama by ID:', error);
      throw error;
    }
  }

  // Get all members of a chama
  static async getChamaMembers(group_id) {
    try {
      const result = await pool.query(
        `SELECT users.user_id, users.full_name, users.email, users.profile_picture, group_members.role
         FROM group_members
         JOIN users ON group_members.user_id = users.user_id
         WHERE group_members.group_id = $1`,
        [group_id]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching chama members:', error);
      throw error;
    }
  }

  static async createChama({ group_name, description, created_by, group_code }) {
  try {
    const result = await pool.query(
      `INSERT INTO groups (group_name, description, created_by, group_code, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [group_name, description, created_by, group_code]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating chama:', error);
    throw error;
  }
}

// Add member to chama
static async addMemberToChama({ user_id, group_id, role }) {
  try {
    const result = await pool.query(
      `INSERT INTO group_members (user_id, group_id, role, joined_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [user_id, group_id, role]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding member to chama:', error);
    throw error;
  }
}

 // Get fines for a user in a specific chama (optionally filtered by status)
  static async getFinesByUser(user_id, group_id, status = 'Unpaid') {
    try {
      const values = [user_id, group_id];
      let query = `
        SELECT * FROM fines
        WHERE user_id = $1 AND group_id = $2
      `;

      if (status) {
        query += ` AND status = $3`;
        values.push(status);
      }

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error fetching user fines:', error);
      throw error;
    }
  }

  // Get all fines for a chama
  static async getChamaFines(group_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM fines WHERE group_id = $1`,
        [group_id]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching chama fines:', error);
      throw error;
    }
  }

static async getUserChamas(user_id) {
  try {
    const result = await pool.query(
      `
      SELECT g.*, gm.role AS "userRole"
      FROM groups g
      JOIN group_members gm ON g.group_id = gm.group_id
      WHERE gm.user_id = $1
      `,
      [user_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching user chamas:', error);
    throw error;
  }
}


  // Get fines for a specific member in a chama
  static async getMemberFines(group_id, user_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM fines 
         WHERE group_id = $1 AND user_id = $2`,
        [group_id, user_id]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching member fines:', error);
      throw error;
    }
  }

  
static async getAllContributionsToGoal(goal_id, user_id = null) {
  try {
    let query = `SELECT * FROM contributions WHERE goal_id = $1`;
    const values = [goal_id];

    if (user_id) {
      query += ` AND user_id = $2`;
      values.push(user_id);
    }

    query += ` ORDER BY contributed_at DESC`;

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error fetching contributions to goal:', error);
    throw error;
  }
}



  // Get all rules for a chama
  static async getChamaRules(group_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM rules WHERE group_id = $1`,
        [group_id]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching chama rules:', error);
      throw error;
    }
  }

   // Get goal info for a chama
  static async getChamaGoals(group_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM goals WHERE group_id = $1`,
        [group_id]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching chama goals:', error);
      throw error;
    }
  }
  // Get all chamas (groups)
static async getAllChamas() {
  try {
    const result = await pool.query('SELECT * FROM groups');
    return result.rows;
  } catch (error) {
    console.error('Error fetching all chamas:', error);
    throw error;
  }
}


 
  // Add new fine
  static async addFine(group_id, user_id, fineData) {
    try {
      const { amount, reason, status = 'unpaid' } = fineData;
      const result = await pool.query(
        `INSERT INTO fines 
         (group_id, user_id, amount, reason, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [group_id, user_id, amount, reason, status]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error adding fine:', error);
      throw error;
    }
  }

  // Update chama basic info
  static async updateChama(group_id, updateData) {
    const { group_name, description } = updateData;
    try {
      const result = await pool.query(
        `UPDATE groups
         SET group_name = $1,
             description = $2
         WHERE group_id = $3
         RETURNING *`,
        [group_name, description, group_id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating chama:', error);
      throw error;
    }
  }
}

module.exports = ChairpersonChamaModel;
