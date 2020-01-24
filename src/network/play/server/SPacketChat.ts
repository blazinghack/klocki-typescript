import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _NetHandlerPlayClient } from "../../../client/network/NetHandlerPlayClient";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _SPacketChat extends _Packet<_NetHandlerPlayClient> {
    public _chatComponent: string | undefined;
    public _type: number | undefined;

    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._chatComponent = buf._readString();
        this._type = buf._readInt8();
    }

    public _processPacket(handler: _NetHandlerPlayClient): void {
        handler._handleChat(this);
    }
}
