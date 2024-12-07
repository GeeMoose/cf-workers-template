/**
 * Run `npm run dev` in your terminal to start a development server
 * Open a browser tab at http://localhost:8787/ to see your worker in action
 * Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use(
	'/api/*',
	cors({
		credentials: true,
		origin: '*',
	})
);

export default app;