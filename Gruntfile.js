module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    /**
     * Pull in the package.json file so we can read its metadata.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * Here's a banner with some template variables.
     * We'll be inserting it at the top of minified assets.
     */
    banner: {

      cfpb:
        '/*!                                      \n' +
        '            /$$$$$$          /$$        \n' +
        '           /$$__  $$        | $$        \n' +
        '  /$$$$$$$| $$  \\__//$$$$$$ | $$$$$$$  \n' +
        ' /$$_____/| $$$$   /$$__  $$| $$__  $$  \n' +
        '| $$      | $$_/  | $$  \\ $$| $$  \\ $$\n' +
        '| $$      | $$    | $$  | $$| $$  | $$  \n' +
        '|  $$$$$$$| $$    | $$$$$$$/| $$$$$$$/  \n' +
        ' \\_______/|__/    | $$____/ |_______/  \n' +
        '                  | $$                  \n' +
        '                  | $$                  \n' +
        '                  |__/                  \n\n' +
        '* <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n\n',

      vendors: grunt.file.read('docs/vendor-licenses.txt')

    },

    /**
     * LESS: https://github.com/gruntjs/grunt-contrib-less
     * 
     * Compile LESS files to CSS.
     */
    less: {
      main: {
        options: {
          banner: '<%= banner.cfpb %>',
          paths: ['src/static']
        },
        files: {
          'dist/static/css/main.css': ['src/static/less/main.less']
        }
      }
    },

    /**
     * CSSMin: https://github.com/gruntjs/grunt-contrib-cssmin
     * 
     * Compress CSS files.
     */
    cssmin: {
      combine: {
        keepSpecialComments: '*',
        files: {
          'dist/static/css/main.min.css': ['<%= banner.cfpb %>', 'dist/static/css/main.css']
        }
      }
    },

    /**
     * HTMLmin: https://github.com/gruntjs/grunt-contrib-htmlmin
     * 
     * Minify HTML.
     */
    htmlmin: {
      dist: {
        options: {
          removeComments: true
        },
        files: {
          'dist/index.html': 'src/index.html',
          'dist/explore.html': 'src/explore.html'
        }
      }
    },

    /**
     * JSHint: https://github.com/gruntjs/grunt-contrib-jshint
     * 
     * Validate files with JSHint.
     * Below are options that conform to idiomatic.js standards.
     * Feel free to add/remove your favorites: http://www.jshint.com/docs/#options
     */
    jshint: {
      options: {
        camelcase: false,
        curly: true,
        forin: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        quotmark: true,
        sub: true,
        boss: true,
        strict: true,
        evil: true,
        eqnull: true,
        browser: true,
        plusplus: false,
        globals: {
          jQuery: true,
          $: true,
          Backbone: true,
          _: true,
          module: true,
          require: true,
          define: true,
          console: true,
          EventEmitter: true
        }
      },
      files: ['Gruntfile.js', 'src/static/js/**/*.js', '!src/static/js/templates/template.js']
    },

    /**
     * Shell: https://github.com/sindresorhus/grunt-shell
     * 
     * Grunt task to run shell commands.
     * For now we're just copying the src file over to dist and
     * zipping the example directory.
     */
    shell: {
      go: {
        command: [
          'bower install',
          'grunt build',
          'grunt'
        ].join('&&')
      },
      dist: {
        command: [
          'cp -r src/static/fonts dist/static',
          'cp -r src/static/img dist/static',
          'cp -r src/static/js dist/static',
          'cp src/static/vendor/cfpb-font-icons/static/css/icons-ie7.css dist/static/css/icons-ie7.css',
          'cp src/static/vendor/html5shiv/dist/* dist/static/js/',
          'cp src/static/vendor/respond/respond.min.js dist/static/js/',
          'cp src/static/vendor/zeroclipboard/* dist/static/js/zeroclipboard/',
          'cp src/static/vendor/chosen/public/chosen-* dist/static/css'
        ].join('&&')
      }
    },

    /**
     * JST: https://github.com/gruntjs/grunt-contrib-jst
     * 
     * Precompile Underscore templates to JST file.
     */
    jst: {
      compile: {
        options: {
          namespace: 'PDP.templates',
          processName: function (filename) {
            return filename.split('/').pop().split('.')[0];
          },
          templateSettings: {
            pretty: true
          }
        },
        files: {
          'src/static/js/templates/template.js': ['src/static/js/templates/*.html']
        }
      }
    },

    /**
     * Uglify: https://github.com/gruntjs/grunt-contrib-uglify
     * 
     * Minify JS files.
     * Make sure to add any other JS libraries/files you'll be using.
     */
    uglify: {
      options: {
        banner: '<%= banner.cfpb %> <%= banner.vendors %>',
        compress: false,
        mangle: false,
        beautify: true
      },
      all: {
        files: {
          'dist/static/js/all.min.js': [
            'src/static/vendor/json3/lib/json3.js',
            'src/static/vendor/jquery/jquery.js',
            'src/static/vendor/lodash/lodash.js',
            'src/static/vendor/eventEmitter/EventEmitter.js',
            'src/static/vendor/chosen/public/chosen.jquery.js',
            'src/static/vendor/bootstrap/js/bootstrap-tooltip.js',
            'src/static/vendor/tidy-table/jquery.tidy.table.js',
            'src/static/vendor/jquery-ui/ui/jquery.ui.core.js',
            'src/static/vendor/jquery-ui/ui/jquery.ui.widget.js',
            'src/static/vendor/jquery-ui/ui/jquery.ui.mouse.js',
            'src/static/vendor/jquery-ui/ui/jquery.ui.slider.js',
            'src/static/vendor/zeroclipboard/ZeroClipboard.js',
            'src/static/js/templates/template.js',
            'src/static/js/modules/*.js',
            'src/static/js/main.js'
          ]
        }
      },
      main: {
        files: {
          'dist/static/js/main.min.js': [
            'src/static/vendor/json3/lib/json3.js',
            'src/static/vendor/jquery/jquery.js',
            'src/static/vendor/lodash/lodash.js',
            'src/static/vendor/bootstrap/js/bootstrap-tooltip.js'
          ]
        }
      },
      home: {
        files: {
          'dist/static/js/home.min.js': [
            'src/static/js/pages/home.js',
          ]
        }
      },
      explore: {
        files: {
          'dist/static/js/explore.min.js': [
            'src/static/vendor/eventEmitter/EventEmitter.js',
            'src/static/vendor/chosen/public/chosen.jquery.js',
            'src/static/vendor/tidy-table/jquery.tidy.table.js',
            'src/static/vendor/jquery-ui/ui/jquery.ui.core.js',
            'src/static/vendor/jquery-ui/ui/jquery.ui.widget.js',
            'src/static/vendor/jquery-ui/ui/jquery.ui.mouse.js',
            'src/static/vendor/jquery-ui/ui/jquery.ui.slider.js',
            'src/static/vendor/zeroclipboard/ZeroClipboard.js',
            'src/static/js/templates/template.js',
            'src/static/js/modules/*.js',
            'src/static/js/main.js'
          ]
        }
      }
    },

    /**
     * Connect: https://github.com/gruntjs/grunt-contrib-connect
     * 
     * Start a connect web server.
     */
    connect: {
      demo: {
        options: {
          port: 8000,
          hostname: '*',
          base: 'dist'
        }
      },
      test: {
        options: {
          port: 8001
        }
      }
    },

    /**
     * Jasmine: https://github.com/gruntjs/grunt-contrib-jasmine
     * 
     * Run jasmine specs headlessly through PhantomJS.
     */
    jasmine: {
      pdp: {
        src: [
          'dist/static/js/all.min.js',
          'test/specs/helpers/debug.js'
        ],
        options: {
          specs: 'test/specs/*.js',
          helpers: 'test/specs/helpers/*.js'
        }
      }
    },

    /**
     * Docco: https://github.com/DavidSouther/grunt-docco
     * 
     * Grunt Docco plugin.
     */
    docco: {
      js: {
        src: ['src/static/js/**/*.js'],
        options: {
          output: 'docs/'
        }
      }
    },

    /**
     * Remove logging: https://github.com/ehynds/grunt-remove-logging
     * 
     * This task removes all console logging statements from your source code.
     */
    removelogging: {
      dist: {
        src: 'dist/static/js/main.min.js',
        dest: 'dist/static/js/main.min.js'
      }
    },

    /**
     * Watch: https://github.com/gruntjs/grunt-contrib-watch
     * 
     * Run predefined tasks whenever watched file patterns are added, changed or deleted.
     * Add files to monitor below.
     */
    watch: {
      scripts: {
        files: ['src/**/*.html', 'src/**/*.less', 'src/**/*.js', 'test/specs/*.js'],
        tasks: ['build', 'test']
      }
    }

  });

  /**
   * The above tasks are loaded here.
   */
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-cfpb-internal');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-remove-logging');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  /**
   * Create task aliases by registering new tasks
   */
  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('docs', ['removelogging', 'docco', 'build-cfpb']);
  grunt.registerTask('go', ['shell:go']);
  grunt.registerTask('build', ['htmlmin', 'shell:dist', 'jst', 'uglify', 'less', 'cssmin']);
  grunt.registerTask('st', ['jasmine:summaryTable']);

  /**
   * The 'default' task will run whenever `grunt` is run without specifying a task
   */
  grunt.registerTask('default', ['connect:demo', 'watch']);

};
