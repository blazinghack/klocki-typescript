import { _ChatColor } from "./ChatColor";

export class _ChatUtils {
    public static _toPlainTextFromChat(chat: any): string {
        let v: string = "";
        const fut: any[] = [chat];
        while (fut.length > 0) {
            const j: any = fut.pop();
            if (typeof j === "string") {
                v += j;
            } else if (j instanceof Array) {
                j.forEach((element: any) => {
                    fut.unshift(element);
                });
            } else if (j instanceof Object) {
                if (j.text) {
                    v += <string> j.text;
                }
                if (j.extra) {
                    fut.unshift(j.extra);
                }
                
            }
        }

        return v;
    }
    public static _toLegacyTextFromChat(chat: any): string {
        let v: string = "";
        const fut: any[] = [chat];
        while (fut.length > 0) {
            const j: any = fut.pop();
            if (typeof j === "string") {
                v += j;
            } else if (j instanceof Array) {
                j.forEach((element: any) => {
                    fut.unshift(element);
                });
            } else if (j instanceof Object) {
                if (j.color) {
                    v += "\xa7" + _ChatColor._colorCodeByName(j.color);
                }
                if (j.text) {
                    v += <string> j.text;
                }
                if (j.extra) {
                    fut.unshift(j.extra);
                }
                if (j.translate) {
                    fut.unshift("trans:" + j.translate);
                }
                if (j.with) {
                    fut.unshift(j.with);
                }
                v += "\xa7r";
            }
        }

        return v;
    }
}
