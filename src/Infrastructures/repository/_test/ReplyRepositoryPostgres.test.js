const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

describe('ReplyRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addReply function', () => {
    it('should persist add reply and return add reply correctly', async () => {
      // Arrange
      const reply = new AddReply({
        content: 'abc',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      const result = await replyRepositoryPostgres.addReply(reply);

      // Assert
      const replyById = await RepliesTableTestHelper.findReply('reply-123');
      expect(replyById).toHaveLength(1);

      expect(result).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: reply.content,
        owner: reply.owner,
      }));
    });
  });

  describe('verifyReplyOwner function', () => {
    it("should throw AuthorizationError if owner haven't reply", async () => {
      const reply = {
        id: 'reply-123',
        owner: 'unkown_user',
      };

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(reply.id, reply.owner))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError if owner have reply', async () => {
      const reply = {
        id: 'reply-123',
        owner: 'user-123',
      };

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(reply.id, reply.owner))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('verifyReplyAvaibility function', () => {
    it('should throw NotFoundError if reply not found', async () => {
      const id = 'unkown_reply';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvaibility(id))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if reply found', async () => {
      const id = 'reply-123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvaibility(id))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply from database', async () => {
      const id = 'reply-123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      // Action
      await replyRepositoryPostgres.deleteReply(id);

      // Assert
      const result = await RepliesTableTestHelper.findReply(id);
      expect(result).toHaveLength(1);
      expect(result[0].is_delete).toEqual(true);
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should persist get replies by comment id and return get replies by comment id correctly sort date on ascending', async () => {
      const payloadCommentA = {
        id: 'comment-124',
        content: 'a thread A',
        threadId: 'thread-123',
        owner: 'user-123',
        date: '2022-02-03T02:22:22.222Z',
        isDelete: false,
      };

      const payloadReplyA = {
        id: 'reply-123',
        content: 'abc',
        commentId: 'comment-123',
        owner: 'user-123',
        date: '2022-02-01T19:22:22.222Z',
        isDelete: false,
      };

      const payloadReplyB = {
        id: 'reply-124',
        content: 'test reply',
        commentId: 'comment-123',
        owner: 'user-123',
        date: '2022-02-02T02:22:22.222Z',
        isDelete: true,
      };

      const payloadReplyC = {
        id: 'reply-125',
        content: 'test reply',
        commentId: 'comment-124',
        owner: 'user-123',
        date: '2022-02-03T02:22:22.222Z',
        isDelete: false,
      };

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment(payloadCommentA);
      await RepliesTableTestHelper.addReply(payloadReplyA);
      await RepliesTableTestHelper.addReply(payloadReplyB);
      await RepliesTableTestHelper.addReply(payloadReplyC);

      // Action
      const result = await replyRepositoryPostgres
        .getRepliesByCommentId([
          'comment-123',
          payloadCommentA.id,
        ]);

      // Assert
      expect(result).toHaveLength(3);

      expect(result[0].id).toEqual(payloadReplyA.id);
      expect(result[0].username).toEqual('dicoding');
      expect(result[0].commentId).toEqual(payloadReplyA.commentId);
      expect(result[0].content).toEqual(payloadReplyA.content);
      expect(result[0].date).not.toBeNull();

      expect(result[1].id).toEqual(payloadReplyB.id);
      expect(result[1].username).toEqual('dicoding');
      expect(result[0].commentId).toEqual(payloadReplyA.commentId);
      expect(result[1].content).toEqual('**balasan telah dihapus**');
      expect(result[1].date).not.toBeNull();

      expect(result[2].id).toEqual(payloadReplyC.id);
      expect(result[2].username).toEqual('dicoding');
      expect(result[0].commentId).toEqual(payloadReplyB.commentId);
      expect(result[2].content).toEqual(payloadReplyC.content);
      expect(result[2].date).not.toBeNull();
    });
  });
});
