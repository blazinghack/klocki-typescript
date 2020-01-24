import { _ExtendedBlockStorage } from "../../world/chunk/storage/ExtendedBlockStorage";
import { _Uint32BlockStorage } from "../../world/chunk/storage/Uint32BlockStorage";

import { _RenderList } from "./RenderList";

export class _ChunkSection {
    
    public _chunkStorage: _Uint32BlockStorage;
    public _posX: number;
    public _posY: number;
    public _posZ: number;
    public _data: Uint32Array;
    public _debugInfo: string | undefined;
    // public _dirty: boolean;

    constructor(x: number, y: number, z: number, chunkStorage: _Uint32BlockStorage) {
        this._chunkStorage = chunkStorage;
        this._posX = x;
        this._posY = y;
        this._posZ = z;
        // this._dirty = true;

        this._data = chunkStorage._data;

    }
    public _getBlockType(x: number, y: number, z: number): number {
        const data = this._data;

        return data[y << 8 | z << 4 | x];
    }
    public _setBlockType(x: number, y: number, z: number, blockID: number) {
        const data = this._data;

        data[y << 8 | z << 4 | x] = blockID;
    }

}
