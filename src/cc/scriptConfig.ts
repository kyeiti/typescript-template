import {Script} from "/cc/Script";
import {Action} from "/cc/types";

export const actionScripts: {[key in Action]: Script} = {
    hack: new Script('controlled/single_hack.js', ['target', 'host', 'threads']),
    weaken: new Script('controlled/single_weaken.js', ['target', 'host', 'threads']),
    grow: new Script('controlled/single_grow.js', ['target', 'host', 'threads']),
    share: new Script('controlled/support_faction.js', []),
}
