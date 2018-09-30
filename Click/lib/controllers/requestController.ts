import { Request, Response } from 'express';
import * as AWS from 'aws-sdk';
import * as keys from './dynamokeys';

let docClient = new AWS.DynamoDB.DocumentClient( {
    region: "us-east-1",
    endpoint: "dynamodb.us-east-1.amazonaws.com",
    accessKeyId: keys.default.access,
    secretAccessKey: keys.default.secret,
    convertEmptyValues: true
}); 


export class ClickController {

    public getQueryID = (req: Request, res: Response) => {
        let query_id = req.query.query_id;
        let impression_id = req.query.impression_id;

        if (!query_id) {
            console.log("QueryID is missing!");
            res.status(400).json({
                status: 400,
                message: "QueryID is missing!"
            })
            return;
        }
        if (!impression_id) {
            console.log("ImpressionID is missing!");
            res.status(400).json({
                status: 400,
                message: "ImpressionID is missing!"
            })
            return;
        }

        let params = {
            TableName: "Tarea6",
            Key: {
                QueryID: query_id
            }
        }

        docClient.get(params).promise().then(promise => {
            let ad = promise.Item.ads.find(adresults => adresults.impression_id === impression_id)
            console.log(ad.url);
            res.redirect(301, ad.url);
        }).catch(err => {
            console.log(err)
        });
        
        return;
    }

    public healthCheck = (req: Request, res: Response) => {
        res.status(200).json({
            'Content-Type': 'text/plain',
            'Content-Length': 2
        })
    }

}
