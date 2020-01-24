import { _Klocki } from "../Klocki";
import { _ShaderWorld } from "../shaders/ShaderWorld";
import { _ShaderMobs } from "../shaders/ShaderMobs";


// Hard to read, but maybe runs fast
export class _WorldRenderer {

    public _buf: ArrayBuffer;
    public _u16: Uint16Array;
    public _u32: Uint32Array;
    public _f32: Float32Array;
    public _bufIndex: number;
    public _first: boolean;
    public _atlas: number;
    public _stride: number;
    public _stride2: number;
    public _stride4: number;
    public _count: number = 0;
    public _posX: number = 0;
    public _posY: number = 0;
    public _posZ: number = 0;
    public _klocki: _Klocki;
    public _u8: Uint8Array;
    public _useShort: boolean;
    public _useMatID: boolean;

    constructor(klocki: _Klocki, size: number, useShort: boolean, useMatID: boolean) {
        this._klocki = klocki;
        this._buf = new ArrayBuffer(size);
        this._u8 = new Uint8Array(this._buf);
        this._u16 = new Uint16Array(this._buf);
        this._u32 = new Uint32Array(this._buf);
        this._f32 = new Float32Array(this._buf);
        this._bufIndex = 0;
        this._useShort = useShort;
        this._useMatID = useMatID;
        // this.vao = gl.createVertexArray()
        // gl.bindVertexArray(this.vao)
        // const gl = klocki._display._gl
        // this._glBuffer = gl.createBuffer()
        this._first = true;
        this._atlas = 0;
        this._stride = (this._useShort ? 16 : 28) + (this._useMatID ? 4 : 0);
        this._stride2 = this._stride >> 1;
        this._stride4 = this._stride >> 2;
        this._reset();

    }
    public _reset() {
        this._count = 0;
        this._bufIndex = 0;
        this._posX = 0;
        this._posY = 0;
        this._posZ = 0;
    }

    public _pos(x: number, y: number, z: number) {
        // if (x === void 0 || y === void 0 || z === void 0) {
        //    throw new Error("x y z can't be undefined")
        // }
        if (this._useShort) {
            const b = this._u16;
            const i = this._count * this._stride2;
            b[i + 2] = Math.round(z * 64); //  // 4 5
            b[i + 1] = Math.round(y * 64); // 2 3
            b[i] = Math.round(x * 64); // 0 1
        } else {
            const b = this._f32;
            const i = this._count * this._stride4;
            b[i + 2] = z; // Math.round((z)) // 8 9 10 11
            b[i + 1] = y; // Math.round((y)) // 4 5 6 7
            b[i] = x; // Math.round((x)) // 0 1 2 3
        }
        
        return this;
    }
    public _tex(tx: number, ty: number) {
        /*let b = this.u32
        let i = this.count * 7 + 3
        b[i] = Math.floor(tx * 65536 * 32768) // 12 13 14 15
        b[i + 1] = Math.floor(ty * 65536 * 32768) // 16 17 18 19
        b[i + 2] = this.atlas // 20 21 22 23
        */
        if (this._useShort) {
            const b = this._u16;
            const i = this._count * this._stride2 + 3;

            b[i + 2] = this._atlas; // 10 11
            b[i + 1] = Math.floor(ty * 32768); // 8 9
            b[i] = Math.floor(tx * 32768); // 6 7
        } else {
            const b = this._f32;
            const i = this._count * this._stride4 + 3;

            this._u32[i + 2] = this._atlas; // 20 21 22 23
            b[i + 1] = ty; // 16 17 18 19
            b[i] = tx; // 12 13 14 15
        }
        
        return this;
    }
    public _color(color: number) {
        if (this._useShort) {
            const b = this._u32;
            const i = this._count * this._stride4 + 3;
            // 12 13 14 15
            b[i] = color;
        } else {
            const b = this._u32;
            const i = this._count * this._stride4 + 6;
            // 24 25 26 27
            b[i] = color;
        }

        return this;
    }

    public _mat(matID: number) {
        if (this._useShort) {

        } else {
            const b = this._u32;
            const i = this._count * this._stride4 + 7;

            b[i] = matID; // 28 29 30 31
        }
        
        return this;
    }
    public _matMany(matID: number, num: number) {

        const b = this._u32;
        const stride4 = this._stride4;
        let i = this._count * stride4 + 7;
        let end = i + stride4*num;
        for(; i<end; i += stride4){
            b[i] = matID;
        }
        this._count += num;
    }
    public _endVertex() {
        this._count++;
    }

