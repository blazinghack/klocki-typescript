import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _NetHandlerPlayClient } from "../../../client/network/NetHandlerPlayClient";
import { _PacketRegistry } from "../../registry/PacketRegistry";
import { _ItemStack } from "../../../client/inventory/ItemStack";

export class _SPacketWindowItems extends _Packet<_NetHandlerPlayClient> {
    public _windowId: number | undefined;
    public _count: number | undefined;
    public _slots: _ItemStack[] | undefined;

    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._windowId = buf._readUint8();
        this._count = buf._readUint16();
        const slots = new Array(this._count);
        for (let i = 0; i < this._count; i++) {
            slots[i] = _ItemStack._read(buf, reg._protocol);
        }
        this._slots = slots;
    }

    public _processPacket(handler: _NetHandlerPlayClient): void {
        handler._handleWindowItems(this);
    }
}
