import mysql_connection from '../models/mysqlDB';
import { Request, Response } from 'express';

export class TargetingController {

    public getCampaignsZip (req: Request, res: Response) {
        let advertiser_campaigns = req.query.advertiser_campaigns;
        let zip_code = req.query.zip_code;
        if (!advertiser_campaigns) {
            console.log("Advertiser Campaigns is missing!");
            res.status(400).json({
                status: 400,
                message: "Advertiser Campaigns is missing!"
            })
            return;
        }
        if (!zip_code) {
            console.log("Zip Code is missing!");
            res.status(400).json({
                status: 400,
                message: "Zip Code is missing!"
            })
            return;
        }
        mysql_connection.query('SELECT id, advertiser_id FROM advertiser_campaigns WHERE advertiser_campaigns.id IN ('+advertiser_campaigns+') AND (targeting = "ALL" OR targeting LIKE "%'+zip_code+'%")'
         , (err, result, fields) => {
            console.log(result)
            if (err) {
                console.log("Status 500. Details: " + err);
                res.status(500).json({
                    status: 500,
                    message: "Internal server error!",
                    details: err
                });
                return;
            } 
            if (result.length > 0){
                console.log(JSON.stringify(result, null, 4));
                res.status(200).json({
                    results: result
                });
            }
            else {
                console.log("Status 404: No campaigns with zip code NULL or with zip code " + zip_code + " found!");
                res.status(404).json({
                    status: 404,
                    message: "No campaigns with zip code NULL or with zip code " + zip_code + " found!"
                });
            }

        });

    }

    public healthCheck = (req: Request, res: Response) => {
        res.status(200).json({
            'Content-Type': 'text/plain',
            'Content-Length': 2
        })
    }

}