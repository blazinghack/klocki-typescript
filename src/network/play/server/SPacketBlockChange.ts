
import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _NetHandlerPlayClient } from "../../../client/network/NetHandlerPlayClient";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _SPacketBlockChange extends _Packet<_NetHandlerPlayClient> {
    _position: Int32Array | undefined;
    _blockID: number | undefined;


    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._position = buf._readPosition();
        this._blockID = buf._readVarInt();

    }

    public _processPacket(handler: _NetHandlerPlayClient): void {
        handler._handleBlockChange(this);
    }

}
