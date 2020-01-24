import { isNumber } from "util";

import { _Klocki } from "./Klocki";
import { _KlockiEntityPlayerSP } from "./entity/KlockiEntityPlayerSP";

class _SimpleTouch {
    public _identifier: number;
    public _pageX: number;
    public _pageY: number;
    public _isMovement: boolean;
    public _timeStart: number;
    constructor(id: number, pageX: number, pageY: number) {
        this._identifier = id;
        this._pageX = pageX;
        this._pageY = pageY;
        this._isMovement = false;
        this._timeStart = -1;
    }
}

export class _Controls {
    public _pressed: Map<string, boolean>;
    public _klocki: _Klocki;
    public _mouseLocked: boolean;
    public _mouseMoves: number;
    public _ongoingTouches: _SimpleTouch[];

    public _lastOrientA: number = 1337;
    public _lastOrientB: number = 1337;
    public _lastOrientG: number = 1337;
    public _isMobile: boolean;

    constructor(klocki: _Klocki) {
        this._klocki = klocki;
        this._pressed = new Map<string, boolean>();
        this._mouseLocked = false;
        this._mouseMoves = 0;
        this._ongoingTouches = new Array<_SimpleTouch>();

        let check = false;
        (function(a) {if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) { check = true; }})(navigator.userAgent || navigator.vendor || (<any>window).opera);
        this._isMobile = check;

        document.addEventListener("keydown",(e) => this._keydown(e));
        document.addEventListener("keyup", (e) => this._keyup(e));

        document.addEventListener('pointerlockchange', (e) => this._onLockChange(e), false);
        document.addEventListener('mozpointerlockchange', (e) => this._onLockChange(e), false);
        const canvas = this._klocki._display._canvas;
        canvas.addEventListener("click", () => {
            if (!this._mouseLocked) {
                this._requestLock();
                //this._klocki._display._canvas.requestFullscreen();
            }
        });
        this._addTouchHandlers();
        canvas.addEventListener("mousemove", (e) => {
            
            if (this._mouseLocked) {
                // const locked = this._isLocked();
                const locked = true;
                if (locked) {
                    const klocki = this._klocki;
                    const world = klocki._theWorld;
                    if (world !== null) {
                        const thePlayer = world._thePlayer!;
                        // console.log(e.movementX, e.movementY, e.clientX, e.clientY, locked);
                        if (klocki._smoothCam || klocki._zoomed) {
                            klocki._yawSmoothSpeed += e.movementX / 400;
                            klocki._pitchSmoothSpeed += e.movementY / 400;
                        } else {
                            thePlayer._yaw += e.movementX / 400;
                            thePlayer._pitch += e.movementY / 400;
                        }
                        thePlayer._fixPitch();
                        this._mouseMoves++;
                    }
                }
            }
        }, false);

        canvas.addEventListener("wheel", (e) => {
            const klocki = this._klocki;
            const world = klocki._theWorld;
            if (world !== null) {
                const thePlayer = world._thePlayer!;
                const wheelEvent = <WheelEvent>e;
                let delta = wheelEvent.deltaY;
                if(wheelEvent.deltaMode == 0){
                    delta /= 100;
                }
                thePlayer._scroll(delta);
            }
        }, false);


