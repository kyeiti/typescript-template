import {PORTS} from "/cc/config";
import {NS} from "@ns";
import {PortListener} from "/port/PortListener";
import {CommandResult} from "/cc/types";


export class Listener extends PortListener<CommandResult>{

    constructor(ns: NS, receivingPort = PORTS.COMMANDER_RECEIVE) {
        super(ns, receivingPort);
    }


    protected read(): CommandResult | null {
        const currentPortValue = this.portToReadFrom.read()
        if(!this.isValidPortData(currentPortValue)) {
            return null;
        }
        const value = currentPortValue as string;
        return <CommandResult>JSON.parse(value);
    }
}