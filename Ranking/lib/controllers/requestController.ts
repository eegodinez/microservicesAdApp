import mysql_connection from '../models/mysqlDB';
import { Request, Response } from 'express';

export class RankingController {

    public getCampaigns (req: Request, res: Response) {
        let advertiser_campaigns = req.query.advertiser_campaigns;
        let advertiser_campaigns_bids = req.query.advertiser_campaigns_bids;
        let maximum = req.query.maximum;
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
        if (!maximum) {
            maximum = 10;
        }
        var ad_cam:Number[] = advertiser_campaigns.split(",");
        var ad_cam_bid:Number[] = advertiser_campaigns_bids.split(",");
        
        const obj = ad_cam.reduce((obj: any, value: any, index: number) => {
            obj[value] = ad_cam_bid[index];
            return obj;
        }, {});

        ad_cam.sort((a: any, b: any) => { 
            return obj[b] - obj[a] 
        });

        var arreglo = [];
        if(ad_cam.length < maximum){
            for(var i=0; i<ad_cam.length; i ++){
                arreglo[i]={ id: Number(ad_cam[i])};
            }
        }else{
            for(var i=0; i<maximum; i ++){
                arreglo[i]={ id: Number(ad_cam[i])};
            }
        }
        console.log(arreglo);
        res.status(200).json({
            results: arreglo
        });
        return;
    }

}