module.exports = function(grunt) {

  // Report elapsed execution time of grunt tasks.
  require('time-grunt')(grunt);

  grunt.initConfig({

    config: {
      src: 'app',
      dev: 'www'
    },

    // manifests
    //--------------------------------------------------------------
    // Contains data to populate the meta banner with

    pkg: grunt.file.readJSON('package.json'),

    // meta
    //--------------------------------------------------------------
    // Generates a banner to be placed on the top of all JS and CSS

    meta: {
      banner: '/*\n * <%= pkg.title %> - r<%= pkg.version %>\n' +
          ' * <%= grunt.template.today("yyyy-mm-dd") %> */' +
          grunt.util.linefeed + grunt.util.linefeed,
    },

    // watch
    //--------------------------------------------------------------
    // Watches for changed files and runs appropriate tasks

    watch: {
      markup: {
        files: ['<%= config.src %>/**/*.{hbs,json}'],
        tasks: ['assemble:dev']
      },
      styles: {
        files: ['<%= config.src %>/assets/scss/**/*.scss'],
        tasks: ['compass:dev']
      },
      images: {
        files: ['<%= config.src %>/assets/images/**/*.{png,jpg,gif,ico,svg}'],
        tasks: ['newer:imagemin']
      },
      scripts: {
        files: ['<%= config.src %>/assets/js/**/*.js'],
        tasks: ['jscs', 'concat:dev', 'concat:vendor']
      },
      copy: {
        files: ['<%= config.src %>/assets/{,*/}*.{js}','<%= config.src %>/assets/js/**/*.js','<%= config.src %>/_toc/{,*/}**'],
        tasks: ['newer:copy:statics']
      }
    },

    // clean
    //--------------------------------------------------------------
    // Empties folders to start fresh

    clean: {
      all: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dev %>/*'
          ]
        }]
      }
    },

    // jshint
    //--------------------------------------------------------------
    // Make sure code styles are up to par and there are no obvious mistakes

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.src %>/assets/js/**/*.js',
        '!<%= config.src %>/assets/js/vendor/*'
      ]
    },

    // jscs
    //--------------------------------------------------------------
    // javascript style consistency

    jscs: {
      options: {
        config: '.jscsrc'
      },
      all: [
        '<%= config.src %>/assets/js/**/*.js',
        '!<%= config.src %>/assets/js/vendor/*'
      ]
    },

    // concat
    //--------------------------------------------------------------
    // Joins files together

    concat: {
      options: {
        banner: '<%= meta.banner %>',
        separator: grunt.util.linefeed + grunt.util.linefeed
      },
      dev: {
        src: [  // common files
          '<%= config.src %>/assets/js/main/globals.js',
          '<%= config.src %>/assets/js/main/init.js'
        ],
        dest: '<%= config.dev %>/js/main.js'
      },
      vendor: {
        src: [  // vendor files
          '<%= config.src %>/assets/js/vendor/jquery-2.1.1.min.js',
          '<%= config.src %>/assets/js/vendor/lodash.min.js',
          '<%= config.src %>/assets/js/vendor/slider.js',
          'bower_components/fabric/dist/fabric.min.js'
        ],
        dest: '<%= config.dev %>/js/vendor.min.js'
      }
    },

    // assemble
    //--------------------------------------------------------------
    // Compiles Handlebars templates to static HTML

    assemble: {
      options: {
        today: '<%= grunt.template.today() %>',
        assets: '/',
        helpers: ['helper-prettify'],
        partials: [
          '<%= config.src %>/_includes/{,*/}*.hbs',
          '<%= config.src %>/_layouts/{,*/}*.hbs'],
        layoutdir: '<%= config.src %>/_layouts/',
        layout: false,
        data: ['<%= config.src %>/_data/**/*.{json,yml}'],
        prettify: {
          indent: 2,
          condense: true,
          padcomments: true
        }
      },
      dev: {
        files: [
          {
            expand: true,
            cwd: '<%= config.src %>/',
            src: ['*.hbs', '_mock/*.hbs'],
            dest: '<%= config.dev %>'
          }
        ]
      }
    },

    // imagemin
    //--------------------------------------------------------------
    // Minify images using OptiPNG, pngquant, jpegtran and gifsicle.
    // Images will be cached and only minified again if they change.

    // Optimizes images for web
    imagemin: {
      all: {
        files: [{
          expand: true,
          cwd: '<%= config.src %>/assets/images/',
          src: ['**/*.{jpg,jpeg,png,gif,ico,svg}'],
          dest: '<%= config.dev %>/images/'
        }]
      }
    },

    // uglify
    //--------------------------------------------------------------
    // Minifies JavaScript

    uglify: {
      options: {
        banner: '<%= meta.banner %>',
        separator: grunt.util.linefeed + grunt.util.linefeed
      },
      all: {
        files: [
          {
            '<%= config.dev %>/js/main.min.js': ['<%= config.dev %>/js/main.js'],
          },
          {
            expand: true,
            cwd: '<%= config.src %>/assets/js/',
            src: ['*.js'],
            dest: '<%= config.dev %>/js/',
            ext: '.min.js'
          }
        ]
      }
    },

    // compass
    //--------------------------------------------------------------

    compass: {
      dev: {
        options: {
          sassDir: '<%= config.src %>/assets/scss',
          cssDir: '<%= config.dev %>/css',
          imagesDir: 'images',
          javascriptDir: 'js',
          fontsDir: 'css/fonts',
          httpImagesPath: 'images',
          httpFontsPath: 'fonts',
          relativeAssets: false,
          assetCacheBuster: false,
          outputStyle: 'expanded',
          noLineComments: false
        }
      },
      deploy: {
        options: {
          sassDir: '<%= config.src %>/assets/scss',
          cssDir: '<%= config.dev %>/css',
          imagesDir: 'images',
          javascriptDir: 'js',
          fontsDir: 'css/fonts',
          httpImagesPath: 'images',
          httpFontsPath: 'fonts',
          relativeAssets: false,
          assetCacheBuster: false,
          outputStyle: 'compressed',
          noLineComments: true
        }
      }
    },

    // convert
    //--------------------------------------------------------------
    // Create any JSON output from static datasets
    convert: {
      options: {
        explicitArray: false,
      },
      csv2json: {
        files: [
          {
            src: '<%= config.src %>/assets/csv/agi-state-2012.csv',
            dest: '<%= config.dev %>/data/agi-state-2012.json'
          },
          {
            src: '<%= config.src %>/assets/csv/TIAACharitable-Performance.csv',
            dest: '<%= config.src %>/assets/data/TIAACharitable-Performance.json'
          },
          {
            src: '<%= config.src %>/assets/csv/TIAACharitable-PerformanceDisclaimers.csv',
            dest: '<%= config.src %>/assets/data/TIAACharitable-PerformanceDisclaimers.json'
          },
          {
            src: '<%= config.src %>/assets/csv/TIAACharitable-PerformanceExpenseRatios.csv',
            dest: '<%= config.src %>/assets/data/TIAACharitable-PerformanceExpenseRatios.json'
          }
        ]
      }
    },

    // copy
    //--------------------------------------------------------------
    // Put files not handled in other tasks here

    copy: {
      statics: {
        files: [
          {
            expand: true,
            cwd: '<%= config.src %>/assets/images/',
            src: ['**/*.{svg}'],
            dest: '<%= config.dev %>/images/'
          },
          {
            expand: true,
            cwd: '<%= config.src %>/assets/js/',
            src: ['*.js'],
            dest: '<%= config.dev %>/js/'
          },
          {
            expand: true,
            cwd: '<%= config.src %>/_data/',
            src: ['lottery.json'],
            dest: '<%= config.dev %>/data/'
          }
        ]
      }
    }
  });

  // Load plugins to provide the necessary tasks
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-jscs');
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('base', ['clean','assemble:dev', 'imagemin', 'copy', 'concat:dev', 'concat:vendor', 'uglify']);
  grunt.registerTask('default', ['base', 'compass:dev']);
  grunt.registerTask('start', ['default', 'watch']);
};