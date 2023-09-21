import gc from "@sg/game-client-base";
import { _decorator, Camera, Node, RenderTexture, Sprite, SpriteFrame, Tween, tween, UITransform } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

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
    miniCameraContainer: Node = null;

    @property(Sprite)
    renderSprite: Sprite = null;

    protected cameraNodes: Node[] = [];
    protected camera: Camera;
    protected browseTween: Tween<Node>;

    protected fov = {
        [CameraType.Center]: 30,
        [CameraType.Right]: 26,
        [CameraType.Left]: 26,
        [CameraType.Bottom]: 28,
        [CameraType.Top]: 28,
    };

    onLoad() {
        super.onLoad();
        if (this.miniCameraContainer) {
            this.cameraNodes = this.miniCameraContainer.getChildByName("anchor").children;
            this.camera = this.miniCameraContainer.getChildByName("camera").getComponent(Camera);
        }
    }

    generateRenderSpriteFrames() {
        const transform = this.renderSprite.getComponent(UITransform);
        const ratio = 2;
        const width = ratio * transform.width;
        const height = ratio * transform.height;

        const spriteFrame = new SpriteFrame();
        const renderTex = new RenderTexture();
        renderTex.reset({
            width,
            height,
        });

        this.camera.targetTexture = renderTex;
        spriteFrame.texture = renderTex;
        this.renderSprite.spriteFrame = spriteFrame;

        this.displayCamera(CameraType.Center);
    }

    start() {
        this.generateRenderSpriteFrames();
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    setVisibility(isPlacingBet: boolean) {
        this.node.active = isPlacingBet;
        this.miniCameraContainer.active = isPlacingBet;
    }

    initCameraCenter() {
        this.displayCamera(CameraType.Center);
    }

    browseAllCameras() {
        const gapTime = 0.7;
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
        const cameraNode = this.cameraNodes[type];
        this.camera.node.position = cameraNode.position;
        this.camera.node.rotation = cameraNode.rotation;
        this.camera.fov = this.fov[type];
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
