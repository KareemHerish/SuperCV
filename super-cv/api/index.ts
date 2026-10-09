import app from '../server';
import type { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  // If Vercel stripped '/api' prefix from req.url, restore it so Express /api/... routes match
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
}
