import type { Request, Response, NextFunction } from 'express';
import { doubleCsrf } from 'csrf-csrf';
import constants from '@/common/constants';

const isProdEnv: boolean = (constants.NODE_ENV.PRODUCTION as string) === process.env.NODE_ENV;
const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: (request: Request) => request.secret,
  cookieName: constants.COOKIES.CSRF_TOKEN_BACKEND,
  cookieOptions: {
    sameSite: isProdEnv ? 'strict' : 'lax',
    secure: isProdEnv,
    path: '/',
  },
  size: 64, // The size of the generated tokens in bits
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getTokenFromRequest: (request: Request) => {
    return request.cookies[constants.COOKIES.XSRF_TOKEN_FRONTEND] || null;
  },
});

/**
 * Filters CSRF routes based on the provided request and response objects.
 *
 * @param {Request} request - The HTTP request object.
 * @param {Response} response - The HTTP response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {void} This function does not return anything.
 */
const filterCSRFRoutes = (request: Request, response: Response, next: NextFunction): void => {
  const ignoreRoutesList = ['/auth/'];
  const ignoreMethodsList = ['GET', 'HEAD', 'OPTIONS'];
  const shouldIgnore = ignoreRoutesList.some((route) => request.url.includes(route));
  if (ignoreMethodsList.includes(request.method) || shouldIgnore) {
    return next();
  }

  return doubleCsrfProtection(request, response, next);
};

// Export filterCSRFRoutes and generateToken
export { filterCSRFRoutes, generateToken as generateCSRFToken };
