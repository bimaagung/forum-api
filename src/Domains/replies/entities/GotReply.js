class GotReply {
  constructor(payload) {
    const {
      id, username, commentId, date, content, isDelete,
    } = payload;

    this.id = id;
    this.username = username;
    this.commentId = commentId;
    this.date = date;
    this.content = isDelete ? '**balasan telah dihapus**' : content;
  }
}

module.exports = GotReply;
