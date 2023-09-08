import { _decorator, Color, Label, Sprite, SpriteAtlas } from "cc";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import { BetChoice } from "../dtf-commons";
import gc from "@sg/game-client-base";
import { resultMapper } from "./bet-detail-body-item";

const { ccclass, property } = _decorator;

@ccclass
export default class ResultBodyItem extends BaseResultBodyItem {
    @property(Sprite)
    dices: Sprite[] = [];

    @property(Label)
    rank: Label = null;

    @property(SpriteAtlas)
    atlas: SpriteAtlas = null;

    setData(result: any, settlementResult: gc.BetHistory.DynamicObject<boolean>) {
        this.dices.forEach((dice, index) => {
            const color = this.getKeyByValue(resultMapper, result[`dice${index + 1}`]);
            dice.spriteFrame = this.atlas?.getSpriteFrame(`history-result-count-${color}`);
        });

        this.rank.string = gc.Translator.gameTranslate(`glossary_${settlementResult[BetChoice.Hot] ? BetChoice.Hot : BetChoice.Cold}`);
    }

    getKeyByValue(resultMapper: object, value: number) {
        return Object.keys(resultMapper).find((key) => resultMapper[key] === value);
    }
}
