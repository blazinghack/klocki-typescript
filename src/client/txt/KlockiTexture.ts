import { _GoImage } from "../imageutil/GoImage";
import { _GoRect } from "../imageutil/GoRect";

export class _KlockiTexture {
    public _img: _GoImage | null;
    public _atlasId: number;
    public _subRect: _GoRect;
    public _children: _KlockiTexture[] | null;
    constructor(goImage: _GoImage | null, atlasId: number, subRect: _GoRect) {
        this._img = goImage;
        this._atlasId = atlasId;
        this._subRect = subRect;
        this._children = null;
    }
    public split(): _KlockiTexture[] {
        this._children = Array(4);
        const r: _GoRect = this._subRect;
        const cx: number = (r._min._x + r._max._x) * 0.5;
        const cy: number = (r._min._y + r._max._y) * 0.5;
        this._children[0] = new _KlockiTexture(null, this._atlasId, new _GoRect(r._min._x, r._min._y, cx, cy));
        this._children[1] = new _KlockiTexture(null, this._atlasId, new _GoRect(cx, r._min._y, r._max._x, cy));
        this._children[2] = new _KlockiTexture(null, this._atlasId, new _GoRect(r._min._x, cy, cx, r._max._y));
        this._children[3] = new _KlockiTexture(null, this._atlasId, new _GoRect(cx, cy, r._max._x, r._max._y));

        return this._children;
    }

    public _zoomCenter(): _KlockiTexture {
        const r: _GoRect = this._subRect;

        const minx: number = r._min._x + r._dx() * 0.25;
        const miny: number = r._min._y + r._dy() * 0.25;

        const maxx: number = r._min._x + r._dx() * 0.75;
        const maxy: number = r._min._y + r._dy() * 0.75;

        return new _KlockiTexture(null, this._atlasId, new _GoRect(minx, miny, maxx, maxy));

    }
    public _subTex(x: number, y: number, dx: number, dy: number) {
        const r: _GoRect = this._subRect;
        const minx: number = r._min._x + r._dx() * x;
        const miny: number = r._min._y + r._dy() * y;

        const maxx: number = r._min._x + r._dx() * (x + dx);
        const maxy: number = r._min._y + r._dy() * (y + dy);
        const tex = new _KlockiTexture(null, this._atlasId, new _GoRect(minx, miny, maxx, maxy));

        return tex;
    }

    public _stdBox(x: number, y: number, dx: number, dy: number, dz: number) {
        const tex = this;

        return [
            tex._subTex(x, y - dz, dx, dz),
            tex._subTex(x + dx, y - dz, dx, dz),
            
            tex._subTex(x, y, dx, dy),
            tex._subTex(x + dx + dz, y, dx, dy),
            
            tex._subTex(x + dx, y, dz, dy),
            tex._subTex(x - dz, y, dz, dy)
        ];
    }
    public _stdBox64(x: number, y: number, dx: number, dy: number, dz: number) {
        return this._stdBox(x / 64, y / 64, dx / 64, dy / 64, dz / 64);
    }
}
