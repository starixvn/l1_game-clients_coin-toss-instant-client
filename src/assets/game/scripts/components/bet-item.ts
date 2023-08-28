import { Sprite, SpriteFrame, _decorator } from "cc";
import BetItem from "../../../../extensions/shared-components/assets/game/bets/scripts/components/bet-item";

const { ccclass, property } = _decorator;

@ccclass
export default class ColorGameBetItem extends BetItem {
    @property(Sprite)
    xSprite: Sprite = null;

    setXSpriteFrame(spriteFrame: SpriteFrame) {
        this.xSprite.node.active = true;
        this.xSprite.spriteFrame = spriteFrame;
    }

    public loadInactiveHighlight() {
        super.loadInactiveHighlight();
        if (this.xSprite) {
            this.xSprite.node.active = false;
        }
    }
}
