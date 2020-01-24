import { _Klocki } from "../Klocki";
import { _GoImage } from "../imageutil/GoImage";
import { _GoRect } from "../imageutil/GoRect";
import { _TextureInfo } from "../txt/TextureInfo";
import { _Shader } from "../shaders/Shader";
import { _ShaderUI } from "../shaders/ShaderUI";

import { _UIRenderer } from "./UIRenderer";

// JavaScript is single thread so f this, let's optimize memory GC
let charSize = 0;
let chari=0, charj=0;
let charWidth=0, charHeight=0;
let charOffsety = 0;
let atlasId = 0;
let charSkew = 0;
const charScaleX = 1 / (128);
const charScaleY = 1 / (128);
let color = 0;

export class _FontRenderer {
    public _uiRenderer: _UIRenderer;
    public _klocki: _Klocki;
    public _guiScale: number;
    public _scaleFactor: number;
    public _unicodeFlag: boolean;
    public _atlas: number;
    public _posX: number;
    public _posY: number;
    public _texOffsetX: number;
    public _texOffsetY: number;
    public _texScale: number = 0;
    public _randomStyle: boolean = false;
    public _boldStyle: boolean = false;
    public _strikethroughStyle: boolean = false;
    public _underlineStyle: boolean = false;
    public _italicStyle: boolean = false;
    public _cachedColor: number = 0;
    public _alpha: number = 0;
    public _charWidth: Uint8Array;
    public _colorCode: Uint32Array;
    public _charIdMap!: Int16Array;
    public _red: number = 1;
    public _blue: number = 1;
    public _green: number = 1;
    public _fontTexture: _TextureInfo;

    constructor(klocki: _Klocki) {
        this._klocki = klocki;
        this._uiRenderer = klocki._uiRenderer;
        // this.vao = gl.createVertexArray()
        // gl.bindVertexArray(this.vao)
        this._guiScale = 2;
        this._scaleFactor = 1;
        this._unicodeFlag = false;
        this._atlas = 0;
        this._posX = 0;
        this._posY = 0;
        this._texOffsetX = 0;
        this._texOffsetY = 0;

        this._fontTexture = this._klocki._textureManager._loadTextureFromURL("assets/"+_Klocki._forbiddenWord+"/textures/font/ascii.png", (img: _GoImage) => this._readFontTexture(img), null, false);

        this._charWidth = new Uint8Array(1024);
        this._colorCode = new Uint32Array(32);
        this._makeCharIdMap();
        this._makeColorCode();

        this._reset();
    }
    public _reset() {

        this._posX = 1;
        this._posY = 1;
        this._randomStyle = false;
        this._boldStyle = false;
        this._strikethroughStyle = false;
        this._underlineStyle = false;
        this._italicStyle = false;
        this._cachedColor = 0xFFFFFFFF;
        this._alpha = 1;

        this._texOffsetX = this._fontTexture._tex._subRect._min._x / this._klocki._textureManager._atlasSize;
        this._texOffsetY = this._fontTexture._tex._subRect._min._y / this._klocki._textureManager._atlasSize;
        this._texScale = this._fontTexture._tex._subRect._dx() / this._klocki._textureManager._atlasSize;
    }

    public _makeColorCode() {
        for (let i = 0; i < 32; ++i) {
            const j = (i >> 3 & 1) * 85;
            let k = (i >> 2 & 1) * 170 + j;
            let l = (i >> 1 & 1) * 170 + j;
            let i1 = (i >> 0 & 1) * 170 + j;

            if (i === 6) {
                k += 85;
            }

            if (i >= 16) {
                k /= 4;
                l /= 4;
                i1 /= 4;
            }

            this._colorCode[i] = (k & 255) << 16 | (l & 255) << 8 | i1 & 255;
        }
    }

