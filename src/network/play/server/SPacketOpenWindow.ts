import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _NetHandlerPlayClient } from "../../../client/network/NetHandlerPlayClient";
import { _PacketRegistry } from "../../registry/PacketRegistry";
import { _ItemStack } from "../../../client/inventory/ItemStack";

export class _SPacketOpenWindow extends _Packet<_NetHandlerPlayClient> {
    public _windowId: number | undefined;
    public _windowType: string | undefined;
    public _windowTitle: string | undefined;
    public _numSlots: number | undefined;
    public _entityId: number | undefined;

    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._windowId = buf._readUint8();
        this._windowType = buf._readString();
        this._windowTitle = buf._readString();
        this._numSlots = buf._readUint8();
        this._entityId = buf._readInt32();
    }

    public _processPacket(handler: _NetHandlerPlayClient): void {
        handler._handleOpenWindow(this);
    }
}
