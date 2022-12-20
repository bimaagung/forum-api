const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
    };

    // Action
    expect(() => new AddComment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    // Arrange
    const payload = {
      content: true,
      threadId: 123,
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'abc',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const { content, threadId, owner } = new AddComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
