const GotComment = require('../GotComment');

describe('a GotComment entities', () => {
  it("should content is '**komentar telah dihapus**' if comment is removed", () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2022-02-02T02:22:22.222Z',
      content: 'a comment',
      isDelete: true,
    };

    // Action
    const {
      id, username, date, content,
    } = new GotComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual('**komentar telah dihapus**');
  });

  it('should create gotComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2022-02-02T02:22:22.222Z',
      content: 'a comment',
      isDelete: false,
    };

    // Action
    const {
      id, username, date, content,
    } = new GotComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
