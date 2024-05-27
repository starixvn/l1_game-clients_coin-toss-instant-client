import { _decorator, Component } from "cc";
import gc from "@sg/game-client-base";

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
export default class BetDetailBodyItem extends Component {
    setData() {}

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
