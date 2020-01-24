import { vec3 } from "gl-matrix";

import { _Klocki } from "../Klocki";
import { _ShaderWorld } from "../shaders/ShaderWorld";

import { _ChunkSection } from "./ChunkSection";
import { _BakeTask } from "./BakeTask";
import { _SectionWatcher } from "./SectionWatcher";
import { _KlockiEntityLiving } from "../entity/KlockiEntityLiving";

// Don't look here, nothing to see
export class _OriginRenderOcTree {
    public static _usedVideoMemory = 0;
    public static _testPosVec3: vec3 = vec3.create();
    public static _outsideHideRadius: number = -13.86;
    public static _redBuf: Uint8Array = new Uint8Array([255, 100, 100, 255]);
    public static _greenBuf: Uint8Array = new Uint8Array([100, 255, 100, 255]);

    public _drawCount: number;
    public _origin: _OriginRenderOcTree;
    public _offsetarr: Float32Array | null;
    public _joined: boolean;
    public _joinSizes: Uint32Array | null;
    public _fromoriginx: number;
    public _fromoriginy: number;
    public _fromoriginz: number;
    public _sizex: number;
    public _sizey: number;
    public _sizez: number;
    public _glBuffer: any;
    public _children: _OriginRenderOcTree[] | null;
    public _klocki: _Klocki;
    public _section: _SectionWatcher | null;
    public _worldchunkx: number;
    public _worldchunky: number;
    public _worldchunkz: number;
    public _parent: _OriginRenderOcTree | null;
    public _aliveChunks: number;
    public _dirty: boolean;
    public _baking: boolean;
    public _bakeTask: _BakeTask | null;

    constructor(klocki: _Klocki, origin: _OriginRenderOcTree | null, parent: _OriginRenderOcTree | null, ox: number, oy: number, oz: number, sx: number, sy: number, sz: number) {
        this._klocki = klocki;
        if (origin == null) {
            origin = this;
            this._offsetarr = new Float32Array(4);
            this._offsetarr[0] = 999999.1337;
            this._offsetarr[1] = 999999.1337;
            this._offsetarr[2] = 999999.1337;
        } else {
            this._offsetarr = null;
        }
        this._bakeTask = null;
        this._parent = parent;
        this._section = null;
        this._drawCount = 0;
        this._origin = origin;

        this._worldchunkx = 0.1337;
        this._worldchunky = 0.1337;
        this._worldchunkz = 0.1337;

        this._joined = false;
        this._joinSizes = null;
        this._aliveChunks = 0;
        this._dirty = false;
        this._baking = false;

        this._fromoriginx = ox;
        this._fromoriginy = oy;
        this._fromoriginz = oz;

        this._sizex = sx;
        this._sizey = sy;
        this._sizez = sz;

        this._glBuffer = null;

        if (sx == 1 || sy == 1 || sz == 1) {
            this._children = null;

            return;
        }
        const children = this._children = new Array(8);
        const sx2 = sx >> 1;
        const sy2 = sy >> 1;
        const sz2 = sz >> 1;
        children[0] = new _OriginRenderOcTree(klocki, origin, this, ox, oy, oz, sx2, sy2, sz2);
        children[1] = new _OriginRenderOcTree(klocki, origin, this, ox + sx2, oy, oz, sx2, sy2, sz2);
        children[2] = new _OriginRenderOcTree(klocki, origin, this, ox, oy, oz + sz2, sx2, sy2, sz2);
        children[3] = new _OriginRenderOcTree(klocki, origin, this, ox + sx2, oy, oz + sz2, sx2, sy2, sz2);

        children[4] = new _OriginRenderOcTree(klocki, origin, this, ox, oy + sy2, oz, sx2, sy2, sz2);
        children[5] = new _OriginRenderOcTree(klocki, origin, this, ox + sx2, oy + sy2, oz, sx2, sy2, sz2);
        children[6] = new _OriginRenderOcTree(klocki, origin, this, ox, oy + sy2, oz + sz2, sx2, sy2, sz2);
        children[7] = new _OriginRenderOcTree(klocki, origin, this, ox + sx2, oy + sy2, oz + sz2, sx2, sy2, sz2);
    }
    public _getBuffer(): WebGLBuffer {
        let buf = this._glBuffer;
        if (buf === null) {
            buf = this._glBuffer = this._klocki._display._gl.createBuffer();
        }

        return buf;
    }
    public _setPosition(x: number, y: number, z: number): boolean {
        const offsetarr = this._offsetarr!;
        if (offsetarr[0] != x || offsetarr[1] != y || offsetarr[2] != z) {
            // this.drawCount = 0
            offsetarr[0] = x;
            offsetarr[1] = y;
            offsetarr[2] = z;

            this._worldchunkx = x / 16;
            this._worldchunky = y / 16;
            this._worldchunkz = z / 16;

            const children = this._children;
            if (children != null) {
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    child._updatePos();
                }
            }

            return true;
        }

