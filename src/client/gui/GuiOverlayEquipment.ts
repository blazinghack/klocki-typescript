import { _Klocki } from "../Klocki";
import { _TextureInfo } from "../txt/TextureInfo";

import { _Gui } from "./Gui";
import { _KlockiTexture } from "../txt/KlockiTexture";

export class _GuiOverlayEquipment extends _Gui {
    public _widgetsTexture: _TextureInfo;

    constructor(klocki: _Klocki) {
        super(klocki);
        this._widgetsTexture = this._klocki._textureManager._loadCached("assets/"+_Klocki._forbiddenWord+"/textures/gui/widgets.png", false);

    }

    public _render(): void {
        if(this._widgetsTexture._promise == null){

           
            this._centeredHotbarTex(182, 22, 0, 0, 0);
            const world = this._klocki._theWorld;
            if(world){
                const player = world._thePlayer!;
                const selected = player._selectedHotbarSlot;
                this._centeredHotbarTex(22, 22, 0, 23, 2*20*(selected-4));

                for(let i = 0; i<9; i++){
                    const slot = player._inventory._mainInventory[27+i];
                    const itemStack = slot._item;
                    if(itemStack){
                        const itemID = itemStack._id;
                        const item = this._klocki._itemRegistry._itemsByLegacyID[itemID];
                        if(item){
                            const itemName = item._name;
                            const itemTex = this._klocki._textureManager._loadCached("assets/"+_Klocki._forbiddenWord+"/textures/item/"+itemName+".png", false);
                            this._centeredItemTex(itemTex, 16, 16, 2*20*(i-4), -6);
                        }
                    }
                }
            }
        }
    }
    _centeredHotbarTex(sizex: number, sizey: number, texoffx: number, texoffy: number, offsetx: number){
        const sc = 2;
        const sx = this._klocki._display._width;
        const sy = this._klocki._display._height;
        let cx = (sx >> 1) + offsetx;
        const uir = this._klocki._uiRenderer;

        const tex = this._widgetsTexture
        const tox = tex._texOffsetX+tex._texScaleX*(texoffx/256)
        const toy = tex._texOffsetY+tex._texScaleY*(texoffy/256)

        const tsx = tex._texScaleX*(sizex/256)
        const tsy = tex._texScaleY*(sizey/256)

        uir._pos(sc * (cx - sizex), sc * (sy - sizey*2), 0)._tex(tox, toy)._color(0xFFFFFFFF)._endVertex();
        uir._pos(sc * (cx + sizex), sc * (sy - sizey*2), 0)._tex(tox+tsx, toy)._color(0xFFFFFFFF)._endVertex();
        uir._pos(sc * (cx - sizex), sc * (sy), 0)._tex(tox, toy+tsy)._color(0xFFFFFFFF)._endVertex();
        uir._pos(sc * (cx + sizex), sc * (sy), 0)._tex(tox+tsx, toy+tsy)._color(0xFFFFFFFF)._endVertex();
    }
    _centeredItemTex(tex: _TextureInfo, sizex: number, sizey: number, offsetx: number, offsety: number){
        const sc = 2;
        const sx = this._klocki._display._width;
        const sy = this._klocki._display._height;
        let cx = (sx >> 1) + offsetx;
        let cy = sy + offsety;
        const uir = this._klocki._uiRenderer;

        const tox = tex._texOffsetX
        const toy = tex._texOffsetY

        const tsx = tex._texScaleX
        const tsy = tex._texScaleY

        uir._pos(sc * (cx - sizex), sc * (cy - sizey*2), 0)._tex(tox, toy)._color(0xFFFFFFFF)._endVertex();
        uir._pos(sc * (cx + sizex), sc * (cy - sizey*2), 0)._tex(tox+tsx, toy)._color(0xFFFFFFFF)._endVertex();
        uir._pos(sc * (cx - sizex), sc * (cy), 0)._tex(tox, toy+tsy)._color(0xFFFFFFFF)._endVertex();
        uir._pos(sc * (cx + sizex), sc * (cy), 0)._tex(tox+tsx, toy+tsy)._color(0xFFFFFFFF)._endVertex();
    }

}
