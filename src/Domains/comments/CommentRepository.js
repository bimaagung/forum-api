class CommentRepository {
  async addComment(comment) {
    throw new Error('COMMENT.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentOwner(id, owner) {
    throw new Error('COMMENT.METHOD_NOT_IMPLEMENTED');
  }

  async deleteComment(id) {
    throw new Error('COMMENT.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentAvaibility(id) {
    throw new Error('COMMENT.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentsByThreadId(threadId) {
    throw new Error('COMMENT.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentRepository;
