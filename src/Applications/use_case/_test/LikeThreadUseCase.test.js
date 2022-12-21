const LikeRepository = require('../../../Domains/likes/LikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  let mockLikeRepository;
  let mockCommentRepository;
  let mockThreadRepository;

  const useCasePayload = {
    userId: 'user-123',
    threadId: 'thread-123',
    commentId: 'comment-123',
  };

  beforeEach(() => {
    mockLikeRepository = new LikeRepository();
    mockCommentRepository = new CommentRepository();
    mockThreadRepository = new ThreadRepository();
  });
  it('should user like the comment and the result is correct', async () => {
    // Arrange
    mockThreadRepository.verifyThreadAvaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(0));
    mockLikeRepository.addLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvaibility).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.verifyLikeComment)
      .toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikeRepository.addLikeComment)
      .toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });

  it('should user unlike the comment and the result is correct', async () => {
    // Arrange
    mockThreadRepository.verifyThreadAvaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(1));
    mockLikeRepository.deleteLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvaibility).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.verifyLikeComment)
      .toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikeRepository.deleteLikeComment)
      .toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });
});
