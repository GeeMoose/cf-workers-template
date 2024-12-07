import { contentJson, legacyTypeIntoZod, OpenAPIRoute } from 'chanfana';
import { Context } from 'hono';
import { z } from 'zod';

import { Bindings, FileBody, R2_PREFIX } from '../types';
import { nanoid } from 'nanoid';

export class UploadFile extends OpenAPIRoute {
	schema = {
		summary: 'upload the assets to R2',
		description: 'upload the assets to R2, and get the download url',
		request: {
			params: z.object({
				// This means the assets only included the image, but this is extendable
				file_name: z.string().regex(/\.(jpg|jpeg|png|gif|bmp|webp)$/i),
			}),
			body: {
				content: {
					'multipart/form-data': {
						schema: legacyTypeIntoZod({ file: FileBody({ format: 'binary' }) }),
					},
				},
			},
		},
		response: {
			'200': {
				description: 'Download URL',
				...contentJson({
					url: z.string().url(),
				}),
			},
		},
	};

	async handle(c: Context<{ Bindings: Bindings }>) {
		const prefix = R2_PREFIX;
		const pathname = `${prefix}/${nanoid()}_${Date.now()}_${c.req.param('file_name')}`;

		try {
			const body = await c.req.parseBody();
			if (!body) {
				return c.json({ error: 'no body' }, 400);
			}
			const file = body['file'] as File;
			const headers = new Headers();
			headers.set('content-type', file.type);

			await c.env.MY_BUCKET.put(pathname, file, { httpMetadata: headers });
			const r2_url = await c.env.R2_SERVICE.getPreSignedR2Url(pathname, 3600, 'GET');
			const url = new URL(c.req.url);
			return c.json({
				url: r2_url,
				origin_url: url.origin + '/api/' + pathname,
				thumb_url: url.origin + '/cdn-cgi/image/width=200,quality=75/api/' + pathname,
			});
		} catch (e: any) {
			return c.json({ error: e.message }, 400);
		}
	}
}

export class UploadFilePut extends OpenAPIRoute {
	schema = {
		summary: '将图片上传R2(PUT)',
		description:
			'上传文件到R2，并获得下载链接<br>可以通过 ```\ncurl --upload-file test.png -v -H "Authorization: Bearer 1234" https://a1d-iu.xiongty.workers.dev/api/uploads/test.png``` 测试',
		request: {
			params: z.object({
				file_name: z.string().regex(/\.(jpg|jpeg|png|gif|bmp|webp)$/i),
			}),
			body: {
				content: {
					'application/octet-stream': {
						schema: z.string(),
					},
				},
			},
		},
		response: {
			'200': {
				description: '下载链接',
				...contentJson({
					url: z.string().url(),
				}),
			},
		},
	};

	async handle(c: Context<{ Bindings: Bindings }>) {
		const prefix = R2_PREFIX;
		const pathname = `${prefix}/${Date.now()}_${nanoid()}_${c.req.param('file_name')}`;

		try {
			const body = c.req.raw.body;
			if (!body) {
				return c.json({ error: 'no body' }, 400);
			}

			await c.env.MY_BUCKET.put(pathname, body);
			const url = new URL(c.req.url);
			const r2_url = await c.env.R2_SERVICE.getPreSignedR2Url(pathname, 3600, 'GET');
			return c.json({
				url: r2_url,
				origin_url: url.origin + '/api/' + pathname,
				thumb_url: url.origin + '/cdn-cgi/image/width=200,quality=75/api/' + pathname,
			});
		} catch (e: any) {
			return c.json({ error: e.message }, 400);
		}
	}
}