import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _CPacketClientStatus extends _Packet<any> {
    public _status: number;

    constructor(status: number) {
        super();
        this._status = status;

    }

    public _writePacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        buf._writeVarInt(reg._SERVER_CLIENT_STATUS);
        buf._writeVarInt(this._status);

    }

}
