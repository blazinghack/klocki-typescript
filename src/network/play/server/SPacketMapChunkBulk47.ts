import { _Packet } from "../../Packet";
import { _NetHandlerPlayClient } from "../../../client/network/NetHandlerPlayClient";
import { _PacketBuffer } from "../../PacketBuffer";
import { _PacketRegistry } from "../../registry/PacketRegistry";

export class _SPacketMapChunkBulk47 extends _Packet<_NetHandlerPlayClient> {
    public _skyLightSent: boolean | undefined;
    public _chunkX: Int32Array | undefined;
    public _chunkZ: Int32Array | undefined;
    public _primaryBitMask: Uint16Array | undefined;
    public _chunkData: Uint8Array[] | undefined;

    private static _calculateSize(bitCount: number, skyLightSent: boolean, hasBiomes: boolean): number {
        const a: number = bitCount * 2 * 16 * 16 * 16;
        const b: number = bitCount * 16 * 16 * 16 / 2;
        const c: number = skyLightSent ? bitCount * 16 * 16 * 16 / 2 : 0;
        const d: number = hasBiomes ? 256 : 0;

        return a + b + c + d;
    }
    private static _bitCount32(n: number): number {
        n = n - ((n >> 1) & 0x55555555);
        n = (n & 0x33333333) + ((n >> 2) & 0x33333333);

        return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
    }
    
    public _readPacketData(buf: _PacketBuffer, reg: _PacketRegistry): void {
        this._skyLightSent = buf._readBoolean();
        const chunkColumnCount: number = buf._readVarInt();

        this._chunkX = new Int32Array(chunkColumnCount);
        this._chunkZ = new Int32Array(chunkColumnCount);
        this._primaryBitMask = new Uint16Array(chunkColumnCount);
        this._chunkData = Array(chunkColumnCount);

        for (let i: number = 0; i < chunkColumnCount; i++) {
            this._chunkX[i] = buf._readInt32();
            this._chunkZ[i] = buf._readInt32();
            this._primaryBitMask[i] = buf._readUint16();
        }
        for (let i: number = 0; i < chunkColumnCount; i++) {
            const bitCount: number = _SPacketMapChunkBulk47._bitCount32(this._primaryBitMask[i]);
            const chunkSize: number = _SPacketMapChunkBulk47._calculateSize(bitCount, this._skyLightSent, true);
            this._chunkData[i] = buf._readUint8Array(chunkSize);
        }
    }

    public _processPacket(handler: _NetHandlerPlayClient): void {
        handler._handleMapChunkBulk47(this);
    }

}
