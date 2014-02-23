# Grunt Boilerplate

### dependencies

`npm install -g grunt-cli bower`

`cd grunt-boilerplate && npm install`

## Usage

 * `./etc` contains configuration. files that matches `/etc/\*secret\*` are git-ignored 
 * `./app/client/*.js` is browserified on save when using `grunt dev`
 * `./app/client/css/*.less` is also compiled and fed through _autoprefixer_ on save.
 * `./app/server/templates` contains the server-side views, layouts, partials.
 * `./app/server/controllers` is where you would add routes. you can override what css/js to include for a given route by modifying `res.locals.page`

### build it

`grunt build:prod` will generate all assets including minified versions.

### pass the tests

`grunt test` and `npm test` do the same thing: run all tests.
`grunt qunit` builds and runs the client-side tests only.

### run the server

`grunt dev` for the live reload magic.

`NODE_ENV=production npm start` runs in the background using minified assets.
