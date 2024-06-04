import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { BetItems } from "db://shared-components/game/bets/scripts/components/bet-items";

const { ccclass } = _decorator;

@ccclass("CoinTossBetItems")
export class CoinTossBetItems extends BetItems {
    handleHighlightAnim(highLightInfo: gc.Rounds.THighlightAnim) {
        const { settlementResult, isAnim } = highLightInfo;
        if (highLightInfo?.settlementResult) {
            this.betItemComponents.forEach((betItem) => {
                const choice = betItem.node.name;
                betItem.handleHighlightAnim(!this.isWinning(+settlementResult?.[choice]) && isAnim);
            });
        }
    }
}
