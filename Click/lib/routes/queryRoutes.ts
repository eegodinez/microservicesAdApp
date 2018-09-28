import { QueryController } from "../controllers/requestController";

export class Routes {

    public queryController: QueryController = new QueryController();

    public routes(app): void {
        app.route('/click')
        .get(this.queryController.getCampaigns);       
    }
    
}