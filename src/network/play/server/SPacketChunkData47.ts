import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _NetHandlerPlayClient } from "../../../client/network/NetHandlerPlayClient";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _SPacketChunkData47 extends _Packet<_NetHandlerPlayClient> {
    public _chunkX: number | undefined;
    public _chunkZ: number | undefined;
    public _groundUpContinuous: boolean | undefined;
    public _primaryBitMask: number | undefined;
    public _data: Uint8Array | undefined;
    
    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._chunkX = buf._readInt32();
        this._chunkZ = buf._readInt32();
        this._groundUpContinuous = buf._readBoolean();
        this._primaryBitMask = buf._readUint16();
        this._data = buf._readUint8Array(buf._readVarInt());
    }

    public _processPacket(handler: _NetHandlerPlayClient): void {
        handler._handleChunkData47(this);
    }
}
