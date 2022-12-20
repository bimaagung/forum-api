const Thread = require('../Thread');

describe('a Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
      body: 'abc',
    };

    // Action
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    // Arrange
    const payload = {
      title: true,
      body: 123,
      owner: true,
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create Thread object correctly', () => {
    // Arrange
    const payload = {
      title: 'abc',
      body: 'abc',
      owner: 'user-123',
    };

    // Action
    const {
      title, body, owner,
    } = new Thread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
