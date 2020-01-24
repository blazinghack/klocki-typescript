
import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _NetHandlerPlayClient } from "../../../client/network/NetHandlerPlayClient";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _SPacketEntityRelativeMove extends _Packet<_NetHandlerPlayClient> {

    public _serverx: number | undefined;
    public _servery: number | undefined;
    public _serverz: number | undefined;
    public _flags: number | undefined;
    public _eid: number | undefined;
    public _currentItem: number | undefined;
    public _uuid: Uint8Array | undefined;
    _onGround: boolean | undefined;

    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._eid = buf._readVarInt();
        if(reg._protocol >= 107){
            this._serverx = buf._readInt16() / (128 * 32);
            this._servery = buf._readInt16() / (128 * 32);
            this._serverz = buf._readInt16() / (128 * 32);
            this._onGround = buf._readBoolean();
        }else{
            this._serverx = buf._readInt8() / 32;
            this._servery = buf._readInt8() / 32;
            this._serverz = buf._readInt8() / 32;
        }

        buf._setReaderIndex(buf._u8.byteLength);
    }

    public _processPacket(handler: _NetHandlerPlayClient): void {
        handler._handleEntityRelativeMove(this);
    }

}
