import { _Klocki } from "../Klocki";
import { _GoImage } from "../imageutil/GoImage";
import { _GoRect } from "../imageutil/GoRect";
import { _TextureInfo } from "../txt/TextureInfo";
import { _Shader } from "../shaders/Shader";
import { _ShaderUI } from "../shaders/ShaderUI";

export class _UIRenderer {
    public _buf: ArrayBuffer;
    public _u16: Uint16Array;
    public _u32: Uint32Array;
    public _bufIndex: number;
    public _glBuffer: WebGLBuffer;
    public _first: boolean;

    public _atlas: number;
    public _count: number;

    constructor(public _klocki: _Klocki) {
        const gl = this._klocki._display._gl;
        const glBuf: WebGLBuffer | null = gl.createBuffer();
        if (glBuf === null) {
            throw new Error("can't UI buffer");
        }
        this._buf = new ArrayBuffer(1 * 1024 * 1024);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, glBuf);
        gl.bufferData(gl.ARRAY_BUFFER, this._buf.byteLength, gl.DYNAMIC_DRAW);

        this._u16 = new Uint16Array(this._buf);
        this._u32 = new Uint32Array(this._buf);
        this._bufIndex = 0;
        // this.vao = gl.createVertexArray()
        // gl.bindVertexArray(this.vao)

        this._glBuffer = glBuf;
        this._first = true;
        this._atlas = 0;
        this._count = 0;

        this._reset();
    }
    public _reset() {
        this._count = 0;
        this._bufIndex = 0;
    }

    public _pos(x: number, y: number, z: number): _UIRenderer {
        const b = this._u16;
        const i = this._count * 8;
        b[i] = Math.round(x); // 0 1
        b[i + 1] = Math.round(y); // 2 3
        b[i + 2] = 0; // 2*Math.sin((new Date).getTime()/1000) // 4 5

        return this;
    }
    public _tex(tx: number, ty: number): _UIRenderer {
        const b = this._u16;
        const i = this._count * 8 + 3;
        b[i] = Math.floor(tx * 32767); // 6 7
        b[i + 1] = Math.floor(ty * 32767); // 8 9
        b[i + 2] = this._atlas;

        return this;
    }
    public _color(color: number): _UIRenderer {
        const b = this._u32;
        const i = this._count * 4 + 3;
        // 12 13 14 15
        b[i] = color;

        return this;
    }
    public _endVertex(): void {
        this._count++;
    }

    public _endAndUpload(programInfo: _ShaderUI) {
        if (this._count === 0) {
            return;
        }
        const stride = 2 * 8;
        // gl.bindVertexArray(this.vao)
        const gl = this._klocki._display._gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._glBuffer);
        const len = this._count * stride;
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Uint8Array(this._buf, 0, len), 0, len);

        // if (this.first) {
        // this.first = false

        {
            const numComponents = 3;
            const type = gl.SHORT;
            const normalize = false;

            const offset = 0;
            // gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

            gl.vertexAttribPointer(
                programInfo._attribLocations._vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            if (this._first) { gl.enableVertexAttribArray(programInfo._attribLocations._vertexPosition); }
        }
        {
            const numComponents = 2;
            const type = gl.SHORT;
            const normalize = true;
            const offset = 6;

            gl.vertexAttribPointer(
                programInfo._attribLocations._textureCoord,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            if (this._first) { gl.enableVertexAttribArray(programInfo._attribLocations._textureCoord); }
        }
        {
            const numComponents = 1;
            const type = gl.SHORT;
            const normalize = false;
            const offset = 10;

            gl.vertexAttribPointer(
                programInfo._attribLocations._textureAtlas,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            if (this._first) { gl.enableVertexAttribArray(programInfo._attribLocations._textureAtlas); }
        }
        {
            const numComponents = 4;
            const type = gl.UNSIGNED_BYTE;
            const normalize = true;
            const offset = 12;

            gl.vertexAttribPointer(
                programInfo._attribLocations._color,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            if (this._first) { gl.enableVertexAttribArray(programInfo._attribLocations._color); }
        }
        // }
        this._first = false;

        // gl.drawArrays(gl.TRIANGLES, 0, this._count);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._klocki._display._indexBuffer);
        gl.drawElements(gl.TRIANGLES, this._count * (6 / 4), gl.UNSIGNED_INT, 0);

    }

}
