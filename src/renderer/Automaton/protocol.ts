import DFAutomaton, { TransitionMatrix } from "./DFAutomaton"
import AutomatonState from "./AutomatonState"
import fs from "node:fs";

let animation_speed: number | undefined = 1000;
const file_path: string = "./app/files";
let protocol_steps: number = 1;
const word_length: number = 64;
const n_items = 1000;
const to_print = 100;
function sleep(miliseconds: number) {
    return new Promise((r) => setTimeout(r, miliseconds));
}

export function createProtocolAutomata() {
    const states: AutomatonState[] = [
        new AutomatonState("ready", async () => {
            if (animation_speed) {
                changeCircleState("ready", "afd");
                await sleep(animation_speed)
            }
            console.log("ready state reached");
            generateBitstringsChunk(n_items);
        }),
        new AutomatonState("sending", async () => {
            if (animation_speed) {
                changeCircleState("sending", "ready");
                await sleep(animation_speed)
            }
            console.log("sending state reached");
            console.log("waiting 1 second for response");
            await sleep(1000);
            console.log("response received");
        }),
        new AutomatonState("afd", async () => {
            if (animation_speed) {
                changeCircleState("afd", "sending");
                await sleep(animation_speed)
            }
            const tMatrix: TransitionMatrix<string> = {
                states: [
                    new AutomatonState("q0", async () => {
                        if (animation_speed) {
                            changeCircleState("q0", "q3");
                            changeCircleState("q0", "q1");
                            await sleep(animation_speed);
                        }
                    }),
                    new AutomatonState("q1", async () => {
                        if (animation_speed) {
                            changeCircleState("q1", "q0");
                            changeCircleState("q1", "q2");
                            await sleep(animation_speed);
                        }
                    }),
                    new AutomatonState("q2", async () => {
                        if (animation_speed) {
                            changeCircleState("q2", "q1");
                            changeCircleState("q2", "q3");
                            await sleep(animation_speed);
                        }
                    }),
                    new AutomatonState("q3", async () => {
                        if (animation_speed) {
                            changeCircleState("q3", "q0");
                            changeCircleState("q3", "q2");
                            await sleep(animation_speed);
                        }
                    }),
                ],
                language: ["0", "1"],
                transition_table: [
                    ["q1", "q3"],
                    ["q0", "q2"],
                    ["q3", "q1"],
                    ["q2", "q0"]
                ],
                final_states: [states[0]]
            }
            let automaton_bitparity: DFAutomaton<string> = new DFAutomaton(tMatrix);
            let file = fs.openSync(file_path + "/bitstrings", fs.constants.O_RDONLY);
            let buffer = Buffer.alloc(word_length);
            let result: string;
            for (let i = 0; i < n_items; ++i) {
                let pos = (n_items * (protocol_steps - 1)) + (i * word_length);
                fs.readSync(file, buffer, {
                    position: pos
                })
                result = await automaton_bitparity.startAutomaton(buffer.toString("utf8").split(""));
                if ((i % to_print) == 0)
                    console.log(`Automaton bitstring progress ${(i / n_items * 100).toFixed(2)}%`);
                if (automaton_bitparity.isFinalState(result)) {
                    fs.appendFileSync(file_path + "/success", buffer.toString("utf8"));
                }
                else {
                    fs.appendFileSync(file_path + "/rejected", buffer.toString("utf8"));
                }
            }
            ++protocol_steps;
        })
    ];
    const language: string[] = ["continue", "stop"];
    /**
     * Transition table for protocol automata
     *          continue    stop
     * ready    sending     null
     * sending  afd         null
     * afd      ready       null
     */
    const table: string[][] = [
        [states[1].name, ""],
        [states[2].name, ""],
        [states[0].name, ""]
    ]
    const transition_matrix: TransitionMatrix<string> = {
        language: language,
        states: states,
        transition_table: table,
        final_states: [states[0]]
    }
    return new DFAutomaton(transition_matrix);
}

export function openFiles() {
    guaranteeDir(file_path);
    fs.writeFileSync(file_path + "/bitstrings", "");
    fs.writeFileSync(file_path + "/success", "");
    fs.writeFileSync(file_path + "/rejected", "");
}

function generateBitstringsChunk(size: number) {
    guaranteeDir(file_path);
    for (let i = 0; i < size; ++i) {
        if ((i % to_print) == 0)
            console.log(`Making bitstrings chunks ${((i / size) * 100).toFixed(2)}%`);
        fs.appendFileSync(file_path + "/bitstrings", generateRandomBitstring(word_length));
    }
}

function generateRandomBitstring(size: number) {
    let bitstring: string = "";
    for (let i = 0; i < size; ++i) {
        bitstring += isOn() ? "1" : "0";
    }
    return bitstring;
}

export function initProtocolInput(): string[] {
    let input: string[] = [];
    do {
        for (let i = 0; i < 3; ++i)
            input.push("continue");
    } while (isOn());
    return input;
}

function isOn(): boolean {
    let seed = getRandomIntInclusive(0, 1000);
    return ((seed >= 150) && (seed <= 800));
}

function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function turnOnCircle(circle: SVGCircleElement) {
    circle.style.fill = "#009933";
}

function turnOffCircle(circle: SVGCircleElement) {
    circle.style.fill = "rgb(235,235,235)";
}

function changeCircleState(toOn: string, toOff: string) {
    turnOnCircle(document.getElementsByClassName(toOn)[0].getElementsByTagName("circle")[0]);
    turnOffCircle(document.getElementsByClassName(toOff)[0].getElementsByTagName("circle")[0]);
}

export function changeAnimationSpeed(speed: number | undefined) {
    animation_speed = speed;
}

function guaranteeDir(path_name: string) {
    if (!fs.existsSync(path_name))
        fs.mkdirSync(path_name, { recursive: true });
}