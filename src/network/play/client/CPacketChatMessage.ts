import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _CPacketChatMessage extends _Packet<any> {
    private readonly _message: string;

    constructor(message?: string) {
        super();
        this._message = (message !== undefined ? message : "");
        if (this._message.length > 100) {
            this._message = this._message.substring(0, 100);
        }
    }
    
    public _writePacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        buf._writeVarInt(reg._SERVER_CHAT);
        buf._writeString(this._message);
    }

}
