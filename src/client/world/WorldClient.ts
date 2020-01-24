import { _Klocki } from "../Klocki";
import { _AxisAlignedBB } from "../../util/AxisAlignedBB";
import { _ExtendedBlockStorage } from "../../world/chunk/storage/ExtendedBlockStorage";
import { _Placeholders } from "../Placeholders";
import { _KlockiEntityPlayerSP } from "../entity/KlockiEntityPlayerSP";
import { _KlockiEntityBase } from "../entity/KlockiEntityBase";
import { _NetHandlerPlayClient } from "../network/NetHandlerPlayClient";

import { _ChunkSection } from "./ChunkSection";
import { _SectionWatcher } from "./SectionWatcher";
import { _TraceGen } from "./TraceGen";

export class _WorldClient {

    public _klocki: _Klocki;
    public _sections: Map<any, _SectionWatcher>;
    public _ticksPassed: number;
    public _thePlayer: _KlockiEntityPlayerSP | null = null;
    public _entities: Map<number, _KlockiEntityBase>;
    public _renderEntityFunc: (e: _KlockiEntityBase) => any;
    public _tickEntityFunc: (e: _KlockiEntityBase) => any;
    public _playHandler: _NetHandlerPlayClient;
    _loadedUglyLimitedHeightChunks: Map<number, boolean>;

    constructor(klocki: _Klocki, playHandler: _NetHandlerPlayClient) {
        this._klocki = klocki;
        this._playHandler = playHandler;
        this._sections = new Map();
        this._loadedUglyLimitedHeightChunks = new Map();
        this._ticksPassed = 0;
        this._entities = new Map<number, _KlockiEntityBase>();
        this._renderEntityFunc = (e: _KlockiEntityBase) => this._renderEntity(e);
        this._tickEntityFunc = (e: _KlockiEntityBase) => this._tickEntity(e);

    }
    public static _uglyChunkKey(x: number, z: number): number {
        return (x << 16) ^ z;
    }
    public static _sectionKey(x: number, y: number, z: number) {
        return (x << 20) ^ (y << 10) ^ z; // collisions
        // return x.toString(16)+"|"+y.toString(16)+"|"+z.toString(16) //todo faster mapping
    }

    public _tick() {
        this._ticksPassed++;
        const thePlayer = this._thePlayer;

        this._entities.forEach(this._tickEntityFunc);
        if (thePlayer) {
            // thePlayer._tick();

            this._klocki._renderList._updatePositions(thePlayer._posX, thePlayer._posY, thePlayer._posZ);

            this._playHandler._sendPosition(thePlayer._posX, thePlayer._posY, thePlayer._posZ, thePlayer._yaw, thePlayer._pitch, thePlayer._onGround);
        }
        
    }
    public _getSectionWatcher(x: number, y: number, z: number): _SectionWatcher {
        const key = _WorldClient._sectionKey(x, y, z);

        let w = this._sections.get(key);
        if (w === void 0) {
            w = new _SectionWatcher();
            this._sections.set(key, w);
        }

        return w;
    }

    public _setSection(x: number, y: number, z: number, section: _ChunkSection) {
        const watcher = this._getSectionWatcher(x, y, z);

        watcher._setSection(section);
    }
    public _getSection(x: number, y: number, z: number): _ChunkSection | null {
        const watcher = this._getSectionWatcher(x, y, z);

        return watcher._section;
    }
    public _setUglyChunkLoaded(x: number, z: number){
        this._loadedUglyLimitedHeightChunks.set(_WorldClient._uglyChunkKey(x,z), true)
    }
    public _isUglyChunkLoaded(x: number, z: number): boolean {
        return this._loadedUglyLimitedHeightChunks.get(_WorldClient._uglyChunkKey(x,z)) === true
    }
    public _setUglyChunkUnloaded(x: number, z: number){
        this._loadedUglyLimitedHeightChunks.delete(_WorldClient._uglyChunkKey(x,z))

    }

    public _getBlockType(x: number, y: number, z: number) {
        const section = this._getSection(x >> 4, y >> 4, z >> 4);
        if (!section) {
            return 0;
        }

        return section._getBlockType(x & 15, y & 15, z & 15);
    }
    
