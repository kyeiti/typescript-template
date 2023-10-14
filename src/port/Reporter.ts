import {PORTS} from "/cc/config";
import {NS} from "@ns";
import {CommandResult} from "/cc/types";
import {PortWriter} from "/port/PortWriter";

export class Reporter extends PortWriter<CommandResult>{
    constructor(ns: NS, portToSendTo = PORTS.COMMANDER_RECEIVE) {
        super(ns, portToSendTo);
    }
}