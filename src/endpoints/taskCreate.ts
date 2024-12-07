import { OpenAPIRoute, contentJson } from 'chanfana';
import { Context } from 'hono';
import { z } from 'zod';
import { nanoid } from 'nanoid';

import { Bindings, TaskMessage, TaskStatus } from '../types';
// import { fetchImageInfo } from '../utils';

export class SendMessage extends OpenAPIRoute {
	schema = {
		summary: 'Send a Message to Queue',
		description: 'Create a new task, package the task into the message to send to the queues. \n',

		request: {
			body: contentJson({
				// raster_url means the input raster image url
				raster_url: z.string().url(),
				// Options is a dict structure, which is optional.
				options: z
					.record(z.string(), z.any())
					.optional()
			}),
		},
	};

	async handle(c: Context<{ Bindings: Bindings }>) {
		const data = await this.getValidatedData<typeof this.schema>();
		const task_id = nanoid();
		const url = new URL(c.req.url);
			const msg = {
				task_id,
				raster_url: data.body.raster_url,
				timestamp: Date.now(),
			} as TaskMessage;
			await c.env.MY_QUEUE.send(msg);

		return c.json({
			id: task_id,
			// status: TaskStatus.WAITING,
			timestamp: Date.now(),
		});
	}
}