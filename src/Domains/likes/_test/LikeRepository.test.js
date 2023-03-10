const LikeRepository = require('../LikeRepository');

describe('LikeRepository interfase', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action & Assert
    await expect(() => likeRepository.addLikeComment({})).rejects.toThrowError('COMMENT.METHOD_NOT_IMPLEMENTED');
    await expect(() => likeRepository.deleteLikeComment({})).rejects.toThrowError('COMMENT.METHOD_NOT_IMPLEMENTED');
    await expect(() => likeRepository.verifyLikeComment({})).rejects.toThrowError('COMMENT.METHOD_NOT_IMPLEMENTED');
    await expect(() => likeRepository.totalLikeComment({})).rejects.toThrowError('COMMENT.METHOD_NOT_IMPLEMENTED');
  });
});
