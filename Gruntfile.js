module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        stylus: {
            compile: {
                files: {
                    'public/stylesheets/style.css': 'public/stylesheets/style.styl',
                    'public/stylesheets/main.css' : ['public/stylesheets/common/*.styl']
                }
            }
        },
        jshint: {
            options: {
                asi: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                undef: true,
                sub: true,
                white: true,
                node: true,
                browser: true,
                jquery: true,
                devel: true,
                multistr: true
            },
            files: ['routes/*.js', './*.js', 'public/javascripts/*.js', 'model/*.js'],
        },
        watch: {
            scripts: {
                files: ['public/stylesheets/style.styl', 'public/stylesheets/common/*.styl', 'routes/*.js', './*.js', 'public/javascripts/*.js', 'model/*.js'],
                tasks: ['stylus', 'jshint'] 
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-stylus')
    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-contrib-watch')

    grunt.registerTask('default', ['stylus'])
}