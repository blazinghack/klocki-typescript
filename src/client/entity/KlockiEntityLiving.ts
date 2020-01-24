import { _Klocki } from "../Klocki";
import { _Placeholders } from "../Placeholders";

import { _KlockiEntityBase } from "./KlockiEntityBase";
import { _FlowingFluidBlock, _AirBlock } from "../../block/Blocks";


function wrapAngle(x: number): number {
    // x -= Math.PI;
    x = x % (Math.PI * 2);
    // x += Math.PI;

    if (x >= Math.PI) {
        x -= Math.PI * 2;
    }
    if (x < -Math.PI) {
        x += Math.PI * 2;
    }

    return x;
}
export class _KlockiEntityLiving extends _KlockiEntityBase {
    public _movementForward: number;
    public _movementStrafe: number;
    public _isFlying: boolean;
    public _jumping: boolean = false;
    public _onGround: boolean = false;
    public _isColidedHorizontally: boolean = false;
    public _newPosX: number;
    public _newPosY: number;
    public _newPosZ: number;
    public _newRotationYaw: number;
    public _newRotationPitch: number;
    public _newPosIterations: number;
    public _limbSwingAmount: number;
    public _prevLimbSwingAmount: number;
    public _limbSwing: number;
    public _doGravity: boolean;
    _distanceWalkedXZ: number;
    _distanceWalkedOnStepXYZ: number;
    _nextStepDistance: number;

    constructor(klocki: _Klocki) {
        super(klocki);
        this._movementForward = 0;
        this._movementStrafe = 0;
        this._isFlying = false;
        this._newPosX = 0;
        this._newPosY = 0;
        this._newPosZ = 0;
        this._newRotationYaw = 0;
        this._newRotationPitch = 0;
        this._newPosIterations = 0;
        this._limbSwingAmount = 0;
        this._prevLimbSwingAmount = 0;
        this._limbSwing = 0;
        this._doGravity = false;
        this._distanceWalkedXZ = 0;
        this._distanceWalkedOnStepXYZ = 0;
        this._nextStepDistance = 0;

    }
    public _tick() {
        super._tick();
        this._tickLiving();
    }

