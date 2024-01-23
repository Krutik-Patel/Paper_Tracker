// class DB {
//     #db;
//     #name;
//     constructor(name) {
//         this.#name = name;
//         this.#db = indexedDB.open(name, 1);
//         this.#db.onupgradeneeded = (event) => {
//             const db = event.target.result;
//             const objectStore = db.createObjectStore('papers', { keypath: 'id', autoIncrement: true });
//             objectStore.createIndex('file_name', 'file_name', { unique: true });
            
//         }
// }

class Paper {
    #file;
    #progress;
    constructor(file, progress = 0) {
        this.#file = file;
        this.#progress = progress;
    };

    set progress(progress) {
        this.#progress = progress;
    }

    get file() {
        return this.#file;
    }

    get progress() {
        return this.#progress;
    }
    set file(file) {
        this.#file = file;
    }

    list_it() {
        return this.#file.name;
    }

    #pdfToBase64Converter(pdf) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const pdfBase64 = event.target.result;
            return pdfBase64;
        }
        reader.readAsDataURL(pdf);
    }

    toJSON() {
        return {
            file: this.#pdfToBase64Converter(this.#file),
            progress: this.#progress
        };  
    }

    static fromJSON(json) {
        const paper = new Paper(json.file, json.progress);
        return paper;
    }
}

class Styler {

    static style_list_tags(index, text, progress) {
        let output = "";
        output += `<li>${text}</li> <input type='text' id='paper-progress-bar-${index}' value='${progress}'></input>`;
        output += `<button id='paper-open-btn-${index}'>Open Paper</button>`;
        output += `<button id='paper-delete-btn-${index}'>Delete Paper</button>`;
        return output;
    }
    
    static style_open_tag(index) {
        document.getElementById(`paper-open-btn-${index}`).addEventListener("click", () => {
            open_paper(index);
            console.log("paper opened");
        });
    }

    static style_progress_bar(index) {
        document.getElementById(`paper-progress-bar-${index}`).addEventListener("change", () => {
            paper_list[index].progress = document.getElementById(`paper-progress-bar-${index}`).value;
            console.log(paper_list[index].progress);
        });
    }

    static style_delete_btn(index) {
        document.getElementById(`paper-delete-btn-${index}`).addEventListener("click", () => {
            delete_paper(index);
        });
    }
}

function saveListToLocalStorage(paper_list) {
    const serializedList = JSON.stringify(paper_list.map(paper => paper.toJSON()));  
    localStorage.setItem('paper_list', serializedList);
}

function getListFromLocalStorage() {
    const serializedList = localStorage.getItem('paper_list');
    return serializedList ? JSON.parse(serializedList).map(item => Paper.fromJSON(item)) : [];
}

function open_paper(index) {
    const file = paper_list[index].file;
    const pdfBlob = new Blob([file], { type: 'application/pdf' });
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);

    console.log("Opening Paper");

    const pdfWindow = window.open(pdfBlobUrl, '_blank');
};

function delete_paper(index) {
    paper_list.splice(index, 1);
    list_papers();
    saveListToLocalStorage(paper_list);
    console.log("paper deleted")
}

function add_paper() {
    paper_list.push(new Paper(document.getElementById("file-input").files[0]));
    list_papers();
    console.log(paper_list);
    saveListToLocalStorage(paper_list);
}


    
function list_papers() {
    output.innerHTML = "";
    for (let i = 0; i < paper_list.length; i++) {
        output.innerHTML += Styler.style_list_tags(i, paper_list[i].list_it(), paper_list[i].progress);
    }

    for (let i = 0; i < paper_list.length; i++) {
        Styler.style_open_tag(i);
        Styler.style_progress_bar(i);
        Styler.style_delete_btn(i);
    }
    console.log("papers listed");
};

let paper_list = getListFromLocalStorage();
add_btn = document.getElementById("file-input");
output = document.getElementById("paper-list-ul");


document.addEventListener('DOMContentLoaded', list_papers());


add_btn.addEventListener("change", () => {
    add_paper();
    console.log("paper added");
});


