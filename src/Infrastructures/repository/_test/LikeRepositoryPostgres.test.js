const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  let likeRepositoryPostgres;

  beforeEach(async () => {
    const fakeIdGenerator = () => '123';

    likeRepositoryPostgres = new LikeRepositoryPostgres(
      pool,
      fakeIdGenerator,
    );

    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLikeComment', () => {
    it('should persist add like comment and return add like comment correctly', async () => {
      // Arrange
      const like = {
        userId: 'user-123',
        commentId: 'comment-123',
      };

      // Action
      const result = await likeRepositoryPostgres.addLikeComment(like.userId, like.commentId);

      // Assert
      const likeComment = await LikesTableTestHelper.findCommentLikes('like-123');
      expect(likeComment).toHaveLength(1);

      expect(result.rows[0].id).toEqual('like-123');
    });
  });

  describe('deleteLikeComment', () => {
    it('should delete like comment from database', async () => {
      // Arrange
      const like = {
        userId: 'user-123',
        commentId: 'comment-123',
      };

      await LikesTableTestHelper.addCommentLikes({});

      // Action
      await likeRepositoryPostgres.deleteLikeComment(like.userId, like.commentId);

      // Assert
      const result = await LikesTableTestHelper.findCommentLikes('like-123');
      expect(result).toHaveLength(0);
    });
  });

  describe('verifyLikeComment', () => {
    it('should return 1 when the user has liked the comment', async () => {
      // Arrange
      const like = {
        userId: 'user-123',
        commentId: 'comment-123',
      };

      await LikesTableTestHelper.addCommentLikes({});

      // Action & Assert
      await expect(likeRepositoryPostgres.verifyLikeComment(like.userId, like.commentId))
        .resolves.toBe(1);
    });

    it('should return 0 when the user has not liked the comment', async () => {
      // Arrange
      const like = {
        userId: 'user-123',
        commentId: 'comment-123',
      };

      // Action & Assert
      await expect(likeRepositoryPostgres.verifyLikeComment(like.userId, like.commentId))
        .resolves.toBe(0);
    });
  });

  describe('totalLikeComment', () => {
    it('should correctly return the total number of likes on the comment', async () => {
      // Arrange
      const commentIds = ['comment-123', 'comment-124'];

      const expectedLikes = [
        {
          comment_id: 'comment-124',
          count: 1,
        },
        {
          comment_id: 'comment-123',
          count: 2,
        },
      ];

      // add new user
      await UsersTableTestHelper.addUser({
        id: 'user-124',
        username: 'dicoding_b',
        password: 'secret',
        fullname: 'Dicoding B',
      });

      // add new comment
      await CommentsTableTestHelper.addComment({
        id: 'comment-124',
        content: 'a comment',
        owner: 'user-124',
        threadId: 'thread-123',
        isDelete: false,
      });

      // add like
      await LikesTableTestHelper.addCommentLikes({});
      await LikesTableTestHelper.addCommentLikes({
        id: 'like-124',
        userId: 'user-124',
        commentId: 'comment-123',
      });
      await LikesTableTestHelper.addCommentLikes({
        id: 'like-125',
        userId: 'user-123',
        commentId: 'comment-124',
      });

      // Action
      const result = await likeRepositoryPostgres.totalLikeComment(commentIds);
      // Assert
      expect(result).toStrictEqual(expectedLikes);
    });
  });
});
