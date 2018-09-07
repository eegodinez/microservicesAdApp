import mysql_connection from '../models/mysqlDB';
import { Request, Response } from 'express';

export class PricingController {

    public getPrice (req: Request, res: Response) {
        let advertiser_campaigns = req.query.advertiser_campaigns;
        let advertiser_campaigns_bids = req.query.advertiser_campaigns_bids;
        let publisher_campaign = req.query.publisher_campaign;
        if (!advertiser_campaigns) {
            console.log("Advertiser campaigns is missing!");
            res.status(400).json({
                status: 400,
                message: "Advertiser campaigns is missing!"
            })
            return;
        }
        if (!advertiser_campaigns_bids) {
            console.log("Bids is missing!");
            res.status(400).json({
                status: 400,
                message: "Bids is missing!"
            })
            return;
        }
        if (!publisher_campaign) {
            console.log("Publisher campaigns is missing!");
            res.status(400).json({
                status: 400,
                message: "Publisher campaigns is missing!"
            })
            return;
        }
        mysql_connection.query('SELECT commission FROM publisher_campaigns WHERE id = ?', publisher_campaign, (err, result, fields) => {
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
                var ad_cam_b:Number[] = advertiser_campaigns_bids.split(",");
                var mi = result[0];
                var value = Object.keys(mi).map(k => mi[k]);
                var arreglo = [];
                for(var i=0; i<ad_cam.length; i++){
                    arreglo[i]={ id: Number(ad_cam[i]) , price: (Number(ad_cam_b[i])* Number(value))};
                }
                
                console.log(arreglo);
                res.status(200).json({
                    results: arreglo
                });

            }
            else {
                console.log("Status 404: No pricing for publisher campaigns with ID " + publisher_campaign + " found!");
                res.status(404).json({
                    status: 404,
                    message: "No pricing for publisher campaigns with ID " + publisher_campaign + " found!"
                });
            }

        });

    }

}