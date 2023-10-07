import {NS} from "@ns";
import {Receiver} from "/cc/Receiver";
import {Command} from "/cc/config";

export async function main(ns: NS) {
    const receiver = new Receiver(ns, ns.getHostname());
    listen(ns, receiver);
}

function listen(ns: NS, receiver: Receiver) {
    receiver.listen().then((c) => act(ns, receiver, c))
}

function act(ns: NS, receiver: Receiver, command: Command) {
    switch(command.action) {
        case "weaken":
            ns.weaken(command.target).then((reduction) => {
                listen(ns, receiver)
                receiver.tell({
                    action: "weaken",
                    target: command.target,
                    host: receiver.server,
                    weakenedByAbs: reduction
                })
            });
            break;
        case "grow":
            ns.grow(command.target).then((growth) => {
                listen(ns, receiver)
                receiver.tell({
                    action: "grow",
                    target: command.target,
                    host: receiver.server,
                    grownByPct: growth
                })
            });
            break;
        case "hack":
            ns.hack(command.target).then((money) => {
                listen(ns, receiver)
                receiver.tell({
                    action: "hack",
                    target: command.target,
                    host: receiver.server,
                    hackedForAbs: money
                })
            });
            break;
    }

}