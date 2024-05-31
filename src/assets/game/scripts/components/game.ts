import gc from "@sg/game-client-base";
import { Label, Node, _decorator } from "cc";
import { AudioUtils } from "db://shared-components/game/audios/utils";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import { FunctionUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
import "./../../../resources/i18n";
import { CoinTossWinningResult } from "./coin-toss-winning-result";
import { FlipCoin } from "./flip-coin";
import { HighlightResult } from "./highlight-result";

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
    flipCoinNode: Node = null;

    @property({ type: Node })
    highlightResultNode: Node = null;

    private winningResult: CoinTossWinningResult = null;
    private flipCoin: FlipCoin = null;
    private highlightResult: HighlightResult = null;

    override namespace = settings.name;
    override containerOptions = containerOptions;
    isLoading = true;

    private readonly winningSounds = {};

    protected clientRoundId = -1;
    protected resultsSoundInfo: ResultSoundInfo[] = [];

    onLoad() {
        super.onLoad();
        this.fetchComponents();
        this.winningResult.hideQuickly();
        this.flipCoin.setStatusNode(true);
    }

    fetchComponents() {
        this.winningResult = this.winningResultNode.getComponent(CoinTossWinningResult);
        this.flipCoin = this.flipCoinNode.getComponent(FlipCoin);
        this.highlightResult = this.highlightResultNode.getComponent(HighlightResult);
    }

    @render(Rounds.RoundStore, (store) => store.clientRoundId)
    storeClientRoundId(clientRoundId: number) {
        this.clientRoundId = clientRoundId;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isInRoundTime)
    renderInRoundTime(isInRoundTime: boolean) {
        if (isInRoundTime && !this.isLoading) {
            this.winningResult.hideQuickly();
        }
    }

    async finishShowResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {
        this.highlightResult.show(result);
        this.winningSound();
        this.winningResult.hide();
        super.finishShowResult(result, settlementResult);
    }

    async showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {
        if (result) {
            this.winningResult.setResult(result);
            if (hasAnimation) {
                await this.winningResult.show();
            } else {
                this.winningResult.showQuickly();
            }
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
            this.flipCoin.playAnim();
            this.highlightResult.hide();
        }
    }

    @render(gc.App.AppStore, (store) => store.isLoading)
    updateLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }
}
