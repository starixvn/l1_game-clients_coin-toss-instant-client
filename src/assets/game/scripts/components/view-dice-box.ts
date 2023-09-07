import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { Rounds } = gc;
const { RoundTimeStore } = Rounds;

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass("ColorGameViewDicesBox")
export class ColorGameViewDicesBox extends ObserverComponent {
    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    @render(RoundTimeStore, (store) => store.isPlacingBet)
    setVisibility(isPlacingBet: boolean) {
        this.node.active = isPlacingBet;
    }

    onClickTop() {
        this.playSoundClick();
        console.log("Click Top Button");
    }

    onClickBottom() {
        this.playSoundClick();
        console.log("Click Bottom Button");
    }

    onClickLeft() {
        this.playSoundClick();
        console.log("Click Left Button");
    }

    onClickRight() {
        this.playSoundClick();
        console.log("Click Right Button");
    }
}
