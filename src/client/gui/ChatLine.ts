import { _ChatUtils } from "../../util/ChatUtils";

export class _ChatLine {
    public _formattedText: string;
    public _jsonChat: any;

    constructor(jsonChat: any) {
        this._jsonChat = jsonChat;
        this._formattedText = _ChatUtils._toLegacyTextFromChat(jsonChat);
        // console.log("formatted:", this._formattedText);
    }
}
