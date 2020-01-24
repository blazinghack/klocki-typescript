
import { mat4, vec3 } from "gl-matrix";

import { _KlockiTexture } from "../txt/KlockiTexture";
import { _WorldRenderer } from "../renderer/WorldRenderer";
import { _TextureInfo } from "../txt/TextureInfo";
import { _Klocki } from "../Klocki";

const simpleCube = [
    { X: 0, Y: 0, Z: 0 },
    { X: 1, Y: 0, Z: 0 },
    { X: 0, Y: 0, Z: 1 },
    { X: 1, Y: 0, Z: 1 },
    { X: 0, Y: 1, Z: 0 },
    { X: 1, Y: 1, Z: 0 },
    { X: 0, Y: 1, Z: 1 },
    { X: 1, Y: 1, Z: 1 },
];

// From steven-go project
const faceVertices = [
    { // Up
        indices: [0, 1, 2, 3, 2, 1],
        cubeIndices: [4, 5, 6, 7, 6, 5],
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
        cubeIndices: [0, 2, 1, 3, 1, 2],
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
        cubeIndices: [0, 1, 4, 5, 4, 1],
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
        cubeIndices: [2, 6, 3, 7, 3, 6],
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
        cubeIndices: [0, 4, 2, 6, 2, 4],
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
        cubeIndices: [1, 3, 5, 7, 5, 3],
        verts: [
            { X: 1, Y: 0, Z: 0, TOffsetX: 1, TOffsetY: 1 },
            { X: 1, Y: 0, Z: 1, TOffsetX: 0, TOffsetY: 1 },
            { X: 1, Y: 1, Z: 0, TOffsetX: 1, TOffsetY: 0 },
            { X: 1, Y: 1, Z: 1, TOffsetX: 0, TOffsetY: 0 },
        ],
        direction: { X: 1, Y: 0, Z: 0 },
    }
];
class _RenderPoint {
    public _pos: vec3;
    constructor(pos: vec3) {
        this._pos = pos;
    }
}
export class _RenderBox {
    public static _tempPoints: vec3[] = [vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create()];
    public static _identity: mat4 = mat4.create();
    public _x: number;
    public _y: number;
    public _z: number;
    public _dx: number;
    public _dy: number;
    public _dz: number;
    public _textures: _KlockiTexture[];
    public _positions: _RenderPoint[];
    public _cachedBuf: Uint8Array;

    constructor(klocki: _Klocki, x: number, y: number, z: number, dx: number, dy: number, dz: number, textures: _KlockiTexture[]) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._dx = dx;
        this._dy = dy;
        this._dz = dz;
        this._textures = textures;
        this._positions = [];

        const as = klocki._textureManager._atlasSize;
        const wr = klocki._worldRendererMobsHelper;
        wr._reset();
        wr._atlas = this._textures[0]._atlasId;

        for (let i = 0; i < 8; i++) {
            const cubeVert = simpleCube[i];
            const pos = vec3.fromValues(this._x + this._dx * cubeVert.X, this._y + this._dy * cubeVert.Y, this._z + this._dz * cubeVert.Z);
            this._positions.push(new _RenderPoint(pos));
        }
        
        for (let facei = 0; facei < 6; facei++) {
            const face = faceVertices[facei];

            const verts = face.verts;

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
            const tex = this._textures[facei];
            const texOffsetX = tex._subRect._min._x / as;
            const texOffsetY = tex._subRect._min._y / as;
            const texScaleX = tex._subRect._dx() / as;
            const texScaleY = tex._subRect._dy() / as;

            const cubeIndices = face.cubeIndices;

            for (let i = 0; i < 4; i++) {
                const vert = verts[i];

                const pos = this._positions[cubeIndices[i]]._pos;
                wr._pos(pos[0], pos[1], pos[2])._tex(texOffsetX + vert.TOffsetX * texScaleX, texOffsetY + vert.TOffsetY * texScaleY)._color(color)._endVertex();
            }
        }
        this._cachedBuf = new Uint8Array(wr._copyBuf());
    }

    public _renderAt(wr: _WorldRenderer, m: mat4) {

        wr._putPrepared(this._cachedBuf);
        const matID = wr._klocki._textureManager._pushGroupMatrix(m);

        wr._matMany(matID, 6*4);


    }
}
