import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { DiceOddsItem } from "./dice-odds-item";
const { ccclass, property } = _decorator;

const { render } = Observer;
const { Rounds } = gc;

@ccclass
export default class DiceOdds extends ObserverComponent {
    @property({ type: DiceOddsItem })
    oddItems: DiceOddsItem[] = [];

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
