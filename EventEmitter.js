class EventEmitter {
    events = {};
    static #instance = undefined;

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new EventEmitter();
        }
        return this.#instance;
    }

    on(eventName, callback) {
        if (eventName in this.events) {
            this.events[eventName].push(callback);
        } else {
            this.events[eventName] = [callback];
        }
    }

    emit(eventName, data=undefined) {
        if (eventName in this.events) {
            this.events[eventName].forEach(callback => {
                callback(data);
            });
        }
    }
};