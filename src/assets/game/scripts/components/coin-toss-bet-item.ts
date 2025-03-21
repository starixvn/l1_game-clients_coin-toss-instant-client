import { _decorator, Node, UIOpacity } from "cc";
import { PFBetItem } from "db://shared-components/provably-fair/round-base/scripts/pf-bet-item";

const { ccclass, property } = _decorator;

@ccclass("CoinTossBetItem")
export class CoinTossBetItem extends PFBetItem {
    @property(Node)
    loseIcon: Node = null;

    public handleHighlightAnim(isActive: boolean) {
        this.loseIcon && (this.loseIcon.active = isActive);
        this.lblTotalBet && (this.lblTotalBet.getComponent(UIOpacity).opacity = isActive ? 180 : 255);
        this.lblOwnBet && (this.lblOwnBet.getComponent(UIOpacity).opacity = isActive ? 180 : 255);
    }
}
