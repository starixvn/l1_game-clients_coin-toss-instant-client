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

    setResult(face: number, cubeUpVector: Vec3, percent: number) {
        const node = this.render;
        let upVector;
        switch (face) {
            case ColorDice.Pink:
                upVector = v3(0, 1, 0);
                break;
            case ColorDice.White:
                upVector = v3(0, -1, 0);
                break;
            case ColorDice.Green:
                upVector = v3(0, 0, -1);
                break;
            case ColorDice.Blue:
                upVector = v3(0, 0, 1);
                break;
            case ColorDice.Red:
                upVector = v3(-1, 0, 0);
                break;
            case ColorDice.Yellow:
                upVector = v3(1, 0, 0);
                break;
            default:
                console.error("Invalid face number. Should be between 0 and 5.");
                return;
        }

        let internalRotate = new Quat();
        Quat.rotationTo(internalRotate, Vec3.UP, upVector);

        let rotateToOrigin = new Quat();
        Quat.rotationTo(rotateToOrigin, Vec3.UP, cubeUpVector);

        const multiply = new Quat();
        Quat.multiply(multiply, rotateToOrigin, internalRotate);

        const rotation = new Quat();
        const initRotation = new Quat();

        Quat.slerp(rotation, Quat.fromEuler(initRotation, 0, 0, 0), multiply, percent);
        node.setRotation(rotation);
    }

    enablePhysics(enabled) {
        const rigidBody = this.cube.getComponent(RigidBody);
        rigidBody.enabled = enabled;
    }
}
