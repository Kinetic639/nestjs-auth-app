import { Request } from 'express';

export const extractJwtFromQuery = (request: Request): string | null => {
  const { token } = request?.query;
  if (!token) {
    return null;
  }
  return token.toString();
};
