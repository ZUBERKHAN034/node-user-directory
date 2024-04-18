export const security = [
  {
    swanSession: [],
  },
  {
    'XSRF-TOKEN': [],
  },
];

export const loginSwaggerUI = {
  tags: ['User'],
  description: 'API to login user into system',
  operationId: 'loginSwaggerUI',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              example: 'johndoe@example.com',
            },
            password: {
              type: 'string',
              example: 'P@ssW0rd',
            },
          },
          required: ['email', 'password'], // Specify required properties here
        },
      },
    },
    required: true, // Specify required request body here
  },
  responses: {
    '200': {
      description: 'Returns user object containing token',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'swanConfig',
                  },
                  token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....',
                  },
                },
              },
            },
          },
        },
      },
    },
    '400': {
      description: 'Validation errors',
    },
    '401': {
      description: 'Invalid Email/Password',
    },
    '404': {
      description: `User doesn't exist`,
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

export const registerUserSwaggerUI = {
  tags: ['User'],
  description: 'API to create user into Swan portal',
  operationId: 'createUserSwaggerUI',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Doe',
            },
            email: {
              type: 'string',
              example: 'johndoe@example.com',
            },
            password: {
              type: 'string',
              example: 'P@ssW0rd',
            },
          },
          required: ['firstName', 'lastName', 'email', 'password'], // Specify required properties here
        },
      },
    },
    required: true, // Specify required request body here
  },
  responses: {
    '200': {
      description: 'Returns User details',
    },
    '400': {
      description: 'Validation errors',
    },
    '409': {
      description: 'User already exists',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
