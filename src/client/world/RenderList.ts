import { _Klocki } from "../Klocki";
import { _ShaderWorld } from "../shaders/ShaderWorld";
import { _WorldRenderer } from "../renderer/WorldRenderer";

import { _OriginRenderOcTree } from "./OriginRenderOcTree";
import { _ChunkSection } from "./ChunkSection";

export class _RenderList {

    public _countChunksX: number;
    public _countChunksY: number;
    public _countChunksZ: number;
    public _renderRegions: _OriginRenderOcTree[];
    public _klocki: _Klocki;
    public _lastsx: number = 0;
    public _lastsy: number = 0;
    public _lastsz: number = 0;
    public _divisionSize: number;

    constructor(klocki: _Klocki, cx: number, cy: number, cz: number) {
        this._klocki = klocki;
        this._countChunksX = cx;
        this._countChunksY = cy;
        this._countChunksZ = cz;
        this._renderRegions = Array(cx * cy * cz);
        this._divisionSize = 256;
        // let sx = cx >> 1
        // let sz = cz >> 1
        // let n = 0
        for (let x = 0; x < cx; x++) {
            for (let y = 0; y < cy; y++) {
                for (let z = 0; z < cz; z++) {
                    const index = (z * cy + y) * cx + x;
                    // this.renderChunks[index] = new RenderChunk(n++, x * 16 - sx * 16, y * 16, z * 16 - sz * 16)
                    this._renderRegions[index] = new _OriginRenderOcTree(klocki, null, null, 0, 0, 0, 16, 16, 16);
                }
            }
        }

    }
    /*
    *    This just maps array position to the render, block position
    */
    public static _renderPos(start: number, divisionSize: number, countDivisions: number, arrpos: number): number {
        const size = divisionSize * countDivisions;
        const blockArrpos = arrpos * divisionSize;
        let j = blockArrpos - start + Math.trunc(size / 2);

        if (j < 0) {
            j -= size - 1;
        }

        return blockArrpos - Math.trunc(j / size) * size;
    }
    public _bakeAll(wr: _WorldRenderer, shaderWorld: _ShaderWorld) {
        for (let i = 0; i < this._renderRegions.length; i++) {
            const rc = this._renderRegions[i];
            rc._bakeAndUpload(shaderWorld);
        }
    }
    public _renderAll(wr: _WorldRenderer, shaderWorld: _ShaderWorld) {
        for (let i = 0; i < this._renderRegions.length; i++) {
            this._renderRegions[i]._preRender(shaderWorld);
        }

        let secs = this._klocki._sectionsByDistanceSquared;
        const gl = this._klocki._display._gl;
        const indexBuf = this._klocki._display._indexBuffer;
        const baker = this._klocki._worldRendererBaker;
        for(let secsIndex = 0; secsIndex < secs.length; ++secsIndex){
            const sections = secs[secsIndex];
            const count = sections[0];
            for(let i = 1; i<=count; i++){
                const arr = <any[]>sections[i];
                const s = (<_OriginRenderOcTree>arr[0]);
                const drawCount = (<number>arr[1]);
                const glBuf = (<WebGLBuffer>arr[2]);
                //s[0]._drawSelf(shaderWorld, s._origin._offsetarr!)
                

                gl.bindBuffer(gl.ARRAY_BUFFER, glBuf);
                baker._setupPointers(shaderWorld);
                // gl.uniform4fv(shaderWorld._uniformLocations._offset, off);
                shaderWorld._updateOffset(s._origin._offsetarr!);
                // gl.drawArrays(gl.TRIANGLES, 0, this._drawCount);
            
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf);
                gl.drawElements(gl.TRIANGLES, (drawCount * 6) >>> 2, gl.UNSIGNED_INT, 0);
            }
        }


    }
    public _joinAt(level: number) {
        for (let i = 0; i < this._renderRegions.length; i++) {
            this._renderRegions[i]._joinAt(level);
        }
    }

    public _updatePositions(viewEntityX: number, viewEntityY: number, viewEntityZ: number) {
        const csize = this._divisionSize;
        const sx = Math.floor(viewEntityX) - csize / 2;
        // const sy = Math.floor(viewEntityY) - csize / 2;
        const sz = Math.floor(viewEntityZ) - csize / 2;

        this._lastsx = sx;
        this._lastsy = 0;
        this._lastsz = sz;

        for (let x = 0; x < this._countChunksX; ++x) {
            const blockX = _RenderList._renderPos(sx, csize, this._countChunksX, x);

            for (let z = 0; z < this._countChunksZ; ++z) {
                const blockZ = _RenderList._renderPos(sz, csize, this._countChunksZ, z);

                for (let y = 0; y < this._countChunksY; ++y) {
                    const blockY = y * csize;
                    const renderRegion = this._renderRegions[(z * this._countChunksY + y) * this._countChunksX + x];

                    if (renderRegion._setPosition(blockX, blockY, blockZ)) {
                        return;
                    }

                }
            }
        }
    }

}
