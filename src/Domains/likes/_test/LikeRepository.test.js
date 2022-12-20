const LikeRepository = require('../LikeRepository');

describe('LikeRepository interfase', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action & Assert
    await expect(() => likeRepository.addLikeThread({})).rejects.toThrowError('COMMENT.METHOD_NOT_IMPLEMENTED');
    await expect(() => likeRepository.deleteLikeThread({})).rejects.toThrowError('COMMENT.METHOD_NOT_IMPLEMENTED');
    await expect(() => likeRepository.verifyLikeThread({})).rejects.toThrowError('COMMENT.METHOD_NOT_IMPLEMENTED');
    await expect(() => likeRepository.totalLikeThread({})).rejects.toThrowError('COMMENT.METHOD_NOT_IMPLEMENTED');
  });
});
