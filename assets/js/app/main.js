/**
 * Created by Steel on 9/18/2017.
 */

$(document).ready(function(){

    composeTab1();
    composeTab2();
    composeTab3();
    composeTab4();
    composeTab5();

    handleDatePicker();

    $("#accordion").accordion();

    $("#submit-btn").on("click", function(){
        var data = {}, object = [], rows, elements;

        rows = $("#general-div").find(".jsgrid-grid-body").find(".jsgrid-table").find("tr");
        rows.each(function(i,row){
            elements = $(row).find("td");
            if (elements.length > 1) {
                object.push({
                    id: elements[0].innerHTML,
                    date: elements[1].innerHTML,
                    supplier: elements[2].innerHTML,
                    reason: elements[3].innerHTML,
                    amount: elements[4].innerHTML
                });
            }
        });
        data.general = object;

        rows = $("#travel-div").find(".jsgrid-grid-body").find(".jsgrid-table").find("tr");
        object = [];
        rows.each(function(i,row){
            elements = $(row).find("td");
            if (elements.length > 1) {
                object.push({
                    id: elements[0].innerHTML,
                    date: elements[1].innerHTML,
                    supplier: elements[2].innerHTML,
                    type: $(elements[3]).val(),
                    amount: elements[4].innerHTML
                });
            }
        });
        data.travel = object;

        rows = $("#entertainment-div").find(".jsgrid-grid-body").find(".jsgrid-table").find("tr");
        object = [];
        rows.each(function(i,row){
            elements = $(row).find("td");
            if (elements.length > 1) {
                object.push({
                    id: elements[0].innerHTML,
                    date: elements[1].innerHTML,
                    supplier: elements[2].innerHTML,
                    person: $(elements[3]).val(),
                    place: elements[4].innerHTML,
                    amount: elements[5].innerHTML
                });
            }
        });
        data.entertainment = object;

        rows = $("#people-div").find(".jsgrid-grid-body").find(".jsgrid-table").find("tr");
        object = [];
        rows.each(function(i,row){
            elements = $(row).find("td");
            if (elements.length > 1) {
                object.push({
                    id: elements[0].innerHTML,
                    name: elements[1].innerHTML,
                    type: elements[2].innerHTML
                });
            }
        });
        data.people = object;

        rows = $("#file-upload").find(".template-download");
        object = [];
        rows.each(function(i, row){
            elements = $(row).find("td");
            object.push({
                name: $(elements[1]).find("a").html(),
                url: $(elements[1]).find("a").attr("href"),
                size: $(elements[2]).find("span").html(),
                "delete-url": $(elements[3]).find("button").attr("data-url")
            });
        });
        data.files = object;

        console.log(data);
    });
});

function composeTab1(){
    $("#general-div").jsGrid({
        height: "350px",
        width: "800px",
        filtering: false,
        inserting: true,
        editing: true,
        sorting: false,
        paging: true,
        autoload: true,
        pageSize: 9,
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
            { name: "date",      title: "Date",         type: "text",   width: 80 },
            { name: "supplier",  title: "Supplier",     type: "text",   width: 100 },
            { name: "reason",    title: "Reason",       type: "text",   width: 150 },
            { name: "amount",    title: "Amount",       type: "text",   width: 80 },
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
        height: "350px",
        width: "800px",
        filtering: false,
        inserting: true,
        editing: true,
        sorting: false,
        paging: true,
        autoload: true,
        pageSize: 9,
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
            { name: "date",      title: "Date",         type: "text",       width: 80 },
            { name: "supplier",  title: "Supplier",     type: "text",       width: 100 },
            { name: "type",      title: "Type",         type: "select",     width: 100, items:types, valueField:"value", textField: "name" },
            { name: "amount",    title: "Amount",       type: "text",       width: 80 },
            { type: "control" }
        ]
    });
}

function composeTab3(){
    var people = listPeople();

    $("#entertainment-div").jsGrid({
        height: "350px",
        width: "800px",
        filtering: true,
        inserting: true,
        editing: true,
        sorting: false,
        paging: true,
        autoload: true,
        pageSize: 9,
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
            { name: "date",      title: "Date",         type: "text",   width: 80 },
            { name: "supplier",  title: "Supplier",     type: "text",   width: 100 },
            { name: "person_id", title: "Person",       type: "select", width: 100, items: people, valueField: "name", textField: "name" },
            { name: "place",     title: "place",        type: "text",   width: 100 },
            { name: "amount",    title: "Amount",       type: "text",   width: 80 },
            { type: "control" }
        ]
    });
}

function composeTab4(){
    var types = [
        {
            name: "Client - local",
            value: "Client - local"
        },
        {
            name: "Client - Intl",
            value: "Client - Intl"
        },
        {
            name: "Staff - local",
            value: "Staff - local"
        },
        {
            name: "Staff - Intl",
            value: "Staff - Intl"
        }
    ];
    $("#people-div").jsGrid({
        height: "352px",
        width: "798px",
        filtering: false,
        inserting: true,
        editing: true,
        sorting: false,
        paging: true,
        autoload: true,
        pageSize: 9,
        pageButtonCount: 5,
        deleteConfirm: "Do you really want to delete person?",
        controller: {
            loadData: function() {
                return listPeople();
            },
            insertItem: function(person) {
                if (person.name != "") {
                    var res = addHandler(person);
                    composeTab3();
                    return res;
                }
            },
            updateItem: function(person) {
                var res = updateHandler(person);
                composeTab3();
                return res;
            },
            deleteItem: function(person) {
                removeHandler(person);
                composeTab3();
            }
        },
        fields: [
            { name: "id",        title: "ID",     type: "",       width: 50 },
            { name: "name",      title: "Name",   type: "text",   width: 150 },
            { name: "type",      title: "Type",   type: "select", width: 150, items: types, valueField: "name", textField: "value" },
            { type: "control" }
        ]
    });}

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
