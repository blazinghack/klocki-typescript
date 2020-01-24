import { mat4 } from "gl-matrix";
import { _KlockiEntityPlayer } from "../entity/KlockiEntityPlayer";
import { _RenderEntity } from "./RenderEntityLiving";
import { _KlockiEntityCreeper } from "../entity/KlockiEntityCreeper";
import { _RenderBox } from "../entity/RenderBox";
import { _Klocki } from "../Klocki";
import { _TextureInfo } from "../txt/TextureInfo";
import { _KlockiTexture } from "../txt/KlockiTexture";
import { _KlockiEntityItemFrame } from "../entity/KlockiEntityItemFrame";


export class _RenderItemFrame extends _RenderEntity {


    public _skinInfo: _TextureInfo;
    public _skinLoaded: boolean;


    public _headBox: _RenderBox | undefined;
    public _headOBox: _RenderBox | undefined;
    public _chestBox: _RenderBox | undefined;
    public _chestOBox: _RenderBox | undefined;
    public _limbBoxes: _RenderBox[] | undefined;
    public _legRightBox: _RenderBox | undefined;
    public _legRightOBox: _RenderBox | undefined;
    public _legLeftBox: _RenderBox | undefined;
    public _legLeftOBox: _RenderBox | undefined;
    public _armRightBox: _RenderBox | undefined;
    public _armRightOBox: _RenderBox | undefined;
    public _armLeftBox: _RenderBox | undefined;
    public _armLeftOBox: _RenderBox | undefined;

    public static _headMatrix: mat4 = mat4.create();
    public static _chestMatrix: mat4 = mat4.create();
    public static _legRightMatrix: mat4 = mat4.create();
    public static _legLeftMatrix: mat4 = mat4.create();
    public static _armLeftMatrix: mat4 = mat4.create();
    public static _armRightMatrix: mat4 = mat4.create();

    constructor(klocki: _Klocki){
        super(klocki)
        this._skinLoaded = false;
        
        const skinInfo: _TextureInfo = klocki._textureManager._loadTextureFromURL("assets/"+_Klocki._forbiddenWord+"/textures/entity/creeper/creeper.png", null, (tex: _KlockiTexture) => {
            const limbOffsets = [
                [0, 16, 0, 32],
                [16, 48, 0, 48],
                [32, 48, 48, 48],
                [40, 16, 40, 32],
            ];
            const limbBoxes = this._limbBoxes = new Array<_RenderBox>(8);
            for (let i = 0; i < 4; i++) {
                const off = limbOffsets[i];
                const litex = tex._stdBox64(off[0] + 4, off[1] + 4, 4, 12, 4);
                const lotex = tex._stdBox64(off[2] + 4, off[3] + 4, 4, 12, 4);

                limbBoxes[i * 2] = new _RenderBox(klocki, -2 / 16, -12 / 16, -2 / 16, 4 / 16, 12 / 16, 4 / 16, litex);
                limbBoxes[i * 2 + 1] = new _RenderBox(klocki, -2.2 / 16, -12.2 / 16, -2.2 / 16, 4.4 / 16, 12.4 / 16, 4.4 / 16, lotex);

            }

            this._headBox = new _RenderBox(klocki, -4 / 16, 0, -4 / 16, 8 / 16, 8 / 16, 8 / 16, tex._stdBox64(8, 8, 8, 8, 8));
            this._headOBox = new _RenderBox(klocki, -4.2 / 16, -0.2 / 16, -4.2 / 16, 8.4 / 16, 8.4 / 16, 8.4 / 16, tex._stdBox64(8 + 32, 8, 8, 8, 8));
            this._chestBox = new _RenderBox(klocki, -4 / 16, -6 / 16, -2 / 16, 8 / 16, 12 / 16, 4 / 16, tex._stdBox64(20, 20, 8, 12, 4));
            this._chestOBox = new _RenderBox(klocki, -4.2 / 16, -6.2 / 16, -2.2 / 16, 8.4 / 16, 12.4 / 16, 4.4 / 16, tex._stdBox64(20, 20 + 16, 8, 12, 4));

            this._legRightBox = limbBoxes[0];
            this._legRightOBox = limbBoxes[1];

            this._legLeftBox = limbBoxes[2];
            this._legLeftOBox = limbBoxes[3];

            this._armRightBox = limbBoxes[4];
            this._armRightOBox = limbBoxes[5];

            this._armLeftBox = limbBoxes[6];
            this._armLeftOBox = limbBoxes[7];

            this._skinLoaded = true;
        }, false);
        this._skinInfo = skinInfo;
    }

    public _render(entity: _KlockiEntityItemFrame){
        if(!this._skinLoaded){
            return;
        }
        super._render(entity);
        //console.log("render cree");
        //const playerScale = 0.9375;
        // console.log("rendering player");
        //const partial = this._klocki._getPartialTicks();
        //const matEntity = _RenderEntityLiving._positionMatrix;
        //mat4.scale(matEntity, matEntity, [playerScale, playerScale, playerScale]);




    }
}