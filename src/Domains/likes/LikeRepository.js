class LikeRepository {
  async addLikeComment(userId, commentId) {
    throw new Error('COMMENT.METHOD_NOT_IMPLEMENTED');
  }

  async deleteLikeComment(userId, commentId) {
    throw new Error('COMMENT.METHOD_NOT_IMPLEMENTED');
  }

  async verifyLikeComment(userId, commentId) {
    throw new Error('COMMENT.METHOD_NOT_IMPLEMENTED');
  }

  async totalLikeComment(commentId) {
    throw new Error('COMMENT.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeRepository;
