
import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _NetHandlerPlayClient } from "../../../client/network/NetHandlerPlayClient";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _SPacketEntityTeleport extends _Packet<_NetHandlerPlayClient> {

    public _serverx: number | undefined;
    public _servery: number | undefined;
    public _serverz: number | undefined;
    public _yaw: number | undefined;
    public _pitch: number | undefined;
    public _flags: number | undefined;
    public _eid: number | undefined;
    public _currentItem: number | undefined;
    public _uuid: Uint8Array | undefined;

    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._eid = buf._readVarInt();
        if(reg._protocol >= 107){
            this._serverx = buf._readFloat64();
            this._servery = buf._readFloat64();
            this._serverz = buf._readFloat64();
        }else{
            this._serverx = buf._readInt32() / 32;
            this._servery = buf._readInt32() / 32;
            this._serverz = buf._readInt32() / 32;
        }
        this._yaw = buf._readInt8() / 256 * Math.PI * 2;
		this._pitch = buf._readInt8() / 256 * Math.PI * 2;

        buf._setReaderIndex(buf._u8.byteLength);
    }

    public _processPacket(handler: _NetHandlerPlayClient): void {
        handler._handleEntityTeleport(this);
    }

}
