import gc from "@sg/game-client-base";
import { _decorator, sp } from "cc";
import { WinningResult } from "../../../../extensions/shared-components/assets/shared/common-components/winning-result/scripts/winning-result";
import { AnimationUtils } from "../../../../extensions/shared-components/assets/shared/utils";

const { ccclass, property } = _decorator;
export interface TResult {
    head: boolean;
    tail: boolean;
}

@ccclass("CoinTossWinningResult")
export class CoinTossWinningResult extends WinningResult {
    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;

    private skinName = "";
    private trackIndex = 0;
    private readonly animName = "settle";
    private readonly durationShowResult = 2;

    getSkinName(isBiden: boolean) {
        let name = "trump";
        if (isBiden) {
            name = "biden";
        }

        return name;
    }

    getTrackIndex(isBiden: boolean) {
        let trackIndex = 0;
        if (isBiden) {
            trackIndex = 1;
        }

        return trackIndex;
    }

    hideQuickly() {
        this.node.active = false;
    }

    async show() {
        this.node.active = true;
        return AnimationUtils.playSkinSpine(this.skeleton, this.animName, this.skinName, this.trackIndex, false, this.durationShowResult);
    }

    setResult(data: gc.GameServiceMessage.TResult) {
        const convertData = data as TResult;
        this.skinName = this.getSkinName(convertData?.head || false);
        this.trackIndex = this.getTrackIndex(convertData?.head || false);
    }
}
