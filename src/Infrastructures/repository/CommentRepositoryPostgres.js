const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const GotComment = require('../../Domains/comments/entities/GotComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const { content, threadId, owner } = comment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, threadId, owner],
    };

    const result = await this._pool.query(query);
    return new AddedComment(result.rows[0]);
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('komentar gagal diverifikasi');
    }
  }

  async verifyCommentAvaibility(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND is_delete = false',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT c.id, u.username, c.date, c.content, c.is_delete FROM comments c LEFT JOIN users u ON u.id = c.owner WHERE thread_id = $1 ORDER BY c.date ASC',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => new GotComment({
      id: row.id,
      username: row.username,
      date: row.date,
      content: row.content,
      isDelete: row.is_delete,

    }));
  }
}

module.exports = CommentRepositoryPostgres;
