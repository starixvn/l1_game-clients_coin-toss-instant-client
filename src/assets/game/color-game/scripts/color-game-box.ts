import { Component, Node, _decorator, tween, v3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ColorGameBox")
export class ColorGameBox extends Component {
  @property(Node)
  lockNode: Node = null;

  private readonly openEulerAngleZ = 30;
  private readonly closeEulerAngleZ = -80;

  open() {
    return new Promise<void>((resolve) => {
      const eulerAngles = this.lockNode.eulerAngles;
      tween(this.lockNode)
        .to(0.5, {
          eulerAngles: v3(eulerAngles.x, eulerAngles.y, this.openEulerAngleZ),
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
        .delay(0.2)
        .call(resolve)
        .start();
    });
  }
}
