
import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _NetHandlerPlayClient } from "../../../client/network/NetHandlerPlayClient";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _SPacketEntityDestroy extends _Packet<_NetHandlerPlayClient> {

    public _eids: number[] | undefined;
    public _count: number | undefined;

    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._count = buf._readVarInt();
        if (this._count > 1024 * 1024 || this._count < 0) {
            throw new Error("can't destroy " + this._count + " entities");
        }
        this._eids = new Array(this._count);
        for (let i = 0; i < this._count; i++) {
            this._eids[i] = buf._readVarInt();
        }

    }

    public _processPacket(handler: _NetHandlerPlayClient): void {
        handler._handleEntityDestroy(this);
    }

}
