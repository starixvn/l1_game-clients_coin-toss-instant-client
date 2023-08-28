import gc from "@sg/game-client-base";
import { Label, _decorator } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { WinningResult } from "db://shared-components/shared/common-components/winning-result/scripts/winning-result";
import { startGame } from "db://shared-components/shared/scripts/startup";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { siteConfigs } from "../../../scripts/site-configs";
import { ColorGame } from "../../color-game/scripts/color-game";
import { containerOptions, settings } from "../game-settings";
import "./../../../resources/i18n";
const { Settlements, Rounds } = gc;

const { movingNode, getPositionAtDestNode, playSpine, fadeOut, fadeIn } = AnimationUtils;

startGame(settings.name, containerOptions, siteConfigs);

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property({ type: Label, override: true, visible: false })
    lblMinBet: Label = null;

    @property({ type: Label, override: true, visible: false })
    lblMaxBet: Label = null;

    @property(WinningResult)
    winningResult: WinningResult = null;

    @property(ColorGame)
    colorGame: ColorGame = null;

    override namespace = settings.name;
    override containerOptions = containerOptions;

    private choiceWinningSounds = {
        dragon: "dragon-growl",
        tiger: "tiger-growl",
    };
    onLoad() {
        super.onLoad();
        this.winningResult.hideQuickly();
    }

    async finishShowResult(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        this.winningResult.setSettlementResult(settlementResult);
        await this.winningResult.show();
        const showWinningResult = 1;
        await AnimationUtils.delayTime(showWinningResult);
        this.winningResult.hide();
        super.finishShowResult(settlementResult);
    }

    async showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {
        if (result) {
            console.log("Show Result", result);
        }
    }

            this.playSound(this.choiceWinningSounds[winChoice]);
    async handleStartRound(isStartRound: boolean) {
        if (isStartRound) {
            super.handleStartRound(isStartRound);
        }
    }
}
