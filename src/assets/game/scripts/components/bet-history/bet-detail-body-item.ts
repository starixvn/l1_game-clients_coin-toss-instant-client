import { _decorator } from "cc";
import gc from "@sg/game-client-base";
import BaseBetDetailBodyItem from "db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-body-item";

const { ccclass } = _decorator;
const { FormatUtils } = gc;

export interface ColorGameResult {
    dice1: number;
    dice2: number;
    dice3: number;
}

export const resultMapper: { [key: string]: number } = {
    yellow: 0,
    red: 1,
    pink: 2,
    white: 3,
    blue: 4,
    green: 5,
};

const oddMapper: { [key: number]: string } = {
    1: "single",
    2: "double",
    3: "triple",
};

const inferableChoices = ["hot", "cold"];

@ccclass
export default class BetDetailBodyItem extends BaseBetDetailBodyItem {
    setData(
        betDetailsLog: gc.BetHistory.BetDetailsLog,
        index: number,
        odds: gc.BetHistory.DynamicObject<number>,
        settlementResult: gc.BetHistory.DynamicObject<boolean>,
        result: gc.BetHistory.DynamicObject<ColorGameResult>,
        freeBet: boolean,
        fractionalOddsFormat: boolean
    ) {
        const { amount, choice } = betDetailsLog;
        const isWin = settlementResult[choice];
        super.setData(betDetailsLog, index, odds, settlementResult, result, freeBet, fractionalOddsFormat);

        const winningOdd = this.getWinningOdd(choice, isWin, result, odds);
        const effectiveOdds = freeBet ? winningOdd - 1 : winningOdd;
        const winningAmount = amount * effectiveOdds;
        this.lblWin.string = FormatUtils.numberWithCommas(winningAmount, 2);
        this.setHighlightTicketDetail(winningAmount > amount);

        this.lblOdds.string = isWin
            ? (fractionalOddsFormat ? FormatUtils.numberWithCommas(+effectiveOdds - 1, 2) : effectiveOdds).toString()
            : "-";
    }

    getWinningOdd(
        choice: string,
        isWin: boolean,
        result: gc.BetHistory.DynamicObject<ColorGameResult>,
        odds: gc.BetHistory.DynamicObject<number>
    ) {
        const winningOddsName = this.getWinningOddName(choice, isWin, result);
        return winningOddsName === "" ? 0 : odds[winningOddsName];
    }

    getWinningOddName(choice: string, isWin: boolean, result: gc.BetHistory.DynamicObject<ColorGameResult>) {
        if (inferableChoices.includes(choice) && isWin) {
            return choice;
        } else if (isWin) {
            let winCount = 0;

            Object.values(result).forEach((dice) => {
                if (resultMapper[choice] === Number(dice)) {
                    winCount += 1;
                }
            });

            return oddMapper[winCount];
        } else {
            return "";
        }
    }
}
