import mysql_connection from '../models/mysqlDB';
import { Request, Response } from 'express';

export class MatchingController {

    public getActiveCampaigns (req: Request, res: Response) {
        req.on('err', err => {
            console.error(err);
        })
        res.on('err', err => {
            console.error(err);
        })
        let category = req.query.category;
        if (!category) {
            console.log("Category is missing!");
            res.status(400).json({
                status: 400,
                message: "Category is missing!"
            })
            return;
        }
        mysql_connection.query('SELECT id, bid, targeting FROM configuration.advertiser_campaigns WHERE status = true AND category = ? ', category, (err, result, fields) => {
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
                console.log("Status 404: No campaigns with category ID " + category + " found!");
                res.status(404).json({
                    status: 404,
                    message: "No campaigns with category ID " + category + " found!"
                });
            }

        });

    }

}