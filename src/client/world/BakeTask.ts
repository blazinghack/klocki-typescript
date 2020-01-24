import { _Block } from "../../block/Block";
import { _TextureInfo } from "../txt/TextureInfo";
import { _BlockRegistry } from "../../block/BlockRegistry";
import { _WorldRenderer } from "../renderer/WorldRenderer";

import { _ChunkSection } from "./ChunkSection";
import { _OriginRenderOcTree } from "./OriginRenderOcTree";
import { _Uint32BlockStorage } from "../../world/chunk/storage/Uint32BlockStorage";
import { _Klocki } from "../Klocki";

const faceVertices = [
    { // Up
        indices: [0, 1, 2, 3, 2, 1],
        verts: [
            { X: 0, Y: 1, Z: 0, TOffsetX: 0, TOffsetY: 0 },
            { X: 1, Y: 1, Z: 0, TOffsetX: 1, TOffsetY: 0 },
            { X: 0, Y: 1, Z: 1, TOffsetX: 0, TOffsetY: 1 },
            { X: 1, Y: 1, Z: 1, TOffsetX: 1, TOffsetY: 1 }
        ],
        direction: { X: 0, Y: 1, Z: 0 },
    },
    { // Down
        indices: [0, 1, 2, 3, 2, 1],
        verts: [
            { X: 0, Y: 0, Z: 0, TOffsetX: 0, TOffsetY: 1 },
            { X: 0, Y: 0, Z: 1, TOffsetX: 0, TOffsetY: 0 },
            { X: 1, Y: 0, Z: 0, TOffsetX: 1, TOffsetY: 1 },
            { X: 1, Y: 0, Z: 1, TOffsetX: 1, TOffsetY: 0 },
        ],
        direction: { X: 0, Y: -1, Z: 0 },
    },
    { // North
        indices: [0, 1, 2, 3, 2, 1],
        verts: [
            { X: 0, Y: 0, Z: 0, TOffsetX: 1, TOffsetY: 1 },
            { X: 1, Y: 0, Z: 0, TOffsetX: 0, TOffsetY: 1 },
            { X: 0, Y: 1, Z: 0, TOffsetX: 1, TOffsetY: 0 },
            { X: 1, Y: 1, Z: 0, TOffsetX: 0, TOffsetY: 0 },
        ],
        direction: { X: 0, Y: 0, Z: -1 },
    },
    { // South
        indices: [0, 1, 2, 3, 2, 1],
        verts: [
            { X: 0, Y: 0, Z: 1, TOffsetX: 0, TOffsetY: 1 },
            { X: 0, Y: 1, Z: 1, TOffsetX: 0, TOffsetY: 0 },
            { X: 1, Y: 0, Z: 1, TOffsetX: 1, TOffsetY: 1 },
            { X: 1, Y: 1, Z: 1, TOffsetX: 1, TOffsetY: 0 },
        ],
        direction: { X: 0, Y: 0, Z: 1 },
    },
    { // West
        indices: [0, 1, 2, 3, 2, 1],
        verts: [
            { X: 0, Y: 0, Z: 0, TOffsetX: 0, TOffsetY: 1 },
            { X: 0, Y: 1, Z: 0, TOffsetX: 0, TOffsetY: 0 },
            { X: 0, Y: 0, Z: 1, TOffsetX: 1, TOffsetY: 1 },
            { X: 0, Y: 1, Z: 1, TOffsetX: 1, TOffsetY: 0 },
        ],
        direction: { X: -1, Y: 0, Z: 0 },
    },
    { // East
        indices: [0, 1, 2, 3, 2, 1],
        verts: [
            { X: 1, Y: 0, Z: 0, TOffsetX: 1, TOffsetY: 1 },
            { X: 1, Y: 0, Z: 1, TOffsetX: 0, TOffsetY: 1 },
            { X: 1, Y: 1, Z: 0, TOffsetX: 1, TOffsetY: 0 },
            { X: 1, Y: 1, Z: 1, TOffsetX: 0, TOffsetY: 0 },
        ],
        direction: { X: 1, Y: 0, Z: 0 },
    }
];
export class _BakeTask {
    public static _airSection = new _ChunkSection(0, -1, 0, new _Uint32BlockStorage(-1, false, new Uint32Array(4096)));
    public static _bakeIdCounter: number = 0;
    private static readonly _initUV = [0, 0];
    private static readonly _initXYZ = [0, 0, 0];
    public _renderLeaf: _OriginRenderOcTree;
    public _section: _ChunkSection;
    public _bakeId: number;
    public _sections: (_ChunkSection | null)[];
    public _registry: _BlockRegistry;
    public _stillDirty: boolean;
    _done: boolean;

