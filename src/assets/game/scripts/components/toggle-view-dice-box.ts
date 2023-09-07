import gc from "@sg/game-client-base";
import { _decorator, Node, Tween, UIOpacity, v3, tween } from "cc";
import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
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
    protected showableOpacity: UIOpacity;

    @render(RoundTimeStore, (store) => store.isPlacingBet)
    setVisibility(isPlacingBet: boolean) {
        this.node.active = isPlacingBet;
    }

    collapse(animated = true) {
        this.shown = false;
        this.toggleIcon(this.shown);

        if (!animated) {
            this.showableOpacity.opacity = 1;
            this.diceBoxNode.position = this.hidePosition;
            return;
        }
        this.tweenCollapse();
    }

    expand() {
        this.shown = true;
        this.toggleIcon(this.shown);
        this.tweenExpand();
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
        Tween.stopAllByTarget(this.showableOpacity);
        tween(this.diceBoxNode).to(this.showDuration, { position: this.showPosition }).start();
        tween(this.showableOpacity).to(this.showDuration, { opacity: 255 }).start();
    }

    tweenCollapse() {
        Tween.stopAllByTarget(this.diceBoxNode);
        Tween.stopAllByTarget(this.showableOpacity);
        tween(this.diceBoxNode).to(this.showDuration, { position: this.hidePosition }).start();
        tween(this.showableOpacity).to(this.showDuration, { opacity: 0 }).start();
    }
}
