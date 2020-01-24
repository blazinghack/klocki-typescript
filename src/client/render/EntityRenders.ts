import { _Klocki } from "../Klocki";
import { _RenderPlayer } from "./RenderPlayer";
import { _RenderCreeper } from "./RenderCreeper";
import { _RenderItemFrame } from "./RenderItemFrame";


export class _EntityRenders {
    public _renderPlayer: _RenderPlayer;
    public _renderCreeper: _RenderCreeper;
    public _renderItemFrame: _RenderItemFrame;

    public constructor(klocki: _Klocki){
        this._renderPlayer = new _RenderPlayer(klocki);
        this._renderCreeper = new _RenderCreeper(klocki);
        this._renderItemFrame = new _RenderItemFrame(klocki);
    }
}