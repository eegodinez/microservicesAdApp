import { TargetingController } from "../controllers/requestController";

export class Routes {

    public targetingController: TargetingController = new TargetingController();

    public routes(app): void {
        app.route('/targeting').get(this.targetingController.getCampaignsZip);
        app.route('/health').get(this.targetingController.healthCheck);
    }
    
}