import { _AxisAlignedBB } from "../../util/AxisAlignedBB";
import { _Klocki } from "../Klocki";
import { _WorldClient } from "../world/WorldClient";

export class _KlockiEntityBase {

    public _klocki: _Klocki;
    public _eid: number;
    public _width: number;
    public _height: number;
    public _serverPosX: number;
    public _serverPosY: number;
    public _serverPosZ: number;
    public _posX: number;
    public _posY: number;
    public _posZ: number;
    public _lastTickPosX: number;
    public _lastTickPosY: number;
    public _lastTickPosZ: number;
    public _prevPosX: number;
    public _prevPosY: number;
    public _prevPosZ: number;
    public _motionX: number;
    public _motionY: number;
    public _motionZ: number;
    public _yaw: number;
    public _pitch: number;
    public _lastAccelerationX: number;
    public _lastAccelerationZ: number;
    public _world: _WorldClient;
    public _metadata: any[];
    public _serverYaw: number;
    public _serverPitch: number;
    public _prevYaw: number;
    public _prevPitch: number;
    private _sprinting: boolean; // TODO

    constructor(klocki: _Klocki) {
        this._klocki = klocki;
        const world = klocki._theWorld;
        if (!world) {
            throw new Error("world undefined");
        }
        this._world = world;
        this._eid = 0;

        this._width = 0;
        this._height = 0;

        this._serverPosX = 0;
        this._serverPosY = 0;
        this._serverPosZ = 0;
        this._serverYaw = 0;
        this._serverPitch = 0;

        this._posX = 0;
        this._posY = 0;
        this._posZ = 0;

        this._lastTickPosX = 0;
        this._lastTickPosY = 0;
        this._lastTickPosZ = 0;

        this._prevPosX = 0;
        this._prevPosY = 0;
        this._prevPosZ = 0;

        this._motionX = 0;
        this._motionY = 0;
        this._motionZ = 0;

        this._prevYaw = 0;
        this._prevPitch = 0;
        this._yaw = 0;
        this._pitch = 0;

        this._lastAccelerationX = 0;
        this._lastAccelerationZ = 0;

        this._sprinting = false;
        this._metadata = new Array(32);
    }
    public _tick() {
        this._prevPosX = this._posX;
        this._prevPosY = this._posY;
        this._prevPosZ = this._posZ;
        this._prevYaw = this._yaw;
        this._prevPitch = this._pitch;
    }
    public getAABB() {
        return _AxisAlignedBB._createEntityAABB(this._posX, this._posY, this._posZ, this._width, this._height);
    }

    public _renderX(partial: number) {
        const prev = this._prevPosX;

        return prev + (this._posX - prev) * partial;
    }
    public _renderY(partial: number) {
        const prev = this._prevPosY;

        return prev + (this._posY - prev) * partial;
    }
    public _renderZ(partial: number) {
        const prev = this._prevPosZ;

        return prev + (this._posZ - prev) * partial;
    }

    public _renderYaw(partial: number) {
        const prev = this._prevYaw;
        let current = this._yaw;
        if (prev > Math.PI / 2 && current < -Math.PI / 2) {
            current += Math.PI * 2;
        }
        if (prev < -Math.PI / 2 && current > Math.PI / 2) {
            current -= Math.PI * 2;
        }

        return prev + (current - prev) * partial;
    }
    public _renderPitch(partial: number) {
        const prev = this._prevPitch;

        return prev + (this._pitch - prev) * partial;
    }
    public _fixPitch() {
        /*if (this._pitch > 90) {
            this._pitch = 90;
        }
        if (this._pitch < -90) {
            this._pitch = -90;
        }*/
        if (this._pitch > Math.PI / 2) {
            this._pitch = Math.PI / 2;
        }
        if (this._pitch < -Math.PI / 2) {
            this._pitch = -Math.PI / 2;
        }
        if (this._yaw > Math.PI) {
            this._yaw -= 2 * Math.PI;
        }
        if (this._yaw < -Math.PI) {
            this._yaw += 2 * Math.PI;
        }
    }
    public _setPos(x: number, y: number, z: number) {
        this._posX = x;
        this._posY = y;
        this._posZ = z;
    }
    public _setYaw(yaw: number) {
        this._yaw = yaw;
    }
    public _setPitch(pitch: number) {
        this._pitch = pitch;
    }
    public _onDestroy() {
        
    }

