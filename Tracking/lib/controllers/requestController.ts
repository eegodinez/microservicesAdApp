import { Request, Response } from 'express';
import DynamoDB = require('aws-sdk/clients/dynamodb');
import Firehose = require('aws-sdk/clients/firehose');
import * as crypto from 'crypto';
import * as dynamo from './dynamokeys';

let firehoseClient = new Firehose({
    region: "us-east-1",
    endpoint: "firehose.us-east-1.amazonaws.com",
    accessKeyId: dynamo.default.access,
    secretAccessKey: dynamo.default.secret,
})

export class TrackingController {

    public queryStream = (req: Request, res: Response) => {
        console.log(req.body);

        let fh_params = {
            DeliveryStreamName: 'QueryStream',
            Record: {
                Data: JSON.stringify(req.body),
            }
        };

        firehoseClient.putRecord(fh_params).promise().then((promise) => {
            console.log(promise)
            res.status(200).json({
                'status': 200
            })
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
            return;
        });
    }

    public impressionStream = (req: Request, res: Response) => {
        console.log(req.body);

        let fh_params = {
            DeliveryStreamName: 'ImpressionStream',
            Record: {
                Data: JSON.stringify(req.body),
            }
        };

        firehoseClient.putRecord(fh_params).promise().then((promise) => {
            console.log(promise)
            res.status(200).json({
                'status': 200
            })
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
            return;
        });
    }

    public clickStream = (req: Request, res: Response) => {
        console.log(req.body);

        let fh_params = {
            DeliveryStreamName: 'ClickStream',
            Record: {
                Data: JSON.stringify(req.body),
            }
        };

        firehoseClient.putRecord(fh_params).promise().then((promise) => {
            console.log(promise);
            res.status(200).json({
                'status': 200
            })
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
            return;
        });
    }

    public healthCheck = (req: Request, res: Response) => {
        res.status(200).json({
            'Content-Type': 'text/plain',
            'Content-Length': 2
        })
    }

}