    public _setupPointersPosition(shaderWorld: _ShaderWorld | _ShaderMobs) {
        const stride = this._stride;
        const gl = this._klocki._display._gl;
        {
            if (this._useShort) {
                const numComponents = 3;
                const type = gl.SHORT;
                const normalize = false;

                const offset = 0;

                gl.vertexAttribPointer(
                    shaderWorld._attribLocations._vertexPosition,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
            } else {
                const numComponents = 3;
                const type = gl.FLOAT;
                const normalize = false;

                const offset = 0;

                gl.vertexAttribPointer(
                    shaderWorld._attribLocations._vertexPosition,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
            }
            if (this._first) { gl.enableVertexAttribArray(shaderWorld._attribLocations._vertexPosition); }
        }
    }
    public _setupPointersTextureCoord(shaderWorld: _ShaderWorld | _ShaderMobs) {
        const stride = this._stride;
        const gl = this._klocki._display._gl;
        {
            if (this._useShort) {
                const numComponents = 2;
                const type = gl.SHORT;
                const normalize = true;
                const offset = 6;

                gl.vertexAttribPointer(
                    shaderWorld._attribLocations._textureCoord,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
            } else {
                const numComponents = 2;
                const type = gl.FLOAT;
                const normalize = false;
                const offset = 12;

                gl.vertexAttribPointer(
                    shaderWorld._attribLocations._textureCoord,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
            }
            if (this._first) { gl.enableVertexAttribArray(shaderWorld._attribLocations._textureCoord); }
        }
    }
    public _setupPointersTextureAtlas(shaderWorld: _ShaderWorld | _ShaderMobs) {
        const stride = this._stride;
        const gl = this._klocki._display._gl;
        {
            
            /*
            gl.vertexAttribPointer(
                programInfo.attribLocations.textureAtlas,
                numComponents,
                type,
                normalize,
                stride,
                offset);
                */
            if (this._useShort) {
                const numComponents = 1;
                const type = gl.SHORT;
                // const normalize = false
                const offset = 10;
                gl.vertexAttribIPointer(
                    shaderWorld._attribLocations._textureAtlas,
                    numComponents,
                    type,
                    stride,
                    offset);
            } else {
                const numComponents = 1;
                const type = gl.INT;
                // const normalize = false
                const offset = 20;
                gl.vertexAttribIPointer(
                    shaderWorld._attribLocations._textureAtlas,
                    numComponents,
                    type,
                    stride,
                    offset);
            }
            if (this._first) { gl.enableVertexAttribArray(shaderWorld._attribLocations._textureAtlas); }
        }
    }
    public _setupPointersColor(shaderWorld: _ShaderWorld | _ShaderMobs) {
        const stride = this._stride;
        const gl = this._klocki._display._gl;
        {
            if (this._useShort) {
                const numComponents = 4;
                const type = gl.UNSIGNED_BYTE;
                const normalize = true;
                const offset = 12;

                gl.vertexAttribPointer(
                    shaderWorld._attribLocations._color,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
            } else {
                const numComponents = 4;
                const type = gl.UNSIGNED_BYTE;
                const normalize = true;
                const offset = 24;
    
                gl.vertexAttribPointer(
                    shaderWorld._attribLocations._color,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
            }
            if (this._first) { gl.enableVertexAttribArray(shaderWorld._attribLocations._color); }
        }
    }
    public _setupPointersMatrixID(shaderWorld: _ShaderMobs) {
        const stride = this._stride;
        const gl = this._klocki._display._gl;
        {
            
            if (this._useMatID) {
                if (this._useShort) {
                    
                } else {
                    const numComponents = 1;
                    const type = gl.INT;
                    const offset = 28;
                    gl.vertexAttribIPointer(
                        shaderWorld._attribLocations._groupMatrixID,
                        numComponents,
                        type,
                        stride,
                        offset);
                }
                if (this._first) { gl.enableVertexAttribArray(shaderWorld._attribLocations._groupMatrixID); }
            }
        }
    }

    public _setupPointers(shaderWorld: _ShaderWorld | _ShaderMobs) {
        // let stride = this._stride
        this._setupPointersPosition(shaderWorld);
        this._setupPointersTextureCoord(shaderWorld);
        this._setupPointersTextureAtlas(shaderWorld);
        this._setupPointersColor(shaderWorld);
        if (shaderWorld instanceof _ShaderMobs) {
            this._setupPointersMatrixID(shaderWorld);
        }
        this._first = false;

    }

    public _upload(shaderWorld: _ShaderWorld | _ShaderMobs, setSize: boolean): number {
        const gl = this._klocki._display._gl;
        if (this._count > 0) {
            //gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(this._buf, 0, this._count * this._stride), gl.DYNAMIC_DRAW);
            const len = this._count * this._stride;
            if(setSize){
                gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(this._buf, 0, len), gl.DYNAMIC_DRAW);
            }else{
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Uint8Array(this._buf, 0, len), 0, len);
            }


            // gl.bufferData(gl.ARRAY_BUFFER, this._buf.slice(0, this._count * this._stride), gl.DYNAMIC_DRAW);
        }

        return this._count;

    }
    public _copyBuf() {
        return this._buf.slice(0, this._count * this._stride);
    }
    public _putPrepared(prepared: Uint8Array) {
        this._u8.set(prepared, this._count * this._stride);
    }

    public _endAndUpload(shaderWorld: _ShaderWorld | _ShaderMobs, glBuffer: WebGLBuffer) {
        this._endAndUploadSetSize(shaderWorld, glBuffer, false);
    }
    public _endAndUploadSetSize(shaderWorld: _ShaderWorld | _ShaderMobs, glBuffer: WebGLBuffer, setSize: boolean) {
        // gl.bindVertexArray(this.vao)
        const gl = this._klocki._display._gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
        const count = this._upload(shaderWorld, setSize);
        this._setupPointers(shaderWorld);

        if (count > 0) {
            if (true) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._klocki._display._indexBuffer);
                gl.drawElements(gl.TRIANGLES, count * (6 / 4), gl.UNSIGNED_INT, 0);
            } else {
                gl.drawArrays(gl.TRIANGLES, 0, count);
            }
        }
    }

}
