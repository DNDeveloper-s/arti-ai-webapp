import {S3} from 'aws-sdk';

const s3 = new S3({
	credentials: {
		accessKeyId: process.env.I_AWS_ACCESS_KEY ?? '',
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
	},
	region: process.env.AWS_REGION,
});

export default async function uploadToS3(buf: S3.PutObjectRequest.Body, name: string, encoding?: string, type?: string): Promise<S3.ManagedUpload.SendData> {
	const params: S3.Types.PutObjectRequest = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: name,
		Body: buf,
	};

	if(encoding) params.ContentEncoding = encoding;
	if(type) params.ContentType = type;

	// @ts-ignore
	const upload = s3.upload(params);
	upload.on('httpUploadProgress', (p) => {
		console.log('upload progress - ', p.loaded / p.total);
	});
	return await upload.promise();
}
