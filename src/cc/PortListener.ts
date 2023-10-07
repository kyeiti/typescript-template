import {waitTime} from "/cc/config";
import {NetscriptPort, NS, PortData} from "@ns";

export abstract class PortListener<Sending, Receiving> {

    protected constructor(protected ns: NS,
                          protected readonly portToWriteTo: NetscriptPort,
                          protected readonly portToReadFrom: NetscriptPort,) {
    }

    tell(data: Sending) {
        this.portToWriteTo.write(JSON.stringify(data));
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