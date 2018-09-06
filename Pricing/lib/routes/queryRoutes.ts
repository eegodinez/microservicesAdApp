import { PricingController } from "../controllers/requestController";

export class Routes {

    public pricingController: PricingController = new PricingController();

    public routes(app): void {
        app.route('/')
        .get(this.pricingController.getPrice);       
    }
    
}