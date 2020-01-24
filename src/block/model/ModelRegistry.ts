import { _Block } from "../Block";
import { _Klocki } from "../../client/Klocki";

import { _BlockModel } from "./Model";

export class _ModelRegistry {
    public _nameModelMap: Map<string, _BlockModel>;
    public _namePromiseMap: Map<string, Promise<any>>;
    public _klocki: _Klocki;

    constructor(klocki: _Klocki) {
        this._klocki = klocki;
        this._nameModelMap = new Map();
        this._namePromiseMap = new Map();
    }
    public _fetchModel(name: string): Promise<any> {
        const guiChat = this._klocki._guiChat;
        if (guiChat) {
            guiChat._appendMessage({ text: "Loading model " + name });
        }

        return fetch("assets/"+_Klocki._forbiddenWord+"/models/" + name + ".json")
            .then(function (response) {
                if (response.status !== 200) {
                    return null;
                }

                return response.json();
            });
            
    }
    public _loadModel(name: string): Promise<any> {
        let promise = this._namePromiseMap.get(name);
        if (promise) {
            return promise;
        }
        promise = new Promise((resolve, reject) => {
            this._fetchModel(name).then((mjson) => {
                if (mjson === null) {
                    resolve(null);
                } else {
                    const loaded = _BlockModel._load(mjson);
                    if (loaded._parent != "") {
                        this._getModel(loaded._parent).then((parentModel: _BlockModel) => {
                            loaded._init(parentModel);
                            resolve(loaded);
                            
                        });
                    }
                }
            });
        });
        
        this._namePromiseMap.set(name, promise);

        return promise;
    }
    public _getModel(name: string): Promise<_BlockModel> {
        const model = this._nameModelMap.get(name);
        if (!model) {
            return this._loadModel(name);
        }

        return Promise.resolve(model);
    }
}
