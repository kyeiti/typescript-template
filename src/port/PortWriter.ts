import {NetscriptPort, NS} from "@ns";

export class PortWriter<Sending> {
    protected readonly portToWriteTo: NetscriptPort

    constructor(protected ns: NS,
                          readonly portNumber: number
                          ) {
    this.portToWriteTo = ns.getPortHandle(portNumber)
    }

    hasData() {
        return this.portToWriteTo.peek() === "NULL PORT DATA"
    }

    tell(data: Sending) {
        this.portToWriteTo.write(JSON.stringify(data));
    }
}