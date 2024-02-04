import { S3Client,GetObjectCommand  } from "@aws-sdk/client-s3";
const client = new S3Client({
    region: "eu-west-2"
});
import  EmlParser from 'eml-parser';
import { emlToSlackBlock , sendToSlack} from "./utils/slack.mjs "

export const handler = async (event) => {
    const message = event.Records[0].Sns.Message;
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

        if (result.headers.get("x-ses-spam-verdict") === 'PASS' && result.headers.get("x-ses-virus-verdict") === 'PASS' ) {
            const slackBlock = emlToSlackBlock({
                parseEmlContent: result,
                bucket: params.Bucket,
                objectName: params.Key
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