    constructor(renderLeaf: _OriginRenderOcTree, section: _ChunkSection) {
        this._renderLeaf = renderLeaf;
        this._section = section;
        this._bakeId = _BakeTask._bakeIdCounter++;
        this._sections = new Array<_ChunkSection | null>(4 * 4 * 4);
        this._registry = this._renderLeaf._klocki._blockRegistry;
        this._stillDirty = false;
        this._done = false;
    }
    public _getBlockTypeFast(x: number, y: number, z: number): number {
        const qsx = x >> 4;
        const qsy = y >> 4;
        const qsz = z >> 4;
        const section = this._sections[((1 + qsx) << 4) | ((1 + qsy) << 2) | (1 + qsz)];
        if (section === null) {
            return 1;
        }

        return section._getBlockType(x & 15, y & 15, z & 15);
    }
    public _getBlockTypeFastDir(x: number, y: number, z: number, dir: number): number {
        switch (dir) {
            case 0: return this._getBlockTypeFast(x, y + 1, z);
            case 1: return this._getBlockTypeFast(x, y - 1, z);
            case 2: return this._getBlockTypeFast(x, y, z - 1);
            case 3: return this._getBlockTypeFast(x, y, z + 1);
            case 4: return this._getBlockTypeFast(x - 1, y, z);
            case 5: return this._getBlockTypeFast(x + 1, y, z);
            default: return -1;
        }
    }

