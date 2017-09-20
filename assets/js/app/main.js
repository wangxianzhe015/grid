/**
 * Created by Steel on 9/18/2017.
 */
var peopleResult, personIndex;

$(document).ready(function(){

    initDBConnection();
    composeTab1();
    composeTab2();

    var people, open = indexedDB.open("AccordionDatabase",1);
    open.onsuccess = function(){
        var db = open.result;
        var transaction = db.transaction("PeopleStore", "readwrite");
        var store = transaction.objectStore("PeopleStore");
        var request = store.getAll();
        request.onsuccess = function(e){
            people = e.target.result;
            composeTab3(people);
        };
    };

    composeTab4();
    composeTab5();

    handleDatePicker();

    $("#accordion").accordion();
});

function composeTab1(){
    $("#general-div").jsGrid({
        height: "100%",
        width: "798px",
        filtering: true,
        inserting: true,
        editing: true,
        sorting: true,
        paging: true,
        autoload: true,
        pageSize: 10,
        pageButtonCount: 5,
        deleteConfirm: "Do you really want to delete client?",
        controller: {
            loadData: function(filter) {
                return $.ajax({
                    type: "GET",
                    url: "server/",
                    data: filter
                });
            },
            insertItem: function(item) {
                return $.ajax({
                    type: "POST",
                    url: "server/",
                    data: item
                });
            },
            updateItem: function(item) {
                return $.ajax({
                    type: "PUT",
                    url: "server/",
                    data: item
                });
            },
            deleteItem: function(item) {
                return $.ajax({
                    type: "DELETE",
                    url: "server/",
                    data: item
                });
            }
        },
        fields: [
            { name: "id",        title: "ID",           type: "",       width: 50,  filtering: false},
            { name: "date",      title: "Date",         type: "text",   width: 100 },
            { name: "supplier",  title: "Supplier",     type: "text",   width: 100 },
            { name: "reason",    title: "Reason",       type: "text",   width: 150 },
            { name: "amount",    title: "Amount",       type: "text",   width: 80 },
            { name: "currency",  title: "Currency",     type: "text",   width: 80 },
            { name: "amount_aud",title: "Amount in AUD",type: "text",   width: 90 },
            { type: "control" }
        ]
    });
}

function composeTab2(){
    var types = [
        {
            value: "Airfare",
            name: "Airfare"
        },
        {
            value: "Taxi",
            name: "Taxi"
        },
        {
            value: "Hotel - Local",
            name: "Hotel - Local"
        },
        {
            value: "Hotel - Intl",
            name: "Hotel - Intl"
        },
        {
            value: "Meals - Intl",
            name: "Meals - Intl"
        }
    ];

    $("#travel-div").jsGrid({
        height: "100%",
        width: "800px",
        filtering: true,
        inserting: true,
        editing: true,
        sorting: true,
        paging: true,
        autoload: true,
        pageSize: 10,
        pageButtonCount: 5,
        deleteConfirm: "Do you really want to delete client?",
        controller: {
            loadData: function(filter) {
                return $.ajax({
                    type: "GET",
                    url: "server/",
                    data: filter
                });
            },
            insertItem: function(item) {
                return $.ajax({
                    type: "POST",
                    url: "server/",
                    data: item
                });
            },
            updateItem: function(item) {
                return $.ajax({
                    type: "PUT",
                    url: "server/",
                    data: item
                });
            },
            deleteItem: function(item) {
                return $.ajax({
                    type: "DELETE",
                    url: "server/",
                    data: item
                });
            }
        },
        fields: [
            { name: "id",        title: "ID",           type: "",           width: 50,  filtering: false},
            { name: "date",      title: "Date",         type: "text",       width: 100 },
            { name: "supplier",  title: "Supplier",     type: "text",       width: 100 },
            { name: "type",      title: "Type",         type: "select",     width: 100, items:types, valueField:"value", textField: "name" },
            { name: "amount",    title: "Amount",       type: "text",       width: 80 },
            { name: "currency",  title: "Currency",     type: "text",       width: 80 },
            { name: "amount_aud",title: "Amount in AUD",type: "text",       width: 90 },
            { type: "control" }
        ]
    });
}

function composeTab3(people){

    $("#entertainment-div").jsGrid({
        height: "100%",
        width: "798px",
        filtering: true,
        inserting: true,
        editing: true,
        sorting: true,
        paging: true,
        autoload: true,
        pageSize: 10,
        pageButtonCount: 5,
        deleteConfirm: "Do you really want to delete client?",
        controller: {
            loadData: function(filter) {
                return $.ajax({
                    type: "GET",
                    url: "server/",
                    data: filter
                });
            },
            insertItem: function(item) {
                return $.ajax({
                    type: "POST",
                    url: "server/",
                    data: item
                });
            },
            updateItem: function(item) {
                return $.ajax({
                    type: "PUT",
                    url: "server/",
                    data: item
                });
            },
            deleteItem: function(item) {
                return $.ajax({
                    type: "DELETE",
                    url: "server/",
                    data: item
                });
            }
        },
        fields: [
            { name: "id",        title: "ID",           type: "",       width: 50,  filtering: false},
            { name: "date",      title: "Date",         type: "text",   width: 100 },
            { name: "supplier",  title: "Supplier",     type: "text",   width: 100 },
            { name: "person_id", title: "Person",       type: "select", width: 150, items: people, valueField: "id", textField: "name" },
            { name: "place",     title: "place",        type: "text",   width: 80 },
            { name: "amount",    title: "Amount",       type: "text",   width: 80 },
            { name: "currency",  title: "Currency",     type: "text",   width: 80 },
            { name: "amount_aud",title: "Amount in AUD",type: "text",   width: 90 },
            { type: "control" }
        ]
    });
}

function composeTab4(){
    $("#addBtn").on("click", addHandler);
    $("#cleBtn").on("click", clearHandler);
    $(".remove").on("click",function(){

    });
    initDBConnection();
    listPeople();
}

function composeTab5(){
    var obj = $('#file-upload');
    obj.fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: 'upload/'
    });

    // Enable iframe cross-domain access via redirect option:

    // Load existing files:
    obj.addClass('fileupload-processing');
    $.ajax({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: obj.fileupload('option', 'url'),
        dataType: 'json',
        context: obj[0]
    }).always(function () {
        $(this).removeClass('fileupload-processing');
    }).done(function (result) {
        $(this).fileupload('option', 'done')
            .call(this, $.Event('done'), {result: result});
    });

}

function handleDatePicker(){
    var tables = $(".jsgrid-table");
    tables.each(function(i,table){
        var ths = $(table).find(".jsgrid-header-row").find("th"),index=-1;
        ths.each(function(i,th){
            if ($(th).html().toLowerCase().indexOf("date") > -1){
                index = i;
            }
        });
        if (index > -1){
            var dateTd = $(table).find(".jsgrid-filter-row").find("td")[index];
            $(dateTd).find("input").datepicker();
            dateTd = $(table).find(".jsgrid-insert-row").find("td")[index];
            $(dateTd).find("input").datepicker();
        }
    });
}

