import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _CPacketPositionAndLook extends _Packet<any> {
    public _x: number;
    public _y: number;
    public _z: number;
    public _yaw: number;
    public _pitch: number;
    public _onground: boolean;

    constructor(x: number, y: number, z: number, yaw: number, pitch: number, onground: boolean) {
        super();
        this._x = x;
        this._y = y;
        this._z = z;
        this._yaw = yaw;
        this._pitch = pitch;
        this._onground = onground;

    }

    public _writePacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        buf._writeVarInt(reg._SERVER_PLAYER_LOOK_AND_POSITION);
        buf._writeFloat64(this._x);
        buf._writeFloat64(this._y);
        buf._writeFloat64(this._z);
        buf._writeFloat32(this._yaw);
        buf._writeFloat32(this._pitch);
        buf._writeBoolean(this._onground);
    }

}
