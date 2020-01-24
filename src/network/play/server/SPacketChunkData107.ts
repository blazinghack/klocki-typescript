import { _Packet } from "../../Packet";
import { _PacketBuffer } from "../../PacketBuffer";
import { _NetHandlerPlayClient } from "../../../client/network/NetHandlerPlayClient";
import { _PacketRegistry } from "../../registry/PacketRegistry";
import { _NbtReader, _NbtBase } from "../../../nbt/Nbt";

export class _SPacketChunkData107 extends _Packet<_NetHandlerPlayClient> {
    public _chunkX: number | undefined;
    public _chunkZ: number | undefined;
    public _fullChunk: boolean | undefined;
    public _primaryBitMask: number | undefined;
    public _data: Uint8Array | undefined;
    public _size: number | undefined;
    public _countBlockEntities: number | undefined;
    public _heightmaps: Map<string, _NbtBase> | undefined;
    
    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._chunkX = buf._readInt32();
        this._chunkZ = buf._readInt32();
        this._fullChunk = buf._readBoolean();
        this._primaryBitMask = buf._readVarInt();
        if(reg._protocol >= 480){
            this._heightmaps = _NbtReader._readMainTag(buf);
        }
        this._size = buf._readVarInt();
        //this._data = buf._peekUint8Array(this._size);
        this._data = buf._readUint8Array(this._size);
        this._countBlockEntities = buf._readVarInt();

        buf._setReaderIndex(buf._u8.byteLength);
    }

    public _processPacket(handler: _NetHandlerPlayClient): void {
        handler._handleChunkData107(this);
    }
}
