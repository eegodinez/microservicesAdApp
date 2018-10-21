import { Request, Response } from 'express';
import DynamoDB = require('aws-sdk/clients/dynamodb');
import axios from 'axios';
import * as crypto from 'crypto';
import * as keys from './dynamokeys';

let docClient = new DynamoDB.DocumentClient( {
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
            let click_put_tracking_JSON = {
                query_id: ad.query_id,
                impression_id: ad.impression_id,
                click_id: crypto.randomBytes(10).toString('hex'),
                timestamp: ad.timestamp,
                publisher_id: ad.publisher_id,
                publisher_campaign_id: ad.publisher_campaign_id,
                advertiser_id: ad.advertiser_id,
                advertiser_campaign_id: ad.advertiser_campaign_id,
                category: ad.category,
                ad_id: ad.id,
                zip_code: ad.zip_code,
                advertiser_price: ad.bid,
                publisher_price: ad.publisher_price,
                position: ad.position,
            }
            
            console.log(click_put_tracking_JSON);

            axios.post('http://www.localhost:8087/tracking/click/',click_put_tracking_JSON).then((response) =>{
                console.log(response);
            }).catch((error) => {
                console.log(error);
            })
            res.redirect(302, ad.url);
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
