import gc from "@sg/game-client-base";
import { Animation, Component, Node, _decorator } from "cc";
import { TResult } from "./coin-toss-winning-result";

const { ccclass, property } = _decorator;

@ccclass("HighlightResult")
export class HighlightResult extends Component {
    @property(Node)
    confetiHeads: Node = null;

    @property(Node)
    confetiTails: Node = null;

    @property(Animation)
    winHeads: Animation = null;

    @property(Animation)
    winTails: Animation = null;

    protected onLoad(): void {
        this.hide();
    }

    setStatusNode(node: Node, status: boolean) {
        node && (node.active = status);
    }

    hide() {
        this.setStatusNode(this.confetiHeads, false);
        this.setStatusNode(this.confetiTails, false);
        this.winHeads.stop();
        this.winTails.stop();
    }

    show(result: gc.GameServiceMessage.TResult) {
        const convertedResult = result as TResult;
        const isHead = convertedResult?.head;
        const animation = isHead ? this.winHeads : this.winTails;
        animation.play();

        this.setStatusNode(this.confetiHeads, isHead);
        this.setStatusNode(this.confetiTails, !isHead);
    }
}
