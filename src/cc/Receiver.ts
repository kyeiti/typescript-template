import {Command, CommandResult, PORTS} from "/cc/config";
import {NS} from "@ns";
import {PortListener} from "/cc/PortListener";

export class Receiver extends PortListener<CommandResult, Command>{
    constructor(ns: NS, readonly server: string) {
        super(ns, ns.getPortHandle(PORTS.COMMANDER_RECEIVE), ns.getPortHandle(PORTS.COMMANDER_SEND));
    }

    protected read() {
        const currentPortValue = this.portToReadFrom.peek();
        if (typeof currentPortValue === "number") {
            return null;
        }
        const command = <Command>JSON.parse(currentPortValue);
        if (command.receiver === this.server) {
            this.portToReadFrom.read();
            return command;
        }
        return null;
    }
}