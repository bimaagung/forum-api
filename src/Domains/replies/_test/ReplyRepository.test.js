const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
  it('should ', async () => {
    // Arrange
    const commentRepository = new ReplyRepository();

    // Action & Assert
    await expect(() => commentRepository.addReply({})).rejects.toThrowError('REPLY.METHOD_NOT_IMPLEMENTED');
    await expect(() => commentRepository.verifyReplyOwner({})).rejects.toThrowError('REPLY.METHOD_NOT_IMPLEMENTED');
    await expect(() => commentRepository.deleteReply({})).rejects.toThrowError('REPLY.METHOD_NOT_IMPLEMENTED');
    await expect(() => commentRepository.verifyReplyAvaibility({})).rejects.toThrowError('REPLY.METHOD_NOT_IMPLEMENTED');
    await expect(() => commentRepository.getRepliesByCommentId({})).rejects.toThrowError('REPLY.METHOD_NOT_IMPLEMENTED');
  });
});
