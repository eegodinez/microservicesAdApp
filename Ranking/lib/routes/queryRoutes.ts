import { RankingController } from "../controllers/requestController";

export class Routes {

    public rankingController: RankingController = new RankingController();

    public routes(app): void {
        app.route('/ranking')
        .get(this.rankingController.getCampaigns);       
    }
    
}