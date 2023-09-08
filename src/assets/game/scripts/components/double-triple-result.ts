import gc from "@sg/game-client-base";
import Observer from "observer";
import { _decorator, Node, Sprite, SpriteFrame } from "cc";
import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render } = Observer;
import { isEmpty } from "lodash-es";
const { Rounds } = gc;

const colorConstant = {
    resultMapper: { yellow: 0, red: 1, pink: 2, white: 3, blue: 4, green: 5 },
};

@ccclass("ColorGameDoubleTripleResult")
export class ColorGameDoubleTripleResult extends ObserverComponent {
    @property(Node)
    resultNode: Node[] = [];

    @property(SpriteFrame)
    doubleSpriteFrame: SpriteFrame = null;

    @property(SpriteFrame)
    doubleLastRoundSpriteFrame: SpriteFrame = null;

    @property(SpriteFrame)
    tripleSpriteFrame: SpriteFrame = null;

    @property(SpriteFrame)
    tripleLastRoundSpriteFrame: SpriteFrame = null;

    setData(result: gc.GameServiceMessage.TResult, double: SpriteFrame, triple: SpriteFrame) {
        this.resultNode.forEach((item: Node) => {
            const choice = item.name;
            item.active = false;

            if (Object.keys(colorConstant.resultMapper).indexOf(choice) >= 0) {
                const xValue = Object.values(result).filter((value) => value === colorConstant.resultMapper[choice]).length;

                if (xValue > 1) {
                    item.active = true;
                    item.getComponent(Sprite).spriteFrame = xValue === 2 ? double : triple;
                }
            }
        });
    }

    setResult(result: gc.GameServiceMessage.TResult) {
        this.setData(result, this.doubleSpriteFrame, this.tripleSpriteFrame);
    }

    setStaticResult(result: gc.GameServiceMessage.TResult) {
        this.setData(result, this.doubleLastRoundSpriteFrame, this.tripleLastRoundSpriteFrame);
    }

    @render(Rounds.RoundStore, (store) => store.highlightStatic, { fireImmediately: false })
    handleHighlightStatic(highlightStatic: gc.Rounds.THighlightStatic) {
        if (!isEmpty(highlightStatic?.result)) {
            this.setStaticResult(highlightStatic.result);
        }
    }

    @render(Rounds.RoundStore, (store) => store.isResetHighlight)
    handleResetHighlight(isResetHighlight: boolean) {
        if (isResetHighlight) {
            this.resultNode.forEach((item) => {
                item.active = false;
            });
        }
    }
}
