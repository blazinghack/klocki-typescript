import { _Klocki } from "../Klocki";
import { _ShaderWorld } from "../shaders/ShaderWorld";
import { _ShaderMobs } from "../shaders/ShaderMobs";
import { _ShaderLines } from "../shaders/ShaderLines";

export class _LineRenderer {

    public _buf: ArrayBuffer;
    public _u16: Uint16Array;
    public _u32: Uint32Array;
    public _f32: Float32Array;
    public _bufIndex: number;
    public _first: boolean;
    public _atlas: number;
    public _stride: number;
    public _count: number = 0;
    public _posX: number = 0;
    public _posY: number = 0;
    public _posZ: number = 0;
    public _klocki: _Klocki;
    public _u8: Uint8Array;
    public _glBuffer: WebGLBuffer;

    constructor(klocki: _Klocki) {
        this._klocki = klocki;
        this._buf = new ArrayBuffer(1 * 1024 * 1024);
        this._u8 = new Uint8Array(this._buf);
        this._u16 = new Uint16Array(this._buf);
        this._u32 = new Uint32Array(this._buf);
        this._f32 = new Float32Array(this._buf);
        this._bufIndex = 0;

        // this.vao = gl.createVertexArray()
        // gl.bindVertexArray(this.vao)
        // const gl = klocki._display._gl
        this._glBuffer = this._klocki._display._gl.createBuffer()!;
        this._first = true;
        this._atlas = 0;
        this._stride = 16;
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

        const b = this._f32;
        const i = this._count * 4;
        b[i + 2] = z; // Math.round((z)) // 8 9 10 11
        b[i + 1] = y; // Math.round((y)) // 4 5 6 7
        b[i] = x; // Math.round((x)) // 0 1 2 3

        return this;
    }

    public _color(color: number) {

        const b = this._u32;
        const i = this._count * 4 + 3;
        // 12 13 14 15
        b[i] = color;
        
        return this;
    }
    public _endVertex() {
        this._count++;
    }

    public _setupPointersPosition(shaderWorld: _ShaderLines) {
        const stride = this._stride;
        const gl = this._klocki._display._gl;
        {

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

            if (this._first) { gl.enableVertexAttribArray(shaderWorld._attribLocations._vertexPosition); }
        }
    }
    
    public _setupPointersColor(shaderWorld: _ShaderLines) {
        const stride = this._stride;
        const gl = this._klocki._display._gl;
        {

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
        }
        if (this._first) { gl.enableVertexAttribArray(shaderWorld._attribLocations._color); }
        
    }
    public _setupPointers(shaderWorld: _ShaderLines) {
        // let stride = this._stride
        this._setupPointersPosition(shaderWorld);
        this._setupPointersColor(shaderWorld);

        this._first = false;

    }

    public _upload(shaderWorld: _ShaderLines): number {
        const gl = this._klocki._display._gl;
        if (this._count > 0) {
            gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(this._buf, 0, this._count * this._stride), gl.DYNAMIC_DRAW);
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
    public _endAndUpload(shaderWorld: _ShaderLines) {
        // gl.bindVertexArray(this.vao)
        const gl = this._klocki._display._gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._glBuffer);
        const count = this._upload(shaderWorld);
        this._setupPointers(shaderWorld);

        if (count > 0) {
            gl.drawArrays(gl.LINES, 0, count);
        }
    }

    public _drawOutline(sx: number, sy: number, sz: number, dx: number, dy: number, dz: number, color: number) {
        this._pos(sx, sy, sz)._color(color)._endVertex();
        this._pos(sx + dx, sy, sz)._color(color)._endVertex();

        this._pos(sx + dx, sy, sz)._color(color)._endVertex();
        this._pos(sx + dx, sy, sz + dz)._color(color)._endVertex();

        this._pos(sx + dx, sy, sz + dz)._color(color)._endVertex();
        this._pos(sx, sy, sz + dz)._color(color)._endVertex();

        this._pos(sx, sy, sz + dz)._color(color)._endVertex();
        this._pos(sx, sy, sz)._color(color)._endVertex();

        this._pos(sx, sy + dy, sz)._color(color)._endVertex();
        this._pos(sx + dx, sy + dy, sz)._color(color)._endVertex();

        this._pos(sx + dx, sy + dy, sz)._color(color)._endVertex();
        this._pos(sx + dx, sy + dy, sz + dz)._color(color)._endVertex();

        this._pos(sx + dx, sy + dy, sz + dz)._color(color)._endVertex();
        this._pos(sx, sy + dy, sz + dz)._color(color)._endVertex();

        this._pos(sx, sy + dy, sz + dz)._color(color)._endVertex();
        this._pos(sx, sy + dy, sz)._color(color)._endVertex();

        this._pos(sx, sy, sz)._color(color)._endVertex();
        this._pos(sx, sy + dy, sz)._color(color)._endVertex();

        this._pos(sx + dx, sy, sz)._color(color)._endVertex();
        this._pos(sx + dx, sy + dy, sz)._color(color)._endVertex();

        this._pos(sx + dx, sy, sz + dz)._color(color)._endVertex();
        this._pos(sx + dx, sy + dy, sz + dz)._color(color)._endVertex();

        this._pos(sx, sy, sz + dz)._color(color)._endVertex();
        this._pos(sx, sy + dy, sz + dz)._color(color)._endVertex();
    }
}
