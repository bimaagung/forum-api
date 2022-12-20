const createServer = require('../createServer');

describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'DIcoding Indonesia',
      password: 'super_secret',
    };
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJSON = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJSON.status).toEqual('error');
    expect(responseJSON.message).toEqual('terjadi kegagalan pada server kami');
  });
});