        return false;
    }
    public _updatePos() {
        this._joined = false;
        this._dirty = false;
        this._drawCount = 0;
        this._aliveChunks = 0;
        if (this._sizex == 1) {

            // remove old watcher
            if (this._section != null) {
                this._section._watcher = null;
            }
            const world = this._klocki._theWorld;
            if (world !== null) {
                const wx = this._origin._worldchunkx + this._fromoriginx;
                const wy = this._origin._worldchunky + this._fromoriginy;
                const wz = this._origin._worldchunkz + this._fromoriginz;
                this._section = world._getSectionWatcher(wx, wy, wz);
                this._section._addWatcher(this);
                // console.log("adding watcher", wx, wy, wz)

                if (this._section._section != null) {
                    this._aliveChunks = 1;
                    this._markDirty();
                }
            }

            return;
        }
        const children = this._children;
        if (children != null) {
            for (let i = 0; i < 8; i++) {
                const child = children[i];
                child._updatePos();
            }
        }
    }
    public _calcAliveChunks() {
        let alive = 0;
        const children = this._children;
        if (children != null) {
            for (let i = 0; i < 8; i++) {
                const child = children[i];
                alive += child._aliveChunks;
            }
        }

        return alive;
    }
    public _markDirty() {
        //let unload = false;
        if (this._sizex != 1) {
            this._aliveChunks = this._calcAliveChunks();
            
            const children = this._children;
            if (children != null) {
                let newDirty = false;
                for (let i = 0; i < 8; i++) {
                    const child = children[i];
                    newDirty = newDirty || child._dirty;
                }
                this._dirty = newDirty;
            }
            if (this._joined) {
                this._markDirtyDownSplit();
            }
        } else {
            const w = this._section;
            if (w !== null) {
                const section = w._section;
                if (section !== null) {
                    if (!this._baking) {
                        this._bakeTask = new _BakeTask(this, section);
                        this._klocki._scheduleBaking(this._bakeTask);
                        this._baking = true;
                        
                        this._dirty = true;
                    }
                    this._aliveChunks = 1;
                }else{
                    //if(this._drawCount > 0){
                    //    unload = true;
                        //this._dirty = true;
                    //}
                }
            }

        }
        this._joined = false;
        // console.log("marking dirty", this._sizex, "at", this._fromoriginx, this._fromoriginy, this._fromoriginz);

        const parent = this._parent;
        if (parent != null) {
            parent._markDirty();
        }
        /*
        if(this._sizex == 1 && this._drawCount > 0){
            const w = this._section;
            if(w){
                const section = w._section;
                if(section == null){
                    const stride = this._klocki._worldRendererBaker._stride;
                    _OriginRenderOcTree._usedVideoMemory -= this._drawCount * stride;
                    this._drawCount = 0;
                    this._aliveChunks = 0;
                    //this._baking = false;
                    //const gl = this._klocki._display._gl;
                    this._klocki._scheduleDeleteBuffer(this._glBuffer);
                    this._glBuffer = null;
                    //this._getBuffer();
                    //gl.bindBuffer(gl.ARRAY_BUFFER, this._getBuffer());
                    //gl.bufferData(gl.ARRAY_BUFFER, 0, gl.STATIC_DRAW);

                    if (parent != null) { // second time
                        parent._markDirty();
                    }
                }
            }
        }*/
    }
    public _markDirtyDownSplit() {
        
        if (this._sizex != 1) {
            this._splitBuffers();
            const children = this._children;
            if (this._sizex > 2 && children != null) {
                
                for (let i = 0; i < 8; i++) {
                    children[i]._splitBuffers();
                }
            }
        }
    }

    public _unmarkDirty() {
        if (this._sizex == 1) {
            this._dirty = false;
        }
        this._joined = false;

        const children = this._children;

        if (children != null) {
            let newDirty = false;
            for (let i = 0; i < 8; i++) {
                const child = children[i];
                newDirty = newDirty || child._dirty;
            }
            this._dirty = newDirty;
        }

        const parent = this._parent;
        if (parent != null) {
            parent._unmarkDirty();
        }

    }
    public _notify() {
        this._markDirty();
    }
    public _preRender(shaderWorld: _ShaderWorld) {
        if (this._aliveChunks === 0) {
            return;
        }
        const sizex = this._sizex
        if (sizex == 1) {
            /*
            if(this.renderChunk == null){
                this.renderChunk = new RenderChunk(0, (this.origin.x+16*this.ox), (this.origin.y+16*this.oy), (this.origin.z+16*this.oz), this.origin, this)
            }
            this.renderChunk.renderChunk(mainWr, programInfo)
            */
            // TODO

            if (this._bakeTask != null || this._drawCount > 0) {
                const off = this._origin._offsetarr!;
                const pos = _OriginRenderOcTree._testPosVec3;
                pos[0] = off[0] + this._fromoriginx * 16 + 8;
                pos[1] = off[1] + this._fromoriginy * 16 + 8;
                pos[2] = off[2] + this._fromoriginz * 16 + 8;
                const visible = this._klocki._frustum._testSphereTouches(pos, -13.86);
                if (visible) {
                    // gl.bindVertexArray(this.vao)

                    /*const gl = this._klocki._display._gl;
                    gl.bindBuffer(gl.ARRAY_BUFFER, this._getBuffer());
                    // this._klocki._worldRenderer._first = true;
                    this._klocki._worldRendererBaker._setupPointers(shaderWorld);
                    // gl.uniform4fv(shaderWorld._uniformLocations._offset, off);
                    shaderWorld._updateOffset(off);
                    //gl.drawArrays(gl.TRIANGLES, 0, this._drawCount);
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._klocki._display._indexBuffer);
                    gl.drawElements(gl.TRIANGLES, this._drawCount*(6/4), gl.UNSIGNED_INT, 0);
                    */
                    const toBake = this._bakeTask != null;
                    const toDraw = this._drawCount > 0;
                    if(toBake || toDraw){
                        this._addToLastSectionsByDistanceSquared(pos, toBake, toDraw);
                    }
                    //if(){
                        //this._drawSelf(shaderWorld, off);
                    //}
                }
            }

            return;
        }
        
        const off = this._origin._offsetarr!;
        const pos = _OriginRenderOcTree._testPosVec3;
        pos[0] = off[0] + this._fromoriginx * 16 + 8*sizex;
        pos[1] = off[1] + this._fromoriginy * 16 + 8*sizex;
        pos[2] = off[2] + this._fromoriginz * 16 + 8*sizex;
        const sphereDistance = this._klocki._frustum._testSphereFully(pos);

        let visibility = 0;
        if (sphereDistance > 7 * sizex) {
            // heuristic, it is profitable to draw if sphere is almost entirely in
            visibility = 1; // all
        } else if (sphereDistance < _OriginRenderOcTree._outsideHideRadius * sizex) {
            // fully outside
        } else {
            visibility = 2; // partial visibility
        }
        if (this._joined) {
            if (this._drawCount > 0) {
                if (visibility == 1 || visibility == 2) { // draw all

                    this._addToLastSectionsByDistanceSquared(pos, false, true);
                    
                    //this._drawSelf(shaderWorld, off);
                } else if (visibility == 2) { // draw partial
                    this._splitBuffers();
                    const children = this._children;
                    if (children != null) {
                        for (let i = 0; i < 8; i++) {
                            const child = children[i];
                            child._preRender(shaderWorld);
                        }
                    }
                }
            }
        } else {
            const children = this._children;
            if (children != null) {
                for (let i = 0; i < 8; i++) {
                    const child = children[i];
                    child._preRender(shaderWorld);
                }
            }
            if (visibility == 1) {
                if (!this._dirty && sizex >= 2 && sizex <= 2) {
                    if (this._calcJoinedSize() > 0 && this._klocki._canJoinNextRegion()) {
                        this._joinBuffers();
                    }
                }
            }
        }
    }

    public _addToLastSectionsByDistanceSquared(pos: vec3, bake: boolean, draw: boolean){
            //"use asm";
            const klocki = this._klocki;
            const dx = (klocki._renderX-pos[0])|0;
            const dy = (klocki._renderY-pos[1])|0;
            const dz = (klocki._renderZ-pos[2])|0;
            const distanceSq = (dx*dx+dy*dy+dz*dz)|0;
            const distanceChunk = (distanceSq >> 8)|0;
            const bakeSec = this._klocki._bakeSectionsByDistanceSquared;
            const sec = this._klocki._sectionsByDistanceSquared;
            if(distanceChunk >= 0 && distanceChunk < bakeSec.length){
                const bakeSectionsArr = bakeSec[distanceChunk];
                const sectionsArr = sec[distanceChunk];
                const indexLast = 1+(<number>bakeSectionsArr[0])|0;
                if(!!bake && indexLast < bakeSectionsArr.length){
                    bakeSectionsArr[indexLast] = this;
                    (<number>bakeSectionsArr[0])++;
                }
                
                const index = (++(<number>sectionsArr[0]))|0;
                if(index < sectionsArr.length){
                    sectionsArr[index] = [this, this._drawCount, this._glBuffer];
                }
            }
        
    }

    public _bakeAndUpload(shaderWorld: _ShaderWorld) {
        if (this._sizex == 1) {
            /*if(this.renderChunk == null){
                this.renderChunk = new RenderChunk(0, (this.origin.x+16*this.ox), (this.origin.y+16*this.oy), (this.origin.z+16*this.oz), this.origin, this)
            }
            this.renderChunk.bakeAndUpload(mainWr, programInfo)
            */
            return;
        }
        const children = this._children;
        if (children != null) {
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                child._bakeAndUpload(shaderWorld);
            }
        }
    }
    public _calcJoinedSize() {
        const children = this._children;
        if (children === null) {
            return 0;
        }
        let sumLength = 0;
        for (let i = 0; i < 8; i++) {
            const child = children[i];
            const dc = child._drawCount;
            if (dc > 0) {
                sumLength += dc;

            }
        }

        return sumLength;
    }
    public _joinBuffers() {
        if(this._drawCount > 0){
            this._clearBuffer();
        }
        this._drawCount = 0;

        const children = this._children!;

        const sumLength = this._calcJoinedSize();

        const gl = this._klocki._display._gl;
        if (sumLength > 0) {
            // console.log("sumlen: " + sumLength);
            const stride = this._klocki._worldRendererBaker._stride;
            //
            gl.bindBuffer(gl.ARRAY_BUFFER, this._getBuffer());

            _OriginRenderOcTree._usedVideoMemory += sumLength * stride;
            gl.bufferData(gl.ARRAY_BUFFER, sumLength * stride, gl.STATIC_DRAW);
            // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(), gl.STATIC_DRAW)
            this._joinSizes = new Uint32Array(8);
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const dc = child._drawCount;
                if (dc > 0) {
                    child._joined = false;
                    // gl.bindBuffer(gl.ARRAY_BUFFER, child.renderChunk.glBuffer);
                    // gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
                    const buf = child._getBuffer();

                    //gl.bindBuffer(gl.ARRAY_BUFFER, this._glBuffer);
                    // gl.bufferData(gl.ARRAY_BUFFER, 0, gl.STATIC_DRAW);

                    gl.bindBuffer(gl.COPY_READ_BUFFER, buf);

                    gl.copyBufferSubData(gl.COPY_READ_BUFFER, gl.ARRAY_BUFFER, 0, this._drawCount * stride, dc * stride);
                    
                    this._drawCount += dc;
                    this._joinSizes[i] = dc;
                }
                
            }
            /*
            //debug
            for(let j = 0; j<this._drawCount; j++){
                gl.bufferSubData(gl.ARRAY_BUFFER, j*stride+24, this._sizex == 2 ? _OriginRenderOcTree._greenBuf: _OriginRenderOcTree._redBuf, 0, 4);
            }
            */
            // clear children
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const dc = child._drawCount;
                if (dc > 0) {
                    child._clearBuffer();
                }
            }
            this._joined = true;
        }
        
    }
    public _splitBuffers() {
        const gl = this._klocki._display._gl;

        if (this._joined && this._drawCount > 0) {
            // console.log("sumlen: " + sumLength);
            const stride = this._klocki._worldRendererBaker._stride;
            //
            gl.bindBuffer(gl.COPY_READ_BUFFER, this._getBuffer());

            let joinedBufferPos = 0;
            const children = this._children!;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const dc = this._joinSizes![i];
                if (dc > 0) {
                    let buf = child._glBuffer;
                    if(buf != null){
                        //console.warn("drawcount: "+dc+" but buffer null");
                        this._klocki._scheduleDeleteBuffer(buf);
                        child._glBuffer = null;
                    }
                    buf = child._getBuffer();

                    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
                    gl.bufferData(gl.ARRAY_BUFFER, dc * stride, gl.STATIC_DRAW);
                    gl.copyBufferSubData(gl.COPY_READ_BUFFER, gl.ARRAY_BUFFER, joinedBufferPos * stride, 0, dc * stride);
                    _OriginRenderOcTree._usedVideoMemory += dc * stride;
                    
                    child._drawCount = dc;
                    joinedBufferPos += dc;
                }
            }
            
            this._joined = false;
            _OriginRenderOcTree._usedVideoMemory -= this._drawCount * stride;
            this._drawCount = 0;
            //gl.bufferData(gl.COPY_READ_BUFFER, 0, gl.STATIC_DRAW);
            this._joinSizes = null;
            this._klocki._scheduleDeleteBuffer(this._glBuffer);
            this._glBuffer = null;
            //this._getBuffer();
        }
        
    }

    public _clearBuffer() {
        //const gl = this._klocki._display._gl;
        const stride = this._klocki._worldRendererBaker._stride;
        //gl.bindBuffer(gl.ARRAY_BUFFER, this._glBuffer);
        _OriginRenderOcTree._usedVideoMemory -= this._drawCount * stride;
        this._drawCount = 0;
        //gl.bufferData(gl.ARRAY_BUFFER, 0, gl.STATIC_DRAW);
        this._klocki._scheduleDeleteBuffer(this._glBuffer);
        this._glBuffer = null;
        //this._getBuffer();
        
    }

    public _joinAt(level: number) {
        if (this._sizex == level) {

            this._joinBuffers();

            return;
        }
        const children = this._children!;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            child._joinAt(level);
        }
    }
    public _drawSelf(shaderWorld: _ShaderWorld, off: Float32Array) {
        const gl = this._klocki._display._gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._getBuffer());
        this._klocki._worldRendererBaker._setupPointers(shaderWorld);
        // gl.uniform4fv(shaderWorld._uniformLocations._offset, off);
        shaderWorld._updateOffset(off);
        // gl.drawArrays(gl.TRIANGLES, 0, this._drawCount);
        if (true) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._klocki._display._indexBuffer);
            gl.drawElements(gl.TRIANGLES, this._drawCount * (6 / 4), gl.UNSIGNED_INT, 0);
        } else {
            gl.drawArrays(gl.POINTS, 0, this._drawCount);
        }
    }

}
