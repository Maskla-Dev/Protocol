import AutomatonState from "./AutomatonState";

export interface TransitionMatrix<DataLanguage> {
    states: AutomatonState[];
    language: DataLanguage[];
    transition_table: string[][];
    final_states: AutomatonState[];
}

class DFAutomaton<DataLanguage>{
    #mTransitionMatrix: TransitionMatrix<DataLanguage>;
    #mCurrentState: AutomatonState;
    constructor(transition_matrix: TransitionMatrix<DataLanguage>) {
        if (DFAutomaton.#verifyTransitionMatrix(transition_matrix)) {
            this.#mTransitionMatrix = transition_matrix;
            this.#mCurrentState = transition_matrix.states[0];
        }
        else
            throw "Verify transition matrix";
    }
    async startAutomaton(input: DataLanguage[]): Promise<string> {
        let i = 0;
        let state_index: number | null = null;
        let symbol_index: number | null = null;
        let next_state_name: string = "";
        await this.#mCurrentState.triggerJob();
        while (input[i] != undefined) {
            symbol_index = this.findSymbolInLanguage(input[i]);
            if (symbol_index == -1)
                break;
            state_index = this.findStateIndex(this.#mCurrentState.name);
            next_state_name = this.#mTransitionMatrix.transition_table[state_index][symbol_index];
            if (next_state_name == "") {
                console.log(`no match state ${this.#mCurrentState.name} for ${input[i]} `)
                ++i;
                continue;
            }
            this.#mCurrentState = this.#mTransitionMatrix.states[this.findStateIndex(next_state_name)];
            await this.#mCurrentState.triggerJob();
            ++i;
        }
        return this.#mCurrentState.name;
    }
    isFinalState(state_name: string): boolean {
        return this.#mTransitionMatrix.final_states.some(state => state.name == state_name);
    }
    findSymbolInLanguage(symbol: DataLanguage) {
        return this.#mTransitionMatrix.language.findIndex(language_symbol => Object.is(language_symbol, symbol));
    }
    findStateIndex(state_name: string): number {
        return this.#mTransitionMatrix.states.findIndex(state => state.name == state_name);
    }
    static #verifyTransitionMatrix<D>(transition_matrix: TransitionMatrix<D>): boolean {
        return (
            transition_matrix.states.length == transition_matrix.transition_table.length &&
            transition_matrix.transition_table.every(column => column.length == transition_matrix.language.length)
        );
    }
}

export default DFAutomaton;