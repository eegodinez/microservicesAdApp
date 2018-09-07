import mysql_connection from '../models/mysqlDB';
import { Request, Response } from 'express';
import { matchingURI, exclusionsURI, targetingURI, rankingURI, adsURI, pricingURI} from './constants'
import axios from 'axios';

export class QueryController {

    public bid;
    public targeting;
    public exclusionResults;
    public targetingResults;

    public getCampaigns = (req: Request, res: Response) => {
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


        this.getMatching(category).then(promise => {

            let matchingResults = promise.data.results;
            console.log(matchingResults)
            console.log("\n")
            
            //id, bid, targeting
            let id_values = matchingResults.map(a => a.id);
            this.bid = matchingResults.map(a => a.bid);
            this.targeting = matchingResults.map(a => a.targeting)

            this.getExclusion(id_values, publisher_campaign).then(promise => {
                let exclusionPromiseResults = promise.data.results;
                this.exclusionResults = exclusionPromiseResults.map(a => a.id);
                console.log(this.exclusionResults);
                console.log("\n")

                this.getTargeting(id_values, zip_code).then(promise => {
                    let targetingPromiseResults = promise.data.results;
                    this.targetingResults = targetingPromiseResults.map(a => a.id);
                    console.log(this.targetingResults);
                    console.log("\n")

                    //inter entre resultados de exclusion y targeting
                    let intersection = this.exclusionResults.filter(x => this.targetingResults.includes(x))
                    console.log("intersection")
                    console.log(intersection);
                    console.log("\n")

                    let bids_filtered = [];
    
                    for (let value in intersection){
                        bids_filtered.push(matchingResults.find(mresults => mresults.id === intersection[value]).bid)
                    }
                   
                     
                    this.getRanking(intersection, bids_filtered,maximum).then(promise => {
                        let rankingPromiseResults = promise.data.results;
                        console.log(rankingPromiseResults);
                        console.log("\n")

                        this.getAds(intersection).then(promise => {
                            let adsPromiseResults = promise.data.results;
                            for (let value in adsPromiseResults){
                                Object.assign(adsPromiseResults[value], {impression_id: Math.floor((Math.random() * 10000000) + 1)});
                            }
                            
                            console.log(adsPromiseResults);
                            console.log("\n");

                            this.getPricing(intersection, bids_filtered, publisher_campaign).then(promise => {
                                let pricingPromiseResults = promise.data.results
                                console.log(pricingPromiseResults);

                                res.status(200).json({
                                    header: {
                                        query_id: Math.floor((Math.random() * 10000000) + 1)
                                    },
                                    status:200,
                                    ads: adsPromiseResults

                                })

                            }).catch((error) => {
                                console.log(error)
                                res.status(404).json({
                                    status:404,
                                    message: "No ad(s) found!"
                                })
                            })

                        }).catch((error) => {
                            console.log(error)
                            res.status(404).json({
                                status:404,
                                message: "No ad(s) found!"
                            })
                        })

                    }).catch((error) => {
                        console.log(error)
                        res.status(404).json({
                            status:404,
                            message: "No ad(s) found!"
                        })
                    })

                    


                }).catch((error) => {
                    console.log(error)
                    res.status(404).json({
                        status:404,
                        message: "No ad(s) found!"
                    })
                })

            }).catch((error) => {
                console.log(error)
                res.status(404).json({
                    status:404,
                    message: "No ad(s) found!"
                })
            })



        }).catch((error) => {
            console.log(error)
            res.status(404).json({
                status:404,
                message: "No ad(s) found!"
            })
        });

        return;
    }

    public getMatching = async (categoryID) => {
        try{
            return await axios.get(matchingURI+'?category='+categoryID);
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }

    public getExclusion = async (advertiser_campaign_id, publisher_campaign_id) => {
        let advertiser_campaign_id_str = advertiser_campaign_id.join();
        try {
            return await axios.get(exclusionsURI+'?advertiser_campaigns='+advertiser_campaign_id_str+'&publisher_campaign='+publisher_campaign_id)
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }

    public getTargeting = async (advertiser_campaign_id, zip_code) => {
        let advertiser_campaign_id_str = advertiser_campaign_id.join();
        try {
            return await axios.get(targetingURI+'?advertiser_campaigns='+advertiser_campaign_id_str+'&zip_code='+zip_code)
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    
    public getRanking = async (advertiser_campaign_id, advertiser_campaign_bids,maximum) => {
        let advertiser_campaign_id_str = advertiser_campaign_id.join();
        let advertiser_campaign_bids_str = advertiser_campaign_bids.join();
        try {
            return await axios.get(rankingURI+'?advertiser_campaigns='+advertiser_campaign_id_str+'&advertiser_campaigns_bids='+advertiser_campaign_bids_str+'&maximum='+maximum)
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }

    public getAds = async (advertiser_campaign_id) => {
        let advertiser_campaign_id_str = advertiser_campaign_id.join();
        try {
            return await axios.get(adsURI+'?advertiser_campaigns='+advertiser_campaign_id_str)
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }

    public getPricing = async (advertiser_campaign_id, advertiser_campaign_bids, publisher_campaign_id) => {
        let advertiser_campaign_id_str = advertiser_campaign_id.join();
        let advertiser_campaign_bids_str = advertiser_campaign_bids.join();
        try {
            return await axios.get(pricingURI+'?advertiser_campaigns='+advertiser_campaign_id_str+'&advertiser_campaigns_bids='+advertiser_campaign_bids_str+'&publisher_campaign='+publisher_campaign_id)
        }
        catch (error) {
            console.log(error);
            return error;
        }

    }




}