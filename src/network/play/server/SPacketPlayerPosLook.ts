import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _NetHandlerPlayClient } from "../../../client/network/NetHandlerPlayClient";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _SPacketPlayerPosLook extends _Packet<_NetHandlerPlayClient> {
    public static readonly _X_FLAG = 0x01;
    public static readonly _Y_FLAG = 0x02;
    public static readonly _Z_FLAG = 0x04;
    public static readonly _YAW_ROT_FLAG = 0x08;
    public static readonly _PITCH_ROT_FLAG = 0x10;
    
    public _x: number | undefined;
    public _y: number | undefined;
    public _z: number | undefined;
    public _yaw: number | undefined;
    public _pitch: number | undefined;
    public _flags: number | undefined;
    public _teleportId: number | undefined;

    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._x = buf._readFloat64();
        this._y = buf._readFloat64();
        this._z = buf._readFloat64();
        this._yaw = buf._readFloat32();
        this._pitch = buf._readFloat32();
        this._flags = buf._readUint8();
        if (reg._protocol >= 107) {
            this._teleportId = buf._readVarInt();
        }
    }

    public _processPacket(handler: _NetHandlerPlayClient): void {
        handler._handlePlayerPosLook(this);
    }

    public _isRelative(flag: number): boolean {
        if (this._flags !== undefined) {
            return (this._flags & flag) === flag;
        }

        return false;
    }
}
