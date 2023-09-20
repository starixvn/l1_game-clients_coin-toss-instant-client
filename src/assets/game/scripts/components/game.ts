import gc from "@sg/game-client-base";
import { Label, _decorator } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { siteConfigs } from "../../../scripts/site-configs";
import { ColorGame } from "../../color-game/scripts/color-game";
import { containerOptions, settings } from "../game-settings";
import "./../../../resources/i18n";
import { ColorGameDoubleTripleResult } from "./double-triple-result";
import { ColorGameWinningResult } from "./winning-result";
import { ColorDice } from "../../color-game/scripts/dice";
const { Rounds, Translator } = gc;

startGame(settings.name, containerOptions, siteConfigs);

const { ccclass, property } = _decorator;
const { observer, render } = Observer;

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property({ type: Label, override: true, visible: false })
    lblMinBet: Label = null;

    @property({ type: Label, override: true, visible: false })
    lblMaxBet: Label = null;

    @property(ColorGameWinningResult)
    winningResult: ColorGameWinningResult = null;

    @property(ColorGame)
    colorGame: ColorGame = null;

    @property(ColorGameDoubleTripleResult)
    doubleTripleResult: ColorGameDoubleTripleResult = null;

    override namespace = settings.name;
    override containerOptions = containerOptions;

    private winningSounds = {
        [ColorDice.Yellow]: "yellow",
        [ColorDice.Red]: "red",
        [ColorDice.Pink]: "pink",
        [ColorDice.White]: "white",
        [ColorDice.Blue]: "blue",
        [ColorDice.Green]: "green",
    };

    protected clientRoundId = -1;
    protected openAnimationIndex = 0;
    protected randomResults = [1, 1, 1];
    protected hasResetBox = false;
    protected currentPlaySFXDuration: number = 0;
    protected diceDropSound = "dice_drop";
    protected delayTimeShowWinningBox = 1.5;
    protected durationTimeShowWinningBox = 2;
    onLoad() {
        super.onLoad();
        this.winningResult.hideQuickly();
    }

    async finishShowResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {
        this.winningResult.setResult(result);
        this.playSound(this.diceDropSound);
        await AnimationUtils.delayTime(this.delayTimeShowWinningBox);
        this.winningSound(result);
        await this.winningResult.show();
        await AnimationUtils.delayTime(this.durationTimeShowWinningBox);
        this.doubleTripleResult.setResult(result);
        this.winningResult.hide();
        super.finishShowResult(result, settlementResult);
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

    async winningSound(data: gc.GameServiceMessage.TResult) {
        if (data) {
            const results = Object.values(data);
            await AnimationUtils.delayTime(1);
            for (const result of results) {
                const winColorName = this.winningSounds[result];
                this.playSound(this.getAudioKeyForLanguage(winColorName));
                console.log("currentPlaySFXDuration", this.currentPlaySFXDuration);
                await AnimationUtils.delayTime(this.currentPlaySFXDuration);
            }
        }
    }

    getAudioKeyForLanguage(name: string): string {
        return `${name}_${Translator.getLanguageId() || "en"}`;
    }

    async handleStartRound(isStartRound: boolean) {
        if (isStartRound) {
            super.handleStartRound(isStartRound);
            this.colorGame.resetColorBox(this.randomResults);
            this.hasResetBox = true;
        }
    }

    @render(gc.Audios.AudioStore, (store) => store.currentPlaySFXDuration, { fireImmediately: false })
    handleCurrentPlaySFXDuration(currentPlaySFXDuration: number) {
        this.currentPlaySFXDuration = currentPlaySFXDuration;
    }
}
