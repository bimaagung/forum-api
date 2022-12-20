const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const Thread = require('../../../Domains/threads/entities/Thread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return add thread correctly', async () => {
      // Arrange
      const thread = new Thread({
        title: 'a thread',
        body: 'a body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await UsersTableTestHelper.addUser({});

      // Action
      const result = await threadRepositoryPostgres.addThread(thread);

      // Assert
      const threadById = await ThreadsTableTestHelper.findThread('thread-123');
      expect(threadById).toHaveLength(1);
      expect(result).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: thread.title,
        owner: thread.owner,
      }));
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError if thread not found', async () => {
      // Arrange
      const id = 'unkown_thread';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById(id)).rejects.toThrow(NotFoundError);
    });

    it('should persist get thread by id and return get thread by id correctly', async () => {
      // Arrange
      const payloadIdThread = 'thread-123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action
      const {
        id, title, body, date, username,
      } = await threadRepositoryPostgres.getThreadById(payloadIdThread);

      // Assert
      expect(id).toEqual(payloadIdThread);
      expect(title).toEqual('a thread');
      expect(body).toEqual('a body');
      expect(username).toEqual('dicoding');
      expect(date).not.toBeNull();
    });
  });

  describe('verifyThreadAvaibility', () => {
    it('should throw NotFoundError if thread not available', async () => {
      // Arrange
      const id = 'unkown_thread';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvaibility(id))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if thread available', async () => {
      // Arrange
      const threadId = 'thread-123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvaibility(threadId))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});
