import gc from "@sg/game-client-base";
import { MeshRenderer, Node, Texture2D, _decorator, tween, v3 } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
const { Configs } = gc;
const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass("ColorGameBox")
export class ColorGameBox extends ObserverComponent {
    @property(Node)
    lockNode: Node = null;

    @property(Node)
    logoNode: Node = null;

    @property(Texture2D)
    logoSGTexture: Texture2D = null;

    @property(Texture2D)
    logoVGTexture: Texture2D = null;

    private readonly openEulerAngleZ = -10;
    private readonly closeEulerAngleZ = -90;

    open(animated = true) {
        return new Promise<void>((resolve) => {
            const eulerAngles = this.lockNode.eulerAngles;
            const destEuler = v3(eulerAngles.x, eulerAngles.y, this.openEulerAngleZ);
            if (!animated) {
                this.lockNode.eulerAngles = destEuler;
                resolve();
                return;
            }
            tween(this.lockNode)
                .to(0.5, {
                    eulerAngles: destEuler,
                })
                .call(resolve)
                .start();
        });
    }

    close() {
        return new Promise<void>((resolve) => {
            const eulerAngles = this.lockNode.eulerAngles;
            tween(this.lockNode)
                .to(0.5, {
                    eulerAngles: v3(eulerAngles.x, eulerAngles.y, this.closeEulerAngleZ),
                })
                .call(resolve)
                .start();
        });
    }

    @render(Configs.SiteConfigs, (store) => store.systemType)
    showSystemSlogan(systemType: string) {
        const isSystemSG = systemType === Configs.SystemConfigs.SG.name;
        const logoRender = this.logoNode.getComponent(MeshRenderer);
        const logoMat = logoRender.getMaterialInstance(0);
        logoMat.setProperty("mainTexture", isSystemSG ? this.logoSGTexture : this.logoVGTexture);
    }
}
