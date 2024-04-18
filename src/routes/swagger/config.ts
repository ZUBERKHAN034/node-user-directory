import constants from '@/common/constants';
import apisPath from '@/routes/swagger/apis';

const apiDocumentationConfig = {
  openapi: '3.0.1',
  info: {
    version: '2.0.0',
    title: 'swan-enterprise : The most powerful CRM for Omnichannel retail',
    description:
      'With Swan AI you can engage, retain and grow your retail customers through the world’s first AI-driven Omnichannel customer engagement platform',
    termsOfService: 'https://qa.swan.cx/',
    contact: {
      name: 'Swan AI Support',
      email: 'support@qa.swan.cx',
      url: 'https://qa.swan.cx/',
    },
  },
  servers: [
    {
      url: process.env.DEV_URL,
      description: 'Development Server',
    },
    {
      url: process.env.PROD_URL, // replace it with deployed server URL
      description: 'Production Server',
    },
  ],
  paths: apisPath,

  components: {
    securitySchemes: {
      swanSession: {
        type: 'apiKey',
        in: 'cookie',
        name: constants.COOKIES.SWAN_SESSION,
        description: 'Description of your custom cookie.',
      },
      'XSRF-TOKEN': {
        type: 'apiKey',
        in: 'cookie',
        name: constants.COOKIES.XSRF_TOKEN_FRONTEND,
        description: 'Description of your custom cookie.',
      },
    },
  },
};

export { apiDocumentationConfig };
