import { Request, Response } from 'express';
import axios from 'axios';
import * as crypto from 'crypto';
import DynamoDB = require('aws-sdk/clients/dynamodb');
import * as dynamo from './dynamokeys';

var matchingURI, exclusionsURI, targetingURI, rankingURI, adsURI, pricingURI, clickURI, trackingQueryURI, trackingImpressionURI: string;

let docClient = new DynamoDB.DocumentClient( {
    region: "us-east-1",
    endpoint: "dynamodb.us-east-1.amazonaws.com",
    accessKeyId: dynamo.default.access,
    secretAccessKey: dynamo.default.secret,
    convertEmptyValues: true,
}); 


axios.get("https://s3.amazonaws.com/tarea5bucket/URI.json").then(promise => {
    let jsonURI = promise.data
    matchingURI = jsonURI["matchingURI"];
    exclusionsURI = jsonURI["exclusionsURI"];
    targetingURI = jsonURI["targetingURI"];
    rankingURI = jsonURI["rankingURI"];
    adsURI = jsonURI["adsURI"];
    pricingURI = jsonURI["pricingURI"];
    clickURI = jsonURI["clickURI"];
    trackingQueryURI = jsonURI["trackingURIQuery"];
    trackingImpressionURI = jsonURI["trackingURIImpression"];
}).catch(error => {
    console.log(error);
})

export class QueryController {

    public bid;
    public targeting;
    public exclusionResults;
    public targetingResults;

