import { Component, JsonAsset, Node, Vec3, _decorator, tween } from "cc";
import { ColorGameBox } from "./color-game-box";
import Dice from "./dice";
const { ccclass, property } = _decorator;

interface Record {
    rotation: { 0: []; 1: []; 2: [] };
    faceUp: { 0: Vec3; 1: Vec3; 2: Vec3 };
}

@ccclass("ColorGame")
export class ColorGame extends Component {
    @property(ColorGameBox)
    box: ColorGameBox = null;

    @property(Node)
    diceContainer: Node = null;

    @property(JsonAsset)
    animationJson: JsonAsset = null;

    @property
    stepToRotate = 20;

    dices: Dice[] = [];

    protected openRecords: Record[] = [];
    protected closeRecord: Record;

    get openAnimationCount() {
        return this.openRecords.length;
    }

    onLoad() {
        this.dices = this.diceContainer.getComponentsInChildren(Dice);
        this.loadAnimation();
    }

    loadAnimation() {
        if (this.animationJson) {
            this.openRecords = this.animationJson.json.open;
            this.closeRecord = this.animationJson.json.close;
        }
    }

    pushNewRecordForOpen(records: Record[]) {
        this.openRecords.push(...records);
    }

    changeCloseRecord(records: Record) {
        this.closeRecord = records;
    }

    async resetColorBox() {
        await this.box.close();
        const animationInfo = this.closeRecord;
        const results = [1, 1, 1];
        this.setResultDices(results, animationInfo.faceUp, 1);
        this.playDicesAnimation(animationInfo.rotation, null);
    }

    showResult(results: number[], animationIndex: number) {
        if (this.openRecords.length === 0) {
            return;
        }
        this.box.open();
        const animationInfo = this.getOpenAnimation(animationIndex);

        this.playDicesAnimation(animationInfo.rotation, (percent) => {
            this.setResultDices(results, animationInfo.faceUp, percent);
        });
    }

    showResultStatic(results: number[], animationIndex: number) {
        this.box.open(false);
        const animationInfo = this.getOpenAnimation(animationIndex);
        this.setLastPositionForAnimation(animationInfo.rotation);
        this.setResultDices(results, animationInfo.faceUp, 1);
    }

    setLastPositionForAnimation(rotation: any) {
        const step = rotation[0].length - 1;
        this.dices.forEach((dice, index) => {
            const info = rotation[index][step];
            dice.cube.position = info.position;
            dice.cube.eulerAngles = info.eulerAngles;
        });
    }

    playDicesAnimation(rotation: any, changeDice: (percent) => void) {
        const stepCounts = rotation[0].length;
        const stepToRotate = this.stepToRotate;
        let step = 0;
        console.time("playDicesAnimation");
        tween(this.node)
            .call(() => {
                this.dices.forEach((dice, index) => {
                    const info = rotation[index][step];
                    dice.cube.position = info.position;
                    dice.cube.eulerAngles = info.eulerAngles;
                });
                step++;
                if (step <= stepToRotate) {
                    changeDice && changeDice(step / stepToRotate);
                }
            })
            .delay(1.0 / 60)
            .union()
            .repeat(stepCounts)
            .call(() => {
                console.timeEnd("playDicesAnimation");
            })
            .start();
    }

    getOpenAnimation(index) {
        return this.openRecords[index];
    }

    setResultDices(results: Number[], faceUp: any, percent: number) {
        this.dices.forEach((dice, index) => {
            const result = results[index];
            dice.setResult(+result, faceUp[index], percent);
        });
    }
}
