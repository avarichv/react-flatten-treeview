export default class StateKeyFrame {
    constructor(target) {
         this.target = target;
         this.frameQueue = [];
    }

    reset() {
        this.frameQueue = [];
        return this;
    }

    set(action) {
        this.frameQueue.unshift(action);
        return this;
    }

    play(state) {
        const next = this.frameQueue && this.frameQueue.pop();
        if(state) {
            this.target.setState(state);
        }
        if(next && typeof next === 'function') {
            next(this);
        }
        return this;
    }
}