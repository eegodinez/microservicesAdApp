import { TargetingController } from "../controllers/requestController";

export class Routes {

    public targetingController: TargetingController = new TargetingController();

    public routes(app): void {
        app.route('/')
        .get(this.targetingController.getCampaignsZip);       
    }
    
}