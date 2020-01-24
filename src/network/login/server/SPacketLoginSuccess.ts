import { _Packet } from "../../Packet";
import { _NetHandlerLoginClient } from "../../../client/network/NetHandlerLoginClient";
import { _PacketBuffer } from "../../PacketBuffer";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _SPacketLoginSuccess extends _Packet<_NetHandlerLoginClient> {
    public _uuid: string | undefined;
    public _name: string | undefined;

    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._uuid = buf._readString();
        this._name = buf._readString();
    }
    public _processPacket(handler: _NetHandlerLoginClient): void {
        handler._handleLoginSuccess(this);
    }
}
