import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _CPacketTeleportConfirm extends _Packet<any> {
    private readonly _teleportID: number;

    constructor(teleportID: number) {
        super();
        this._teleportID = teleportID;
    }

    public _writePacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        buf._writeVarInt(reg._SERVER_TELEPORT_CONFIRM);
        
        buf._writeVarInt(this._teleportID);
        
    }

}
