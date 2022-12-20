const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const reply = new AddReply({
      content: useCasePayload.content,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
    });
    await this._threadRepository.verifyThreadAvaibility(useCasePayload.threadId);
    await this._commentRepository.verifyCommentAvaibility(reply.commentId);
    return this._replyRepository.addReply(reply);
  }
}

module.exports = AddReplyUseCase;
