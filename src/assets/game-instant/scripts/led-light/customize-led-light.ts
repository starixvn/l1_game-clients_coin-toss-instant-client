import { CCFloat, Node, UITransform, _decorator, v3 } from "cc";
import { LedLight } from "../../../../extensions/shared-components/assets/game/led-light/scripts/components/led-light";
import { LedLightItem } from "../../../../extensions/shared-components/assets/game/led-light/scripts/components/led-light-item";
import { CustomLedLightTooltip, TipAlignment } from "./custom-led-light-tooltip";
const { ccclass, property } = _decorator;

@ccclass("CustomLedLight")
export class CustomLedLight extends LedLight {
    @property(CCFloat)
    offsetBorderCount = 2;
    override toolTipCompt: CustomLedLightTooltip;

    protected readonly ledLightItemListener = {
        onEnter: (node: Node) => {
            const childIndex = node.parent.children.findIndex((child) => child === node);
            this.selectedLedLight = node;
            const pos = this.toolTipCompt.node.parent
                .getComponent(UITransform)
                .convertToNodeSpaceAR(node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0)));
            this.toolTipCompt.node.position = v3(pos.x, this.toolTipCompt.node.position.y, 0);
            const ledLightInfo = node.getComponent(LedLightItem).ledLightItemInfo;
            this.toolTipCompt.setTooltipInfo(ledLightInfo);
            this.toolTipCompt.showTooltip();

            let tipAlignment = TipAlignment.Cennter;
            if (childIndex <= this.offsetBorderCount) {
                tipAlignment = TipAlignment.Left;
            }
            if (childIndex >= node.parent.children.length - 1 - this.offsetBorderCount) {
                tipAlignment = TipAlignment.Right;
            }
            this.toolTipCompt.setAlignment(tipAlignment);
        },
        onLeave: () => {
            this.selectedLedLight = null;
            this.toolTipCompt?.showTooltip(false);
        },
    };
}
