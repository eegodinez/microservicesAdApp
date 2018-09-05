import mysql_connection from '../models/mysqlDB';
import { Request, Response } from 'express';

export class AdsController {

    public getAdvertisers (req: Request, res: Response) {
        let advertiser_campaigns = req.query.advertiser_campaigns;
        if (!advertiser_campaigns) {
            console.log("Advertiser campaigns is missing!");
            res.status(400).json({
                status: 400,
                message: "Advertiser campaigns is missing!"
            })
            return;
        }
        mysql_connection.query('SELECT id, headline, description, url FROM ads JOIN campaign_ads ON ads.id = campaign_ads.ad_id WHERE campaign_ads.campaign_id IN (?)'
         , advertiser_campaigns, (err, result, fields) => {
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
                console.log("Status 404: No advertiser campaigns with ID " + advertiser_campaigns + " found!");
                res.status(404).json({
                    status: 404,
                    message: "No advertiser campaigns with ID " + advertiser_campaigns + " found!"
                });
            }

        });

    }

}