import {waitTime} from "/cc/config";
import {NetscriptPort, NS, PortData} from "@ns";

export abstract class PortListener<Receiving> {
    protected readonly portToReadFrom: NetscriptPort;

    protected constructor(protected ns: NS,
                          private readonly portNumber: number,) {
        this.portToReadFrom = this.ns.getPortHandle(portNumber);
    }

    async listen() {
        let received = this.read();
        while (received === null) {
            await this.ns.sleep(waitTime).then(
                () => received = this.read()
            )
        }
        return received;
    }

    protected abstract read(): Receiving | null;

    protected isValidPortData(data: PortData) {
        return !(data === "NULL PORT DATA" || typeof data === "number")
    }
}