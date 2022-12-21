/* instanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableHelper = {
  async addCommentLikes({
    id = 'like-123', userId = 'user-123', commentId = 'comment-123',
  }) {
    const query = {
      text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3)',
      values: [id, userId, commentId],
    };

    await pool.query(query);
  },

  async findCommentLikes(id) {
    const query = {
      text: 'SELECT * FROM user_comment_likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM user_comment_likes WHERE 1 = 1');
  },
};

module.exports = LikesTableHelper;
