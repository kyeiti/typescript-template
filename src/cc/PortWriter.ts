import {NetscriptPort, NS} from "@ns";

export abstract class PortWriter<Sending> {
    protected readonly portToWriteTo: NetscriptPort

    protected constructor(protected ns: NS,
                          private readonly portNumber: number
                          ) {
    this.portToWriteTo = ns.getPortHandle(portNumber)
    }

    tell(data: Sending) {
        this.portToWriteTo.write(JSON.stringify(data));
    }
}