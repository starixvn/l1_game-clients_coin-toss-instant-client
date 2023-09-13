import gc from "@sg/game-client-base";
import { _decorator, Color, Node, Sprite, tween, v3 } from "cc";
import { WinningResult } from "../../../../extensions/shared-components/assets/shared/common-components/winning-result/scripts/winning-result";
import { AnimationUtils } from "../../../../extensions/shared-components/assets/shared/utils/utils";
const { ccclass, property } = _decorator;

export enum ColorDice {
    Yellow = 0,
    Red = 1,
    Pink = 2,
    White = 3,
    Blue = 4,
    Green = 5,
}

@ccclass("ColorGameWinningResult")
export class ColorGameWinningResult extends WinningResult {
    @property(Node)
    colors: Node[] = [];

    show(duration = 0.3) {
        return new Promise((resolve) => {
            this.node.scale = v3(0, 0, 0);
            this.node.active = true;
            tween(this.node)
                .call(() => {
                    AnimationUtils.fadeIn(this.node, 0.4 * duration);
                })
                .to(
                    duration,
                    {
                        scale: v3(1.05, 1.05, 1.05),
                    },
                    { easing: "sineOut" }
                )
                .to(
                    0.1,
                    {
                        scale: v3(1, 1, 1),
                    },
                    { easing: "sineOut" }
                )
                .call(resolve)
                .start();
        });
    }

    setResult(data: gc.GameServiceMessage.TResult) {
        const results = Object.values(data);

        this.colors.forEach((color, index) => {
            const result = results[index];
            const ctx = color.getComponent(Sprite);

            switch (result) {
                case ColorDice.Pink:
                    ctx.color = new Color().fromHEX("#fd477c");
                    break;
                case ColorDice.Green:
                    ctx.color = new Color().fromHEX("#2dad2c");
                    break;
                case ColorDice.Blue:
                    ctx.color = new Color().fromHEX("#168cc9");
                    break;
                case ColorDice.Red:
                    ctx.color = new Color().fromHEX("#cb2821");
                    break;
                case ColorDice.Yellow:
                    ctx.color = new Color().fromHEX("#ffcf00");
                    break;
                default:
                    ctx.color = new Color().fromHEX("#ffffff");
            }
        });
    }
}
