
import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _NetHandlerPlayClient } from "../../../client/network/NetHandlerPlayClient";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _SPacketMultiBlockChange extends _Packet<_NetHandlerPlayClient> {
    public _chunkX: number | undefined;
    public _chunkZ: number | undefined;
    public _records: Int32Array | undefined;
    


    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._chunkX = buf._readInt32();
        this._chunkZ = buf._readInt32();
        const count = buf._readVarInt();
        if(count < 0 || count > 4096*16){
            throw new Error("wrong multi block change count: "+count);
        }
        const records = this._records = new Int32Array(4*count);
        for(let i = 0; i<count; i++){
            const xz = buf._readUint8();
            const y = buf._readUint8();
            const blockID = buf._readVarInt();
            records[i*4+0] = (xz & 0xF0) >> 4;
            records[i*4+1] = y;
            records[i*4+2] = xz & 0xF;
            records[i*4+3] = blockID;
        }

    }

    public _processPacket(handler: _NetHandlerPlayClient): void {
        handler._handleMultiBlockChange(this);
    }

}
