import gc from "@sg/game-client-base";
import { _decorator, sp, v3 } from "cc";
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

    animName = "";
    durationShowResult = 2;

    getAnimName(isBiden: boolean) {
        let name = "show-ket-qua-trump";
        if (isBiden) {
            name = "show-ket-qua-biden";
        }
        console.log("name", name);

        return name;
    }

    showQuickly() {
        this.node.scale = v3(1, 1, 1);
        this.node.active = true;
    }

    hideQuickly() {
        super.hideQuickly();
        this.skeleton.node.active = false;
    }

    show() {
        this.skeleton.node.active = true;
        return AnimationUtils.playSpine(this.skeleton, this.animName, false, this.durationShowResult);
    }

    setResult(data: gc.GameServiceMessage.TResult) {
        const convertData = data as TResult;
        this.animName = this.getAnimName(convertData?.head || false);
    }
}
