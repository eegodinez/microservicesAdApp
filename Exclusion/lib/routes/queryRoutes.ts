import { ExclusionsController } from "../controllers/requestController";

export class Routes {

    public exclusionsController: ExclusionsController = new ExclusionsController();

    public routes(app): void {
        app.route('/')
        .get(this.exclusionsController.getNonExcludedCampaigns);       
    }
    
}