    public _makeCharIdMap(): Int16Array {
        let charIdOrder: string = "\u00c0\u00c1\u00c2\u00c8\u00ca\u00cb\u00cd\u00d3\u00d4\u00d5\u00da\u00df\u00e3\u00f5\u011f\u0130\u0131\u0152\u0153\u015e\u015f\u0174\u0175\u017e\u0207\u0000\u0000\u0000\u0000\u0000\u0000\u0000 !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u0000\u00c7\u00fc\u00e9\u00e2\u00e4\u00e0\u00e5\u00e7\u00ea\u00eb\u00e8\u00ef\u00ee\u00ec\u00c4\u00c5\u00c9\u00e6\u00c6\u00f4\u00f6\u00f2\u00fb\u00f9\u00ff\u00d6\u00dc\u00f8\u00a3\u00d8\u00d7\u0192\u00e1\u00ed\u00f3\u00fa\u00f1\u00d1\u00aa\u00ba\u00bf\u00ae\u00ac\u00bd\u00bc\u00a1\u00ab\u00bb\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255d\u255c\u255b\u2510\u2514\u2534\u252c\u251c\u2500\u253c\u255e\u255f\u255a\u2554\u2569\u2566\u2560\u2550\u256c\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256b\u256a\u2518\u250c\u2588\u2584\u258c\u2590\u2580\u03b1\u03b2\u0393\u03c0\u03a3\u03c3\u03bc\u03c4\u03a6\u0398\u03a9\u03b4\u221e\u2205\u2208\u2229\u2261\u00b1\u2265\u2264\u2320\u2321\u00f7\u2248\u00b0\u2219\u00b7\u221a\u207f\u00b2\u25a0\u0000";

        charIdOrder += "\u00c0\u00c1\u00c2\u00c3\u00c4\u00c5\u00c6\u00c7\u00c8\u00c9\u00ca\u00cb\u00cc\u00cd\u00ce\u00cf";
        charIdOrder += "\u00d0\u00d1\u00d2\u00d3\u00d4\u00d5\u00d6\u00d9\u00da\u00db\u00dc\u00dd\u00e0\u00e1\u00e2\u00e3";
        charIdOrder += "\u00e4\u00e5\u00e6\u00e7\u00ec\u00ed\u00ee\u00ef\u00f1\u00f2\u00f3\u00f4\u00f5\u00f6\u00f9\u00fa";
        charIdOrder += "\u00fb\u00fc\u00fd\u00ff\u0100\u0101\u0102\u0103\u0104\u0105\u0106\u0107\u0108\u0109\u010a\u010b";
        charIdOrder += "\u010c\u010d\u010e\u010f\u0110\u0111\u0112\u0113\u0114\u0115\u0116\u0117\u0118\u0119\u011a\u011b";
        charIdOrder += "\u011c\u011d\u1e20\u1e21\u011e\u011f\u0120\u0121\u0122\u0123\u0124\u0125\u0126\u0127\u0128\u0129";
        charIdOrder += "\u012a\u012b\u012c\u012d\u012e\u012f\u0130\u0131\u0134\u0135\u0136\u0137\u0139\u013a\u013b\u013c";
        charIdOrder += "\u013d\u013e\u013f\u0140\u0141\u0142\u0143\u0144\u0145\u0146\u0147\u0148\u014a\u014b\u014c\u014d";
        charIdOrder += "\u014e\u014f\u0150\u0151\u0152\u0153\u0154\u0155\u0156\u0157\u0158\u0159\u015a\u015b\u015c\u015d";
        charIdOrder += "\u015e\u015f\u0160\u0161\u0162\u0163\u0164\u0165\u0166\u0167\u0168\u0169\u016a\u016b\u016c\u016d";
        charIdOrder += "\u016e\u016f\u0170\u0171\u0172\u0173\u0174\u0175\u0176\u0177\u0178\u0179\u017a\u017b\u017c\u017d";
        charIdOrder += "\u017e\u01fc\u01fd\u01fe\u01ff\u0218\u0219\u021a\u021b\u0386\u0388\u0389\u038a\u038c\u038e\u038f";
        charIdOrder += "\u0390\u03aa\u03ab\u03ac\u03ad\u03ae\u03af\u03b0\u03ca\u03cb\u03cc\u03cd\u03ce\u0400\u0401\u0403";
        charIdOrder += "\u0407\u040c\u040d\u040e\u0419\u0439\u0450\u0451\u0452\u0453\u0457\u045b\u045c\u045d\u045e\u045f";
        charIdOrder += "\u0490\u0491\u1e02\u1e03\u1e0a\u1e0b\u1e1e\u1e1f\u1e22\u1e23\u1e30\u1e31\u1e40\u1e41\u1e56\u1e57";
        charIdOrder += "\u1e60\u1e61\u1e6a\u1e6b\u1e80\u1e81\u1e82\u1e83\u1e84\u1e85\u1ef2\u1ef3\u00e8\u00e9\u00ea\u00eb";
        // charIdOrder += "\u0149\u01e7\u01eb\u040f\u1e0d\u1e25\u1e5b\u1e6d\u1e92\u1eca\u1ecb\u1ecc\u1ecd\u1ee4\u1ee5\u2116"; // 17
        // charIdOrder += "\u0207\u0194\u0263\u0283\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000"; // 18

        this._charIdMap = new Int16Array(65536);
        this._charIdMap.fill(-1);

        for (let i: number = charIdOrder.length - 1; i > 0; i--) {
            this._charIdMap[charIdOrder.charCodeAt(i)] = i;
        }

        return this._charIdMap;
    }

