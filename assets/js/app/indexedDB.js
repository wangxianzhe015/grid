function initDBConnection(){
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    var open = indexedDB.open("AccordionDatabase", 1);
    open.onupgradeneeded = function() {
        var db = open.result;
        var store = db.createObjectStore("PeopleStore", {keyPath: "id", autoIncrement: true});
        var index = store.createIndex("PeopleIndex", ["name", "type"]);
    };

}

function addHandler(){
    var name = $("#name").val();
    var type = $("#type").val();
    if (name == ""){
        alert("Input Full Name!");
        $("#name").focus();
        return false;
    }

    var open = indexedDB.open("AccordionDatabase", 1);

    open.onsuccess = function() {
        // Start a new transaction
        var db = open.result;
        var tx = db.transaction("PeopleStore", "readwrite");
        var store = tx.objectStore("PeopleStore");

        // Add data
        store.put({name: name, type: type});

        // Close the db when the transaction is done
        tx.oncomplete = function() {
            listPeople();
            db.close();
        };
        clearHandler();
    };
}

function clearHandler(){
    $("#name").val("").focus();
    $("#type").prop("checked",false);
}

function removeHandler(){
    var id = $(this).attr("data-id");
    var open = indexedDB.open("AccordionDatabase",1);
    open.onsuccess = function(){
        var db = open.result;
        var tx = db.transaction("PeopleStore", "readwrite");
        var store = tx.objectStore("PeopleStore");

        store.delete(parseInt(id));
        listItems();
    }
}

function showDetail(){
    $(".detail").hide();
    $(".confirm").hide();
    $(".edit").show();
    var target = $(this).parent().parent().next();
    $(target).show();
    $(target).next().show();
    $(target).next().find("input").each(function(index,obj){
        $(obj).attr("readonly",true);
    });
}

function closeDetail(){
    $(".detail").hide();
    $("#table").find("input").each(function(index,obj){
        $(obj).attr("readonly",true);
    });
}

function enableEdit(){
    var row = $(this).parent().parent();
    $(this).hide();
    $(this).next().show();
    row.find("input").each(function(index,obj){
        $(obj).attr({
            readonly: false
        });
    });
    row.find("select").each(function(index,obj){
        $(obj).attr({
            disabled: false
        });
    });
}

function confirmEdit(){
    var id = $(this).attr("data-id"),row = $(this).parent().parent(),
        name=$(row).find(".edit-name").val(),
        type=$(row).find(".edit-type").val();
    var open = indexedDB.open("AccordionDatabase");

    open.onsuccess = function(){
        var db = open.result;
        var transaction = db.transaction('PeopleStore',"readwrite");
        var store = transaction.objectStore('PeopleStore');
        var obj = {id: parseInt(id), name: name, type: type};
        store.put(obj);
        listPeople();
    };
}

function listPeople(){
    var rows = $("#people-table").find("tr");
    var types = [
        {
            value: "Client - Local",
            name: "Client - Local"
        },
        {
            value: "Client - Intl",
            name: "Client - Intl"
        },
        {
            value: "Staff - Local",
            name: "Staff - Local"
        },
        {
            value: "Staff - Intl",
            name: "Staff - Intl"
        }
    ];

    if (rows.length > 1) {
        rows.each(function (index, row) {
            if (index > 0) {
                $(row).remove();
            }
        });
    }
    var open = indexedDB.open("AccordionDatabase",1);
    open.onsuccess = function(){
        var db = open.result;
        var transaction = db.transaction("PeopleStore", "readwrite");
        var store = transaction.objectStore("PeopleStore");
        var cursorRequest = store.openCursor(),index = 1;
        cursorRequest.onsuccess = function(event){
            var cursor = event.target.result;
            if(cursor) {
                // First Row
                var value = cursor.value;
                var row = document.createElement("tr");
                row.className = "person";
                var noTd = document.createElement("td");
                noTd.innerHTML = index;
                $(row).append(noTd);
                var nameTd = document.createElement("td");
                nameTd.innerHTML = value.name;
                $(row).append(nameTd);
                var typeTd = document.createElement("td"),
                    typeInput = document.createElement("input");
                $(typeInput).attr("type", "text").val(value.type).attr("readonly", true);
                $(typeTd).append(typeInput);
                $(row).append(typeTd);
                var operationTd = document.createElement("td");
                var seeBtn = document.createElement("button");
                seeBtn.className = "btn btn-success see";
                $(seeBtn).attr("data-id",value.id);
                seeBtn.innerHTML = "See";
                seeBtn.onclick = showDetail;
                $(operationTd).append(seeBtn).append(" ");
                var removeBtn = document.createElement("button");
                removeBtn.className = "btn btn-danger remove";
                $(removeBtn).attr("data-id",value.id);
                removeBtn.innerHTML = "Remove";
                removeBtn.onclick = removeHandler;
                $(operationTd).append(removeBtn);
                $(row).append(operationTd);
                // End of First Row

                // Hidden edit panel (title)
                var detailRowTitle = document.createElement("tr");
                detailRowTitle.className = "detail";
                nameTd = document.createElement("td");
                nameTd.innerHTML = "Name";
                nameTd.colSpan = 2;
                $(detailRowTitle).append(nameTd);
                var titleTd = document.createElement("td");
                titleTd.innerHTML = "Classification";
                $(detailRowTitle).append(titleTd);
                var opTd = document.createElement("td");
                $(detailRowTitle).append(opTd);
                // End Hidden edit panel (title)

                // Hidden edit panel (input items)
                var detailRowContent = document.createElement("tr");
                detailRowContent.className = "detail";
                nameTd = document.createElement("td");
                nameTd.colSpan = 2;
                nameTd.innerHTML = "<input type='text' class='edit-name' value='"+value.name+"' readonly/>";
                $(detailRowContent).append(nameTd);
                typeTd = document.createElement("td");
                typeInput = document.createElement("select");
                types.forEach(function(type){
                    $(typeInput).append($("<option>").attr("value",type.value).html(type.name));
                });
                $(typeInput).attr({
                    class: "edit-type",
                    disabled: true
                });
                $(typeTd).append(typeInput);
                $(detailRowContent).append(typeTd);
                opTd = document.createElement("td");
                var editBtn = document.createElement("button");
                editBtn.className = "btn btn-warning edit";
                $(editBtn).attr("data-id",value.id);
                editBtn.innerHTML = "Edit";
                editBtn.onclick = enableEdit;
                $(opTd).append(editBtn).append(" ");
                var confirmBtn = document.createElement("button");
                confirmBtn.className = "btn btn-success confirm";
                $(confirmBtn).attr("data-id",value.id);
                confirmBtn.innerHTML = "Confirm";
                confirmBtn.onclick = confirmEdit;
                $(opTd).append(confirmBtn).append(" ");
                var closeBtn = document.createElement("button");
                closeBtn.className = "btn btn-danger";
                closeBtn.innerHTML = "Close";
                closeBtn.onclick = closeDetail;
                $(opTd).append(closeBtn);
                $(detailRowContent).append(opTd);
                // End Hidden edit panel (input items)

                $("#people-table").append(row).append(detailRowTitle).append(detailRowContent);

                index++;
                cursor.continue()
            }
        };


    };


}