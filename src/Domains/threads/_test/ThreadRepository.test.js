const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should ', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    await expect(() => threadRepository.addThread({})).rejects.toThrowError('THREAD.METHOD_NOT_IMPLEMENTED');
    await expect(() => threadRepository.getThreadById({})).rejects.toThrowError('THREAD.METHOD_NOT_IMPLEMENTED');
    await expect(() => threadRepository.verifyThreadAvaibility({})).rejects.toThrowError('THREAD.METHOD_NOT_IMPLEMENTED');
  });
});
