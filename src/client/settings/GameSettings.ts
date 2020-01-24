export class _GameSettings {
    public mouseSensitivity: number = 0.5;
    public invertMouse: boolean = false;
    public renderDistanceChunks: number = 8;
    public viewBobbing: boolean = true;
    public anaglyph: boolean = false;
    public fboEnable: boolean = true;

    public _loadOptions(): void {
        const settings: string | null = localStorage.getItem("game-settings");
        if (settings) {
            Object.assign(this, settings);
        } else {
            console.log("Settings not found");
        }
    }

    public _saveOptions(): void {
        localStorage.setItem("game-settings", JSON.stringify(this));
    }
}
