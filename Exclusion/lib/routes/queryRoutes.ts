import { ExclusionsController } from "../controllers/requestController";

export class Routes {

    public exclusionsController: ExclusionsController = new ExclusionsController();

    public routes(app): void {
        app.route('/exclusion').get(this.exclusionsController.getNonExcludedCampaigns);
        app.route('/health').get(this.exclusionsController.healthCheck);         
    }
    
}