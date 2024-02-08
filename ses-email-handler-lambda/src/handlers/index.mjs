import { S3Client,GetObjectCommand, PutObjectCommand  } from "@aws-sdk/client-s3";
const client = new S3Client({
    region: "eu-west-2"
});
import  EmlParser from 'eml-parser';
import { emlToSlackBlock , sendToSlack} from "./utils/slack.mjs"
import { createHmac } from "node:crypto";

export const handler = async (event) => {
    let message = event.Records[0].Sns.Message;
    message = JSON.parse(message);
    const {action: { bucketName, objectKey}} = message.receipt
    const params = {
        Bucket: bucketName,
        Key: objectKey,
    };
    

    try {
        const command = new GetObjectCommand(params);
        const response = await client.send(command);
        const parserInit = new EmlParser(response.Body)
        
        const result = await parserInit.parseEml();

        if (result.headers.get("x-ses-spam-verdict") === 'PASS' && result.headers.get("x-ses-virus-verdict") === 'PASS') {
            let attachements = []
            if (result.attachments && result.attachments.length > 0) {
                for (const [index,attachment] of result.attachments.entries()) { 
                    //upload attachment to S3
                    const putParams = {
                        Body: attachment.content,
                        Bucket: bucketName,
                        Key: `attachments/${objectKey + "_" + index + "_"}${attachment.filename}`,
                        ContentLength: attachment.size
                    }
                    const command = new PutObjectCommand(putParams)

                    try {
                        await client.send(command)
                        const params = {
                            name: attachment.filename,
                            size: attachment.size,
                            url: null,
                            key: putParams.Key,
                            bucket: putParams.Bucket,
                            mimetype: attachment.mimetype,
                            acl: "public-read",
                            provider: "aws"
                        }

                        const timestamp = Math.floor(Date.now() / 1000);
                        const signatureVersion = 'v0'
                        const concated = `${signatureVersion}:${timestamp}:${params}`
                        const lambdaSigningSecret = process.env.lambdaSigningSecret || "your_lambda_signing_secret_here";
                        const hmac = createHmac('sha256', lambdaSigningSecret)
                        const mySignature = 'v0=' + hmac.update(concated).digest('hex');

                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                        myHeaders.append("x-lambda-request-timestamp", timestamp);
                        myHeaders.append("x-lambda-signature", mySignature);

                        var raw = JSON.stringify(params);

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: raw,
                            redirect: 'follow'
                        };

                        const response = await fetch("https://technoob-staging.azurewebsites.net/api/v1/utils/upload-file/external", requestOptions)
                        const result = await response.json();
                        params.url = result.data.url;
                        attachements.push(params)
                    } catch (error) {
                        console.log(error)
                    }
                    
                } 
            }
            const slackBlock = emlToSlackBlock({
                parseEmlContent: result,
                bucket: params.Bucket,
                objectName: params.Key,
                attachements
            });
            await sendToSlack(slackBlock);
        } else {
            return "Invalid Email, could be spam"
        }
       

        return "done";
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
};




