let PAPER_ADD_EMIT_EVENT = 'paperAdded';
let PAPER_DEL_EMIT_EVENT = 'paperDeleted';
let PAPER_OPEN_EMIT_EVENT = 'paperOpened';
let PAPER_FETCH_ALL_EMIT_EVENT = 'paperFetchALl';
let DB_FETCH_ALL_EMIT_EVENT = 'dbFetchALl';
let DB_NAME = 'R-Papers-DB';
let DB_OPEN_CONNECTION_EMIT_EVENT = 'dbOpen';
let DB_ADD_DATA_EMIT_EVENT = 'dbAdd';
let DB_DEL_DATA_EMIT_EVENT = 'dbDel';

class Library {
    #paperList = [];
    #eventEmitter;
    static #instance = undefined;

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new Library();
        }
        return this.#instance;
    }

    constructor() {
        this.#eventEmitter = EventEmitter.getInstance();

        this.#eventEmitter.on(DB_FETCH_ALL_EMIT_EVENT, (data) => {
            this.#paperList = data;
            // console.log(`Data: ${data}`);
        });

        this.#eventEmitter.emit(PAPER_FETCH_ALL_EMIT_EVENT);

        console.log("Paper List Fetched");
    };

    addPaper(paper) {
        this.#paperList.push(paper);
        this.#eventEmitter.emit(PAPER_ADD_EMIT_EVENT, paper);
    };

    deletePaper(index) {
        this.#paperList.splice(index, 1);
        this.#eventEmitter.emit(PAPER_DEL_EMIT_EVENT);
    };

    openPaper(index) {
        let paper = this.#paperList[index].file;
        let pdfBlob = new Blob([paper], { type: 'application/pdf' });
        let pdfURL = URL.createObjectURL(pdfBlob);
        const pdfWindow = window.open(pdfURL, '_blank')

        this.#eventEmitter.emit(PAPER_OPEN_EMIT_EVENT);
    };

    set paperList(list) { this.#paperList = list; };

    get paperList() { return this.#paperList; };
}

class Paper {
    #paperName;
    #progress;
    #id;

    constructor(file_name, id, progress = 0) {
        this.#paperName = file_name;
        this.#progress = progress;
        this.#id = id;
    }

    get paperName() {
        return this.#paperName;
    }

    get progress() {
        return this.#progress;
    }

    set paperName(name) {
        this.#paperName = name;
    }

    set progress(progres) {
        this.#progress = progress;
    }

    get id() {
        return this.#id;
    }
}