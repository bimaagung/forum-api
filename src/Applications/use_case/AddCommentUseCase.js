const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const comment = new AddComment(useCasePayload);
    await this._threadRepository.verifyThreadAvaibility(comment.threadId);
    return this._commentRepository.addComment(comment);
  }
}

module.exports = AddCommentUseCase;