    public getCampaigns = (req: Request, res: Response) => {
        let category = parseInt(req.query.category);
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


            if (promise.response){
                res.status(promise.response.status).json(promise.response.data)
                return;
            }

            if (promise.errno){
                res.status(500).json({
                    Error: promise.errno,
                    URL: promise.config.url
                })
                return;                
            }

            let matchingResults = promise.data.results;
            console.log(matchingResults)
            console.log("\n")
            
            //id, bid, targeting
            let id_values = matchingResults.map(a => a.id);
            this.bid = matchingResults.map(a => a.bid);
            this.targeting = matchingResults.map(a => a.targeting)

            this.getExclusion(id_values, publisher_campaign).then(promise => {

                if (promise.response){
                    res.status(promise.response.status).json(promise.response.data)
                    return;
                }

                if (promise.errno){
                    res.status(500).json({
                        Error: promise.errno,
                        URL: promise.config.url
                    })
                    return;                
                }

                let exclusionPromiseResults = promise.data.results;
                let global_publisher_id = promise.data.publisher_id;
                this.exclusionResults = exclusionPromiseResults.map(a => a.id);
                console.log('Exclusion Results');
                console.log(this.exclusionResults);
                console.log("\n");

                this.getTargeting(id_values, zip_code).then(promise => {

                    if (promise.response){
                        res.status(promise.response.status).json(promise.response.data)
                        return;
                    }

                    if (promise.errno){
                        res.status(500).json({
                            Error: promise.errno,
                            URL: promise.config.url
                        })
                        return;                
                    }

                    let targetingPromiseResults = promise.data.results;
                    console.log(targetingPromiseResults);

                    this.targetingResults = targetingPromiseResults.map(a => a.id);

                    //Es mejor obtenerlo del servicio Ads, ya que nos lo devuleve ordenado
                    //let targetingAdvertiserIdResults = targetingPromiseResults.map(a => a.advertiser_id);


                    //inter entre resultados de exclusion y targeting
                    console.log("targeting")
                    console.log(this.targetingResults)
                    let intersection = this.exclusionResults.filter(x => this.targetingResults.includes(x))
                    console.log("intersection")
                    console.log(intersection);
                    console.log("\n")



                    let bids_filtered = [];
    
                    for (let value in intersection){
                        bids_filtered.push(matchingResults.find(mresults => mresults.id === intersection[value]).bid)
                    }

                    let advertiser_id_filtered = []
                    for (let value in intersection){
                        advertiser_id_filtered.push(targetingPromiseResults.find(tresults => tresults.id === intersection[value]).advertiser_id)
                    }

                    console.log("Filtered advertiser id")
                    console.log(advertiser_id_filtered);
                    console.log("\n")
                   
                     
                    this.getRanking(intersection, bids_filtered,maximum).then(promise => {

                        if (promise.response){
                            res.status(promise.response.status).json(promise.response.data)
                            return;
                        }

                        if (promise.errno){
                            res.status(500).json({
                                Error: promise.errno,
                                URL: promise.config.url
                            })
                            return;                
                        }

                        let rankingPromiseResults = promise.data.results;
                        let ordered_advertiser_campaign_id = rankingPromiseResults.map(a => a.id);
                        let ordered_bids = rankingPromiseResults.map(a => a.bid);
                        console.log("Ranking Promise Results");
                        console.log(rankingPromiseResults);
                        console.log("\n");

                        this.getAds(ordered_advertiser_campaign_id).then(promise => {

                            if (promise.response){
                                res.status(promise.response.status).json(promise.response.data)
                                return;
                            }

                            if (promise.errno){
                                res.status(500).json({
                                    Error: promise.errno,
                                    URL: promise.config.url
                                })
                                return;                
                            }

                            let adsPromiseResults = promise.data.results;

                            let rngQueryID = crypto.randomBytes(10).toString('hex')
                            let ts = this.js_yyyy_mm_dd_hh_mm_ss();
                            for (let value in adsPromiseResults){
                                let impressionID = crypto.randomBytes(10).toString('hex')
                                Object.assign(adsPromiseResults[value], {
                                    impression_id: impressionID, 
                                    clickURL: clickURI+"?query_id="+rngQueryID+"&impression_id="+impressionID,
                                })
                            }

                            let newAdsPromiseResults = JSON.parse(JSON.stringify(adsPromiseResults));
                            for (let value in newAdsPromiseResults){
                                Object.assign(newAdsPromiseResults[value], {
                                    timestamp: ts,
                                    publisher_id: parseInt(global_publisher_id),
                                    publisher_campaign_id: parseInt(publisher_campaign),
                                    category: category,
                                    zip_code: zip_code,
                                    position: parseInt(value) + 1,
                                    query_id: rngQueryID,
                                });
                            }


                            //preparar JSON de impression para enviar a tracking
                            
                            let impression_put_tracking_JSON = {};

                            for (let value in newAdsPromiseResults){
                                impression_put_tracking_JSON[value] = {
                                    query_id: rngQueryID,
                                    impression_id: newAdsPromiseResults[value].impression_id,
                                    timestamp: newAdsPromiseResults[value].timestamp,
                                    publisher_id: parseInt(global_publisher_id),
                                    publisher_campaign_id: parseInt(publisher_campaign),
                                    advertiser_id: parseInt(newAdsPromiseResults[value].advertiser_id),
                                    advertiser_campaign_id: parseInt(newAdsPromiseResults[value].advertiser_campaign_id), 
                                    category: category,
                                    ad_id: parseInt(newAdsPromiseResults[value].id),
                                    zip_code: zip_code,
                                    advertiser_price: newAdsPromiseResults[value].bid,
                                    position: parseInt(value)+1,
                                };
                            }

                            for (let value in adsPromiseResults) {
                                delete adsPromiseResults[value]["advertiser_id"];
                                delete adsPromiseResults[value]["advertiser_campaign_id"];
                                delete adsPromiseResults[value]["bid"];
                            }

                            console.log('Ads Promise Results');
                            console.log(adsPromiseResults);
                            console.log("\n");

                            this.getPricing(intersection, bids_filtered, publisher_campaign).then(promise => {

                                if (promise.response){
                                    res.status(500).json(promise.response.data)
                                    return;
                                }

                                if (promise.errno){
                                    res.status(500).json({
                                        Error: promise.errno,
                                        URL: promise.config.url
                                    })
                                    return;                
                                }

                                let pricingPromiseResults = promise.data.results
                                console.log('Pricing Promise Results');
                                console.log(pricingPromiseResults);
                                console.log('\n');

                                for (let value in pricingPromiseResults) {
                                    Object.assign(impression_put_tracking_JSON[value], {
                                        publisher_price: parseFloat(pricingPromiseResults[value].price),
                                    });
                                    Object.assign(newAdsPromiseResults[value], {
                                        publisher_price: parseFloat(pricingPromiseResults[value].price),
                                    });
                                }

                                console.log("Tracking Payload Impression");
                                console.log(impression_put_tracking_JSON);
                                console.log("\n");

                                let params = {
                                    TableName: "Tarea6",
                                    Item: {
                                        QueryID: rngQueryID,
                                        ads: newAdsPromiseResults,
                                        TTL: Math.floor(new Date().getTime() / 1000) + 86400
                                    }
                                }

                                docClient.put(params).promise().then(promise => {
                                    console.log(promise);
                                }).catch(error => {
                                    console.log(error);
                                    res.status(500).json(error)
                                    return;
                                })

                                let query_put_tracking_JSON = {
                                    query_id: rngQueryID,
                                    publisher_campaign_id: parseInt(publisher_campaign),
                                    publisher_id: parseInt(global_publisher_id),
                                    category: category,
                                    zip_code: zip_code,
                                    timestamp: ts,
                                }

                                axios.post(trackingQueryURI,query_put_tracking_JSON).then((response) =>{
                                    console.log(response);
                                }).catch((error) => {
                                    //console.log(error);
                                    //res.status(500).json(error)
                                    return;
                                })

                                console.log("Impression click URI");
                                console.log(trackingImpressionURI);
                                console.log("\n")
                                for (let value in impression_put_tracking_JSON){
                                    axios.post(trackingImpressionURI,impression_put_tracking_JSON[value]).then((response) =>{
                                        console.log(response);
                                    }).catch((error) => {
                                        //console.log(error);
                                        //res.status(500).json(error)
                                        return;
                                    })
                                }
                                
                                res.status(200).json({
                                    header: {
                                        query_id: rngQueryID
                                    },
                                    ads: adsPromiseResults,
                                })

                            }).catch((error) => {
                                console.log(error)
                                res.status(500).json({
                                    status:500,
                                    message: "Query-MS failed at call to Pricing",
                                    details: error
                                })
                            })
                        }).catch((error) => {
                            console.log(error)
                            res.status(500).json({
                                status:500,
                                message: "Query-MS failed at call to Ads",
                                details: error
                            })
                        })
                    }).catch((error) => {
                        console.log(error)
                        res.status(500).json({
                            status:500,
                            message: "Query-MS failed at call to Ranking",
                            details: error
                        })
                    })
                }).catch((error) => {
                    console.log(error)
                    res.status(500).json({
                        status:500,
                        message: "Query-MS failed at call to Targeting",
                        details: error
                    })
                })
            }).catch((error) => {
                console.log(error)
                res.status(500).json({
                    status:500,
                    message: "Query-MS failed at call to Exclusion",
                    details: error
                })
            })
        }).catch((error) => {
            console.log(error);
            res.status(500).json({
                status:500,
                message: "Query-MS failed at call to Matching",
                details: error
            })
        });
        return;
    }

    public healthCheck = (req: Request, res: Response) => {
        res.status(200).json({
            'Content-Type': 'text/plain',
            'Content-Length': 2
        })
    }

    public getMatching = async (categoryID) => {
        console.log(matchingURI);
        try{
            return await axios.get(matchingURI+'?category='+categoryID);
        }
        catch (error) {
            console.log("getMatching Failed!");
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

    public js_yyyy_mm_dd_hh_mm_ss = () => {
        let now = new Date();
        let year = "" + now.getFullYear();
        let month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
        let day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
        let hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
        let minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
        let second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
      }




}
