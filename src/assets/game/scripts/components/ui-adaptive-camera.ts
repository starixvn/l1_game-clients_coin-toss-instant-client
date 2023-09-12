import { _decorator, Camera, Component, game, rect } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UiAdaptiveCamera")
export class UiAdaptiveCamera extends Component {
    height = 0.19;
    y = 0.805;
    widthHeightRatio = 1.778;
    protected camera: Camera;

    onLoad() {
        this.camera = this.getComponent(Camera);
    }
    update(dt: number) {
        if (!this.camera) {
            return;
        }

        const cameraWidth = this.widthHeightRatio * this.height * (game.canvas.height / game.canvas.width);
        const cameraX = (1 - cameraWidth) / 2;
        this.camera.rect = rect(cameraX, this.y, cameraWidth, this.height);
    }
}
