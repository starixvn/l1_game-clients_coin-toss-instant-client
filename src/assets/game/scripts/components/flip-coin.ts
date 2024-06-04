import { Component, _decorator, sp, Node } from "cc";
import { AnimationUtils } from "../../../../extensions/shared-components/assets/shared/utils";

const { ccclass, property } = _decorator;

@ccclass("FlipCoin")
export class FlipCoin extends Component {
    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;

    @property(Node)
    hand: Node = null;

    private readonly animName = "flip";
    private readonly durationFlipCoin = 3;

    init() {
        this.skeleton && (this.skeleton.node.active = false);
        this.hand && (this.hand.active = true);
    }

    setStatusNode(status: boolean) {
        this.node.active = status;
        this.skeleton && (this.skeleton.node.active = true);
    }

    async playAnim() {
        this.setStatusNode(true);
        this.hand && (this.hand.active = false);
        this.skeleton && (await AnimationUtils.playSpine(this.skeleton, this.animName, false, this.durationFlipCoin));
        // this.setStatusNode(false);
    }
}
