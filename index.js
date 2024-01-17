class Paper {
    constructor(file) {
        this.file = file;
        this.progress = 0;
    }
}

function saveListToLocalStorage(paper_list) {
    const serializedList = JSON.stringify(paper_list);
    localStorage.setItem('paper_list', serializedList);
}

function getListFromLocalStorage() {
    const serializedList = localStorage.getItem('paper_list');
    return serializedList ? JSON.parse(serializedList) : [];
}

function delete_paper(index) {
    paper_list.splice(index, 1);
    list_papers();
    saveListToLocalStorage(paper_list);
    console.log("paper deleted")
}

function list_papers() {
    output.innerHTML = "";
    for (let i = 0; i < paper_list.length; i++) {
        output.innerHTML += `<li>${paper_list[i].file}</li> <input type='text' id='paper-progress-bar-${i}' value='${paper_list[i].progress}'></input>`;
        output.innerHTML += `<button id='paper-delete-btn-${i}'>Delete Paper</button>`;
    }

    for (let i = 0; i < paper_list.length; i++) {
        document.getElementById(`paper-progress-bar-${i}`).addEventListener("change", () => {
            paper_list[i].progress = document.getElementById(`paper-progress-bar-${i}`).value;
            console.log(paper_list[i].progress);
        });
        document.getElementById(`paper-delete-btn-${i}`).addEventListener("click", () => {
            delete_paper(i);
        });
    }
    console.log("papers listed");
};


let paper_list = getListFromLocalStorage();

add_btn = document.getElementById("add-btn");
output = document.getElementById("paper-list-ul");


add_btn.addEventListener("click", () => {
    paper_list.push(new Paper(document.getElementById("file-input").value));
    list_papers();
    console.log(paper_list);
    saveListToLocalStorage(paper_list);
});


