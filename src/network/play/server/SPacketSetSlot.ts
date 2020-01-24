import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _NetHandlerPlayClient } from "../../../client/network/NetHandlerPlayClient";
import { _PacketRegistry } from "../../registry/PacketRegistry";
import { _ItemStack } from "../../../client/inventory/ItemStack";

export class _SPacketSetSlot extends _Packet<_NetHandlerPlayClient> {
    public _windowId: number | undefined;
    public _slotId: number | undefined;
    public _slot: _ItemStack | null | undefined;

    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._windowId = buf._readUint8();
        this._slotId = buf._readUint16();
        
        this._slot = _ItemStack._read(buf, reg._protocol);
        
    }

    public _processPacket(handler: _NetHandlerPlayClient): void {
        handler._handleSetSlot(this);
    }
}
