import { _Block } from "../block/Block";

import { _Item } from "./Item";

export class _ItemBlock extends _Item {

}

export class _ItemMultiTexture extends _ItemBlock {
    constructor(b1: _Block, b2: _Block) {
        super();
    }
}
export class _ItemColored extends _ItemBlock {
    constructor(b1: _Block, a: boolean) {
        super();

    }
}
