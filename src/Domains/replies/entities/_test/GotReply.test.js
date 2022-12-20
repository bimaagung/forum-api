const GotReply = require('../GotReply');

describe('a GotReply entities', () => {
  it("should content is '**komentar telah dihapus**' if comment is removed", () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      commentId: 'comment-123',
      date: '2022-02-02T02:22:22.222Z',
      content: 'a comment',
      isDelete: true,
    };

    // Action
    const {
      id, username, commentId, date, content,
    } = new GotReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(commentId).toEqual(payload.commentId);
    expect(date).toEqual(payload.date);
    expect(content).toEqual('**balasan telah dihapus**');
  });

  it('should create gotReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      commentId: 'comment-123',
      date: '2022-02-02T02:22:22.222Z',
      content: 'a comment',
      isDelete: false,
    };

    // Action
    const {
      id, username, commentId, date, content,
    } = new GotReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(commentId).toEqual(payload.commentId);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
