import {Command, CommandResult, PORTS} from "/cc/config";
import {NS} from "@ns";
import {PortListener} from "/cc/PortListener";


export class Commander extends PortListener<Command, CommandResult>{

    constructor(ns: NS) {
        super(ns, ns.getPortHandle(PORTS.COMMANDER_SEND), ns.getPortHandle(PORTS.COMMANDER_RECEIVE));
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