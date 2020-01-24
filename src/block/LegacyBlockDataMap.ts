import { _Block } from "./Block";

export class _LegacyBlockDataMap {
    public _byData: _Block[] = [];
    public _names: string[] = [];
    public _opaque: boolean = false;
    
    public _fillAll(name: string, blockTypeInstance: _Block): void {
        for (let i: number = 0; i < 16; i++) {
            this._byData[i] = blockTypeInstance;
            this._names[i] = name;
        }
    }
}
