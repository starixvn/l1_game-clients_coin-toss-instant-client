import inversify from "inversify";
import mobx from "mobx";
const { injectable } = inversify;
@injectable()
export class CameraStore {
    mainCameraActive = true;
    miniCameraActive = false;
    constructor() {
        mobx.makeAutoObservable(this);
    }
}
