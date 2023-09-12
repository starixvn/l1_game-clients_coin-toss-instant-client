import gc from "@sg/game-client-base";
import { _decorator, Camera, Node, Tween, tween } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { UiAdaptiveCamera } from "./ui-adaptive-camera";

const { Rounds } = gc;
const { RoundTimeStore } = Rounds;

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

enum CameraType {
    Center = 0,
    Right,
    Left,
    Top,
    Bottom,
}

@ccclass("ColorGameViewDicesBox")
export class ColorGameViewDicesBox extends ObserverComponent {
    @property(Node)
    miniCameraContainer;
    protected cameraNodes: Node[] = [];

    protected browseTween: Tween<Node>;

    onLoad() {
        if (this.miniCameraContainer) {
            this.cameraNodes = this.miniCameraContainer.getComponentsInChildren(Camera).map((camera) => camera.node);

            this.cameraNodes.forEach((node) => node.addComponent(UiAdaptiveCamera));
        }
    }

    start() {
        this.cameraNodes.forEach((node) => (node.active = false));
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    setVisibility(isPlacingBet: boolean) {
        this.node.active = isPlacingBet;
        this.miniCameraContainer.active = isPlacingBet;
    }

    browseAllCameras() {
        const gapTime = 0.4;
        const order = [
            //
            CameraType.Center,
            CameraType.Right,
            CameraType.Left,
            CameraType.Top,
            CameraType.Bottom,
            CameraType.Center,
        ];
        let index = 0;
        this.browseTween = tween(this.node)
            .call(() => {
                this.displayCamera(order[index]);
                index++;
            })
            .delay(gapTime)
            .union()
            .repeat(order.length)
            .start();
    }

    stopBrowseCameras() {
        this.browseTween?.stop();
        this.browseTween = null;
    }

    displayCamera(type: CameraType) {
        this.cameraNodes.forEach((node, index) => {
            node.active = type === index;
        });
    }

    onClickTop() {
        this.playSoundClick();
        this.stopBrowseCameras();
        this.displayCamera(CameraType.Top);
    }

    onClickBottom() {
        this.playSoundClick();
        this.stopBrowseCameras();
        this.displayCamera(CameraType.Bottom);
    }

    onClickLeft() {
        this.playSoundClick();
        this.stopBrowseCameras();
        this.displayCamera(CameraType.Left);
    }

    onClickRight() {
        this.playSoundClick();
        this.stopBrowseCameras();
        this.displayCamera(CameraType.Right);
    }
}
