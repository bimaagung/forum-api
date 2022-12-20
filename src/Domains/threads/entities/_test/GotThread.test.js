const GotThread = require('../GotThread');

describe('a GotThread entities', () => {
  it('should create gotComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      title: 'a thread',
      body: 'a body',
      date: '2022-02-02T02:22:22.222Z',
      username: 'dicoding',
    };

    // Action
    const {
      id, title, body, date, username,
    } = new GotThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
