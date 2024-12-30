import { describe, expect, it } from 'vitest';
import { request } from '../../setup/setup';
import jwt from 'jsonwebtoken';

describe('Authorization middleware', () => {
  it('should return 401 with no token provided', async () => {
    const res = await request.get('/histories').set('Cookie', '');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Access denied: No token provided');
  });
  it('should return 401 with invalid token (badly signed)', async () => {
    const invalidToken = 'invalid.token.value';
    const res = await request.get('/histories').set('Cookie', `token=${invalidToken}`);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid token');
  });
  it('should return 401 with insufficient permissions', async () => {
    const token = jwt.sign(
      { userId: '123', roles: ['doctor'] },
      process.env.VITE_JWT_SECRET
    );
    const res = await request.get('/histories').set('Cookie', `token=${token}`);
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Access denied: Insufficient permissions');
  });
  it('should validate the token successfully', async () => {
    const token = jwt.sign( { userId: '123', roles: ['admin'] }, process.env.VITE_JWT_SECRET);
    const res = await request.get('/histories').set('Cookie', `token=${token}`);
    expect(res.status).toBe(200);
  });
});