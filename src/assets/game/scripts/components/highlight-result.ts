import gc from "@sg/game-client-base";
import { Component, Node, _decorator } from "cc";
import { TResult } from "./coin-toss-winning-result";

const { ccclass, property } = _decorator;

@ccclass("HighlightResult")
export class HighlightResult extends Component {
    @property(Node)
    biden: Node = null;

    @property(Node)
    trump: Node = null;

    protected onLoad(): void {
        this.hide();
    }

    setStatusNode(node: Node, status: boolean) {
        node && (node.active = status);
    }

    hide() {
        this.setStatusNode(this.biden, false);
        this.setStatusNode(this.trump, false);
    }

    show(result: gc.GameServiceMessage.TResult) {
        const convertResult = result as TResult;
        if (convertResult?.head) {
            this.setStatusNode(this.biden, true);
        } else {
            this.setStatusNode(this.trump, true);
        }
    }
}
