import { _Packet } from "../../Packet";
import { _NetHandlerLoginClient } from "../../../client/network/NetHandlerLoginClient";
import { _PacketBuffer } from "../../PacketBuffer";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _SPacketDisconnect extends _Packet<_NetHandlerLoginClient> {
    public _reason: string | undefined;
    public _writePacketData(buf: _PacketBuffer, reg: import("../../registry/PacketRegistry")._PacketRegistry): void {
        throw new Error("Method not implemented.");
    }

    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._reason = buf._readString();
    }

    public _processPacket(handler: _NetHandlerLoginClient): void {
        handler._handleDisconnect(this);
    }
}
