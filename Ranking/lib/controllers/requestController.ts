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
        if(ad_cam.length != ad_cam_bid.length){
            console.log("The number of advertiser campaigns does not match the number of bids!");
            res.status(404).json({
                status: 404,
                message: "The number of advertiser campaigns does not match the number of bids!"
            })
            return;
        }
        function swap(myArr, i, j){
            var tmpVal = myArr[i];
            myArr[i] = myArr[j];
            myArr[j] = tmpVal;
            return myArr;
        }
        for( var pass = 1; pass < ad_cam_bid.length; pass++ ){
            for( var left = 0; left < (ad_cam_bid.length - pass); left++){
              var right = left + 1;
              if( ad_cam_bid[left] < ad_cam_bid[right]){
                swap(ad_cam_bid, left, right);
                swap(ad_cam, left, right);
              }
            }
        }
        console.log(JSON.stringify(ad_cam, null, 4));
        res.status(200).json({
            results: ad_cam
        });
        return;
    }

}