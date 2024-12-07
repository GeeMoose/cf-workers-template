import { fromHono } from 'chanfana';
import { cache } from 'hono/cache';

import app from './app';

import { SendMessage } from './endpoints/taskCreate';


// Setup OpenAPI registry
export const options = {
	docs_url: '/docs',
	schema: {
		info: {
			title: 'the a1d cloudflare workers template',
			version: '1.0',
		},
		security: [
			{
				BearerAuth: [],
			},
		],
	},
};

const openapi = fromHono(app, options);

openapi.post('/api/task', SendMessage);

export default {
	fetch: app.fetch,
};