import svg_graph from "./svg_graph";

class Graph {
    #mContainer: HTMLDivElement;
    constructor() {
        this.#mContainer = document.createElement("div");
        this.#mContainer.id = "graph";
        this.#mContainer.innerHTML = svg_graph;
    }
    get domElement(): HTMLDivElement {
        return this.#mContainer;
    }
}

export default Graph;