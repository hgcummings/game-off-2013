## The game

You are in charge of a tiny planet with a small but growing population. Build farms and facilities to feed them while keeping climate change under control.

Remember, your tiny planet only has a micro-climate, so change can be dramatic!

![alt text](https://raw.github.com/Softwire/game-off-2013/master/screenshot.png "In-game screenshot")

### 3rd-party libraries

Open source:
* [D3](http://d3js.org/)
* [jQuery](http://jquery.com/)
* [Bootstrap](http://getbootstrap.com/)
* [Underscore](http://underscorejs.org/)
* [requireJS](http://requirejs.org/)
* [requirejs-plugins](https://github.com/millermedeiros/requirejs-plugins)
* [jasmine](http://pivotal.github.io/jasmine/)
* [Squire.js](https://github.com/iammerrick/Squire.js/)
* [rng-js](https://github.com/skeeto/rng-js)

Other:
* [Google Charts API](https://developers.google.com/chart/)

## The Challenge

We have the entire month of November to create a **web-based** game *loosely* based on the theme "change".

## Developer setup

### Pre-requisites

Install node.js from http://nodejs.org/

```
npm install -g grunt-cli
```

### Setup

```
git clone git@github.com:Softwire/game-off-2013.git gameoff
cd gameoff
npm install
```

### Development

Run static analysis (JSLint)
```
grunt
```

Run continuous tests (you may need to set the CHROME_BIN environment variable to the location of your Google Chrome executable)
```
karma start
```

Coverage reports should appear under /coverage.

You can also run continuous tests within WebStorm by creating a new Karma run configuration and specifying the project's Karma config file.

### Launching the game

If you're using WebStorm/IntelliJ, just right-click on index.html and select "Open in browser".

Otherwise, you can just run a simple HTTP server, e.g.
```
npm install -g http-server
http-server src -p 8001
```
Then visit http://localhost:8001