    public _getCharId(c: number): number {
        return this._charIdMap[c];
    }
    public _addChar(c: number, italic: boolean) {
        if (c === 32) {
            return 4; // this.charWidth[c];
        } else {
            const charId = this._getCharId(c);

            return charId != -1 && !this._unicodeFlag ? this._addDefaultChar(charId, italic) : 4; // this.addUnicodeChar(c, italic);
        }
    }
    public _addDefaultChar(charId: number, italic: boolean) {
        charSize = 0;
        chari=0;
        charj=0;
        charWidth=0;
        charHeight=0;
        charOffsety = 0;

        atlasId = charId >> 8;
        // console.log(charId)
        if (atlasId === 0) {
            charSize = this._charWidth[charId];
            chari = (charId & 0x0F) * 8;
            charj = (charId >> 4) * 8;
            charWidth = 8 - 0.05;
            charHeight = 8 - 0.05;
        } else {
            charSize = 8; // this.charWidthAccented[c];
            chari = 128 + ((charId & 0x0F) * 9);
            charj = ((charId & 0xFF) >> 4) * 12;
            charWidth = 9 - 0.05;
            charHeight = 12 - 0.05;

            charOffsety = -3;

        }
        charSkew = italic ? 1 : 0;
        // let mx = 1.0 / (4 * 128.0)
        // let my = 1.0 / (4 * 128.0)


        color = this._cachedColor;
        /*
        void(chari)
        void(charj)
        void(charWidth)
        void(charHeight)

        void(charOffsety)
        void(charSkew)
        void(charScaleX)
        void(charScaleY)
        void(color)
        */
        this._pos(+ charSkew, charOffsety, 0)._tex(chari * charScaleX, charj * charScaleY)._color(color)._endVertex();
        this._pos(- charSkew, charHeight + charOffsety, 0)._tex(chari * charScaleX, (charj + charHeight) * charScaleY)._color(color)._endVertex();
        this._pos(+ charWidth - 1 + charSkew, charOffsety, 0)._tex((chari + charWidth - 1) * charScaleX, charj * charScaleY)._color(color)._endVertex();
        this._pos(+ charWidth - 1 - charSkew, charHeight + charOffsety, 0)._tex((chari + charWidth - 1) * charScaleX, (charj + charHeight) * charScaleY)._color(color)._endVertex();

        //uir._pos(+ k, offsety, 0)._tex(i * mx, j * my)._color(this._cachedColor)._endVertex();
        //uir._pos(+ width - 1 - k, height + offsety, 0)._tex((i + width - 1) * mx, (j + height) * my)._color(this._cachedColor)._endVertex();
        
        return charSize;
    }
    public _pos(x: number, y: number, z: number) {
        this._uiRenderer._pos((this._posX + x) * 2 * this._guiScale, (this._posY + y) * 2 * this._guiScale, z);

        return this;
    }
    public _tex(x: number, y: number) {
        this._uiRenderer._tex(this._texOffsetX + x * this._texScale, this._texOffsetY + y * this._texScale);

        return this;
    }
    public _color(color: number) {
        this._uiRenderer._color(color);

        return this;
    }
    public _endVertex() {
        this._uiRenderer._endVertex();
    }
    public _setColor(r: number, g: number, b: number, a: number): void {
        this._cachedColor = (a << 24) | (b << 16) | (g << 8) | r;
        // console.log("setColor", r,b,g,a, this.cachedColor)
    }

