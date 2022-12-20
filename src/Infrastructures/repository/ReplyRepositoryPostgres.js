const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const GotReply = require('../../Domains/replies/entities/GotReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(reply) {
    const { content, commentId, owner } = reply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, commentId, owner],
    };

    const result = await this._pool.query(query);
    return new AddedReply(result.rows[0]);
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('balasan gagal diverifikasi');
    }
  }

  async verifyReplyAvaibility(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND is_delete = false',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getRepliesByCommentId(commentIds) {
    const query = {
      text: 'SELECT replies.*, users.username FROM replies INNER JOIN users ON users.id = replies.owner WHERE replies.comment_id = ANY($1::text[]) ORDER BY replies.date ASC',
      values: [commentIds],
    };
    const result = await this._pool.query(query);

    return result.rows.map((row) => new GotReply({
      id: row.id,
      username: row.username,
      commentId: row.comment_id,
      date: row.date,
      content: row.content,
      isDelete: row.is_delete,
    }));
  }
}

module.exports = ReplyRepositoryPostgres;
