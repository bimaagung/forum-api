const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.verifyReplyAvaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadAvaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.verifyReplyOwner)
      .toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
    expect(mockReplyRepository.verifyReplyAvaibility).toBeCalledWith(useCasePayload.replyId);
    expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvaibility).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
  });
});
