const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLikeComment(userId, commentId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, commentId],
    };

    return this._pool.query(query);
  }

  async deleteLikeComment(userId, commentId) {
    const query = {
      text: 'DELETE FROM user_comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    await this._pool.query(query);
  }

  async verifyLikeComment(userId, commentId) {
    const query = {
      text: 'SELECT * FROM user_comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }

  async totalLikeComment(commentId) {
    const query = {
      text: 'SELECT * FROM user_comment_likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }
}

module.exports = LikeRepositoryPostgres;
