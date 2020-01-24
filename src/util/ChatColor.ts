export class _ChatColor {
    public static readonly _COLOR_CHAR: string = '\u00A7';
    public static readonly _STRIP_COLOR_PATTERN: RegExp = /\u00A7[0-9A-FK-OR]/gi;
    public static _colorCodes: { [key: string]: string } = {
        black: '0',
        dark_blue: '1',
        dark_green: '2',
        dark_aqua: '3',
        dark_red: '4',
        dark_purple: '5',
        gold: '6',
        gray: '7',
        dark_gray: '8',
        blue: '9',
        green: 'a',
        aqua: 'b',
        red: 'c',
        light_purple: 'd',
        yellow: 'e',
        white: 'f',
    };


    public static _stripColor(input: string): string {
        return input.replace(_ChatColor._STRIP_COLOR_PATTERN, "");
    }
    public static _colorCodeByName(name: string): string {
        if (_ChatColor._colorCodes.hasOwnProperty(name)) {
            return _ChatColor._colorCodes[name];
        }

        return 'r';
    }
    

}
