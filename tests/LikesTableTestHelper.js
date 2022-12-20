/* instanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableHelper = {
  async addThreadLikes({
    id = 'likes-123', userId = 'user-123', threadId = 'thread-123',
  }) {
    const query = {
      text: 'INSERT INTO user_thread_likes VALUES($1, $2, $3)',
      values: [id, userId, threadId],
    };

    await pool.query(query);
  },

  async findThreadLikes(id) {
    const query = {
      text: 'SELECT * FROM user_thread_likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM user_thread_likes WHERE 1 = 1');
  },
};

module.exports = LikesTableHelper;
