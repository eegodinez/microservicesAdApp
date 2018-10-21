import { TrackingController } from "../controllers/requestController";

export class Routes {

    public trackingController: TrackingController = new TrackingController();

    public routes(app): void {
        app.route('/tracking/query').post(this.trackingController.queryStream);
        app.route('/tracking/impression').post(this.trackingController.impressionStream);
        app.route('/tracking/click').post(this.trackingController.clickStream);
        app.route('/health').get(this.trackingController.healthCheck);   
    }
    
}