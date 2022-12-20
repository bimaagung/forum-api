const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('CommentRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addComment function', () => {
    it('should persist add comment and return add comment correctly', async () => {
      // Arrange
      const comment = new AddComment({
        content: 'abc',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action
      const result = await commentRepositoryPostgres.addComment(comment);

      // Assert
      const commentById = await CommentsTableTestHelper.findComment('comment-123');
      expect(commentById).toHaveLength(1);

      expect(result).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: comment.content,
        owner: comment.owner,
      }));
    });
  });

  describe('verifyCommentOwner function', () => {
    it("should throw AuthorizationError if owner haven't comment", async () => {
      const comment = {
        id: 'comment-123',
        owner: 'unkown_user',
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(comment.id, comment.owner))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError if owner have comment', async () => {
      const comment = {
        id: 'comment-123',
        owner: 'user-123',
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(comment.id, comment.owner))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('verifyCommentAvaibility function', () => {
    it('should throw NotFoundError if comment not found', async () => {
      const id = 'unkown_comment';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvaibility(id))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if comment found', async () => {
      const id = 'comment-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvaibility(id))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment from database', async () => {
      const id = 'comment-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      await commentRepositoryPostgres.deleteComment(id);

      // Assert
      const result = await CommentsTableTestHelper.findComment(id);
      expect(result).toHaveLength(1);
      expect(result[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should persist get comments by thread id and return get comments by thread id correctly sort date on ascending', async () => {
      const payloadA = {
        id: 'comment-123',
        content: 'abc',
        threadId: 'thread-123',
        owner: 'user-123',
        date: '2022-02-02T02:22:22.222Z',
        isDelete: false,
      };

      const payloadB = {
        id: 'comment-124',
        content: 'test comment',
        threadId: 'thread-123',
        owner: 'user-123',
        date: '2022-02-02T03:22:22.222Z',
        isDelete: true,
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment(payloadA);
      await CommentsTableTestHelper.addComment(payloadB);

      // Action
      const result = await commentRepositoryPostgres.getCommentsByThreadId(payloadA.threadId);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].id).toEqual(payloadA.id);
      expect(result[0].username).toEqual('dicoding');
      expect(result[0].content).toEqual(payloadA.content);
      expect(result[0].date).not.toBeNull();

      expect(result[1].id).toEqual(payloadB.id);
      expect(result[1].username).toEqual('dicoding');
      expect(result[1].content).toEqual('**komentar telah dihapus**');
      expect(result[1].date).not.toBeNull();
    });
  });
});