    public _setNewLocation(x: number, y: number, z: number, yaw: number, pitch: number, iterations: number, isTeleport: boolean) {
        this._posX = x;
        this._posY = y;
        this._posZ = z;

        this._prevPosX = x;
        this._prevPosY = y;
        this._prevPosZ = z;
    }
    public calcAccelerationFlying(strafe: number, forward: number, moveFactor: number, yaw: number) {
        let v = strafe * strafe + forward * forward;
        if (v >= 0.0001) {
            v = Math.sqrt(v);

            if (v < 1) {
                v = 1;
            }

            v = moveFactor / v;
            strafe *= v;
            forward *= v;
            // const sin = Math.sin(yaw * (Math.PI / 180));
            // const cos = Math.cos(yaw * (Math.PI / 180));
            const sin = Math.sin(yaw);
            const cos = Math.cos(yaw);
            this._lastAccelerationX = strafe * cos - forward * sin;
            this._lastAccelerationZ = forward * cos + strafe * sin;
        } else {
            this._lastAccelerationX = 0;
            this._lastAccelerationZ = 0;
        }
    }
    public accelerateFlying(strafe: number, forward: number, moveFactor: number) {
        this.calcAccelerationFlying(strafe, forward, moveFactor, this._yaw);
        this._motionX += this._lastAccelerationX;
        this._motionZ += this._lastAccelerationZ;
    }
    public _viewVector(): number[] {
        // const sinyaw = Math.sin(this._yaw * (Math.PI / 180));
        // const cosyaw = Math.cos(this._yaw * (Math.PI / 180));
        // const cospitch = Math.cos(this._pitch * (Math.PI / 180));
        // const sinpitch = Math.cos(this._pitch * (Math.PI / 180));
        const sinyaw = Math.sin(this._yaw);
        const cosyaw = Math.cos(this._yaw);
        const cospitch = Math.cos(this._pitch);
        const sinpitch = Math.cos(this._pitch);
        let x = -sinyaw;
        let z = cosyaw;
        x *= cospitch;
        z *= cospitch;

        return [x, sinpitch, z];
    }

    public moveEntity(deltaX: number, deltaY: number, deltaZ: number, inputOnGround: boolean, inputaabb: _AxisAlignedBB) {// (X, Y, Z, predeltaX, predeltaY, predeltaZ float64, IsColidedHorizontally, OnGround bool) {
        let predeltaX = deltaX;
        let predeltaY = deltaY;
        let predeltaZ = deltaZ;

        const cpaabb = inputaabb;
        let onGround = inputOnGround;
        let isColidedHorizontally = false;

        // fmt.Printf("aabb: %s\n", cpaabb)
        const theWorld = this._world;
        const colidedList = theWorld._getBlockAABBsInAABB(cpaabb._addCoord(deltaX, deltaY, deltaZ));
        const colidedLen = colidedList.length;

        for (let i = 0; i < colidedLen; i++) {
            const colided = colidedList[i];
            const pre = deltaY;
            deltaY = colided._calculateYOffset(cpaabb, deltaY);
            if (deltaY != pre) {
                // fmt.Printf("colided %s\n", colided)
            }
        }
        cpaabb._offset(0, deltaY, 0);

        for (let i = 0; i < colidedLen; i++) {
            const colided = colidedList[i];
            // fmt.Printf("colided %s\n", colided)
            deltaX = colided._calculateXOffset(cpaabb, deltaX);
        }
        cpaabb._offset(deltaX, 0, 0);

        for (let i = 0; i < colidedLen; i++) {
            const colided = colidedList[i];
            // fmt.Printf("colided %s\n", colided)
            deltaZ = colided._calculateZOffset(cpaabb, deltaZ);
        }
        cpaabb._offset(0, 0, deltaZ);


        const x = (cpaabb._minX() + cpaabb._maxX()) * 0.5;
        const y = cpaabb._minY();
        const z = (cpaabb._minZ() + cpaabb._maxZ()) * 0.5;

        onGround = false;
        isColidedHorizontally = false;
        if (predeltaX != deltaX) {
            predeltaX = 0;
            isColidedHorizontally = true;
            // this.nextTickSprinting = false
        }
        if (predeltaY != deltaY) {
            predeltaY = 0;
            if (deltaY < 0.00001) {
                onGround = true;
            }
        }
        if (predeltaZ != deltaZ) {
            predeltaZ = 0;
            isColidedHorizontally = true;
            // this.nextTickSprinting = false
        }

        // ladder here


        return [x, y, z, predeltaX, predeltaY, predeltaZ, isColidedHorizontally, onGround];
    }
    public _distanceSquaredTo(x: number, y: number, z: number): number {
        const dx = this._posX - x;
        const dy = this._posY - y;
        const dz = this._posZ - z;

        return dx * dx + dy * dy + dz * dz;
    }
    public _render() {

    }
    public _setSprinting(sprinting: boolean) {
        this._sprinting = sprinting;
    }
    public _getSprinting() {
        return this._sprinting;
    }
}
