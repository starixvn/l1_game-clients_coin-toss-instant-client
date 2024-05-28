import gc from "@sg/game-client-base";
import { Color, Sprite, _decorator } from "cc";
import { LedLightTooltip } from "db://shared-components/game/led-light/scripts/components/led-light-tooltip";
import { BetChoice } from "../coin-toss-choices";
const { ccclass, property } = _decorator;

enum ColorResult {
    head = "#0535b3",
    tail = "#d5301a",
}
@ccclass("CustomLedLightTooltip")
export class CustomLedLightTooltip extends LedLightTooltip {
    @property(Sprite)
    chipRed: Sprite = null;

    @property(Sprite)
    chipBlue: Sprite = null;

    protected onLoad(): void {
        super.onLoad();
    }

    public setTooltipInfo(ledLightInfo: gc.RoundHistories.RoundHistory) {
        this.roundId.string = `#${ledLightInfo.roundId}`;
        const winChoice = this.findWinningChoice(ledLightInfo);
        const name = gc.Translator.gameTranslate(`glossary_${winChoice}`);
        this.result.string = name.toUpperCase();
        this.result.color = new Color(ColorResult[winChoice]);
        this.updateChipInfo(winChoice);
        this.showTooltip();
    }

    protected findWinningChoice(ledLightInfo: gc.RoundHistories.RoundHistory): string {
        const choices = [BetChoice.Trump, BetChoice.Biden];
        return choices.find(choice => ledLightInfo.settlementResult[choice]) || "";
    }
    
    protected updateChipInfo(choice: string) {
        this.chipBlue.node.active = choice === "head";
        this.chipRed.node.active = choice === "tail";
    }
}
