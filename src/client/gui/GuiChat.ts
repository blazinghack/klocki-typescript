import { _Klocki } from "../Klocki";
import { _Deque } from "../../util/Deque";

import { _Gui } from "./Gui";
import { _ChatLine } from "./ChatLine";

export class _GuiChat extends _Gui {

    public _visibleMessages: _Deque<_ChatLine>;
    public _animationOffset: number;
    public _lastAnimationOffset: number;
    public _animationOffsetSpeed: number;

    constructor(klocki: _Klocki) {
        super(klocki);
        this._visibleMessages = new _Deque<_ChatLine>();
        this._animationOffset = 0;
        this._lastAnimationOffset = 0;
        this._animationOffsetSpeed = 0;
    }

    public _render(): void {
        const fr = this._klocki._fontRenderer;
        const size = this._visibleMessages._size();
        const offset = this._getAnimationOffset(this._klocki._getPartialTicks());
        let rsize = size;
        if (rsize > 5) {
            rsize = 5;
        }
        for (let linei = 0; linei < rsize; linei++) {
            const dequeIndex = linei;
            const line = this._visibleMessages._peek(dequeIndex);

            if (line) {
                fr._drawString(line._formattedText, 2, -offset + this._klocki._display._guiHeight - 18 - linei * 9, 0xFFFFFFFF, true);
            }
        }
    }
    public _appendMessage(chatComponent: any) {
        this._visibleMessages._enqueue(new _ChatLine(chatComponent));
        this._animationOffset -= 9;
        this._lastAnimationOffset -= 9;
    }
    public _tick(): void {
        const animationGoto = 0;
        this._lastAnimationOffset = this._animationOffset;
		      this._animationOffsetSpeed *= 0.33;
        this._animationOffsetSpeed += (animationGoto - this._animationOffset) * 0.3;
        this._animationOffset += this._animationOffsetSpeed;
    }
    public _getAnimationOffset(renderPartial: number): number {
    	return this._lastAnimationOffset + (this._animationOffset - this._lastAnimationOffset) * renderPartial;
    }
}
