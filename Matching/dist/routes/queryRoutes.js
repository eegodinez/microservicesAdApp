"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestController_1 = require("../controllers/requestController");
class Routes {
    constructor() {
        this.matchingController = new requestController_1.MatchingController();
    }
    routes(app) {
        app.route('/')
            .get(this.matchingController.getActiveCampaigns);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=queryRoutes.js.map