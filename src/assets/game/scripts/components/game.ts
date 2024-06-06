import gc from "@sg/game-client-base";
import { Label, Node, _decorator } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
import "./../../../resources/i18n";
import { CoinTossWinningResult } from "./coin-toss-winning-result";
import { FlipCoin } from "./flip-coin";
import { HighlightResult } from "./highlight-result";

const { Rounds, Translator, RoundHistories } = gc;

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

    private readonly winningSounds = { head: "head", tail: "tail" };

    protected clientRoundId = -1;
    protected resultSoundId = "";
    enableFixHandleFinish = true;

    onLoad() {
        super.onLoad();
        this.fetchComponents();
        this.winningResult.hideQuickly();
        this.flipCoin.init();
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
        this.playWinningSound();
        super.finishShowResult(result, settlementResult);
    }

    async showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {
        if (result) {
            this.flipCoin.setStatusNode(false);
            this.loadSoundResultBeforeRead(result);
            this.winningResult.setResult(result);
            if (hasAnimation) {
                await this.winningResult.show();
            }
        }
    }

    playWinningSound() {
        this.resultSoundId && this.playSound(this.resultSoundId);
    }

    loadSoundResultBeforeRead(data: gc.GameServiceMessage.TResult) {
        let isCancelLoadSounds = false;
        const maxWaitTime = 5000;
        const result = Object.keys(data).find((key) => data[key]);

        const timeoutCancelWinningSound = setTimeout(() => {
            isCancelLoadSounds = true;
        }, maxWaitTime);

        if (isCancelLoadSounds) {
            return;
        }
        const winOptionName = this.winningSounds[result];
        const soundId = this.getAudioKeyForLanguage(winOptionName);
        if (soundId) {
            this.resultSoundId = soundId;
        }

        timeoutCancelWinningSound && clearTimeout(timeoutCancelWinningSound);
    }

    getAudioKeyForLanguage(name: string): string {
        return `${name}_${Translator.getLanguageId() || "en"}`;
    }

    async handleStartRound(isStartRound: boolean) {
        if (isStartRound) {
            super.handleStartRound(isStartRound);
            this.winningResult.hideQuickly();
            this.flipCoin.playAnim();
            this.highlightResult.hide();
            this.resultSoundId = "";
        }
    }

    @render(gc.App.AppStore, (store) => store.isLoading)
    updateLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.firstJoinGameHistory)
    async renderStaticResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }

        const { animationHighlight, roundTime, roundHistory: lastRound } = firstJoinGameHistory;
        if (lastRound && animationHighlight && roundTime > 0) {
            const { result } = lastRound;
            this.flipCoin.setStatusNode(false);
            this.highlightResult.show(result);
        }
    }
}
