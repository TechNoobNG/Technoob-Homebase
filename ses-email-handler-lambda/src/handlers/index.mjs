import { S3Client,GetObjectCommand, PutObjectCommand  } from "@aws-sdk/client-s3";
const client = new S3Client({
    region: "eu-west-2"
});
import  EmlParser from 'eml-parser';
import { emlToSlackBlock , sendToSlack} from "./utils/slack.mjs"

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
                        ContentLength: attachment.size,
                        ACL: "public-read"
                    }
                    const command = new PutObjectCommand(putParams)

                    try {
                        await client.send(command)
                        attachements.push({
                            name: attachment.filename,
                            size: attachment.size,
                            url: `https://${bucketName}.s3.eu-west-2.amazonaws.com/attachments/${putParams.Key}`
                        })
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




