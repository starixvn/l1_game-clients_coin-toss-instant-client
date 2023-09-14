import gc from "@sg/game-client-base";
import Observer from "observer";
import { _decorator, AudioClip, AudioSource, Component, JsonAsset, Node } from "cc";
import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { TAudioConfigs } from "../../../../extensions/shared-components/assets/game/audios/scripts/component/audio-container";
const { Audios } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass("ColorGameWinningAudio")
export class ColorGameWinningAudio extends ObserverComponent {
    @property(JsonAsset)
    audioConfig: JsonAsset = null;

    @property(AudioSource)
    audioSource: AudioSource = null;

    audioIds = [];
    protected audioConfigs: TAudioConfigs = {};

    private winningSounds = {
        0: "yellow",
        1: "red",
        2: "pink",
        3: "white",
        4: "blue",
        5: "green",
    };

    onLoad() {
        super.onLoad();
        this.loadAudios().catch((error) => log(error));
        this.audioSource.node.on(AudioSource.EventType.STARTED, () => this.updateMusicState(Audios.MusicState.STARTED));
        this.audioSource.node.on(AudioSource.EventType.ENDED, () => this.updateMusicState(Audios.MusicState.ENDED));
        console.log("ColorGameWinningAudio");
    }

    @handle(gc.Audios.AudioHandler, (handle, state: gc.Audios.MusicState) => handle.updateMusicState(state))
    updateMusicState(state: gc.Audios.MusicState) {
        return state;
    }

    @handle(gc.Audios.AudioHandler, (handle, ids: string[]) => handle.setMusicIds(ids))
    registerMusicIds() {
        return this.audioIds;
    }

    async loadAudios() {
        const audioConfigs: TAudioConfigs = {
            ...this.audioConfig?.json,
        };
        this.audioConfigs = audioConfigs;
        const keys = Object.keys(this.audioConfigs);
        for (const key of keys) {
            this.audioIds.push(key);
            console.log("loadAudios", this.audioIds);
        }

        this.registerMusicIds();
        this.audiosLoaded();
    }

    protected playAudioClip(audioClip: AudioClip) {
        this.audioSource.clip = audioClip;
        this.audioSource.play();
    }

    protected stopMusic() {
        this.audioSource.stop();
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.audiosLoaded())
    audiosLoaded() {}
}
