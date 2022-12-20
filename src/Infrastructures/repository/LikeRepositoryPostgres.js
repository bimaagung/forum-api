const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLikeThread({ userId, threadId }) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO user_thread_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, threadId],
    };

    return this._pool.query(query);
  }
}

module.exports = LikeRepositoryPostgres;
