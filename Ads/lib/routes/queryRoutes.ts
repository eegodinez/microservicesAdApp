import { AdsController } from "../controllers/requestController";

export class Routes {

    public adsController: AdsController = new AdsController();

    public routes(app): void {
        app.route('/ads').get(this.adsController.getAdvertisers);
        app.route('/health').get(this.adsController.healthCheck);        
    }
    
}