// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
  paths: {
    jquery: 'libs/jquery-2.1.4.min',
    underscore: 'libs/underscore.min',
    backbone: 'libs/backbone.min',
    bootstrap: 'libs/bootstrap.min'
  }

});
 // Load our app module and pass it to our definition function
require(['app'], function(App){
  // The "app" dependency is passed in as "App"
  App.initialize();
});