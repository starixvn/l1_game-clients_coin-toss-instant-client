import gc from "@sg/game-client-base";
import { Color, Sprite, _decorator } from "cc";
import { LedLightTooltip } from "db://shared-components/game/led-light/scripts/components/led-light-tooltip";
import { BetChoice } from "../coin-toss-choices";
const { ccclass, property } = _decorator;

enum ColorResult {
    tail = "#0535b3",
    head = "#d5301a",
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
        this.showChipInfo(winChoice);
        this.showTooltip();
    }

    protected findWinningChoice(ledLightInfo: gc.RoundHistories.RoundHistory): string {
        const choices = [BetChoice.Trump, BetChoice.Biden];
        let winChoice = "";

        choices.forEach((choice) => {
            if (ledLightInfo.settlementResult[choice]) {
                winChoice = choice;
            }
        });

        return winChoice;
    }

    protected showChipInfo(choice: string) {
        choice === "tail" ? (this.chipBlue.node.active = true) : (this.chipBlue.node.active = false);
        choice === "head" ? (this.chipRed.node.active = true) : (this.chipRed.node.active = false);
    }
}