        window.addEventListener('beforeunload', (e) => {
            if (this._mouseLocked) {
                e.preventDefault();
                e.returnValue = "Do you really want to leave?";
                this._klocki._guiChat._appendMessage({"text":"Press F11 to prevent CTRL+W", "color":"green"});
                return "Do you really want to leave?";
                
            } else {
                return void 0;
            }
        });

    }
    public static _copyTouch(touch: Touch) {
        return new _SimpleTouch(touch.identifier, touch.pageX, touch.pageY);
    }
    public _requestLock() {
        const canvas = this._klocki._display._canvas;
        canvas.requestPointerLock = canvas.requestPointerLock ||
                    (<any>canvas).mozRequestPointerLock;

        canvas.requestPointerLock();
    }
    public _isLocked() {
        return document.pointerLockElement === this._klocki._display._canvas || (<any>document).mozPointerLockElement === this._klocki._display._canvas;
    }
    public _onLockChange(e: Event) {
        if (this._isLocked()) {
            this._mouseLocked = true;
        } else {
            this._mouseLocked = false;
        }
    }
    public _keydown(e: KeyboardEvent) {
        const key = e.key.toLowerCase();

        if(e.ctrlKey && (key == 'w' || key == 's')){
            e.preventDefault();
            e.stopPropagation();
        }

        const was = this._pressed.get(key);
        this._pressed.set(key, true);
        // console.log("pressed", key)
        if (was) {
            return;
        }
        if (key == 'f5') {
            this._klocki._cyclePersonView();
        }
        if (key == 'f8') {
            this._klocki._toggleSmoothCam();
        }
        if (key == 'c') {
            this._klocki._yawSmoothSpeed = 0;
            this._klocki._pitchSmoothSpeed = 0;
        }
        if (key == 'a' && this._pressed.get('f3')) {
            const world = this._klocki._theWorld;
            if (world) {
                world._sections.forEach((v, k) => {
                    v._notify();
                });
            }
        }
    }
    public _keyup(e: KeyboardEvent) {
        const key = e.key.toLowerCase();
        this._pressed.set(key, false);
        // console.log("unpressed", key)

    }
    public isPressed(key: string) {
        return this._pressed.get(key) === true;
    }

    public _handleTouchEnd(evt: TouchEvent) {
        evt.preventDefault();
        const touches = evt.changedTouches;

        let thePlayer: _KlockiEntityPlayerSP | null = null;
        if (this._klocki._theWorld) {
            thePlayer = this._klocki._theWorld._thePlayer;
        }
        for (let i = 0; i < touches.length; i++) {
            const idx = this._ongoingTouchIndexById(touches[i].identifier);

            if (idx >= 0) {
                const touch = this._ongoingTouches[idx];
                const now = (new Date).getTime();
                const diff = now - touch._timeStart;
                if (thePlayer && touch._isMovement) {
                    thePlayer._touchMoveForward = 0;
                    thePlayer._touchMoveStrafe = 0;
                }
                if (thePlayer && diff < 150) {
                    thePlayer._jumping = true;
                }
                this._ongoingTouches.splice(idx, 1);
            } else {
                // console.log("can't figure out which touch to end");
            }
        }
    }
    public _ongoingTouchIndexById(idToFind: number) {
        for (let i = 0; i < this._ongoingTouches.length; i++) {
            const id = this._ongoingTouches[i]._identifier;
            if (id == idToFind) {
                return i;
            }
        }

        return -1;
    }
    public _handleTouchMove(evt: TouchEvent) {
        evt.preventDefault();
        console.log("touch move");
        const touches = evt.changedTouches;

        let thePlayer: _KlockiEntityPlayerSP | null = null;
        if (this._klocki._theWorld) {
            thePlayer = this._klocki._theWorld._thePlayer;
        }
        for (let i = 0; i < touches.length; i++) {
            const idx = this._ongoingTouchIndexById(touches[i].identifier);

            if (idx >= 0) {
                const touch = _Controls._copyTouch(touches[i]);
                const dx = touch._pageX - this._ongoingTouches[idx]._pageX;
                const dy = touch._pageY - this._ongoingTouches[idx]._pageY;

                touch._isMovement = this._ongoingTouches[idx]._isMovement;
                touch._timeStart = this._ongoingTouches[idx]._timeStart;
                if (thePlayer) {
                    if (touch._isMovement) {
                        let rx = touch._pageX / window.innerWidth;
                        let ry = touch._pageY / window.innerHeight;

                        rx -= 0.18;
                        ry -= 0.7;

                        rx *= 20;
                        ry *= 10;

                        thePlayer._touchMoveForward = -ry;
                        thePlayer._touchMoveStrafe = -rx;
                    } else {
                        thePlayer._yaw += dx / 95;
                        thePlayer._pitch += dy / 95;
                        thePlayer._fixPitch();
                    }
                }

                this._ongoingTouches.splice(idx, 1, touch);

            } else {
                // console.log("can't figure out which touch to continue");
            }
        }
    }
    public _handleTouchStart(evt: TouchEvent) {
        evt.preventDefault();
        const touches = evt.changedTouches;
        console.log("touch start");
        //this._klocki._display._canvas.requestFullscreen();

        for (let i = 0; i < touches.length; i++) {
            const touch = _Controls._copyTouch(touches[i]);
            const rx = touch._pageX / window.innerWidth;
            const ry = touch._pageY / window.innerHeight;

            touch._isMovement = rx < 0.3 && ry > 0.5;
            touch._timeStart = (new Date).getTime();

            this._ongoingTouches.push(touch);

        }
    }
    public _handleTouchCancel(evt: TouchEvent) {
        evt.preventDefault();
        const touches = evt.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            const idx = this._ongoingTouchIndexById(touches[i].identifier);
            this._ongoingTouches.splice(idx, 1);
        }
    }
    public _handleOrientation(evt: DeviceOrientationEvent) {
        if (!isNumber(evt.alpha)) {
            return;
        }
        let thePlayer: _KlockiEntityPlayerSP | null = null;
        if (this._klocki._theWorld) {
            thePlayer = this._klocki._theWorld._thePlayer;
        }

        // console.log("orient")
        if (thePlayer) {
            if (evt.absolute) {
                thePlayer._yaw += (evt.alpha / 180) * Math.PI;
                thePlayer._pitch += (evt.gamma! / 180) * Math.PI;
            } else {
                
                if (this._lastOrientA == 1337) {
                    
                } else {
                    let da = evt.alpha - this._lastOrientA;
                    // const db = evt.beta!-this._lastOrientB;
                    let dg = evt.gamma! - this._lastOrientG;

                    if (dg > 90) {
                        dg -= 180;
                    }
                    if (dg < -90) {
                        dg += 180;
                    }
                    if (da > 90 && da < 270) {
                        da -= 180;
                    }
                    if (da < -90 && da > -270) {
                        da += 180;
                    }
                    thePlayer._yaw -= (da / 180) * Math.PI;

                    thePlayer._pitch += (dg / 180) * Math.PI;
                }
                this._lastOrientA = evt.alpha;
                this._lastOrientB = evt.beta!;
                this._lastOrientG = evt.gamma!;
                
            }
        }
    }
    public _addTouchHandlers() {
        console.log("registering touches");
        const canvas = this._klocki._display._canvas;

        canvas.addEventListener("touchstart", (e: TouchEvent) => this._handleTouchStart(e), false);
        canvas.addEventListener("touchend", (e: TouchEvent) => this._handleTouchEnd(e), false);
        canvas.addEventListener("touchcancel", (e: TouchEvent) => this._handleTouchCancel(e), false);
        canvas.addEventListener("touchmove", (e: TouchEvent) => this._handleTouchMove(e), false);

        window.addEventListener("deviceorientation", (e: DeviceOrientationEvent) => this._handleOrientation(e));
    }
}
