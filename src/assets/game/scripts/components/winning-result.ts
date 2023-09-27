import gc from "@sg/game-client-base";
import { _decorator, Color, Node, Sprite, tween, v3 } from "cc";
import { WinningResult } from "../../../../extensions/shared-components/assets/shared/common-components/winning-result/scripts/winning-result";
import { AnimationUtils } from "../../../../extensions/shared-components/assets/shared/utils/utils";
import { ColorDice } from "../../color-game/scripts/dice";
const { ccclass, property } = _decorator;

@ccclass("ColorGameWinningResult")
export class ColorGameWinningResult extends WinningResult {
    @property(Node)
    colors: Node[] = [];

    private readonly colorHex = {
        [ColorDice.Yellow]: "#ffcf00",
        [ColorDice.Red]: "#cb2821",
        [ColorDice.Pink]: "#fd477c",
        [ColorDice.White]: "#ffffff",
        [ColorDice.Blue]: "#168cc9",
        [ColorDice.Green]: "#2dad2c",
    };

    protected delayTimeShowWinning = 2;
    protected durationTimeShowWinning = 5;

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
            ctx.color = new Color().fromHEX(this.colorHex[result]);
        });
    }
}
