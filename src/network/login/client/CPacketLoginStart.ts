import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _CPacketLoginStart extends _Packet<any> {
    private readonly _name: string;

    constructor(name?: string) {
        super();
        this._name = (name !== undefined ? name : "");
    }

    public _writePacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        buf._writeVarInt(0x00);
        buf._writeString(this._name);
    }

}
