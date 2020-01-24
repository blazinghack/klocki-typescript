import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _CPacketKeepAlive extends _Packet<any> {
    private readonly _keepAliveID: number | Uint8Array;

    constructor(keepAliveID: number | Uint8Array) {
        super();
        this._keepAliveID = keepAliveID;
    }

    public _writePacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        buf._writeVarInt(reg._SERVER_KEEPALIVE);
        if (reg._protocol >= 107) {
            buf._writeUint8Array(<Uint8Array>this._keepAliveID);
        } else {
            buf._writeVarInt(<number>this._keepAliveID);
        }
    }

}
