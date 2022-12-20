const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addLikeThread', () => {
    it('should persist add like thread and return add like thread correctly', async () => {
      const like = {
        userId: 'user-123',
        threadId: 'thread-123',
      };

      const fakeIdGenerator = () => '123';

      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action
      const result = await likeRepositoryPostgres.addLikeThread(like);

      // Assert
      const likeThread = await LikesTableTestHelper.findThreadLikes('like-123');
      expect(likeThread).toHaveLength(1);

      expect(result.rows[0].id).toEqual('like-123');
    });
  });
});
