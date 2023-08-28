import gc from "@sg/game-client-base";
import { _decorator, Component, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class ColorGameDiceOddsItem extends Component {
    @property(Label)
    lblOdds: Label = null;

    renderOdd(odds: number, fractional: boolean) {
        this.lblOdds.string = gc.FormatUtils.formatOdds(odds, fractional);
    }
}
