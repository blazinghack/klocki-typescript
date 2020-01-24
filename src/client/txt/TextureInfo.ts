import { _GoRect } from "../imageutil/GoRect";

import { _TextureManager } from "./TextureManager";
import { _KlockiTexture } from "./KlockiTexture";

export class _TextureInfo {
    public _url: string;
    public _tex: _KlockiTexture;
    public _texOffsetX: number = 0;
    public _texOffsetY: number = 0;
    public _texScaleX: number = 1;
    public _texScaleY: number = 1;
    public _allocatedTex: _KlockiTexture;
    public _manager: _TextureManager;
    public _glTexture: WebGLTexture;
    public _promise: Promise<_KlockiTexture> | null;

    constructor(manager: _TextureManager, glTexture: WebGLTexture, url: string, klockiTexture: _KlockiTexture) {
        this._manager = manager;
        this._glTexture = glTexture;
        this._url = url;
        this._tex = klockiTexture;
        this._allocatedTex = klockiTexture;
        this._promise = null;
        this._updateRenderInfo();
    }
    public _updateRenderInfo(): void {
        const r: _GoRect = this._tex._subRect;
        this._texOffsetX = r._min._x / this._manager._atlasSize;
        this._texOffsetY = r._min._y / this._manager._atlasSize;
        this._texScaleX = r._dx() / this._manager._atlasSize;
        this._texScaleY = r._dy() / this._manager._atlasSize;
    }

}
