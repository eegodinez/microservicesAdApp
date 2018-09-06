import { QueryController } from "../controllers/requestController";

export class Routes {

    public queryController: QueryController = new QueryController();

    public routes(app): void {
        app.route('/')
        .get(this.queryController.getCampaigns);       
    }
    
}