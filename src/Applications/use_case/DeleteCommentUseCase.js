class DeleteCommentUseCase {
  constructor({
    commentRepository,
    threadRepository,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ commentId, threadId, owner }) {
    await this._commentRepository.verifyCommentAvaibility(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    await this._threadRepository.verifyThreadAvaibility(threadId);
    return this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
