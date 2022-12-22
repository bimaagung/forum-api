const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const GetThreadById = require('../GetThreadByIdUseCase');
const GotThread = require('../../../Domains/threads/entities/GotThread');

describe('GetThreadById', () => {
  let mockThreadRepository;
  let mockCommentRepository;
  let mockReplyRepository;
  let mockLikeRepository;

  const threadIdPayload = 'thread-123';

  beforeEach(() => {
    mockThreadRepository = new ThreadRepository();
    mockCommentRepository = new CommentRepository();
    mockReplyRepository = new ReplyRepository();
    mockLikeRepository = new LikeRepository();
  });
  it('should orchestrating the get thread by id action correctly', async () => {
    // Arrange
    const expectedThread = new GotThread({
      id: 'thread-123',
      title: 'a thread',
      body: 'a body',
      date: '2022-02-02T02:22:22.222Z',
      username: 'dicoding',
    });

    const expectedComment = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2022-02-02T02:22:22.222Z',
        content: 'abc',
        likeCount: 2,
        replies: [
          {
            id: 'reply-123',
            username: 'dicoding',
            date: '2022-02-01T19:22:22.222Z',
            content: 'abc',
          },
          {
            id: 'reply-124',
            username: 'dicoding',
            date: '2022-02-02T02:22:22.222Z',
            content: 'abc',
          },
        ],
      },
      {
        id: 'comment-124',
        username: 'dicoding',
        date: '2022-02-03T02:22:22.222Z',
        content: 'abc',
        likeCount: 1,
        replies: [
          {
            id: 'reply-125',
            username: 'dicoding',
            date: '2022-02-03T02:22:22.222Z',
            content: 'abc',
          },
        ],
      },
    ];

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new GotThread({
          id: 'thread-123',
          title: 'a thread',
          body: 'a body',
          date: '2022-02-02T02:22:22.222Z',
          username: 'dicoding',
        }),
      ));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(
        [
          {
            id: 'comment-123',
            username: 'dicoding',
            date: '2022-02-02T02:22:22.222Z',
            content: 'abc',
          },
          {
            id: 'comment-124',
            username: 'dicoding',
            date: '2022-02-03T02:22:22.222Z',
            content: 'abc',
          },
        ],
      ));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(
        [
          {
            id: 'reply-123',
            username: 'dicoding',
            commentId: 'comment-123',
            date: '2022-02-01T19:22:22.222Z',
            content: 'abc',
          },
          {
            id: 'reply-124',
            username: 'dicoding',
            commentId: 'comment-123',
            date: '2022-02-02T02:22:22.222Z',
            content: 'abc',
          },
          {
            id: 'reply-125',
            username: 'dicoding',
            commentId: 'comment-124',
            date: '2022-02-03T02:22:22.222Z',
            content: 'abc',
          },
        ],
      ));

    mockLikeRepository.totalLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(
        [
          {
            comment_id: 'comment-124',
            count: 1,
          },
          {
            comment_id: 'comment-123',
            count: 2,
          },
        ],
      ));

    const getThreadById = new GetThreadById({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const result = await getThreadById.execute(threadIdPayload);

    // Assert
    expect(result).toStrictEqual({
      ...expectedThread,
      comments: expectedComment,
    });
    expect(mockThreadRepository.getThreadById)
      .toBeCalledWith(threadIdPayload);
    expect(mockCommentRepository.getCommentsByThreadId)
      .toBeCalledWith(threadIdPayload);
    expect(mockReplyRepository.getRepliesByCommentId)
      .toBeCalledWith(expectedComment.map((row) => row.id));
    expect(mockLikeRepository.totalLikeComment)
      .toBeCalledWith(expectedComment.map((row) => row.id));
  });

  it('should not thow error if reply or comment is empty', async () => {
    // Arrange
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new GotThread({
          id: 'thread-123',
          title: 'a thread',
          body: 'a body',
          date: '2022-02-02T02:22:22.222Z',
          username: 'dicoding',
        }),
      ));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));
    mockLikeRepository.totalLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    const getThreadById = new GetThreadById({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action & Assert
    await expect(getThreadById.execute(threadIdPayload))
      .resolves.not.toThrowError();
  });
});
