import mysql_connection from '../models/mysqlDB';
import { Request, Response } from 'express';
import { matchingURI, exclusionsURI, targetingURI, rankingURI, adsURI, pricingURI} from './constants'
import axios from 'axios';

export class QueryController {

    public getCampaigns (req: Request, res: Response) {
        let category = req.query.category;
        let publisher_campaign = req.query.publisher_campaign;
        let zip_code = req.query.zip_code;
        let maximum = req.query.maximum;

        if (!category) {
            console.log("Category is missing!");
            res.status(400).json({
                status: 400,
                message: "Category is missing!"
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
        if (!zip_code) {
            console.log("Zip Code is missing!");
            res.status(400).json({
                status: 400,
                message: "Zip Code is missing!"
            })
            return;
        }
        if (!maximum) {
            maximum = 10;
        }



        console.log(this.getMatching);
        //console.log(responseMatching);

        return;
    }

     getMatching = async (categoryID) =>{
        try{
            return await axios.get(matchingURI+'?category='+categoryID);
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }

}