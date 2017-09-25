function initDB() {
    if (window.openDatabase) {
        //Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 1024 x 1024 = 1MB
        mydb = openDatabase("people_db", "0.1", "A Database of People", 1024 * 1024);

        //create the cars table using SQL for the database using a transaction
        mydb.transaction(function (t) {
            t.executeSql("CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY ASC, name TEXT, type TEXT)");
        });
    } else {
        alert("WebSQL is not supported by your browser!");
    }
}

function addHandler(person){
    var name = person.name,
        type = person.type,
        id;

    mydb.transaction(function (t) {
        t.executeSql("INSERT INTO people (name, type) VALUES (?, ?)", [name, type], function(tx, result){
            id = result.insertId;
            console.log(id);
        });
    });
    console.log(id);
    return {id: id, name: name, type: type};
}

function listPeople(){
    return mydb.transaction(function (t) {
        return t.executeSql("SELECT * FROM people", [], function(tx, result){
            var res = result.rows;
            console.log(res);
            return res;
        });
    });

}