    public _getBlockAABBsInAABB(aabb: _AxisAlignedBB): _AxisAlignedBB[] {
        const list: _AxisAlignedBB[] = [];
        const minx = Math.floor(aabb._minX());
        const miny = Math.floor(aabb._minY());
        const minz = Math.floor(aabb._minZ());
        const maxx = Math.floor(aabb._maxX() + 1);
        const maxy = Math.floor(aabb._maxY() + 1);
        const maxz = Math.floor(aabb._maxZ() + 1);

        const aabbs = new Array<_AxisAlignedBB>(16);
        let aabbsIndex = 0;
        const reg = this._klocki._blockRegistry;
        for (let x = minx; x < maxx; x++) {
            for (let y = miny; y < maxy; y++) {
                for (let z = minz; z < maxz; z++) {
                    const id = this._getBlockType(x, y, z);
                    //if (id != -1 && !_Placeholders._isTranslucentBlock(id)) {
                    if (id >= 1) {
                        const block = reg._byStateId(id);
                        if(block && block._opaque){
                            /*aabbs = aabbs[:0]
                            if id == 126 || id == 182 || id == 44 {
                                data := int(serverSide.worldState.GetBlockDataAt(x, y, z))
                                if data&8 > 0 {
                                    aabbs = append(aabbs, slabupperAABB)
                                } else {
                                    aabbs = append(aabbs, slabAABB)
                                }
                            } else if IsStairs(id) {
                                data := int(serverSide.worldState.GetBlockDataAt(x, y, z))
                                if data < len(stairAABBs) {
                                    aabbs = append(aabbs, stairAABBs[data]...)
                                } else {
                                    aabbs = append(aabbs, blockAABB)
                                }
                            } else if id == 85 || id == 139 {
                                aabbs = append(aabbs, fenceAABB)
                            } else if id == 78 {
                                data := int(serverSide.worldState.GetBlockDataAt(x, y, z))
                                if data < 8 {
                                    aabbs = append(aabbs, snowAABB[data])
                                }
                            } else {*/
                            aabbs[aabbsIndex++] = _Placeholders._fullBlockAABB;
                            // }
                            for (let i = 0; i < aabbsIndex; ++i) {
                                const aabb = aabbs[i]._createWithOffset(x, y, z);
                                list.push(aabb);
                            }
                        }
                    }
                }
            }
        }

        return list;
    }
    public _addEntity(entity: _KlockiEntityBase) {
        this._entities.set(entity._eid, entity);
    }
    public _getEntity(eid: number) {
        return this._entities.get(eid);
    }
    public _removeEntity(eid: number) {
        return this._entities.delete(eid);
    }
    public _renderEntities() {
        const wr = this._klocki._worldRendererMobs;
        wr._reset();

        wr._pos(0, 200, 0)._tex(0, 0)._color(0xFFFFFFFF)._endVertex();
        wr._pos(100, 200, 0)._tex(1, 0)._color(0xFFFFFFFF)._endVertex();
        wr._pos(0, 200, 100)._tex(0, 1)._color(0xFFFFFFFF)._endVertex();

        wr._pos(100, 200, 100)._tex(1, 1)._color(0xFFFFFFFF)._endVertex();
        // wr._pos(100, 200, 0)._tex(1, 0)._color(0xFFFFFFFF)._endVertex();
        // wr._pos(0, 200, 100)._tex(0, 1)._color(0xFFFFFFFF)._endVertex();

        wr._atlas = 1;

        wr._pos(0, 210, 0)._tex(0, 0)._color(0xFFFFFFFF)._endVertex();
        wr._pos(100, 210, 0)._tex(1, 0)._color(0xFFFFFFFF)._endVertex();
        wr._pos(0, 210, 100)._tex(0, 1)._color(0xFFFFFFFF)._endVertex();

        wr._pos(100, 210, 100)._tex(1, 1)._color(0xFFFFFFFF)._endVertex();
        // wr._pos(100, 210, 0)._tex(1, 0)._color(0xFFFFFFFF)._endVertex();
        // wr._pos(0, 210, 100)._tex(0, 1)._color(0xFFFFFFFF)._endVertex();

        wr._atlas = 0;
        this._entities.forEach(this._renderEntityFunc);
        
    }
    public _renderEntity(e: _KlockiEntityBase): void {
        const vec = _Klocki._utilVec3;
        vec[0] = e._posX;
        vec[1] = e._posY;
        vec[2] = e._posZ;

        if (this._klocki._frustum._testSphereTouches(vec, -4)) {
            e._render();
        }
        
    }
    public _tickEntity(e: _KlockiEntityBase): void {
        e._tick();
    }

    public _traceAnyBlock(max: number, s: Float64Array, d: Float64Array) {
        return this._traceRay(max, s, d, (x: number, y: number, z: number) => {
            
            const blockType = this._getBlockType(x, y, z);

            return blockType == 0;
        });
    }

    public _traceRay(max: number, s: Float64Array, d: Float64Array, cb: Function): number[] | null {

        const aGen = new _TraceGen(s[0], d[0]);
        const bGen = new _TraceGen(s[1], d[1]);
        const cGen = new _TraceGen(s[2], d[2]);
	       let nextNA = aGen._next();
	       let nextNB = bGen._next();
	       let nextNC = cGen._next();

        let x = Math.floor(s[0]);
        let y = Math.floor(s[1]);
        let z = Math.floor(s[2]);
	       while (1) {
           if (!cb(x, y, z)) {
               return [x, y, z];
           }
           let nextN = 0;
           if (nextNA <= nextNB) {
               if (nextNA <= nextNC) {
                   nextN = nextNA;
                   nextNA = aGen._next();
                   x += Math.sign(d[0]);
               } else {
                   nextN = nextNC;
                   nextNC = cGen._next();
                   z += Math.sign(d[2]);
               }
           } else {
               if (nextNB <= nextNC) {
                   nextN = nextNB;
                   nextNB = bGen._next();
                   y += Math.sign(d[1]);
               } else {
                   nextN = nextNC;
                   nextNC = cGen._next();
                   z += Math.sign(d[2]);
               }
           }
           if (nextN > max) {
               break;
                
           }
       }

	       return null;
    }

}
