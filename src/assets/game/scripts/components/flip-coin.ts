import { Component, _decorator, sp } from "cc";
import { AnimationUtils } from "../../../../extensions/shared-components/assets/shared/utils";

const { ccclass, property } = _decorator;

@ccclass("FlipCoin")
export class FlipCoin extends Component {
    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;

    private readonly animName = "flip";
    private readonly durationFlipCoin = 3;

    protected onLoad(): void {
        this.setStatusNode(false);
    }

    setStatusNode(status: boolean) {
        this.node.active = status;
    }

    async playAnim() {
        this.setStatusNode(true);
        this.skeleton && (await AnimationUtils.playSpine(this.skeleton, this.animName, false, this.durationFlipCoin));
        this.setStatusNode(false);
    }
}
