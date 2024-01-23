class DataBase {
    #dbName;
    #storeName;
    #db;
    #eventEmitter;

    constructor(dbName, storeName = 'papers') {
        this.#dbName = dbName;
        this.#storeName = storeName;
        this.#db = null;
        this.#eventEmitter = EventEmitter.getInstance();

        this.#eventEmitter.on(PAPER_FETCH_ALL_EMIT_EVENT, (data) => { this.getAllData(); });
        this.#eventEmitter.on(PAPER_ADD_EMIT_EVENT, (data) => { this.addData(data); });
        this.#eventEmitter.on(PAPER_DEL_EMIT_EVENT, (data) => { this.deleteData(data); });
    };

    openConnection() {
        return new Promise((resolve, reject) => {
            const dbRequest = indexedDB.open(this.#dbName, 1);
            
            dbRequest.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.#storeName)) {
                    db.createObjectStore(this.#storeName, { keyPath: 'id', autoIncrement: true });
                }
            };
            
            dbRequest.onsuccess = (event) => {
                // console.log(`In open connection ${event.target.result}`);
                console.log('Database opened');
                this.#db = event.target.result;
                resolve(this.#db);
            };

            dbRequest.onerror = (event) => {
                reject(`Failed to open database ${event.target.error}`);
            }
        });
    };

    closeConnection() {
        if (this.#db) {
            this.#db.close();
            this.#db = null;
            console.log('Database Closed');
        }
    };

    addData(data) {
        this.openConnection().then((db) => {
            this.#db = db;
            const transaction = this.#db.transaction(this.#storeName, 'readwrite');
            const store = transaction.objectStore(this.#storeName);
            const request = store.add(data);

            request.onsuccess = (event) => {
                this.#eventEmitter.emit(DB_ADD_DATA_EMIT_EVENT, event.target.result);
                console.log("Entry Added to Database");
            };

            request.onerror = (event) => {
                reject(`Failed to add data: ${event.target.error}`);
            };

            this.closeConnection();

        }).catch((error) => {
            console.log(`Error:${error}`);
        });


    };

    deleteData(id) {
        this.openConnection().then((db) => {
            this.#db = db;
            const transaction = this.#db.transaction(this.#storeName, 'readwrite');
            const store = transaction.objectStore(this.#storeName);
            const request = store.delete(id);

            request.onsuccess = (event) => {
                this.#eventEmitter.emit(DB_DEL_DATA_EMIT_EVENT, event.target.result);
            };

            request.onerror = (event) => {
                reject(`Failed to delete data: ${event.target.result}`);
            };

            this.closeConnection();

        }).catch((error) => {
            console.log(`Error:${error}`);
        });
    };

    clearAll() {
        this.openConnection().then((db) => {
            const transaction = db.transaction(this.#storeName, 'readwrite');

            transaction.onsuccess = () => {
                console.log('Transaction Successful');
            };

            transaction.onerror = (event) => {
                console.log(`Transaction Failed ${event.target.error}`);
            };

            const objStore = transaction.objectStore(this.#storeName);
            const clearRequest = objStore.clear();

            clearRequest.onsuccess = () => {
                console.log(`Data Cleared`);
            };
            
            clearRequest.onerror = (event) => {
                console.log(`Failed to clear Data ${event.target.error}`);
            };
            this.closeConnection();
    }).catch((error) => {
        console.log(`Error:${error}`);
    });

}

    getAllData() {
        this.openConnection().then((db) => {
            this.#db = db;
            // console.log(db);
            const transaction = this.#db.transaction(this.#storeName, 'readwrite');
            const store = transaction.objectStore(this.#storeName);
            const request = store.getAll();

            request.onsuccess = (event) => {
                
                this.#eventEmitter.emit(DB_FETCH_ALL_EMIT_EVENT, event.target.result);
            };

            request.onerror = (event) => {
                console.log(`Failed to fetch data: ${event.target.error}`);
            };
      
            this.closeConnection();
        }).catch((error) => {
            console.log(`Error:${error}`);
        });
    };

    
    set db(db) { this.#db = db; }

    set dbName(dbName) { this.#dbName = dbName; }

    set storeName(storeName) { this.#storeName = storeName; }

    get db() { return this.#db; }

    get dbName() { return this.#dbName; }

    get storeName() { return this.#storeName; }

    get eventEmitter() { return this.#eventEmitter; }
}