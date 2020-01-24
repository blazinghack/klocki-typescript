import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _NetHandlerPlayClient } from "../../../client/network/NetHandlerPlayClient";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _SPacketKeepAlive extends _Packet<_NetHandlerPlayClient> {
    public _keepAliveID: Uint8Array | number | undefined;

    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        if (reg._protocol >= 107) {
            this._keepAliveID = buf._readUint8Array(8);
        } else {
            this._keepAliveID = buf._readVarInt();
        }
    }

    public _processPacket(handler: _NetHandlerPlayClient): void {
        handler._handleKeepAlive(this);
    }
}
