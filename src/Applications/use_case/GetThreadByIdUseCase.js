class GetThreadByIdUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const commentIds = comments.map((row) => row.id);

    const replies = await this._replyRepository.getRepliesByCommentId(commentIds);

    const commentReplies = comments.map((comment) => (
      {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
        replies: replies.filter((reply) => reply.commentId === comment.id).map((row) => ({
          id: row.id,
          username: row.username,
          date: row.date,
          content: row.content,
        })),
      }));

    const result = {
      ...thread,
      comments: commentReplies,
    };

    return result;
  }
}

module.exports = GetThreadByIdUseCase;
