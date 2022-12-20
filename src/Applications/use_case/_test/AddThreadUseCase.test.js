const Thread = require('../../../Domains/threads/entities/Thread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'a tread',
      body: 'a body',
      owner: 'user-123',
    };

    const expectedThread = new AddedThread({
      id: 'thread-123',
      title: 'a thread',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new AddedThread({
          id: 'thread-123',
          title: 'a thread',
          owner: 'user-123',
        }),
      ));

    const addThreadUseCase = new AddedThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual(expectedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new Thread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    }));
  });
});
