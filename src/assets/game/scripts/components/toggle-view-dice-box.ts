import gc from "@sg/game-client-base";
import { Node, Tween, UIOpacity, _decorator, tween, v3 } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { ColorGameViewDicesBox } from "./view-dice-box";
const { Rounds } = gc;
const { RoundTimeStore } = Rounds;

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass("ColorGameToggleViewDicesBox")
export class ColorGameToggleViewDicesBox extends ObserverComponent {
    @property(Node)
    diceBoxNode: Node = null;

    @property(Node)
    showIcon: Node = null;

    @property(Node)
    hideIcon: Node = null;

    protected readonly showDuration = 0.2;
    protected readonly showPosition = v3(0, 314, 0);
    protected readonly hidePosition = v3(0, 477, 0);
    protected shown = false;

    protected _colorGameViewDicesBox: ColorGameViewDicesBox;

    get colorGameViewDicesBox() {
        if (!this._colorGameViewDicesBox) {
            this._colorGameViewDicesBox = this.diceBoxNode.getComponent(ColorGameViewDicesBox);
        }
        return this._colorGameViewDicesBox;
    }
    protected _diceBoxOpacity: UIOpacity;

    get diceBoxOpacity() {
        if (!this._diceBoxOpacity) {
            this._diceBoxOpacity = this.diceBoxNode.addComponent(UIOpacity);
        }
        return this._diceBoxOpacity;
    }

    @render(RoundTimeStore, (store) => store.isPlacingBet)
    setVisibility(isPlacingBet: boolean) {
        this.node.active = isPlacingBet;

        this.colorGameViewDicesBox.setVisibility(isPlacingBet);
    }

    collapse(animated = true) {
        this.shown = false;
        this.toggleIcon(this.shown);

        if (!animated) {
            this.diceBoxNode.position = this.hidePosition;
            return;
        }
        this.tweenCollapse();
    }

    showMiniCamera(show: boolean) {
        this.colorGameViewDicesBox.setVisibility(show);
    }

    expand() {
        this.shown = true;
        this.toggleIcon(this.shown);
        this.tweenExpand();
        this.showMiniCamera(true);
    }

    toggleIcon(active: boolean) {
        this.showIcon.active = !active;
        this.hideIcon.active = active;
    }

    onClickExpand() {
        this.shown = !this.shown;
        this.shown ? this.expand() : this.collapse();
    }

    tweenExpand() {
        Tween.stopAllByTarget(this.diceBoxNode);
        this.diceBoxNode.position = this.hidePosition;
        this.diceBoxOpacity.opacity = 1;
        this.colorGameViewDicesBox.initCameraCenter();
        tween(this.diceBoxOpacity).to(0.1, { opacity: 255 }).start();
        tween(this.diceBoxNode)
            .to(this.showDuration, { position: this.showPosition })
            .call(() => {
                this.colorGameViewDicesBox.browseAllCameras();
            })
            .start();
    }

    tweenCollapse() {
        Tween.stopAllByTarget(this.diceBoxNode);

        this.colorGameViewDicesBox.stopBrowseCameras();
        tween(this.diceBoxNode)
            .to(this.showDuration, { position: this.hidePosition })
            .call(() => {
                this.diceBoxOpacity.opacity = 1;
            })
            .start();
    }
}
