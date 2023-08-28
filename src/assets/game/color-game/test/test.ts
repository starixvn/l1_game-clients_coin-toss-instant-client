import { _decorator, Component, EditBox, Node, sys, v3 } from "cc";
import { ColorGame } from "../scripts/color-game";
import { ColorGameBox } from "../scripts/color-game-box";
import Dice from "../scripts/dice";
const { ccclass, property } = _decorator;

@ccclass("test")
export class test extends Component {
    @property(Node)
    diceContainer: Node = null;

    @property(EditBox)
    editBox: EditBox = null;

    @property(ColorGameBox)
    colorBox: ColorGameBox = null;

    @property(ColorGame)
    colorGame: ColorGame = null;

    dices: Dice[] = [];

    protected isAnimating = false;
    protected tempRotation = { 0: [], 1: [], 2: [] };

    protected records = [];

    onLoad() {
        this.dices = this.diceContainer.getComponentsInChildren(Dice);
    }

    update(dt: number) {
        this.syncDices();
    }

    syncDices() {
        if (!this.isAnimating) {
            return;
        }

        this.dices.forEach((dice, index) => {
            const { position, eulerAngles } = dice.cube;
            const info = {
                position: v3(position),
                eulerAngles: v3(eulerAngles),
            };

            this.tempRotation[index].push(info);
        });
    }

    onDemoOpen() {
        const results = this.editBox.string.split(",").map((a) => +a);
        this.colorGame.showResult(results, 0);
    }

    onDemoClose() {
        this.colorGame.resetColorBox([1, 1, 1]);
    }

    onNewRecordClick(duration: number) {
        this.tempRotation = { 0: [], 1: [], 2: [] };
        this.isAnimating = true;
        console.time("Record duration ");
        this.unschedule(this.onStopRecord);
        this.scheduleOnce(this.onStopRecord, duration);
    }

    onStopRecord() {
        if (!this.isAnimating) {
            return;
        }
        this.isAnimating = false;
        console.timeEnd("Record duration ");
        this.createNewRecord();
    }

    onPushNewRecordForOpen() {
        this.colorGame.pushNewRecordForOpen(this.records);
    }

    onChangeCloseRecord() {
        this.colorGame.changeCloseRecord(this.records.slice(-1)[0]);
    }

    private createNewRecord() {
        const stepCounts = this.tempRotation[0].length;
        console.log("stop record steps length ", stepCounts);

        const faceUp = { 0: v3(), 1: v3(), 2: v3() };
        const base = {
            up: v3(0, 1, 0),
            right: v3(1, 0, 0),
            forward: v3(0, 0, -1),
        };
        this.dices.forEach((dice, index) => {
            let maxY = 0;
            Object.keys(base).forEach((key) => {
                const y = dice.cube[key].y;
                const absY = Math.abs(y);
                if (maxY < absY) {
                    maxY = absY;

                    if (y > 0) {
                        faceUp[index] = v3(base[key]);
                    } else {
                        faceUp[index] = v3(base[key]).multiplyScalar(-1);
                    }
                }
            });
        });
        this.records.push({
            rotation: this.tempRotation,
            faceUp,
        });
        sys.localStorage.setItem("color-game-animation", JSON.stringify(this.records));
    }

    async onCloseClick() {
        this.dices.forEach((dice, index) => {
            dice.enablePhysics(false);
        });
        await this.colorBox.close();
        this.dices.forEach((dice, index) => {
            dice.cube.position = v3(0, 0, 0);
            dice.cube.eulerAngles = v3(0, 0, 0);
            dice.enablePhysics(true);
        });
        this.onNewRecordClick(0.5);
    }

    async onOpenClick() {
        this.onNewRecordClick(2);
        await this.colorBox.open();
    }
}
