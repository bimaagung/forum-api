/* instanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableHelper = {
  async addComment({
    id = 'comment-123', content = 'abc', threadId = 'thread-123', owner = 'user-123', date = '2022-02-02T02:22:22.222Z', isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, threadId, owner, date, isDelete],
    };

    await pool.query(query);
  },

  async findComment(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1 = 1');
  },
};

module.exports = CommentsTableHelper;
