function initDBConnection(){
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    var open = indexedDB.open("AccordionDatabase", 1);
    open.onupgradeneeded = function() {
        var db = open.result;
        var store = db.createObjectStore("PeopleStore", {keyPath: "id", autoIncrement: true});
        var index = store.createIndex("PeopleIndex", ["name", "type"]);
    };

}

function addHandler(data){
    var name = data.name, type = data.type;
    var open = indexedDB.open("AccordionDatabase", 1),
        res;

    return open.onsuccess = function() {
        // Start a new transaction
        var db = open.result;
        var tx = db.transaction("PeopleStore", "readwrite");
        var store = tx.objectStore("PeopleStore");

        // Add data
        var request = store.put({name: name, type: type});
        request.onsuccess = function(event){
            res = {id: event.target.result, name: name, type: type};
            console.log(res);
        };

        // Close the db when the transaction is done
        tx.oncomplete = function() {
            db.close();
        };
        return res;
    };

}

function removeHandler(item){
    var id = item.id;
    var open = indexedDB.open("AccordionDatabase",1);
    open.onsuccess = function(){
        var db = open.result;
        var tx = db.transaction("PeopleStore", "readwrite");
        var store = tx.objectStore("PeopleStore");

        store.delete(parseInt(id));

        // Close the db when the transaction is done
        tx.oncomplete = function() {
            db.close();
        };
    }
}

function updateHandler(data){
    var id = data.id, name = data.name, type = data.type;
    var open = indexedDB.open("MyDatabase");

    open.onsuccess = function(){
        var db = open.result;
        var transaction = db.transaction('PeopleStore',"readwrite");
        var store = transaction.objectStore('PeopleStore');
        var obj = {id: parseInt(id), name: name, type: type};
        store.put(obj);

        // Close the db when the transaction is done
        transaction.oncomplete = function() {
            db.close();
        };
    };
}

function listPeople(filter, callback){
    var name = filter.name,
        type = filter.type,
        open = indexedDB.open("AccordionDatabase",1),
        res;

    open.onsuccess = function(){
        var db = open.result;
        var transaction = db.transaction("PeopleStore", "readwrite");
        var store = transaction.objectStore("PeopleStore");
        var request = store.getAll();
        request.onsuccess = function(event){
            res = event.target.result;
            callback(res);
        };

        // Close the db when the transaction is done
        transaction.oncomplete = function() {
            db.close();
        };
    };

}

function getIndexedDBResult(){
    var res;
    if (peopleResult == null){
        setTimeout(function(){
            return getIndexedDBResult();
        },1000);
    } else {
        res = peopleResult;
        peopleResult = null;
        return res;
    }
}