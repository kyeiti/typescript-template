import {Script} from "/cc/Script";
import {Action} from "/cc/types";

export const actionScripts: {[key in Action]: Script} = {
    hack: new Script('controlled/single_hack.js', ['port/Reporter.js', 'cc/config.js', 'port/PortWriter.js'], ['target', 'host', 'threads']),
    weaken: new Script('controlled/single_weaken.js', ['port/Reporter.js', 'cc/config.js', 'port/PortWriter.js'], ['target', 'host', 'threads']),
    grow: new Script('controlled/single_grow.js', ['port/Reporter.js', 'cc/config.js', 'port/PortWriter.js'], ['target', 'host', 'threads']),
    share: new Script('controlled/support_faction.js', ['port/Reporter.js', 'cc/config.js', 'port/PortWriter.js'], []),
}
