class ThreadRepository {
  async addThread(thread) {
    throw new Error('THREAD.METHOD_NOT_IMPLEMENTED');
  }

  async getThreadById(id) {
    throw new Error('THREAD.METHOD_NOT_IMPLEMENTED');
  }

  async verifyThreadAvaibility(id) {
    throw new Error('THREAD.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadRepository;
