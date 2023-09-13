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
    miniCameraContainer;

    @property(Sprite)
    renderSprite: Sprite = null;

    protected cameraNodes: Camera[] = [];
    protected renderCameraSprites: SpriteFrame[] = [];

    protected browseTween: Tween<Node>;

    onLoad() {
        super.onLoad();
        if (this.miniCameraContainer) {
            this.cameraNodes = this.miniCameraContainer.getComponentsInChildren(Camera);
        }
    }

    generateRenderSpriteFrames() {
        const transform = this.renderSprite.getComponent(UITransform);
        const ratio = 2;
        const width = ratio * transform.width;
        const height = ratio * transform.height;
        this.cameraNodes.forEach((camera) => {
            const sp = new SpriteFrame();
            const renderTex = new RenderTexture();
            renderTex.reset({
                width,
                height,
            });
            camera.targetTexture = renderTex;
            sp.texture = renderTex;
            this.renderCameraSprites.push(sp);
        });
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
        this.renderSprite.spriteFrame = this.renderCameraSprites[type];
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
