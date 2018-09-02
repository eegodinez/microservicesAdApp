"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysqlDB_1 = require("../models/mysqlDB");
class MatchingController {
    getActiveCampaigns(req, res) {
        let category = req.query.category;
        if (!category) {
            console.log("Category is missing!");
            res.status(400).json({
                status: 400,
                message: "Category is missing!"
            });
            return;
        }
        mysqlDB_1.default.query('SELECT id, bid, targeting FROM configuration.advertiser_campaigns WHERE status = true AND category = ? ', category, (err, result, fields) => {
            if (err) {
                console.log("Status 500. Details: " + err);
                res.status(500).json({
                    status: 500,
                    message: "Internal server error!",
                    details: err
                });
                return;
            }
            if (result.length > 0) {
                console.log(JSON.stringify(result, null, 4));
                res.status(200).json({
                    results: result
                });
            }
            else {
                console.log("Status 400: No campaigns with category ID " + category + " found!");
                res.status(400).json({
                    status: 400,
                    message: "No campaigns with category ID " + category + " found!"
                });
            }
        });
    }
}
exports.MatchingController = MatchingController;
//# sourceMappingURL=requestController.js.map