/*global module */
module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sftp-deploy');

    //
    // Grunt configuration:
    //
    // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
    //
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bower: {
            build: {
                dest: 'public_html/assets/build/js/third_party'
            }
        },

        clean: {
            all: ["public_html/assets/build"],
            post: [
                "public_html/assets/build/js/third_party/requirejs-plugins.js"
            ]
        },

        img: {
            build: {
                src: 'public_html/assets/src/img',
                dest: 'public_html/assets/build/img'
            }
        },

        copy: {
            main: {
                files: [
					{
						expand: true,
						cwd: 'public_html/assets/src/vector/',
						src: ['*'],
						dest: 'public_html/assets/build/vector/',
						filter: 'isFile'
					}, // includes files in path
					{
						expand: true,
						cwd: 'public_html/assets/src/pdf/',
						src: ['*'],
						dest: 'public_html/assets/build/pdf/',
						filter: 'isFile'
					}, // includes files in path
					{
						expand: true,
						cwd: 'public_html/assets/src/krpano/',
						src: ['**'],
						dest: 'public_html/assets/build/krpano/',
						filter: 'isFile'
					}, // includes krpano in path
					{
						expand: true,
						cwd: 'public_html/assets/src/js/controllers/explore/',
						src: ['*.html'],
						dest: 'public_html/assets/build/js/controllers/explore/',
						filter: 'isFile'
					} // includes template file for the panorama
                ]
            }
        },

        'sftp-deploy': {
			default: {
				auth: {
					host: '176.34.244.212',
					port: 22,
					authKey: 'privateKeyEncrypted'
				},
				src: '.',
				dest: '/mnt/www_vhosts/falconandassociates.jwt-london.net',
				exclusions: [
					'./**/.DS_Store',
					'./.hg',
					'./.hgignore',
					'./.idea',
					'./.bowerrc',
					'./.ftppass',
					'./.jshintrc',
					'./package.json',
					'./Gruntfile.js',
					'./public_html/temp',
					'./public_html/assets/src',
					'./public_html/assets/build/krpano',
					'./public_html/images',
					'./public_html/themes',
					'./db',
					'./node_modules',
					'./README.md',
					'./app'
				],
				server_sep: '/'
			},
            all: {
                auth: {
                    host: '176.34.244.212',
                    port: 22,
                    authKey: 'privateKeyEncrypted'
                },
                src: '.',
                dest: '/mnt/www_vhosts/falconandassociates.jwt-london.net',
                exclusions: [
                    './**/.DS_Store',
                    './.hg',
                    './.hgignore',
                    './.idea',
                    './.bowerrc',
                    './.ftppass',
                    './.jshintrc',
                    './package.json',
                    './Gruntfile.js',
                    './public_html/assets/src',
					'./public_html/temp',
                    './public_html/images',
                    './db',
                    './node_modules',
                    './README.md'
                ],
                server_sep: '/'
            }
        },


        imagemin: {
            dynamic: {                         // Another target
                files: [
                    {
                        expand: true,                  // Enable dynamic expansion
                        cwd: 'public_html/assets/src/img/',                   // Src matches are relative to this path
                        src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                        dest: 'public_html/assets/build/img/'                  // Destination path prefix
                    }
                ]
            }
        },

        cssmin: {
            options: {
                banner: '/* \n' +
                    ' * <%= pkg.description %> <%= grunt.template.today("yyyy-mm-dd") %> \n' +
                    ' * <%= pkg.author %> \n' +
                    ' */ \n'
            },
            minify: {
                expand: true,
                cwd: 'public_html/assets/src/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'public_html/assets/build/css/',
                ext: '.css'
            }
        },


        connect: {
            server: {
                options: {
                    port: 3000,
                    base: 'public_html',
                    open: true
                }
            }
        },

        watch: {
            css: {
                files: [
                    'templates/default_site/**/*.html',
                    'public_html/assets/src/js/**/*.js',
                    'public_html/assets/src/css/**/*.css',
                    'public_html/assets/src/img/*',
                    'public_html/assets/nobuild/js/**/*.js',
                    'public_html/assets/nobuild/css/**/*.css',
                    'public_html/assets/nobuild/img/**/*'
                ],
                tasks: [],
                options: {
                    livereload: true,
                },
            },
        },

        // specifying JSHint options and globals
        // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#specifying-jshint-options-and-globals
        jshint: {
            all: [
                'Gruntfile.js',
                'public_html/assets/src/js/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        uglify: {
            options: {
                report: 'min',
                preserveComments: 'some',
                banner: '/* \n' +
                    ' * <%= pkg.description %> <%= grunt.template.today("yyyy-mm-dd") %> \n' +
                    ' * <%= pkg.author %> \n' +
                    ' */ \n'
            },
            falcon: {
                files: [{
					'public_html/assets/build/js/falcon.js': [
                        'public_html/assets/build/js/third_party/jquery.js',
                        'public_html/assets/build/js/third_party/requirejs.js',
                        'public_html/assets/src/js/*.js'
					]
                }]
            },
			controllers: {
				files: [{
					expand: true,
					cwd: 'public_html/assets/src/js/controllers',
					src: ['**/*.js'],
					dest: 'public_html/assets/build/js/controllers/',
					ext: '.js'
				}]
			},
			components: {
				files: [{
					expand: true,
					cwd: 'public_html/assets/src/js/components',
					src: ['**/*.js'],
					dest: 'public_html/assets/build/js/components/',
					ext: '.js'
				}]
			},
            plugins: {
                files: [
                    {
                        expand: true,
                        cwd: 'public_html/assets/src/js/third_party/requirejs-plugins',
                        src: ['src/*', 'lib/*'],
                        dest: 'public_html/assets/build/js/third_party/requirejs-plugins',
                        filter: 'isFile',
                        ext: '.js'
                    }
                ]
            }
        }
    });

    // Alias the `test` task to run the `mocha` task instead
    grunt.registerTask('default', ['clean', 'imagemin', 'copy', 'cssmin', /*'jshint',*/ 'bower', 'uglify', 'clean:post']);
    grunt.registerTask('livereload', ['watch']);
    grunt.registerTask('deploy', ['default', 'sftp-deploy:default']);
    grunt.registerTask('deploy:all', ['default', 'sftp-deploy:all']);

};
