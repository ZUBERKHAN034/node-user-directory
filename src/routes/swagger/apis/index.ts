import { registerUserSwaggerUI, loginSwaggerUI } from '@/routes/swagger/apis/user';

const apisPath = {
  // ENDPOINTS FOR USER
  '/auth/login': {
    post: loginSwaggerUI,
  },
  '/auth/register': {
    post: registerUserSwaggerUI,
  },
};

export default apisPath;
