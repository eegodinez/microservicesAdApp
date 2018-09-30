import { PricingController } from "../controllers/requestController";

export class Routes {

    public pricingController: PricingController = new PricingController();

    public routes(app): void {
        app.route('/pricing').get(this.pricingController.getPrice);
        app.route('/health').get(this.pricingController.healthCheck);
    }
    
}