
import { _Klocki } from "../Klocki";
import { _TextureInfo } from "../txt/TextureInfo";
import { _KlockiTexture } from "../txt/KlockiTexture";

import { _KlockiEntityLiving } from "./KlockiEntityLiving";
import { _RenderBox } from "./RenderBox";
import { _RenderPlayer } from "../render/RenderPlayer";
import { _KlockiEntityBase } from "./KlockiEntityBase";

export class _KlockiEntityItemFrame extends _KlockiEntityBase {


    constructor(klocki: _Klocki) {
        super(klocki);
        
    }

    public _tick() {

        super._tick();
        //const dx = this._posX - this._prevPosX;
        //const dz = this._posZ - this._prevPosZ;

    }
    public _render() {

        this._klocki._entityRenders._renderItemFrame._render(this);
        
    }
}
