import { _ChunkSection } from "./ChunkSection";
import { _OriginRenderOcTree } from "./OriginRenderOcTree";


// Section Watcher watches the watched chunk section to be watched and watches it to the other end of watch listener though it could be implemented as simple pointer but who cares, have a nice day
export class _SectionWatcher {

    public _section: _ChunkSection | null;
    public _refCount: number;
    public _watcher: _OriginRenderOcTree | null;

    constructor() {
        this._section = null;
        this._refCount = 0;
        this._watcher = null;
    }

    public _setSection(section: _ChunkSection | null) {
        this._section = section;
        this._notify();
    }
    public _retain(num?: number) {
        if (num) {
            this._refCount += num;
        } else {
            this._refCount++;
        }
    }
    public _addWatcher(w: _OriginRenderOcTree) {
        this._watcher = w;
    }
    public _notify() {
        /*
        const watchers = this._watchers;
        for (let i = 0; i < watchers.length; i++) {
            watchers[i]._notify();
        }
        */
        if (this._watcher !== null) {
            this._watcher._notify();
        }
    }

}
