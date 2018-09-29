import { ClickController } from "../controllers/requestController";

export class Routes {

    public queryController: ClickController = new ClickController();

    public routes(app): void {
        app.route('/click')
        .get(this.queryController.getQueryID);       
    }
    
}