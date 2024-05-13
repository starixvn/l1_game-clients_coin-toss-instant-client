import gc from "@sg/game-client-base";
import { Label, Node, _decorator } from "cc";
import { AudioUtils } from "db://shared-components/game/audios/utils";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import { AnimationUtils, FunctionUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { siteConfigs } from "../../../scripts/site-configs";
import { ColorDice } from "../../color-game/scripts/dice";
import { containerOptions, settings } from "../game-settings";
import "./../../../resources/i18n";
import { ColorGameDoubleTripleResult } from "./double-triple-result";
import { ColorGameWinningResult } from "./winning-result";

const { Rounds, Translator } = gc;

startGame(settings.name, containerOptions, siteConfigs);

const { ccclass, property } = _decorator;
const { observer, render } = Observer;

type ResultSoundInfo = {
    soundId: string;
    duration: number;
};

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property({ type: Label, override: true, visible: false })
    lblMinBet: Label = null;

    @property({ type: Label, override: true, visible: false })
    lblMaxBet: Label = null;

    @property({ type: Node })
    winningResultNode: Node = null;

    @property({ type: Node })
    doubleTripleResultNode: Node = null;

    private winningResult: ColorGameWinningResult = null;
    private doubleTripleResult: ColorGameDoubleTripleResult = null;

    override namespace = settings.name;
    override containerOptions = containerOptions;
    isLoading = true;

    private readonly winningSounds = {
        [ColorDice.Yellow]: "yellow",
        [ColorDice.Red]: "red",
        [ColorDice.Pink]: "pink",
        [ColorDice.White]: "white",
        [ColorDice.Blue]: "blue",
        [ColorDice.Green]: "green",
    };

    protected clientRoundId = -1;
    protected openAnimationIndex = 0;
    protected hasResetBox = false;
    protected delayTimeShowWinningBox = 2;
    protected resultsSoundInfo: ResultSoundInfo[] = [];

    onLoad() {
        super.onLoad();
        this.fetchComponents();
        this.winningResult.hideQuickly();
    }

    fetchComponents() {
        this.winningResult = this.winningResultNode.getComponent(ColorGameWinningResult);
        this.doubleTripleResult = this.doubleTripleResultNode.getComponent(ColorGameDoubleTripleResult);
    }

    @render(Rounds.RoundStore, (store) => store.clientRoundId)
    storeClientRoundId(clientRoundId: number) {
        this.clientRoundId = clientRoundId;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isInRoundTime)
    renderInRoundTime(isInRoundTime: boolean) {
        if (isInRoundTime && !this.hasResetBox && !this.isLoading) {
            this.winningResult.hideQuickly();
        }
    }

    async showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {
        if (result) {
            this.hasResetBox = false;
            //this.winningResult.setResult(result);
            this.loadSoundResultBeforeRead(result);
            if (hasAnimation) {
                await AnimationUtils.delayTime(this.delayTimeShowWinningBox);
                //this.winningResult.show();
                this.winningSound();
            } else {
                //this.winningResult.showQuickly();
            }
            this.doubleTripleResult.setResult(result);
        }
    }

    async winningSound() {
        if (this.resultsSoundInfo.length > 1) {
            await this.playSequentialSounds();
        }
    }

    async playSequentialSounds() {
        for (const resultSoundInfo of this.resultsSoundInfo) {
            this.playSound(resultSoundInfo.soundId);
            await FunctionUtils.delay(resultSoundInfo.duration * 1000);
        }
    }

    async loadSoundResultBeforeRead(data: gc.GameServiceMessage.TResult) {
        let isCancelLoadSounds = false;
        const maxWaitTime = 5000;
        const results = Object.values(data);

        const timeoutCancelWinningSound = setTimeout(() => {
            isCancelLoadSounds = true;
        }, maxWaitTime);

        for (const result of results) {
            if (isCancelLoadSounds) {
                break;
            }
            const winColorName = this.winningSounds[result];
            const soundId = this.getAudioKeyForLanguage(winColorName);
            if (soundId) {
                const duration = await AudioUtils.getDurationClip(soundId);

                if (duration > 0) {
                    this.resultsSoundInfo.push({ soundId, duration });
                }
            }
        }

        timeoutCancelWinningSound && clearTimeout(timeoutCancelWinningSound);
    }

    getAudioKeyForLanguage(name: string): string {
        return `${name}_${Translator.getLanguageId() || "en"}`;
    }

    async handleStartRound(isStartRound: boolean) {
        if (isStartRound) {
            super.handleStartRound(isStartRound);
            this.winningResult.hide();
            this.resultsSoundInfo = [];
        }
    }

    @render(gc.App.AppStore, (store) => store.isLoading)
    updateLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }
}
