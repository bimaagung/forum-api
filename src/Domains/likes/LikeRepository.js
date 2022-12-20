class LikeRepository {
  async addLikeThread({ userId, threadId }) {
    throw new Error('COMMENT.METHOD_NOT_IMPLEMENTED');
  }

  async deleteLikeThread({ userId, threadId }) {
    throw new Error('COMMENT.METHOD_NOT_IMPLEMENTED');
  }

  async verifyLikeThread({ userId, threadId }) {
    throw new Error('COMMENT.METHOD_NOT_IMPLEMENTED');
  }

  async totalLikeThread(threadId) {
    throw new Error('COMMENT.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeRepository;
