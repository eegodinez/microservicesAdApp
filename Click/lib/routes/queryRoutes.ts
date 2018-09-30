import { ClickController } from "../controllers/requestController";

export class Routes {

    public clickController: ClickController = new ClickController();

    public routes(app): void {
        app.route('/click').get(this.clickController.getQueryID);
        app.route('/health').get(this.clickController.healthCheck);   
    }
    
}