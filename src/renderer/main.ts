import Graph from "./resources/graph";
import { initProtocolInput, createProtocolAutomata, changeAnimationSpeed, openFiles } from "./Automaton/protocol"

async function main() {
    let root = document.createElement("div");
    let speedmeter = createSlider();
    changeAnimationSpeed(Number(speedmeter.value) > 0 ? Number(speedmeter.value) : undefined);
    root.id = "root";
    let graph = new Graph();
    document.body.appendChild(root);
    root.appendChild(speedmeter);
    root.style.width = "800px";
    root.style.height = "600px";
    root.appendChild(graph.domElement);
    openFiles();
    let automaton = createProtocolAutomata();
    let protocol_input = initProtocolInput();
    console.log(protocol_input);
    let automaton_result = await automaton.startAutomaton(protocol_input);
    console.log(automaton_result);
}

function createSlider() {
    let slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "2000";
    slider.step = "1";
    slider.value = "1000";
    slider.oninput = () => {
        let speed = Number(slider.value);
        console.log(speed);
        changeAnimationSpeed(speed > 0 ? speed : undefined);
    }
    return slider;
}

export default main;