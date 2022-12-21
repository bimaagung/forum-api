const pool = require('../../database/postgres/pool');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  let server;
  let loginResponse;

  afterAll(async () => {
    await pool.end();
  });
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});

    server = await createServer(container);

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding_b',
        password: 'secret',
        fullname: 'Dicoding Indonesia B',
      },
    });

    loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding_b',
        password: 'secret',
      },
    });
  });
  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 when user like comments', async () => {
      // Arrange
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJSON.status).toEqual('success');
    });
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 when user unlike comments', async () => {
      // Arrange
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJSON.status).toEqual('success');
    });
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 400 when thread not found', async () => {
      // Arrange
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/unkown_thread/comments/comment-123/likes',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('thread tidak ditemukan');
    });
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 400 when comment not found', async () => {
      // Arrange
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/unkown_comment/likes',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJSON = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJSON.status).toEqual('fail');
      expect(responseJSON.message).toEqual('komentar tidak ditemukan');
    });
  });
});
