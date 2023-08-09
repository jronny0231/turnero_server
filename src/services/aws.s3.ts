import {
    S3Client,
    PutObjectCommand,
    PutObjectCommandInput,
    ListObjectsCommand,
    GetObjectCommand
} from '@aws-sdk/client-s3';
import fs from 'fs';

const AWS_BUCKET_NAME: string = process.env.AWS_BUCKET_NAM ?? "";
const AWS_BUCKET_REGION: string = process.env.AWS_BUCKET_REGION ?? "";
const AWS_PUBLIC_KEY: string = process.env.AWS_PUBLIC_KEY ?? "";
const AWS_SECRET_KEY: string = process.env.AWS_SECRET_KEY ?? "";

const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
})

export const uploadFile = async ({tempFilePath, newName}: {tempFilePath: string, newName: string}) => {
    try {
        const fileStream = fs.createReadStream(tempFilePath)

        const uploadParams: PutObjectCommandInput = {
            Bucket: AWS_BUCKET_NAME,
            Key: newName,
            Body: fileStream
        }

        const command = new PutObjectCommand(uploadParams)

        return await client.send(command)

    } catch (error) {
        console.error({error})
        return error
    }

}

export const getFileList = async () => {
    const command = new ListObjectsCommand({
        Bucket: AWS_BUCKET_NAME
    })

    const result = await client.send(command)
    return result.Contents
}

export const getFile = async ({fileKey}: {fileKey: string}) => {
   try {
        const command = new GetObjectCommand({
            Bucket: AWS_BUCKET_NAME,
            Key: fileKey
        })

        const result = await client.send(command)

        return {
            metadata: result.Metadata,
            body: result.Body
        }
   } catch (error) {
        console.error({error})
        return error
   }
}

export const downloadTempFile = ({fileKey, live}: {fileKey: string, live: number}) => {

    console.log({fileKey, live})
    return true
}

