import {PORTS} from "/cc/config";
import {NS} from "@ns";
import {CommandResult} from "/cc/types";
import {PortWriter} from "/cc/PortWriter";

export class Reporter extends PortWriter<CommandResult>{
    constructor(ns: NS, readonly server: string, portToSendTo = PORTS.COMMANDER_RECEIVE) {
        super(ns, portToSendTo);
    }
}