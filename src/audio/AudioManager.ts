import { _Klocki } from "../client/Klocki";

export class _Panner {
    public _panner: PannerNode;
    constructor(panner: PannerNode) {
        this._panner = panner;
    }
    public _setPosition(x: number, y: number, z: number) {
        this._panner.setPosition(x, y, z);
    }
}
export class _AudioManager {
    public _audioCtx: AudioContext;
    public _listener: AudioListener;
    _klocki: _Klocki;
    constructor(klocki: _Klocki) {
        this._klocki = klocki
        const AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext;
        const audioCtx = new AudioContext();
        const listener = audioCtx.listener;
        this._audioCtx = audioCtx;
        this._listener = listener;

    }
    public _setListenerPos(x: number, y: number, z: number) {

        this._listener.setPosition(x, y, z);
    }
    public _setListenerOrientation(x: number, y: number, z: number, ux: number, uy: number, uz: number) {

        this._listener.setOrientation(x, y, z, ux, uy, uz);
    }
    public _newPanner(): _Panner {
        const panner = this._audioCtx.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 3;
        panner.maxDistance = 1000;
        panner.rolloffFactor = 1;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;
        
        return new _Panner(panner);
    }
    public _newFastPanner(): _Panner {
        const panner = this._audioCtx.createPanner();
        panner.panningModel = 'equalpower';
        panner.distanceModel = 'inverse';
        panner.refDistance = 3;
        panner.maxDistance = 1000;
        panner.rolloffFactor = 1;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;
        
        return new _Panner(panner);
    }

    public _playSoundKeyAt(soundKey: string, vol: number, pitch: number, x: number, y: number, z: number){
        const soundDesc = this._klocki._soundsJson[soundKey];
        const soundPaths = <string[]>soundDesc.sounds;
        const r = Math.floor(Math.random()*soundPaths.length);
        const soundPath = soundPaths[r];
        const resourceId = _Klocki._forbiddenWord+"/sounds/"+soundPath+".ogg";
        console.log("playing "+resourceId);
        const resourceInfo = this._klocki._assetsJson.objects[resourceId];

        if(resourceInfo){
            const resourceHash = resourceInfo.hash;
            const resourcePath = _Klocki._hashToPath(resourceHash);

            const request = new Request(resourcePath);


            fetch(request).then(function (response) {
                return response.arrayBuffer();
            }).then((buffer)=> {

                const audioCtx = this._klocki._audioManager._audioCtx;
                const source = audioCtx.createBufferSource();
                
                const panner = this._klocki._audioManager._newFastPanner();
                panner._setPosition(x, y, z);

                audioCtx.decodeAudioData(buffer, function (decodedData: AudioBuffer) {
                    source.buffer = decodedData;
                    source.playbackRate.value = pitch;
                    const gainer = audioCtx.createGain();
                    gainer.gain.value = vol*0.2;
                    source.connect(panner._panner).connect(gainer).connect(audioCtx.destination);
                    
                    const startTime = audioCtx.currentTime;
                    source.start(startTime, 0);
                    
                    source.onended = ()=>{
                        source.disconnect(panner._panner);//.disconnect(gainer);
                        panner._panner.disconnect(gainer);
                        gainer.disconnect(audioCtx.destination);
                        
                    }
                    
                });
            });
        }
    }
    
}
