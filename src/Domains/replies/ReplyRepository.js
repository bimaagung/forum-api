class ReplyRepository {
  async addReply(comment) {
    throw new Error('REPLY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyOwner(id, owner) {
    throw new Error('REPLY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReply(id) {
    throw new Error('REPLY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyAvaibility(id) {
    throw new Error('REPLY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesByCommentId(commentId) {
    throw new Error('REPLY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ReplyRepository;
