class LikeCommentUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { userId, threadId, commentId } = useCasePayload;
    await this._threadRepository.verifyThreadAvaibility(threadId);
    await this._commentRepository.verifyCommentAvaibility(commentId);
    const verifyLike = await this._likeRepository.verifyLikeComment(userId, commentId);
    if (verifyLike < 1) {
      return this._likeRepository.addLikeComment(userId, commentId);
    }
    return this._likeRepository.deleteLikeComment(userId, commentId);
  }
}

module.exports = LikeCommentUseCase;
