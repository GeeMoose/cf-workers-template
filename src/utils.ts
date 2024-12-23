import {  WorkerEntrypoint } from 'cloudflare:workers';
import { AwsClient } from 'aws4fetch';

export const getPreSignedR2Url = async (
	accountID: string,
	bucketName: string,
	accessKeyId: string,
	secretAccessKey: string,
	pathname: string,
	expires: number,
	method: 'GET' | 'PUT'
) => {
	const r2 = new AwsClient({
		accessKeyId,
		secretAccessKey,
	});

	const url = new URL(`https://${bucketName}.${accountID}.r2.cloudflarestorage.com`);
	url.pathname = pathname;
	url.searchParams.set('X-Amz-Expires', expires.toString());

	const signed = await r2.sign(new Request(url, { method }), { aws: { signQuery: true } });
	return signed.url;
};

export class R2Service extends WorkerEntrypoint<Env> {
	async getPreSignedR2Url(pathname: string, expires: number, method: 'GET' | 'PUT'): Promise<string> {
		return getPreSignedR2Url(
			this.env.CF_ACCOUNT_ID,
			this.env.S3_BUCKET,
			this.env.S3_ACCESS_KEY_ID,
			this.env.S3_SECRET_ACCESS_KEY,
			pathname,
			expires,
			method
		);
	}
}