import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ColorGameDiceOddsItem } from "./dice-odds-item";
import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;

const { render } = Observer;
const { Rounds } = gc;

@ccclass
export default class ColorGameDiceOdds extends ObserverComponent {
    @property({ type: ColorGameDiceOddsItem })
    oddItems: ColorGameDiceOddsItem[] = [];

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
