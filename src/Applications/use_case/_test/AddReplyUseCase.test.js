const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddReplyUserCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'abc',
      commentId: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const expectedReply = new AddedReply({
      id: 'reply-123',
      content: 'abc',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new AddedReply({
          id: 'reply-123',
          content: 'abc',
          owner: 'user-123',
        }),
      ));

    const addReplyUseCase = new AddReplyUserCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual(expectedReply);
    expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvaibility).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
      content: useCasePayload.content,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
    }));
  });
});
