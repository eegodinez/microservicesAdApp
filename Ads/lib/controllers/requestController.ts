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
        mysql_connection.query('SELECT campaign_ads.campaign_id, ads.id, ads.headline, ads.description, ads.url FROM ads JOIN campaign_ads ON ads.id = campaign_ads.ad_id WHERE campaign_ads.campaign_id IN ('+advertiser_campaigns+') ORDER BY campaign_ads.campaign_id'
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
                var random = 0;
                var registro = 0;
                let resultL = result.length;
                let resultLI = result.length;
                var value = result.map(k =>k.campaign_id);
                var id = result.map(k =>k.id);
                var headline = result.map(k =>k.headline);
                var description = result.map(k =>k.description);
                var url = result.map(k =>k.url);
                var arreglo = [];
                var debe = false;

                for(var i=0; i<resultL-1; i++){
                    console.log("valor i: "+ i);
                    debe = true;
                    for(var j=i+1; j<resultLI; j++){
                        console.log("valor j: "+j);
                        if(Number(value[i]) != Number(value[j])){
                            random =  Math.round(Math.random() * (j - i) + i)-1;
                            if(random<i) random=i;
                            arreglo[registro]={ id: Number(id[random]), headline: headline[random],
                                description: description[random], url: url[random]};
                            registro++;
                            i=j-1;
                            j=resultLI;
                            debe=false;
                        }
                    }
                }
                if(debe){
                    random =  Math.round(Math.random() * ((j-1) - (i-1)) + (i-1))-1;
                    if(random<i) random=i;
                    arreglo[registro]={ id: Number(id[random]), headline: headline[random],
                        description: description[random], url: url[random]};
                }else if(Number(value[resultL-2]) != Number(value[resultL-1])){
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

    public healthCheck = (req: Request, res: Response) => {
        res.status(200).json({
            'Content-Type': 'text/plain',
            'Content-Length': 2
        })
    }

}