import {Script} from "/cc/Script";
import {Action} from "/cc/types";

export const actionScripts: {[key in Action]: Script} = {
    hack: new Script('single_hack.js', ['target', 'host', 'threads']),
    weaken: new Script('single_weaken.js', ['target', 'host', 'threads']),
    grow: new Script('single_grow.js', ['target', 'host', 'threads']),
    share: new Script('support_faction.js', []),
}
