export type AutomatonActivity = () => Promise<void>;

class AutomatonState {
    #mName: string = "";
    #mActivity: AutomatonActivity | undefined;
    constructor(name: string, activity?: AutomatonActivity) {
        this.#mName = name;
        this.#mActivity = activity;
    }
    async triggerJob(): Promise<void> {
        if (this.#mActivity)
            return this.#mActivity();
    }
    get name() {
        return this.#mName;
    }
}

export default AutomatonState;