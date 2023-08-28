import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { BetItems } from "../../../../extensions/shared-components/assets/game/bets/scripts/components/bet-items";
import Observer from "observer";
import { ColorGameOddItem } from "./odd-item";
const { ccclass, property } = _decorator;

const { render } = Observer;
const { Rounds } = gc;

@ccclass
export default class ColorGameBetItems extends BetItems {
    @property({ type: ColorGameOddItem })
    oddItems: ColorGameOddItem[] = [];

    @render(Rounds.RoundStore, (store) => store.roundOdds, { fireImmediately: false })
    renderOdds(roundOdds: gc.Rounds.RoundOdds) {
        const { odds, fractional } = roundOdds;

        this.oddItems.forEach((item) => {
            if (odds?.[item.node.name]) {
                item.renderOdd(odds[item.node.name], fractional);
            }
        });
    }
}
