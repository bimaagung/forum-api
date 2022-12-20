/* instanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableHelper = {
  async addReply({
    id = 'reply-123', content = 'abc', commentId = 'comment-123', owner = 'user-123', date = '2022-02-02T02:22:22.222Z', isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO Replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, commentId, owner, date, isDelete],
    };

    await pool.query(query);
  },

  async findReply(id) {
    const query = {
      text: 'SELECT * FROM Replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM Replies WHERE 1 = 1');
  },
};

module.exports = RepliesTableHelper;
