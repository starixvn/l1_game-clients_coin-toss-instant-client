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
import ColorGameDiceOdds from "./dice-odds";
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

    @property(ColorGameDiceOdds)
    dicesOdds: ColorGameDiceOdds = null;

    override namespace = settings.name;
    override containerOptions = containerOptions;

    protected clientRoundId = -1;
    protected openAnimationIndex = 0;
    protected randomResults = [1, 1, 1];
    protected hasResetBox = false;

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

    @render(Rounds.RoundStore, (store) => store.clientRoundId)
    storeClientRoundId(clientRoundId: number) {
        this.clientRoundId = clientRoundId;
        this.calculateForDices();
    }

    @render(Rounds.RoundTimeStore, (store) => store.isInRoundTime)
    renderInRoundTime(isInRoundTime: boolean) {
        if (isInRoundTime && !this.hasResetBox) {
            this.colorGame.resetColorBox(this.randomResults);
            this.hasResetBox = true;
        }
    }

    calculateForDices() {
        const seedNumber = 123;
        this.openAnimationIndex = (this.clientRoundId * seedNumber) % this.colorGame.openAnimationCount;
        const temp = (this.clientRoundId * seedNumber).toString().slice(-3);
        this.randomResults = [];
        for (let i = 0; i < 3; i++) {
            this.randomResults.push(+temp[i] % 6);
        }
    }

    async showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {
        if (result) {
            const results = Object.values(result);
            const animationIndex = this.openAnimationIndex;
            if (hasAnimation) {
                this.colorGame.showResult(results, animationIndex);
            } else {
                this.colorGame.showResultStatic(results, animationIndex);
            }

            this.hasResetBox = false;
        }
    }

            this.playSound(this.choiceWinningSounds[winChoice]);
    async handleStartRound(isStartRound: boolean) {
        if (isStartRound) {
            super.handleStartRound(isStartRound);
            this.colorGame.resetColorBox(this.randomResults);
            this.hasResetBox = true;
        }
    }
}
