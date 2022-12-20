const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should ', async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action & Assert
    await expect(() => commentRepository.addComment({})).rejects.toThrowError('COMMENT.METHOD_NOT_IMPLEMENTED');
    await expect(() => commentRepository.verifyCommentOwner({})).rejects.toThrowError('COMMENT.METHOD_NOT_IMPLEMENTED');
    await expect(() => commentRepository.deleteComment({})).rejects.toThrowError('COMMENT.METHOD_NOT_IMPLEMENTED');
    await expect(() => commentRepository.verifyCommentAvaibility({})).rejects.toThrowError('COMMENT.METHOD_NOT_IMPLEMENTED');
    await expect(() => commentRepository.getCommentsByThreadId({})).rejects.toThrowError('COMMENT.METHOD_NOT_IMPLEMENTED');
  });
});
