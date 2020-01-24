
import { _TextureInfo } from "../../client/txt/TextureInfo";

export class _ModelFace {
    public _texture: string;
    public _textureResolved: _TextureInfo | null;
    public _cullface: string;
    public _cullfaceIndex: number;
    public _uv: number[];
    public _tintindex: any;
    constructor(texture: string, cullface: string, uv: number[], tintindex: number) {
        this._texture = texture;
        this._textureResolved = null;
        this._cullface = cullface;
        this._tintindex = tintindex;
        let index = dir2order.get(cullface);
        if (index === void 0) {
            index = -1;
        }
        this._cullfaceIndex = index;
        this._uv = [
            uv[0] / 16,
            uv[1] / 16,
            uv[2] / 16,
            uv[3] / 16,
            (uv[2] - uv[0]) / 16,
            (uv[3] - uv[1]) / 16
        ];
    }
}
const dir2order = new Map([["up", 0], ["down", 1], ["north", 2], ["south", 3], ["west", 4], ["east", 5]]);
// const cull2order = new Map([["up", 1], ["down", 0], ["north", 3], ["south", 2], ["west", 5], ["east", 4]]);
export class _ModelElement {
    public _from: number[];
    public _to: number[];
    public _delta: number[];
    public _faces: _ModelFace[];
    public _facesOriginal: any;
    constructor(from: number[], to: number[], faces: any) {

        this._from = from;
        this._to = to;
        this._delta = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
        this._faces = Array(6);
        this._facesOriginal = faces;
        if (faces) {
            for (const dirName in faces) {
                if (faces.hasOwnProperty(dirName)) {
                    const f = faces[dirName];
                    let cull = f.cullface;
                    if (!cull) {
                        cull = "";
                    }
                    let uv = f.uv;
                    if (!uv) {
                        uv = [0, 0, 16, 16];
                    }
                    const num: number | undefined = dir2order.get(dirName);

                    let tintindex = -1;
                    if (f.hasOwnProperty("tintindex")) {
                        tintindex = f.tintindex;
                    }
                    if (num !== void 0) {
                        this._faces[num] = new _ModelFace(f.texture, cull, uv, tintindex);
                    }
                }
            }
        }
    }

    public _copy() {
        return new _ModelElement(this._from, this._to, this._facesOriginal);
    }
}

export class _BlockModel {
    public _parent!: string;
    public _parentModel: _BlockModel | null;
    public _selfElements: _ModelElement[];
    public _selfTextures: Map<string, string>;
    public _textures: Map<string, string>;
    public _elements: _ModelElement[];
    public constructor() {
        this._parentModel = null;
        this._selfTextures = new Map<string, string>();
        this._textures = new Map<string, string>();
        this._elements = [];
        this._selfElements = [];
    }

    public static _load(mjson: any): _BlockModel {
        const m = new _BlockModel();

        m._parent = mjson.parent;
        // m._selfTextures =

        const texs = mjson.textures;
        for (let texKey in texs) {
            if (texs.hasOwnProperty(texKey)) {

                const texVal = texs[texKey];
                // console.log("tex", texKey, texVal);
                if (texKey.charAt(0) === '#') {
                    texKey = texKey.substring(1);
                }
                m._selfTextures.set(texKey, texVal);
            }
        }
        if (mjson.elements) {
            for (let i = 0; i < mjson.elements.length; i++) {
                const e = mjson.elements[i];

                const from = [e.from[0] / 16, e.from[1] / 16, e.from[2] / 16];
                const to = [e.to[0] / 16, e.to[1] / 16, e.to[2] / 16];

                m._selfElements.push(new _ModelElement(from, to, e.faces));
            }
        }

        return m;
    }
    public _resolveTexture(name: string) {
        let v: string | undefined = name;
        if (v.charAt(0) === '#') {
            v = v.substring(1);
        }
        while (true) {
            v = this._textures.get(v);
            if (v === void 0) {
                return "";
            }
            if (v.charAt(0) === '#') {
                v = v.substring(1);
            } else {
                return v;
            }
        }
    }
    public _init(parent: _BlockModel) {
        this._parentModel = parent;
        if (parent != null) {
            parent._textures.forEach((v, k) => {
                this._textures.set(k, v);
            });
            for (let i = 0; i < parent._elements.length; i++) {
                this._elements.push(parent._elements[i]._copy());
            }
        }
        this._selfTextures.forEach((v, k) => {
            this._textures.set(k, v);

        });
        for (let i = 0; i < this._selfElements.length; i++) {
            this._elements.push(this._selfElements[i]);
        }

    }
}
