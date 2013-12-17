module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    // Task: Lint all JS files
    jshint: {
      files: ['public/js/application/**/*.js', 'app/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: false,
          module: true
        }
      }
    },

    // Task: Lint all HTML files
    htmllint: {
      all: ["app/views/index/*.html.ejs"]
    },

    // Task: Compile SASS to CSS
    less: {
      compile: {
        files: {
          'public/styles/style.css': 'public/styles/style.less'
        }
      }
    },

    // Task: Lint CSS
    csslint: {
      strict: {
        options: {
          import: 2,
          'adjoining-classes': false,
          'box-model': false
        },
        src: ['public/styles/style.css']
      }
    },

    // Task: Uglify build JS
    requirejs: {
      production: {
        options: {
          name: 'app',
          baseUrl: "public/js/application",
          mainConfigFile: "public/js/application/bootstrap.js",
          out: "public/js/build/build.js"
        }
      }
    },

    // Task: Restart Node
    shell: {
      nodemon: {
        command: 'lcm server',
        options: {
          stdout: true,
          stderr: true
        }
      }
    },

    // Task: Watch
    watch: {
      jshint: {
        files: ['public/js/**/*.js', 'Gruntfile.js', 'app/**/*.js'],
        tasks: ['jshint']
      },
      less: {
        files: ['public/styles/*.less'],
        tasks: ['less']
      },
      htmllint: {
        files: ['app/views/**/*.html.ejs'],
        tasks: ['htmllint']
      },
      csslint: {
        files: ['public/styles/style.css'],
        tasks: ['csslint']
      }
    }

  });

  // Load the plugin for watch
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Load the plugin for JSHint
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load the plugin for HTML lint
  grunt.loadNpmTasks('grunt-html');

  // Load the plugin for HTML lint
  grunt.loadNpmTasks('grunt-contrib-csslint');

  // Load the plugin for LESS
  grunt.loadNpmTasks('grunt-contrib-less');

   // Load the plugin for RequireJS
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Load the plugin for develop
  grunt.loadNpmTasks('grunt-shell');

  // Default task(s)
  grunt.registerTask('default', ['jshint']);

};