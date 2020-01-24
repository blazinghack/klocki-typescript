import { PNG } from "pngjs";

import { _Klocki } from "../Klocki";
import { _GoRect } from "../imageutil/GoRect";
import { _GoImage } from "../imageutil/GoImage";

import { _TextureAllocator } from "./TextureAllocator";
import { _TextureInfo } from "./TextureInfo";
import { _KlockiTexture } from "./KlockiTexture";

export class _TextureManager {
    private static _missingTexture: Uint8Array | null;
    public _klocki: _Klocki;
    public _textureAllocator: _TextureAllocator;
    public _mainTexture: WebGLTexture;

    public _atlasSize: number;
    public _nAtlas: number;
    public _defaultKlockiTexture: _KlockiTexture;
    public _cachedTextures: Map<string, _TextureInfo>;
    public _groupParamTexture!: WebGLTexture;
    public _groupParamsBuf!: Float32Array;
    public _groupParamsTexSize!: number;
    public _groupParamsCount!: number;
    constructor(klocki: _Klocki) {
        this._klocki = klocki;
        this._cachedTextures = new Map<string, _TextureInfo>();

        const gl: WebGL2RenderingContext = this._klocki._display._gl;
        const mainTex: WebGLTexture | null = gl.createTexture();
        if (!mainTex) {
            throw new Error("can't create main texture");
        }
        
        this._mainTexture = mainTex;

        this._textureAllocator = new _TextureAllocator();

        this._atlasSize = 1024;
        this._nAtlas = 32;

        this._defaultKlockiTexture = new _KlockiTexture(null, 0, new _GoRect(0, 0, 1, 1));

        const mipLevelCount: number = 1;
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this._mainTexture);
        gl.texStorage3D(gl.TEXTURE_2D_ARRAY, mipLevelCount, gl.RGBA8, this._atlasSize, this._atlasSize, this._nAtlas);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        for (let i: number = 0; i < this._nAtlas; i++) {
            this._textureAllocator._provide(new _KlockiTexture(null, i, new _GoRect(0, 0, this._atlasSize, this._atlasSize)));
        }

