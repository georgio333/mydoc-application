/*MyDoc - Application app - backend - API version 1.0 
Author: Iurii Makalov */

var restify = require('restify');
var Connection = require('tedious').Connection;
var server = restify.createServer();
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var uuid = require('uuid');
var dateFormat = require('dateformat');


var connection = mysql.createConnection({
    server: '127.0.0.1:3306',
    user: 'yuriy',
    password: 'test1234!',
    database: 'status'
});


server.listen(8080, function() {
    console.log('listening at %s', server.url);
});

//checking status of customer's request 
server.get('/customer/status/:receiptId/:zipCode', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var receiptId = req.params.receiptId;
    var zipCode = req.params.zipCode;

    connection.query("SELECT * FROM progress WHERE Belegnummer = ? AND LieferadressePLZ = ?", [receiptId, zipCode], function(err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.tagId + err);
            return;
        }
        var out = [];
        tmpres.forEach(function(a) {
            out.push({
                name: a.LieferadresseName2,
                surname: a.LeferadresseName3,
                street: a.LieferadresseStraße,
                postCode: a.LieferadressePLZ,
                city: a.LieferadresseOrt,
                created: a.Erstanlagedatum,
                updated: a.Änderungsdatum,
                notice: a.Beschreibung,
                shortInfo: a.Kurztext,
                appId: a.Belegnummer,
                status: a.Status
            });
        });
        res.json(out);
        console.log("get status info for customer: " + out);
    });
});

//get first list of employees
server.get('/route/support', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    connection.query("SELECT kurzname FROM personal", function(err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.tagId + err);
            return;
        }
        var out = [];
        tmpres.forEach(function(a) {
            out.push({
                name: a.kurzname
            });
        });
        res.json(out);
        console.log('Get list of employees');
    });
});

//get list of customers for employee by date
server.get('/route/:name/:date', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var test = req.params.name;
    var date1 = req.params.date;
    //var date1 = '2015';
    //var test = DateTime.Now;
    console.log(date1);
    connection.query("SELECT *  FROM progress WHERE employee = ? AND Termin LIKE ? AND (Status = '24' OR Status = '30')", [test, '%' + date1 + '%'], function(err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.tagId + err);
            return;
        }
        var out = [];
        tmpres.forEach(function(a) {
            out.push({
                number: a.Nummer,
                name: a.LieferadresseName2,
                surname: a.LieferadresseName3,
                street: a.LieferadresseStraße,
                postCode: a.LieferadressePLZ,
                city: a.LieferadresseOrt,
                termin: a.Termin + a.Status,
                status: a.Status,
                created: a.Erstanlagedatum,
                employee: a.employee,
                appId: a.Belegnummer,
            });
        });
        res.json(out);
        console.log('Get clients info of ' + test + ' on: ' + date1);
    });
});

//get list of all customers for employee
server.get('/allClients/:name/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var test = req.params.name;
    console.log(test);

    connection.query("SELECT * FROM progress WHERE employee = ? AND (Status = '24' OR Status = '30')", [test], function(err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.tagId + err);
            return;
        }
        var out = [];
        tmpres.forEach(function(a) {
            out.push({
                number: a.Nummer,
                name: a.LieferadresseName2,
                surname: a.LieferadresseName3,
                street: a.LieferadresseStraße,
                postCode: a.LieferadressePLZ,
                city: a.LieferadresseOrt,
                termin: a.Termin,
                status: a.Status,
                created: a.Erstanlagedatum,
                employee: a.employee,
                appId: a.Belegnummer
            });
        });
        res.json(out);
        console.log('Get all clients for employee: ' + test);
    });
});

//get customer info for edit
server.get('/customer/edit/:id', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var number = req.params.id;
    console.log(number);
    connection.query("SELECT * FROM progress WHERE Nummer = ?", [number], function(err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.id + err);
            return;
        }
        var out = [];
        tmpres.forEach(function(a) {
            out.push({
                number: a.Nummer,
                name: a.LieferadresseName2,
                surname: a.LieferadresseName3,
                street: a.LieferadresseStraße,
                postCode: a.LieferadressePLZ,
                city: a.LieferadresseOrt,
                termin: a.Termin + a.Status,
                status: a.Status,
                employee: a.employee,
            });
        });
        res.json(out);
        console.log('Get customer´s info: ' + number);
    });
});

//change data for customer
server.put('/change/appointment/:id/:date', bodyParser(), function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var city = req.body.city;
    var postcode = req.body.postcode;
    var street = req.body.street;
    var number = req.params.id;
    var termin = req.params.date;
    var date_ = Date.now();
    var date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
    //var termin = "2016-03-15 00:00:00";
    connection.query("UPDATE progress SET Termin = ?, LieferadresseOrt = ?, LieferadressePLZ = ?, LieferadresseStraße = ?, Änderungsdatum = ? WHERE Nummer = ?", [termin, city, postcode, street, date, number], function(err, tmpres) {

        if (err) {
            console.log("query failed!" + req.params.id + err);
            return res.json({ success: false });
        }
        console.log('Data has been changed for customer: ' + number);
        return res.json({ success: !!tmpres });
    });
});


//change data for customer
server.post('/add/appointment/:date', bodyParser(), function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var city = req.body.city;
    var postcode = req.body.postcode;
    var street = req.body.street;
    var termin = req.params.date;
    var employee = req.body.employee;
    var status = req.body.status;
    var name = req.body.name;
    var surname = req.body.surname;
    var appId = req.body.appId;
    var date_ = Date.now();
    var date = dateFormat(date_, "yyyy-mm-dd h:MM:ss");
    var id = uuid.v1();
    connection.query("INSERT INTO progress (LieferadresseOrt, LieferadressePLZ , LieferadresseStraße, employee, Status, LieferadresseName2, LieferadresseName3, Nummer, Erstanlagedatum, Belegnummer, Termin, Änderungsdatum) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", [city, postcode, street, employee, status, name, surname, id, date, appId, termin, date], function(err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.id + err);
            return res.json({ success: false });
        }
        console.log('New application has been added successfully: ' + appId);
        return res.json({ success: !!tmpres });
    });
});

//change data for customer
server.post('/add/employee', bodyParser(), function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var name = req.body.name;
    var id = uuid.v1();
    connection.query("INSERT INTO personal (kurzname, id) VALUES (?, ?)", [name, id], function(err, tmpres) {
        if (err) {
            console.log("query failed!" + req.params.id + err);
            return res.json({ success: false });
        }
        console.log('New employee has been added successfully: ' + name);
        return res.json({ success: !!tmpres });
    });
});