    public _tickLiving() {
        if (this._newPosIterations > 0) {
            // console.log("newpos iter")
            const nextX = this._posX + (this._newPosX - this._posX) / this._newPosIterations;
            const nextY = this._posY + (this._newPosY - this._posY) / this._newPosIterations;
            const nextZ = this._posZ + (this._newPosZ - this._posZ) / this._newPosIterations;
            const deltaYaw = wrapAngle(this._newRotationYaw - this._yaw);
            const nextYaw = this._yaw + deltaYaw / this._newPosIterations;
            const nextPitch = this._pitch + (this._newRotationPitch - this._pitch) / this._newPosIterations;
            this._setPos(nextX, nextY, nextZ);
            this._setYaw(nextYaw);
            this._setPitch(nextPitch);
        }
        if(this._doGravity){
            this._moveEntityWithHeading();
        }
    }
    public _isSneaking(): boolean {
        return <boolean> this._metadata[1];
    }
    public _setSneaking(v: boolean) {
        return this._metadata[1] = v;
    }
    public _setNewLocation(x: number, y: number, z: number, yaw: number, pitch: number, iterations: number, isTeleport: boolean) {
        this._newPosX = x;
        this._newPosY = y;
        this._newPosZ = z;
        this._newRotationYaw = yaw;
        this._newRotationPitch = pitch;
        if (iterations >= 0) {
            this._newPosIterations = iterations;
        }
    }
    public _getFlyFactor(x: number, y: number, z: number, onground: boolean, sprinting: boolean) {// (flyfactor, slipperiness) {
        const blocktypefloor = this._world._getBlockType(x, y, z);

        let slipperiness = 0.91;
        if (onground) {
            if (blocktypefloor == 79 || blocktypefloor == 174) {
                slipperiness = 0.98;
            } else {
                slipperiness = 0.6;
            }
            slipperiness *= 0.91;
        }
        const wat = 0.16277 / (slipperiness * slipperiness * slipperiness);
        let flyfactor = 0.02;
        if (onground) {
            flyfactor = 0.1 * wat;
            if (sprinting) {
                flyfactor *= 1.3;
            }
        }

        return [flyfactor, slipperiness];
    }
    public _jump() {
        this._motionY = 0.42;
        if(this._getSprinting()){
            let radYaw = this._yaw
            this._motionX -= Math.sin(radYaw) * 0.2
            this._motionZ += Math.cos(radYaw) * 0.2
        }
    }
    public _moveEntityWithHeading() {
        const blocktypein = this._world._getBlockType(Math.floor(this._posX), Math.floor(this._posY), Math.floor(this._posZ));
        const globalPallette = this._klocki._blockRegistry._globalPalette;
        const block = globalPallette[blocktypein];
        const h = this._klocki._blockRegistry._helper;

        let moveFactor = 1;
        const flySpeed = 0.05;

        if (this._isFlying) {
            this._motionY *= 0.6;
            moveFactor *= 4;
            if (this._isSneaking()) {
                this._motionY -= flySpeed * 3;
            }
            if (this._jumping) {
                this._motionY += flySpeed * 3;
            }
        }

        if (this._jumping) {
            this._jumping = false;
            if (!(block == h._WATER! || block == h._LAVA!)) {
                if (this._onGround) {
                    this._jump();
                    // this.jumpTicks = 10
                }
            } else {
                this._motionY += 0.04;
            }
        } else {
            // this.jumpTicks = 0
        }
        /*
        if(this.Sneaking()){
            this.movementForward *= playerSneakSpeedModifier
            this.movementStrafe *= playerSneakSpeedModifier
            //Client.CameraHeight = playerSneakCameraHeight
        } else {
            //Client.CameraHeight = playerCameraHeight
        }*/

        let lastX = this._posX
        let lastY = this._posY
        let lastZ = this._posZ

        if (true || blocktypein != 0) {
            // if this.ticksLived > 10 { //&& this.ticksLived & 1 == 1 {
            // 	this.SendPositionSoft()
            // }
            
            if (!this._isFlying && (block == h._WATER! || block == h._LAVA!)) {
                // let preY = this.posY
                this.accelerateFlying(this._movementStrafe, this._movementForward, 0.02 * moveFactor);
                const [nextPosX, nextPosY, nextPosZ, nextMotionX, nextMotionY, nextMotionZ, nextIsColidedHorizontally, nextOnGround] =
                    this.moveEntity(this._motionX, this._motionY, this._motionZ, this._onGround, this.getAABB());

                this._posX = <number> nextPosX;
                this._posY = <number> nextPosY;
                this._posZ = <number> nextPosZ;
                this._motionX = <number> nextMotionX;
                this._motionY = <number> nextMotionY;
                this._motionZ = <number> nextMotionZ;
                this._isColidedHorizontally = <boolean> nextIsColidedHorizontally;
                this._onGround = <boolean> nextOnGround;

                if (block == h._WATER!) {
                    this._motionX *= 0.8;
                    this._motionY *= 0.8;
                    this._motionZ *= 0.8;
                    this._motionY -= 0.02;
                } else if (block == h._LAVA!) {
                    this._motionX *= 0.5;
                    this._motionY *= 0.5;
                    this._motionZ *= 0.5;
                    this._motionY -= 0.02;
                }
                if (this._isColidedHorizontally) {
                    // aabb = this.GetAABB()
                    // aabb.Offset(this.MotionX, this.MotionY+0.6-this.PosY+preY, this.MotionZ)
                    /*
                    if this.IsLiquidInAABB(aabb) {
                        this.MotionY = 0.3
                    }
                */
                }
            } else {
                let [flyfactor, slipperiness] = this._getFlyFactor(Math.floor(this._posX), Math.floor(this._posY - 0.05), Math.floor(this._posZ), this._onGround, this._getSprinting());
                if (this._isFlying && this._getSprinting()) {
                    flyfactor *= 4;
                }
                this.accelerateFlying(this._movementStrafe, this._movementForward, flyfactor * moveFactor);

                const [nextPosX, nextPosY, nextPosZ, nextMotionX, nextMotionY, nextMotionZ, nextIsColidedHorizontally, nextOnGround] =
                    this.moveEntity(this._motionX, this._motionY, this._motionZ, this._onGround, this.getAABB());

                this._posX = <number> nextPosX;
                this._posY = <number> nextPosY;
                this._posZ = <number> nextPosZ;
                this._motionX = <number> nextMotionX;
                this._motionY = <number> nextMotionY;
                this._motionZ = <number> nextMotionZ;
                this._isColidedHorizontally = <boolean> nextIsColidedHorizontally;
                this._onGround = <boolean> nextOnGround;

                // this.sess.Logf("x%.2f y%.2f z%.2f | mx%.2f my%.2f mz%.2f | ff%.2f ss%.2f %v", this.X, this.Y, this.Z, this.MotionX, this.MotionY, this.MotionZ, flyfactor, slipperiness, this.onground)

                if (!this._isFlying) {
                    this._motionY -= 0.08;
                }

                this._motionY *= 0.98;
                this._motionX *= slipperiness;
                this._motionZ *= slipperiness;
                // console.log(this.motionX, this.motionY, this.motionZ, slipperiness)
            }

        }
        
        let deltaX = this._posX - lastX
        let deltaY = this._posY - lastY
        let deltaZ = this._posZ - lastZ
        this._distanceWalkedXZ += Math.sqrt(deltaX*deltaX+deltaZ*deltaZ) * 0.6
        this._distanceWalkedOnStepXYZ += Math.sqrt(deltaX*deltaX+deltaY*deltaY+deltaZ*deltaZ) * 0.6
    
        //blocktypeground := chunkMap.Block(int(math.Floor(this.PosX)), int(math.Floor(this.PosY-0.2)), int(math.Floor(this.PosZ)))
        const blockTypeGround = this._world._getBlockType(Math.floor(this._posX), Math.floor(this._posY-0.2), Math.floor(this._posZ));
        const blockGround = globalPallette[blockTypeGround];

        if(this._distanceWalkedOnStepXYZ > this._nextStepDistance && !(blockGround instanceof _AirBlock)){
            this._nextStepDistance = Math.floor(this._distanceWalkedOnStepXYZ) + 1
    
            if(blockGround instanceof _FlowingFluidBlock) {
                let vol = Math.sqrt(this._motionX*this._motionX*0.2+this._motionY*this._motionY+this._motionZ*this._motionZ*0.2) * 0.35
    
                if(vol > 1.0){
                    vol = 1.0
                }
                /*
                PlaySoundAt("game.player.swim", vol, 1.0+(rand.Float64()-rand.Float64())*0.4, mgl32.Vec3{
                    float32(this.PosX),
                    float32(this.PosY),
                    float32(this.PosZ),
                })
                */
                
                const soundKey = "entity.player.swim";
                const pitch = 1.0+(Math.random()-Math.random())*0.4;
                this._klocki._audioManager._playSoundKeyAt(soundKey, vol, pitch, lastX, lastY, lastZ);
            } else {
                /*name, vol, pitch := blocktypeground.StepSound()
                PlaySoundAt(name, vol, pitch, mgl32.Vec3{
                    float32(this.PosX),
                    float32(this.PosY),
                    float32(this.PosZ),
                })*/

                const soundType = blockGround._prop._soundType;
                const soundKey = soundType._stepSound._key;
                this._klocki._audioManager._playSoundKeyAt(soundKey, 1, 1, lastX, lastY, lastZ);
            }
        }
        
    }

}
