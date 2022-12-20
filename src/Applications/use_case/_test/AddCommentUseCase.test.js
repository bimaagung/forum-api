const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUserCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = new AddComment({
      content: 'abc',
      threadId: 'thread-123',
      owner: 'user-123',
    });

    const expectedComment = new AddedComment({
      id: 'comment-123',
      content: 'abc',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new AddedComment({
          id: 'comment-123',
          content: 'abc',
          owner: 'user-123',
        }),
      ));

    const addCommentUseCase = new AddCommentUserCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual(expectedComment);
    expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(useCasePayload);
  });
});
