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
        mysql_connection.query('SELECT campaign_ads.campaign_id, ads.id, ads.headline, ads.description, ads.url FROM ads JOIN campaign_ads ON ads.id = campaign_ads.ad_id WHERE campaign_ads.campaign_id IN ('+advertiser_campaigns+')'
         , (err, result, fields) => {
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
                var random = 0;
                var registro = 0;
                let resultL = result.length;
                var value = result.map(k =>k.campaign_id);
                var id = result.map(k =>k.id);
                var headline = result.map(k =>k.headline);
                var description = result.map(k =>k.description);
                var url = result.map(k =>k.url);
                var arreglo = [];

                for(var i=0; i<resultL-1; i++){
                    for(var j=i+1; j<resultL; j++){
                        if(Number(value[i]) != Number(value[j])){
                            i=j;
                            j=resultL;
                            random = Math.floor(Math.random() * i) + 0;
                            arreglo[registro]={ id: Number(id[random]), headline: headline[random],
                                description: description[random], url: url[random]};
                            registro++;
                        }
                    }
                }
                if(Number(value[resultL-2]) != Number(value[resultL-1])){
                    arreglo[registro]={ id: Number(id[resultL-1]), headline: headline[resultL-1],
                        description: description[resultL-1], url: url[resultL-1]};
                }
                console.log(arreglo);
                res.status(200).json({
                    results: arreglo
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