        this._makeCubeParamTex();
    }

    private static _generateMissingTexture(): Uint8Array {
        const pixels: Uint32Array = new Uint32Array(8 * 8);
        for (let x: number = 0; x < 8; x++) {
            for (let y: number = 0; y < 8; y++) {
                pixels[x * 8] = ((x % 2) === (y % 2)) ? 0xFF00FF00 : 0xFFFF00FF;
            }
        }

        return new Uint8Array(pixels.buffer);
    }

    public _init(): void {
    }
    public _loadCached(url: string, fixedAlias: boolean): _TextureInfo {
        let texInfo = this._cachedTextures.get(url);
        if (texInfo !== void 0) {
            return texInfo;
        }
        console.log("first time", url);
        texInfo = this._loadTextureFromURL(url, null, null, fixedAlias);
        this._cachedTextures.set(url, texInfo);

        return texInfo;
    }
    public _loadTextureFromURL(url: string, precallback: Function | null, inpostcallback: Function | null, fixedAlias: boolean): _TextureInfo {
        // const gl: WebGL2RenderingContext = this._klocki._display._gl;
        // gl.bindTexture(gl.TEXTURE_2D_ARRAY, this._mainTexture);
        const textureInfo: _TextureInfo = new _TextureInfo(this, this._mainTexture, url, this._defaultKlockiTexture);
        textureInfo._promise = new Promise((resolve, reject) => {
            const postcallback = (tex: _KlockiTexture) => {
                resolve(tex);
                if (inpostcallback != null) {
                    inpostcallback(tex);
                }
                
                textureInfo._promise = null;
            };
            //const cache: string | null = localStorage.getItem(url);
            const cache: string | null = null;
            if (cache) {
                const v: ArrayBuffer = this._str2ab(cache);
                try {
                    const png: PNG = new PNG();
                    png.parse(Buffer.from(v), (err: Error, data: PNG) => {
                        if (err) {
                            console.warn(`load from cache ${url} failed: ${err}`);
                            localStorage.removeItem(url);
                            this._downloadTextureFromURL(url, precallback, postcallback, fixedAlias, textureInfo);
                        } else {
                            this._loadTextureFromParsedImage(textureInfo, data.data, precallback, postcallback, fixedAlias, png.width, png.height);
                        }
                    });
                } catch (e) {
                    console.warn(`load from cache ${url} failed: ${e}`);
                    localStorage.removeItem(url);
                    this._downloadTextureFromURL(url, precallback, postcallback, fixedAlias, textureInfo);
                }
            } else {
                this._downloadTextureFromURL(url, precallback, postcallback, fixedAlias, textureInfo);
            }
        });
        
        return textureInfo;
    }

    public _makeCubeParamTex() {
        const gl = this._klocki._display._gl;
        const boxParamTex: WebGLTexture | null = gl.createTexture();
        if (!boxParamTex) {
            throw new Error("can't create boxParamTex texture");
        }
        this._groupParamTexture = boxParamTex;
        this._groupParamsTexSize = 256;
        this._groupParamsCount = 0;
        this._groupParamsBuf = new Float32Array(this._groupParamsTexSize * this._groupParamsTexSize * 4);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this._groupParamTexture);
        // const size = this._boxParamsTexSize;
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, this._boxParamsTexSize, this._boxParamsTexSize, 0, gl.RGBA, gl.FLOAT, 0);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, this._groupParamsTexSize, this._groupParamsTexSize, 0, gl.RGBA, gl.FLOAT, this._groupParamsBuf, 0);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.activeTexture(gl.TEXTURE0);
        
    }
    public _pushGroupMatrix(mat: Float32Array): number {
        const pos = this._groupParamsCount << 4;
        // const buf = this._boxParamsBuf;
        
        this._groupParamsBuf.set(mat, pos);

        return this._groupParamsCount++;
    }
    public _resetBoxBuf() {
        this._groupParamsCount = 0;
    }
    public _uploadGroupParamTex() {
        const gl = this._klocki._display._gl;
        //const sliced = new Float32Array(this._groupParamsBuf, 0, this._groupParamsCount * 16);
        // const sliced = this._boxParamsBuf.slice(0, this._boxParamsCount*8);
        //gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this._groupParamTexture);
        //gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this._groupParamsTexSize, this._groupParamsTexSize, gl.RGBA, gl.FLOAT, sliced, 0);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, this._groupParamsTexSize, this._groupParamsTexSize, 0, gl.RGBA, gl.FLOAT, this._groupParamsBuf, 0);
        

        //gl.activeTexture(gl.TEXTURE0);
    }

    private _downloadTextureFromURL(url: string, precallback: Function | null, postcallback: Function | null, fixedAlias: boolean, textureInfo: _TextureInfo): void {
        fetch(url).then(async (v: Response) => {
            if (!v.ok) {
                throw Error(v.statusText);
            }

            return v.arrayBuffer();
        }).then((v: ArrayBuffer) => {
            const png: PNG = new PNG();
            png.parse(Buffer.from(v), (err: Error, data: PNG) => {
                if (err) {
                    console.warn(`load ${url} failed: ${err}`);
                    if (!_TextureManager._missingTexture) {
                        _TextureManager._missingTexture = _TextureManager._generateMissingTexture();
                    }
                    this._loadTextureFromParsedImage(textureInfo, _TextureManager._missingTexture, precallback, postcallback, fixedAlias, 8, 8);
                } else {
                    localStorage.setItem(url, this._ab2str(v));
                    this._loadTextureFromParsedImage(textureInfo, data.data, precallback, postcallback, fixedAlias, png.width, png.height);
                }
            });
        }).catch((reason: any) => {
            console.warn(`load ${url} failed: ${reason}`);
            if (!_TextureManager._missingTexture) {
                _TextureManager._missingTexture = _TextureManager._generateMissingTexture();
            }
            this._loadTextureFromParsedImage(textureInfo, _TextureManager._missingTexture, precallback, postcallback, fixedAlias, 8, 8);
        });
    }

    private _loadTextureFromParsedImage(textureInfo: _TextureInfo, pixels: Uint8Array, precallback: Function | null, postcallback: Function | null, fixedAlias: boolean, w: number, h: number): void {
        const gl: WebGL2RenderingContext = this._klocki._display._gl;
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this._mainTexture);
        let aliasWidth: number = w;
        if (fixedAlias) {
            aliasWidth *= 2;
        }
        const klockiTexture: _KlockiTexture = this._textureAllocator._allocate(aliasWidth);
        textureInfo._allocatedTex = klockiTexture;
        const r: _GoRect = klockiTexture._subRect;
        const imgSource: _GoImage = new _GoImage(pixels, w, h);
        if (precallback != null) {
            precallback(imgSource);
        }
        let uploadedImg: _GoImage = imgSource;
        if (fixedAlias) {
            const apixels: Uint8Array = new Uint8Array(aliasWidth * aliasWidth * 4);
            const imgAlias: _GoImage = new _GoImage(apixels, aliasWidth, aliasWidth);
            const dpixels: Uint8Array = imgAlias._pixels;
            const w2: number = w >> 1;
            for (let x: number = 0; x < aliasWidth; x++) {
                for (let y: number = 0; y < aliasWidth; y++) {
                    const doffset: number = imgAlias._pixOffset(x, y);
                    const soffset: number = imgSource._pixOffset((w2 + x) % w, (w2 + y) % w);
                    dpixels[doffset + 0] = pixels[soffset + 0];
                    dpixels[doffset + 1] = pixels[soffset + 1];
                    dpixels[doffset + 2] = pixels[soffset + 2];
                    dpixels[doffset + 3] = pixels[soffset + 3];
                }
            }
            uploadedImg = imgAlias;

            textureInfo._tex = klockiTexture._zoomCenter();
        } else {
            textureInfo._tex = klockiTexture;
        }
        textureInfo._updateRenderInfo();
        if (postcallback != null) {
            postcallback(textureInfo._tex);
        }
        const mipmapLevel: number = 0;
        const srcFormat: number = gl.RGBA;
        const srcType: number = gl.UNSIGNED_BYTE;
        // console.log("atlasId: ", klockiTexture._atlasId);
        gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, mipmapLevel, r._min._x, r._min._y, klockiTexture._atlasId, uploadedImg._rect._dx(), uploadedImg._rect._dy(), 1, srcFormat, srcType, uploadedImg._pixels);
    }

    private _str2ab(byteString: string): Uint8Array {
        const byteArray: Uint8Array = new Uint8Array(byteString.length);
        for (let i: number = 0; i < byteString.length; i++) {
            byteArray[i] = byteString.charCodeAt(i);
        }

        return byteArray;
    }
    private _ab2str(buffer: ArrayBuffer): string {
        const byteArray: Uint8Array = new Uint8Array(buffer);
        let byteString: string = "";
        for (let i: number = 0; i < byteArray.byteLength; i++) {
            byteString += String.fromCodePoint(byteArray[i]);
        }

        return byteString;
    }
}
