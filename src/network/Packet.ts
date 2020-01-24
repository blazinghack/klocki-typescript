import { _INetHandler } from "./INetHandler";
import { _PacketBuffer } from "./PacketBuffer";
import { _PacketRegistry } from "./registry/PacketRegistry";

export class _Packet<_INetHandler> {
    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        throw new Error("Method not implemented.");
    }
    public _writePacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        throw new Error("Method not implemented.");
    }
    public _processPacket(handler: _INetHandler): void {
        throw new Error("Method not implemented.");
    }
}
