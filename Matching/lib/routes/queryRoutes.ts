import { MatchingController } from "../controllers/requestController";

export class Routes {

    public matchingController: MatchingController = new MatchingController();

    public routes(app): void {
        app.route('/')
        .get(this.matchingController.getActiveCampaigns);       
    }
    
}