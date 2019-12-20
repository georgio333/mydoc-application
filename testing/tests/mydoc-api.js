/*
 * MyDoc  - REST-based service 
 * Testing in Lab: http://127.0.0.1:8080/ENDPOINT
 * Testing in Live: http://88.198.205.97/api/v1/mydoc/ENDPOINT
 * Author: Makalov Iurii 
 * */

var
    config = require('../config/mydoc-api-test.json'),
    async = require('async'),
        chai = require('chai'),
        expect = chai.expect,
        should = chai.should(),
        request = require('request'),
        logger = require('../include/logger.js'),
        log = logger.logger


var getAPIUrl = function(path) {
    // return 'http://' + config.api.host + ':' + config.api.port + path;
    return 'http://' + config.api.host + config.api.basic_path + path;
};

var getToolsIProv = function(path) {
    return 'http://' + config.api.host + ((config.api.SmsPaymentPort) ? ':' + config.api.SmsPaymentPort : '') + path;
};

chai.Assertion.addProperty('json', function() {
    JSON.parse(this._obj);
});


//MyDoc API Calls
var ENDPOINT_EMPLOYEE_LIST = getAPIUrl('route/support');
var ENDPOINT_EMPLOYEE_LIST_BY_DATE = getAPIUrl('route/');
var ENDPOINT_ALL_APPLICATIONS_LIST = getAPIUrl('allClients/');
var ENDPOINT_CHANGE_APPOINTMENT = getAPIUrl('change/appointment/');
var ENDPOINT_ADD_APPOINTMENT = getAPIUrl('add/appointment/');


describe('MYDOC - REST-based service - Application app', function() {

    var token = null;

    it('should able to return a list of employess from database', function(cb) {

        this.timeout(7000);
        request.get(ENDPOINT_EMPLOYEE_LIST, {
            json: true,
            strictSSL: false,
            headers: {
                'X-CSession-Token': token
            }
        }, function(err, res, body) {
            try {
                console.log(body);
                var testCase = "should be able to return a list of employess";
                should.not.exist(err);
                should.exist(body);
                res.statusCode.should.equal(200);
                switch (res.statusCode == 200) {
                    case true:
                        log.info("mydoc_01 | " + testCase);
                        break;
                }

            } catch (err) {
                log.error("mydoc_01 " + testCase + '->' + err);
                should.throw(err);
            }
            cb();
        });
    });

    it('should able to return a list of employess for user by date', function(cb) {

        this.timeout(7000);
        request.get(ENDPOINT_EMPLOYEE_LIST_BY_DATE + config.employee.name_1 + '/' + config.date.date_1, {
            json: true,
            strictSSL: false,
            headers: {
                'X-CSession-Token': token
            }
        }, function(err, res, body) {
            try {
                // console.log(body);
                var testCase = "should able to return a list of employess for user by date";
                should.not.exist(err);
                should.exist(body);
                res.statusCode.should.equal(200);
                switch (res.statusCode == 200) {
                    case true:
                        log.info("mydoc_02 | " + testCase);
                        break;
                }

            } catch (err) {
                log.error("mydoc_02 " + testCase + '->' + err);
                should.throw(err);
            }
            cb();
        });

    });

    it('should able to return a list of all applications for employee', function(cb) {

        this.timeout(7000);
        request.get(ENDPOINT_ALL_APPLICATIONS_LIST + config.employee.name_1, {
            json: true,
            strictSSL: false,
            headers: {
                'X-CSession-Token': token
            }
        }, function(err, res, body) {
            try {
                // console.log(body);
                var testCase = "should able to return a list of all applications for employee";
                should.not.exist(err);
                should.exist(body);
                res.statusCode.should.equal(200);
                switch (res.statusCode == 200) {
                    case true:
                        log.info("mydoc_03 | " + testCase);
                        break;
                }

            } catch (err) {
                log.error("mydoc_03 " + testCase + '->' + err);
                should.throw(err);
            }
            cb();
        });

    });


    it('change appointment for customer - PATCH request - customerID:' + config.customer.appId_1, function(cb) {
        this.timeout(6000);
        request.put(ENDPOINT_CHANGE_APPOINTMENT + config.customer.appId_1 + '/' + config.date.date_3, {
            json: true,
            strictSSL: false,
            headers: {
                'X-CSession-Token': token
            },
            body: {
                street: config.appointment.change.street,
                postcode: config.appointment.change.postcode,
                city: config.appointment.change.city
            }
        }, function(err, res, body) {
            try {
                console.log(body);
                var testCase = 'change appointment for customer - PATCH request - customerID:' + config.customer.appId_1;
                should.not.exist(err);
                should.exist(body);
                res.statusCode.should.equal(200);
                switch (res.statusCode == 200) {
                    case true:
                        log.info("Passed: " + testCase);
                        break;
                }
            } catch (err) {
                log.error("Failed: " + testCase + '->' + err);
                should.throw(err);
            }
            cb();
        });
    });

        it('add new application to database - POST request - date:', function(cb) {
        this.timeout(6000);
        request.post(ENDPOINT_ADD_APPOINTMENT + config.date.date_2, {
            json: true,
            strictSSL: false,
            headers: {
                'X-CSession-Token': token
            },
            body: config.appointment.new_2
        }, function(err, res, body) {
            try {
                console.log(body);
                var testCase = 'add new application to database - POST request - date:' + config.date.date_2;
                should.not.exist(err);
                should.exist(body);
                res.statusCode.should.equal(200);
                switch (res.statusCode == 200) {
                    case true:
                        log.info("Passed: " + testCase);
                        break;
                }
            } catch (err) {
                log.error("Failed: " + testCase + '->' + err);
                should.throw(err);
            }
            cb();
        });
    });


});