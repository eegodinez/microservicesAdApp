import { AdsController } from "../controllers/requestController";

export class Routes {

    public adsController: AdsController = new AdsController();

    public routes(app): void {
        app.route('/')
        .get(this.adsController.getAdvertisers);       
    }
    
}