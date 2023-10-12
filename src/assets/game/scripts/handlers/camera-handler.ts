import inversify from "inversify";
import { CameraStore } from "../stores/camera-store";

const { injectable, inject } = inversify;

@injectable()
export class CameraHandler {
    @inject(CameraStore) private readonly cameraStore: CameraStore;

    handle(active: boolean) {}

    activateMainCamera(active: boolean) {
        this.cameraStore.mainCameraActive = active;
    }

    activateMiniCamera(active: boolean) {
        this.cameraStore.miniCameraActive = active;
    }
}
