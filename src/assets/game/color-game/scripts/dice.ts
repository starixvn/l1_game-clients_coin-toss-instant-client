import { Component, Node, Quat, RigidBody, Vec3, _decorator, v3 } from "cc";
const { ccclass, property } = _decorator;
export enum ColorDice {
    Yellow = 0,
    Red = 1,
    Pink = 2,
    White = 3,
    Blue = 4,
    Green = 5,
}

@ccclass
export default class Dice extends Component {
    @property(Node)
    cube: Node = null;

    @property(Node)
    render: Node = null;

    setResult(face: number, cubeUpVector: Vec3, percent: number, diceIndex: number) {
        const node = this.render;
        let upVector: Vec3;
        switch (face) {
            case ColorDice.Pink:
                upVector = v3(0, 1, 0);
                break;
            case ColorDice.White:
                upVector = v3(0, -1, 0);
                break;
            case ColorDice.Yellow:
                upVector = v3(0, 0, 1);
                break;
            case ColorDice.Red:
                upVector = v3(0, 0, -1);
                break;
            case ColorDice.Green:
                upVector = v3(1, 0, 0);
                break;
            case ColorDice.Blue:
                upVector = v3(-1, 0, 0);
                break;

            default:
                console.error("Invalid face number. Should be between 0 and 5.");
                return;
        }

        const upRotate = new Quat();
        Quat.rotationTo(upRotate, Vec3.UP, upVector);

        const extra = new Quat();
        if (diceIndex % 2 > 0) {
            Quat.rotationTo(extra, Vec3.RIGHT, Vec3.FORWARD);
        } else {
            Quat.rotationTo(extra, Vec3.FORWARD, Vec3.RIGHT);
        }

        Quat.multiply(upRotate, extra, upRotate);

        const rotateToOrigin = new Quat();
        Quat.rotationTo(rotateToOrigin, Vec3.UP, cubeUpVector);

        const multiply = new Quat();
        Quat.multiply(multiply, rotateToOrigin, upRotate);

        const rotation = new Quat();

        Quat.slerp(rotation, node.rotation, multiply, percent);
        node.setRotation(rotation);
    }

    enablePhysics(enabled) {
        const rigidBody = this.cube.getComponent(RigidBody);
        rigidBody.enabled = enabled;
    }
}
