module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mocha: {
            all: {
                src: ['tests/**.js']
            },
            options: {
                run: true
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                colors: true,
                require: [
                    function() { var config = require(__dirname + '/config/mydoc-api-test.json'); }
                ]
            },
            src: ['tests/mydoc-api.js']
        }
    });
    // grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.registerTask('default', ['mochaTest']);
};
    


