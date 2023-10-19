import gc from "@sg/game-client-base";
import { Mesh, MeshRenderer, Node, _decorator, tween, v3 } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
const { Configs } = gc;
const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass("ColorGameBox")
export class ColorGameBox extends ObserverComponent {
    @property(Node)
    lockNode: Node = null;

    @property(MeshRenderer)
    meshRendererLogo: MeshRenderer = null;

    @property(Mesh)
    meshLogoSG: Mesh = null;

    @property(Mesh)
    meshLogoVG: Mesh = null;

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
        this.meshRendererLogo.mesh = systemType === Configs.SystemConfigs.VG.name ? this.meshLogoVG : this.meshLogoSG;
    }
}
