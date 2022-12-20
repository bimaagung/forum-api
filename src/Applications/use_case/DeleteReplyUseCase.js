class DeleteReplyUseCase {
  constructor({
    replyRepository,
    commentRepository,
    threadRepository,
  }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({
    replyId, commentId, threadId, owner,
  }) {
    await this._replyRepository.verifyReplyAvaibility(replyId);
    await this._replyRepository.verifyReplyOwner(replyId, owner);
    await this._threadRepository.verifyThreadAvaibility(threadId);
    await this._commentRepository.verifyCommentAvaibility(commentId);
    return this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
