import { _TextureInfo } from "../client/txt/TextureInfo";
import { _TextureManager } from "../client/txt/TextureManager";

import { _BlockProperties } from "./BlockProperties";
import { _BlockModel } from "./model/Model";

export class _Block {
    public _prop: _BlockProperties;
    public _hasModel: boolean;
    public _name: string;
    public _textureInfo: _TextureInfo | null;
    public _textureCallback: Function | null;
    public _model: _BlockModel | null;
    public _opaque: boolean;
    public _states: number;
    public _baseStateId: number;

    constructor(prop: _BlockProperties) {
        this._prop = prop;
        this._hasModel = true;
        this._name = "notset";
        this._textureInfo = null;
        this._textureCallback = null;
        this._model = null;
        this._opaque = prop._opaque;
        this._states = 1;
        this._baseStateId = -1;
    }


    public _loadModelTexture(manager: _TextureManager): void {
        if (this._hasModel) {
            
        }
    }
    
    public _textureName(): string {
        return this._name;
    }
    public _getDefaultState() {
        return this;
    }
}