    public _renderStringAtPos(str: string, dropShadow: boolean) {
        for (let i = 0; i < str.length; i++) {
            const c = str.charCodeAt(i);

            if (c === 167 && i + 1 < str.length) {
                // console.log("color")
                const col = str.charAt(i + 1).toLowerCase().charCodeAt(0);

                const num = col >= 48 && col <= 57; // 0 9
                const af = col >= 97 && col <= 102;
                if (num || af) {
                    let i1 = col;
                    if (num) { i1 -= 48; } // 0
                    if (af) { i1 -= 97 - 10; } // 'a'-10

                    this._randomStyle = false;
                    this._boldStyle = false;
                    this._strikethroughStyle = false;
                    this._underlineStyle = false;
                    this._italicStyle = false;

                    if (i1 < 0 || i1 > 15) {
                        i1 = 15;
                    }

                    if (dropShadow) {
                        i1 += 16;
                    }

                    const j1 = this._colorCode[i1];
                    // this._textColor = j1
                    this._setColor(j1 >> 16, j1 >> 8 & 255, j1 & 255, (this._alpha * 255) & 255);
                } else if (col === 107) {// k
                    this._randomStyle = true;
                } else if (col === 108) {// l
                    this._boldStyle = true;
                } else if (col === 109) {// m
                    this._strikethroughStyle = true;
                } else if (col === 110) {// n
                    this._underlineStyle = true;
                } else if (col === 111) {// o
                    this._italicStyle = true;
                } else if (col === 114) {// r
                    this._randomStyle = false;
                    this._boldStyle = false;
                    this._strikethroughStyle = false;
                    this._underlineStyle = false;
                    this._italicStyle = false;
                    this._setColor(this._red * 255, this._blue * 255, this._green * 255, this._alpha * 255);

                }

                ++i;
            } else {
                const charId = this._getCharId(c);

                if (this._randomStyle && charId != -1) {
                    // let width = 0//this._getCharWidth(c)
                    /*char c1;
                    while (true)
                    {
                        charId = this.fontRandom.nextInt(charIdOrder.length());
                        c1 = charIdOrder.charAt(charId);
    
                        if (width === this.getCharWidth(c1))
                        {
                            break;
                        }
                    }*/
                    /*
                    if(charWidthMap[width] != null){
                        ArrayList<Integer> list = charWidthMap[width];
                        charId = (char) list.get(fontRandom.nextInt(list.size())).intValue();
                        let randomc = charIdOrder.charAt(charId);
                        if(getCharWidth(randomc) === width) c = randomc;
                    }
                    */
                }

                const f1 = this._unicodeFlag ? 0.5 : 1 / this._scaleFactor;
                const flag = (c === 0 || charId === -1 || this._unicodeFlag) && dropShadow;

                if (flag) {
                    this._posX -= f1;
                    this._posY -= f1;
                }
                // console.log("adding", c, this.posX, this.posY)
                let f = this._addChar(c, this._italicStyle);

                if (flag) {
                    this._posX += f1;
                    this._posY += f1;
                }

                if (this._boldStyle) {
                    this._posX += f1;

                    if (flag) {
                        this._posX -= f1;
                        this._posY -= f1;
                    }

                    this._addChar(c, this._italicStyle);
                    this._posX -= f1;

                    if (flag) {
                        this._posX += f1;
                        this._posY += f1;
                    }

                    f += f1;
                }
                // todo: strikethrough and underline

                this._posX += f;
            }
        }
    }

    public _renderString(text: string, x: number, y: number, color: number, dropShadow: boolean) {
        if (!text || text.length === 0) {
            return 0;
        } else {
            if ((color & -67108864) === 0) {
                color |= -16777216;
            }

            if (dropShadow) {
                color = (color & 16579836) >> 2 | color & -16777216;
            }

            this._red = (color >> 16 & 255) / 255;
            this._blue = (color >> 8 & 255) / 255;
            this._green = (color & 255) / 255;
            this._alpha = (color >> 24 & 255) / 255;
            // this.setColor(this.red * 255, this.blue * 255, this.green * 255, this.alpha * 255)
            this._cachedColor = color;
            this._posX = x;
            this._posY = y;
            this._scaleFactor = 1;

            this._renderStringAtPos(text, dropShadow);

            return Math.floor(this._posX);
        }
    }
    public _drawString(text: string, x: number, y: number, color: number, dropShadow: boolean) {
        // this.reset()
        let len;
        if (dropShadow) {
            len = this._renderString(text, x + 1, y + 1, color, true);
            len = Math.max(len, this._renderString(text, x, y, color, false));
        } else {
            len = this._renderString(text, x, y, color, false);
        }

        return len;
    }
    public _readFontTexture(img: _GoImage) {
        this._readDefaultFontTexture(img._subImage(new _GoRect(0, 0, img._rect._dx(), img._rect._dy())), 16, 16);
    }
    public _readDefaultFontTexture(img: _GoImage, gw: number, gh: number) {
        const sw = img._rect._dx() / gw;
        const sh = img._rect._dy() / gh;
        // console.logconsole.log(img)
        for (let i = 0; i <= 255; i++) {
            const cx = (i & 0xF) * sw;
            const cy = (i >> 4) * sh;
            this._readGlyph(i, img._subImage(new _GoRect(cx, cy, cx + sw, cy + sh)));
        }
    }
    public _readGlyph(charId: number, img: _GoImage) {
        let startx = 0;
        let endx = 0;
        let start = true;
        // console.log(charIdOrder[charId], img.rect.dx(), img)
        xloop:
        for (let x = img._rect._min._x; x < img._rect._max._x; x++) {
            for (let y = img._rect._min._y; y < img._rect._max._y; y++) {
                const offset = img._pixOffset(x, y);
                const a = img._pixels[offset + 3];
                if (start && a != 0) {
                    startx = x;
                    // console.log("startx", x, a, offset)
                    start = false;
                    continue xloop;
                } else if (!start && a != 0) {
                    continue xloop;
                }
            }
            if (!start) {
                endx = x;
                break;
            }
        }
        this._charWidth[charId] = endx - startx + 1;
    }
}