    public _bake(wr: _WorldRenderer) {

        this._done = true;
        this._renderLeaf._unmarkDirty();
        wr._reset();

        const sx = this._section._posX;
        const sy = this._section._posY;
        const sz = this._section._posZ;

        const ox = this._renderLeaf._fromoriginx * 16;
        const oy = this._renderLeaf._fromoriginy * 16;
        const oz = this._renderLeaf._fromoriginz * 16;

        const world = this._renderLeaf._klocki._theWorld;
        const registry = this._registry;
        if (!world) {
            // this._renderLeaf._unmarkDirty();
            
            return;
        }
        const section = world._getSection(sx, sy, sz);
        if (!section) {
            this._renderLeaf._baking = false;
            this._renderLeaf._bakeTask = null;
            // this._renderLeaf._unmarkDirty();
            return;
        }


        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                for (let z = 0; z < 3; z++) {
                    let section = world._getSection(sx + x - 1, sy + y - 1, sz + z - 1);
                    if(section == null){
                        if(world._isUglyChunkLoaded(sx + x - 1, sz + z - 1)){
                            section = _BakeTask._airSection
                        }
                    }
                    this._sections[(x << 4) | (y << 2) | z] = section;
                }
            }
        }

        const bs = 16;
        for (let x = 0; x < bs; x++) {
            for (let y = 0; y < bs; y++) {
                for (let z = 0; z < bs; z++) {
                    const stateId = this._getBlockTypeFast(x, y, z);
                    //const blockType = id >> 4;
                    //const blockData = id & 15;
                    if (stateId != 0) {

                        //let blockTypeInstance = registry._blocksByLegacyId[blockType];
                        let block = registry._globalPalette[stateId];
                        if (!block) {
                            block = registry._globalPalette[1];
                        }

                        if (!block._hasModel) {
                            continue;
                        }


                        wr._atlas = 0;

                        this._renderModel(x, y, z, ox + x, oy + y, oz + z, wr, block);
                    }
                }
            }
        }

        const stride = wr._stride;
        const gl = this._renderLeaf._klocki._display._gl;

        _OriginRenderOcTree._usedVideoMemory -= this._renderLeaf._drawCount * stride;
        if(this._renderLeaf._glBuffer != null){
            this._renderLeaf._klocki._scheduleDeleteBuffer(this._renderLeaf._glBuffer);
            this._renderLeaf._glBuffer = null;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this._renderLeaf._getBuffer());
        
        this._renderLeaf._drawCount = wr._upload(this._renderLeaf._klocki._shaderWorld, true);
        
        _OriginRenderOcTree._usedVideoMemory += this._renderLeaf._drawCount * stride;
        // this._renderLeaf._unmarkDirty();

        this._renderLeaf._baking = false;
        this._renderLeaf._bakeTask = null;
        // throw new Error("test")
        if (this._stillDirty) {
            // this._renderLeaf._markDirty();
        }
    }
    public _renderModel(x: number, y: number, z: number, ax: number, ay: number, az: number, wr: _WorldRenderer, block: _Block) {
        const model = block._model;
        // const info = block._textureInfo;
        const reduced = false;
        const numFaces = 6;

        let lastColor = 0xFFFFFFFF;
        let lastUV: number[] = _BakeTask._initUV;
        const registry = this._registry;
        //const globalPalette = registry._globalPalette;
        const globalPaletteOpaque = registry._globalPaletteOpaque;
        let oneFaceDrawn = false;
        let topRendered = false;
        let reducedTexOffsetX = 0;
        let reducedTexOffsetY = 0;
        if (model != null) {
            let texOffsetX = 0, texOffsetY = 0, texScaleX = 0, texScaleY = 0;
            let from: number[] = _BakeTask._initXYZ;
            let delta: number[] = _BakeTask._initXYZ;
            oneFaceDrawn = false;
            for (let i = 0; i < model._elements.length; i++) {
                const element = model._elements[i];
                from = element._from;
                delta = element._delta;

                for (let facei = numFaces - 1; facei >= 0; facei--) {
                    const modelFace = element._faces[facei];
                    if (modelFace) {
                        
                        let texInfo: _TextureInfo | null = modelFace._textureResolved;
                        
                        if (texInfo == null) {
                            const textureName = model._resolveTexture(modelFace._texture);
                            // console.log("loading", textureName);
                            // this._renderLeaf._klocki._guiChat._appendMessage({"text":"loading "+textureName});
                            if (textureName != "") {
                                texInfo = this._renderLeaf._klocki._textureManager._loadCached(`assets/`+_Klocki._forbiddenWord+`/textures/` + textureName + `.png`, true);
                                
                            }
                        }
                        if (texInfo != null) {
                            if (texInfo._promise != null) {
                                // this._stillDirty = true;
                                // console.log("still loading");
                                texInfo._promise.then(() => {
                                    this._renderLeaf._markDirty();
                                    // this._renderLeaf._klocki._guiChat._appendMessage({"text":"callback "+textureName});
                                });
                                
                            }
                            modelFace._textureResolved = texInfo;
                            texOffsetX = texInfo._texOffsetX;
                            texOffsetY = texInfo._texOffsetY;
                            texScaleX = texInfo._texScaleX;
                            texScaleY = texInfo._texScaleY;
                        }

                        if (modelFace._cullfaceIndex !== -1) {
                            // const facecull = faceVertices[modelFace._cullfaceIndex];
                            // const dir = facecull.direction;
                            const neighborBlockId = this._getBlockTypeFastDir(x, y, z, modelFace._cullfaceIndex);
                            if(neighborBlockId >= 0 && neighborBlockId < globalPaletteOpaque.length){
                                //const blockType = neighborBlockId >> 4;
                                // const blockData = neighborBlockId & 15;
                                /*
                                const block = globalPalette[neighborBlockId];
                                if (block != null) {
                                    if (block._opaque) {
                                        continue;
                                    }
                                }else{
                                    continue;
                                }*/
                                const blockOpaque = globalPaletteOpaque[neighborBlockId];
                                if(blockOpaque != 0){
                                    continue;
                                }

                            }
                        }
                        const face = faceVertices[facei];
                        // const dir = face.direction;
                        // const indices = face.indices;
                        // const indicesLen = indices.length;
                        const verts = face.verts;
                        const uv = modelFace._uv;

                        let color = 0xFFFFFFFF;
                        if (facei == 2 || facei == 3) {
                            color = 0xFFCCCCCC;
                        }
                        if (facei == 4 || facei == 5) {
                            color = 0xFFAAAAAA;
                        }
                        if (facei == 1) {
                            color = 0xFF999999;
                        }
                        let tintcolor = 0xFFFFFFFF;
                        if (modelFace._tintindex == 0) {
                            tintcolor = 0xFF10C40A;
                            color = 0xFF000000 | (((color & 0xFF) * (tintcolor & 0xFF)) * (1 / 255)) & 0xFF | (((((color >> 8) & 0xFF) * ((tintcolor >> 8) & 0xFF)) * (1 / 255)) & 0xFF) << 8 | (((((color >> 16) & 0xFF) * ((tintcolor >> 16) & 0xFF)) * (1 / 255)) & 0xFF) << 16;
                        
                        }
                        // for (let i = 0; i < indicesLen; i++) {
                        //    const vert = verts[indices[i]];
                        if (facei != 1) {
                            if (!topRendered) {
                                oneFaceDrawn = true;
                                lastUV = uv;
                                lastColor = color;
                                reducedTexOffsetX = texOffsetX;
                                reducedTexOffsetY = texOffsetY;
                            }
                            if (facei == 0) {
                                topRendered = true;
                            }
                        }
                        if (!reduced) {
                            for (let i = 0; i < 4; i++) {
                                const vert = verts[i];
                                wr._pos(ax + vert.X * delta[0] + from[0], ay + vert.Y * delta[1] + from[1], az + vert.Z * delta[2] + from[2])
                                    ._tex(texOffsetX + (uv[0] + vert.TOffsetX * uv[4]) * texScaleX, texOffsetY + (uv[1] + vert.TOffsetY * uv[5]) * texScaleY)
                                    ._color(color)._endVertex();
                            }
                        }
                        /*
                        let fcx = 0;
                        let fcy = 0;
                        let fcz = 0;
                        for (let i = 0; i < 4; i++) {
                            const vert = verts[i];

                            fcx += vert.X;
                            fcy += vert.Y;
                            fcz += vert.Z;
                        }
                        fcx *= 0.25;
                        fcy *= 0.25;
                        fcz *= 0.25;
                        */
                        
                    }
                }
                
            }
            if (reduced && oneFaceDrawn) {
                wr._pos(ax + 0.5 * delta[0] + from[0], ay + 0.5 * delta[1] + from[1], az + 0.5 * delta[2] + from[2])
                    ._tex(reducedTexOffsetX + (lastUV[0]) * texScaleX, reducedTexOffsetY + (lastUV[1]) * texScaleY)
                    ._color(lastColor)._endVertex();
            }
        }
    }

}
