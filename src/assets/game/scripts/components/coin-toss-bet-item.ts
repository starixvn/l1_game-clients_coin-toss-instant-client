import { _decorator, Node } from "cc";
import { PFBetItem } from "db://shared-components/provably-fair/round-base/scripts/pf-bet-item";

const { ccclass, property } = _decorator;

@ccclass("CoinTossBetItem")
export class CoinTossBetItem extends PFBetItem {
    @property(Node)
    normalIcon: Node = null;

    @property(Node)
    loseIcon: Node = null;

    public handleHighlightAnim(isActive: boolean) {
        this.normalIcon && (this.normalIcon.active = !isActive);
        this.loseIcon && (this.loseIcon.active = isActive);
    }
}
