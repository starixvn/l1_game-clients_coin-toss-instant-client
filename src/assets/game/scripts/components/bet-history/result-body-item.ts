import { _decorator, Color, Label, Sprite } from "cc";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import { BetChoice } from "../dtf-commons";
import gc from "@sg/game-client-base";

const { ccclass } = _decorator;
const { property } = _decorator;

const ColorDictionary: { [key: number]: string } = {
    0: "FFFF00",
    1: "FF0000",
    2: "FF00C2",
    3: "FFFFFF",
    5: "00FF0A",
    4: "008FFF",
};

@ccclass
export default class ResultBodyItem extends BaseResultBodyItem {
    @property(Sprite)
    dices: Sprite[] = [];

    @property(Label)
    rank: Label = null;

    setData(result: any, settlementResult: gc.BetHistory.DynamicObject<boolean>) {
        this.dices.forEach((dice, index) => {
            dice.color = new Color(ColorDictionary[result[`dice${index + 1}`]]);
        });

        this.rank.string = gc.Translator.gameTranslate(`glossary_${settlementResult[BetChoice.Hot] ? BetChoice.Hot : BetChoice.Cold}`);
    }
}
