function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue) {
    var expires = "expires=01 Jan 2070 00:00:00 UTC;";
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function listPeople(){
    var string = getCookie("people"),
        rows = string.split(","), res=[];
    if (string != "") {
        rows.forEach(function (row, i) {
            var items = row.split(":");
            res.push({
                id: items[0],
                name: items[1],
                type: items[2]
            })
        });
    }
    return res;
}

function addHandler(person){
    var name = person.name,
        type = person.type,
        oldCookie = getCookie("people"),
        rows = oldCookie.split(","),
        lastId = oldCookie==""?0:parseInt(rows[rows.length - 1].split(":")[0]),
        newCookie = oldCookie==""?"1:" + name + ":" + type:oldCookie + "," + parseInt(lastId + 1) + ":" + name + ":" + type;
    setCookie("people", newCookie);
    return {id: parseInt(lastId + 1), name: name, type: type}

}

function updateHandler(person){
    var id = person.id,
        name = person.name,
        type = person.type,
        oldCookie = getCookie("people"),
        rows = oldCookie.split(","),
        newCookie = "";
    rows.forEach(function(row){
        var fields = row.split(":");
        if (fields[0] == id){
            if (newCookie == "") {
                newCookie = id + ":" + name + ":" + type;
            } else {
                newCookie = newCookie + "," + id + ":" + name + ":" + type;
            }
        } else {
            if (newCookie == "") {
                newCookie = row;
            } else {
                newCookie = newCookie + "," + row;
            }
        }
    });
    setCookie("people", newCookie);
    return {
        id: id,
        name: name,
        type: type
    }
}

function removeHandler(person){
    var id = person.id,
        oldCookie = getCookie("people"),
        rows = oldCookie.split(","),
        newCookie = "";
    rows.forEach(function(row){
        var fields = row.split(":");
        if (fields[0] != id){
            if (newCookie == ""){
                newCookie = row;
            } else {
                newCookie = newCookie + "," + row;
            }
        }
    });
    console.log(newCookie);
    setCookie("people",newCookie);
}