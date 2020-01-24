export class _ChatAllowedCharacters {

    public static readonly _allowedCharactersArray: string[] = ['/', '\n', '\r', '\t', '\u0000', '\f', '`', '?', '*', '\\', '<', '>', '|', '\"', ':'];

    public static _isAllowedCharacter(character: number): boolean {
        return character !== 167 && character >= 32 && character !== 127;
    }

    public static _filterAllowedCharacters(input: string): string {
        let v: string = "";
        for (let i: number = 0; i < input.length; i++) {
            if (this._isAllowedCharacter(input.charCodeAt(i))) {
                v += input[i];
            }
        }

        return v;
    }
}
