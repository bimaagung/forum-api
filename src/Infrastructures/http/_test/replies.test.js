const pool = require('../../database/postgres/pool');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId/replies}', () => {
    it('should response 201 and persisted replies', async () => {
      // Arrange
      const requestPayload = {
        content: 'abc',
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

      // Add Thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'a thread',
          body: 'a body',
        },
      });

      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      // Add Comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'abc',
        },
      });

      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJSON.status).toEqual('success');
      expect(responseJSON.data.addedReply).toBeDefined();
      expect(responseJSON.data.addedReply).toHaveProperty('id');
      expect(responseJSON.data.addedReply).toHaveProperty('content');
      expect(responseJSON.data.addedReply).toHaveProperty('owner');
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'abc',
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

      // Add Thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'a thread',
          body: 'a body',
        },
      });

      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      // Add Comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'abc',
        },
      });

      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/unkown_thread/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 if comment not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'abc',
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

      // Add Thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'a thread',
          body: 'a body',
        },
      });

      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/unkown_comment/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 400 if reply payload not contain needed property', async () => {
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

      // Add Thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'a thread',
          body: 'a body',
        },
      });

      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      // Add Comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'abc',
        },
      });

      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 if reply payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
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

      // Add Thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'a thread',
          body: 'a body',
        },
      });

      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      // Add Comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'abc',
        },
      });

      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('tidak dapat membuat balasan baru karena tipe data tidak sesuai');
    });

    it('should response 401 if reply unathorized', async () => {
      // Arrange
      const requestPayload = {
        content: 'abc',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thred-123/comments/comment-123/replies',
        payload: requestPayload,
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJSON.message).toEqual('Missing authentication');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and persisted replies', async () => {
      // Arrange
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

      // Add Thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'a thread',
          body: 'a body',
        },
      });

      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      // Add Comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'abc',
        },
      });

      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      // Add Reply
      const replyReponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'abc',
        },
      });

      const { data: { addedReply: { id: replyId } } } = JSON.parse(replyReponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJSON.status).toEqual('success');
    });

    it("should response 403 if reply can't verify owner", async () => {
      // Arrange
      const server = await createServer(container);

      // User A
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'userA',
          password: 'secret',
          fullname: 'User A',
        },
      });

      const loginUserAResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'userA',
          password: 'secret',
        },
      });

      const { data: { accessToken: accessTokenA } } = JSON.parse(loginUserAResponse.payload);

      // User B
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'userB',
          password: 'secret',
          fullname: 'User B',
        },
      });

      const loginUserBResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'userB',
          password: 'secret',
        },
      });

      const { data: { accessToken: accessTokenB } } = JSON.parse(loginUserBResponse.payload);

      // Add Thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization: `Bearer ${accessTokenA}`,
        },
        payload: {
          title: 'a thread',
          body: 'a body',
        },
      });

      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      // Add Comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization: `Bearer ${accessTokenB}`,
        },
        payload: {
          content: 'abc',
        },
      });

      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      // Add Reply
      const replyReponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessTokenA}`,
        },
        payload: {
          content: 'abc',
        },
      });

      const { data: { addedReply: { id: replyId } } } = JSON.parse(replyReponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: `Bearer ${accessTokenB}`,
        },
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('balasan gagal diverifikasi');
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
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

      // Add Thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'a thread',
          body: 'a body',
        },
      });

      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      // Add Comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'abc',
        },
      });

      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      // Add Reply
      const replyReponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'abc',
        },
      });

      const { data: { addedReply: { id: replyId } } } = JSON.parse(replyReponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/unkown_thread/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 if comment not found', async () => {
      // Arrange
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

      // Add Thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'a thread',
          body: 'a body',
        },
      });

      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      // Add Comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'abc',
        },
      });

      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      // Add Reply
      const replyReponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'abc',
        },
      });

      const { data: { addedReply: { id: replyId } } } = JSON.parse(replyReponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/unkown_comment/replies/${replyId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 404 if reply not found', async () => {
      // Arrange
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
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/unkown_reply',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('balasan tidak ditemukan');
    });
  });
});
