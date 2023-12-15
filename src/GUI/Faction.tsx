import {FactionName} from "/util/Factions/Faction";

export function Faction({name}: { name: FactionName },) {
    const className = name.replace(" ", "_");
    const onHover = () => {
        // const collection = document.getElementsByClassName(className);
        // for (const element of collection) {
        //     element.setAttribute('style', 'background-color: navy');
        // }
    }
    const onMouseOut = () => {
        // const collection = document.getElementsByClassName(className);
        // for (const element of collection) {
        //     element.setAttribute('style', '');
        // }
    }

    return <div
        onMouseEnter={onHover}
        onMouseOut={onMouseOut}
        className={"faction " + className}>
        {name}
    </div>
}