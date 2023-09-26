import { _decorator, Component, EditBox, Label, Node, RigidBody, sys, v3, Vec3 } from "cc";
import { ColorGame } from "../scripts/color-game";
import { ColorGameBox } from "../scripts/color-game-box";
import Dice from "../scripts/dice";
const { ccclass, property } = _decorator;

@ccclass("CreateAnimation")
export class CreateAnimation extends Component {
    @property(Node)
    diceContainer: Node = null;

    @property(EditBox)
    editBox: EditBox = null;

    @property(ColorGameBox)
    colorBox: ColorGameBox = null;

    @property(ColorGame)
    colorGame: ColorGame = null;

    @property(Label)
    animationIndexLabel: Label = null;

    dices: Dice[] = [];

    protected animationIndex = 0;
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

    get demoResults() {
        return this.editBox.string.split(",").map((a) => +a);
    }

    onDemoOpen() {
        const results = this.demoResults;
        this.colorGame.showResult(results, this.animationIndex);
    }

    onDemoClose() {
        const results = this.demoResults;
        this.colorGame.resetColorBox(results);
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
        this.scheduleOnce(this.applyForce, 0.3);
        await this.colorBox.open();
    }

    applyForce() {
        const rigidBodies = this.dices.map((dice) => dice.cube.getComponent(RigidBody));

        const applyForce = () =>
            rigidBodies.forEach((body) => {
                // body.applyLocalForce(Vec3.random(new Vec3(), 3), Vec3.UP);
                body.applyLocalForce(v3(0, 2, 0), Vec3.random(new Vec3(), 1));
            });

        applyForce();
    }

    onClickNextAnimation() {
        this.animationIndex++;
        this.updateAnimationIndex();
    }

    onClickPrevAnimation() {
        this.animationIndex--;
        this.updateAnimationIndex();
    }

    updateAnimationIndex() {
        if (this.animationIndex >= this.colorGame.openAnimationCount) {
            this.animationIndex = this.colorGame.openAnimationCount - 1;
        }
        if (this.animationIndex <= 0) {
            this.animationIndex = 0;
        }

        this.animationIndexLabel.string = `Animation Id: ${this.animationIndex}`;
    }
}
