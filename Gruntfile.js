module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'calc.min.js': ['calc.min.js']
				}
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'calc.js'],
			options: {
				evil: true,
				// options here to override JSHint defaults
				globals: {
					console: true,
					module: true,
					document: true
				}
			}
		},
		includes: {
			options: {
				includeRegexp: /^\s*?\/\/\s*import\s+['"]?([^'"]+)['"]?\s*$/,
				duplicates: false,
				flatten: false
			},
			dist: {
				files: [
					{
					expand: true,

					src: ['calc.js', '!libs/**/*.js'],
					ext: '.min.js'
					}
				]
			}
		},
	    watch: {
			options: {
				spawn: true
			},
			js: {
				files: ['calc.js', '!libs/**/*.js'],
				tasks: ['jshint', 'includes:dist', 'uglify:dist']
			}
	    },

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-includes');

	grunt.registerTask('default', ['jshint', 'includes:dist', 'uglify:dist']);

};
