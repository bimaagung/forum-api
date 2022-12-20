const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const GotThread = require('../../Domains/threads/entities/GotThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread) {
    const { title, body, owner } = thread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner, date',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);
    return new AddedThread(result.rows[0]);
  }

  async getThreadById(id) {
    const query = {
      text: 'SELECT t.id, t.title, t.body, t.date, u.username FROM threads t LEFT JOIN users u ON u.id = t.owner WHERE t.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new GotThread(result.rows[0]);
  }

  async verifyThreadAvaibility(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
