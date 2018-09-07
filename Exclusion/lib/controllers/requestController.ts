import mysql_connection from '../models/mysqlDB';
import { Request, Response } from 'express';
import { json } from '../../node_modules/@types/body-parser';
import { isNumber } from 'util';

export class ExclusionsController {

    public getNonExcludedCampaigns (req: Request, res: Response) {
        let advertiser_campaigns = req.query.advertiser_campaigns;
        let publisher_campaign = req.query.publisher_campaign;
        if (!advertiser_campaigns) {
            console.log("Advertiser Campaigns is missing!");
            res.status(400).json({
                status: 400,
                message: "Advertiser Campaigns is missing!"
            })
            return;
        }
        if (!publisher_campaign) {
            console.log("Publisher Campaign is missing!");
            res.status(400).json({
                status: 400,
                message: "Publisher Campaign is missing!"
            })
            return;
        }
        mysql_connection.query('SELECT advertiser_campaigns.id FROM publisher_campaigns JOIN publishers ON publisher_campaigns.publisher_id = publishers.id JOIN publishers_exclusions ON publishers_exclusions.publisher_id = publishers.id JOIN advertisers ON publishers_exclusions.advertiser_id = advertisers.id JOIN advertiser_campaigns ON advertisers.id = advertiser_campaigns.advertiser_id WHERE publisher_campaigns.id = ?', 
            publisher_campaign, (err, result, fields) => {
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
                var ad_cam:Number[] = advertiser_campaigns.split(",");
                var mi = result[0];
                var value = Object.keys(mi).map(k => mi[k]);
                for(var i=0; i<result.length; i++){
                    mi = result[i];
                    value = Object.keys(mi).map(k => mi[k]);
                    for(var j=0; j<ad_cam.length; j++){
                        if(Number(value) == Number(ad_cam[j])){
                            ad_cam.splice(j,1);
                        }
                    }
                }

                var arreglo = [];
                for(var i=0; i<ad_cam.length; i++){
                    arreglo[i]={ id: Number(ad_cam[i])};
                }
                console.log(arreglo);
                res.status(200).json({
                    results: arreglo
                });
            }
            else {
                console.log("Status 404: No campaigns with Publisher Campaign ID " + publisher_campaign + " found!");
                res.status(404).json({
                    status: 404,
                    message: "No campaigns with Publisher Campaign ID " + publisher_campaign
                });
            }

        });

    }

}