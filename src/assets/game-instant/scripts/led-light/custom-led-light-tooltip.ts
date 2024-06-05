import gc from "@sg/game-client-base";
import { Color, _decorator, Node, v3, UITransform, CCFloat } from "cc";
import { LedLightTooltip } from "db://shared-components/game/led-light/scripts/components/led-light-tooltip";
import { BetChoice } from "../coin-toss-choices";
const { ccclass, property } = _decorator;

export enum TipAlignment {
    Left,
    Cennter,
    Right,
}

enum ColorResult {
    head = "#0535b3",
    tail = "#d5301a",
}
@ccclass("CustomLedLightTooltip")
export class CustomLedLightTooltip extends LedLightTooltip {
    @property(Node)
    background: Node = null;

    @property(CCFloat)
    offsetAligment = 0.2;

    protected onLoad(): void {
        super.onLoad();
    }

    public setTooltipInfo(ledLightInfo: gc.RoundHistories.RoundHistory) {
        this.roundId.string = `#${ledLightInfo.roundId}`;
        const winChoice = this.findWinningChoice(ledLightInfo);
        const name = gc.Translator.gameTranslate(`glossary_${winChoice}`);
        this.result.string = name.toUpperCase();
        this.result.color = new Color(ColorResult[winChoice]);
        this.showTooltip();
    }

    protected findWinningChoice(ledLightInfo: gc.RoundHistories.RoundHistory): string {
        const choices = [BetChoice.Trump, BetChoice.Biden];
        return choices.find((choice) => ledLightInfo.settlementResult[choice]) || "";
    }

    public setAlignment(alignment: TipAlignment) {
        if (!this.background) {
            return;
        }
        const pos = this.background.position;

        const width = this.background.getComponent(UITransform).width;
        const dict = [-0.5 + this.offsetAligment, 0, 0.5 - this.offsetAligment];
        const posX = width * dict[alignment];
        this.background.position = v3(posX, pos.y, pos.z);
    }
}
