import { _Klocki } from './client/Klocki';
declare global {
    interface Window { klocki: _Klocki; }
}

window.klocki = window.klocki || {};
window.addEventListener("load", (ev: Event) => (window.klocki = new _Klocki()));

document.addEventListener("mouseup",  (e) => {
    e.preventDefault(); // disable mouse back and forward buttons
});
document.addEventListener("keydown",  (e) => {
    //console.log("key "+e.key)
    if (e.ctrlKey || e.key === "F3" || e.key === "F5" || e.key === "F8" || e.key == "Tab" || e.key == "Control" || e.key == "Shift") {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    return undefined;
});
