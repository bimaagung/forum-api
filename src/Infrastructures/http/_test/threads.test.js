const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const LikesTableHelper = require('../../../../tests/LikesTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
  afterEach(async () => {
    await LikesTableHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted threads', async () => {
      // Arrange
      const requestPayload = {
        title: 'a thread',
        body: 'a body',
      };
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJSON.status).toEqual('success');
      expect(responseJSON.data.addedThread).toBeDefined();
      expect(responseJSON.data.addedThread).toHaveProperty('id');
      expect(responseJSON.data.addedThread).toHaveProperty('title');
      expect(responseJSON.data.addedThread).toHaveProperty('owner');
    });
    it('should response 400 if thread payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });
    it('should response 400 if thread payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        title: 123,
        body: true,
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
    it('should response 401 if thread unathorized', async () => {
      // Arrange
      const requestPayload = {
        title: 123,
        body: true,
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJSON.message).toEqual('Missing authentication');
    });
  });

  describe('when GET threads/{threadId}', () => {
    it('should response 200 and persisted threads', async () => {
      // Arrange
      const userPayloadB = {
        id: 'user-124',
        username: 'dicoding_b',
        password: 'secret',
        fullname: 'Dicoding Indonesia B',
      };

      const commentPayloadA = {
        id: 'comment-123',
        content: 'abc',
        threadId: 'thread-123',
        owner: 'user-123',
        date: '2022-02-02T02:22:22.222Z',
        isDelete: false,
      };

      const commentPayloadB = {
        id: 'comment-124',
        content: 'test comment',
        threadId: 'thread-123',
        owner: 'user-123',
        date: '2022-02-02T03:22:22.222Z',
        isDelete: true,
      };

      const replyPayloadA = {
        id: 'reply-123',
        content: 'abc',
        commentId: 'comment-123',
        owner: 'user-123',
        date: '2022-02-02T02:22:22.222Z',
        isDelete: false,
      };

      const replyPayloadB = {
        id: 'reply-124',
        content: 'test reply',
        commentId: 'comment-123',
        owner: 'user-123',
        date: '2022-02-02T03:22:22.222Z',
        isDelete: true,
      };

      const likePayloadB = {
        id: 'like-124',
        userId: 'user-124',
        commentId: 'comment-123',
      };

      const likePayloadC = {
        id: 'like-125',
        userId: 'user-123',
        commentId: 'comment-124',
      };

      const server = await createServer(container);

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser(userPayloadB);
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment(commentPayloadA);
      await CommentsTableTestHelper.addComment(commentPayloadB);
      await RepliesTableTestHelper.addReply(replyPayloadA);
      await RepliesTableTestHelper.addReply(replyPayloadB);
      await LikesTableHelper.addCommentLikes({});
      await LikesTableHelper.addCommentLikes(likePayloadB);
      await LikesTableHelper.addCommentLikes(likePayloadC);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJSON.status).toEqual('success');
      expect(responseJSON.data.thread).toBeDefined();
      expect(responseJSON.data.thread.comments).toHaveLength(2);
      expect(responseJSON.data.thread.comments[0].replies).toHaveLength(2);
      expect(responseJSON.data.thread.comments[0].content)
        .toEqual(commentPayloadA.content);
      expect(responseJSON.data.thread.comments[1].content)
        .toEqual('**komentar telah dihapus**');
      expect(responseJSON.data.thread.comments[0].replies[0].content)
        .toEqual(replyPayloadA.content);
      expect(responseJSON.data.thread.comments[0].replies[1].content).toEqual('**balasan telah dihapus**');
      expect(responseJSON.data.thread.comments[0].date)
        .not.toBeNull();
      expect(responseJSON.data.thread.comments[1].date)
        .not.toBeNull();
      expect(responseJSON.data.thread.comments[0].replies[0].date)
        .not.toBeNull();
      expect(responseJSON.data.thread.comments[0].replies[1].date)
        .not.toBeNull();
      expect(responseJSON.data.thread.comments[0].likeCount)
        .toEqual(2);
      expect(responseJSON.data.thread.comments[1].likeCount)
        .toEqual(1);
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      const expectedCommentPayloadA = {
        id: 'comment-123',
        content: 'abc',
        threadId: 'thread-123',
        owner: 'user-123',
        date: '2022-02-02T02:22:22.222Z',
        isDelete: false,
      };

      const expectedCommentPayloadB = {
        id: 'comment-124',
        content: 'test comment',
        threadId: 'thread-123',
        owner: 'user-123',
        date: '2022-02-02T03:22:22.222Z',
        isDelete: true,
      };

      const server = await createServer(container);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment(expectedCommentPayloadA);
      await CommentsTableTestHelper.addComment(expectedCommentPayloadB);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/unkown_thread',
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('thread tidak ditemukan');
    });
  });
});
