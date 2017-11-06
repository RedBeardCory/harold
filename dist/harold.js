/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Data = __webpack_require__(1);

var _Data2 = _interopRequireDefault(_Data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Discord = __webpack_require__(2);
var util = __webpack_require__(3);
var fs = __webpack_require__(4);


/**
 * initialises the bot into the server
 */
var bot = new Discord.Client({
  token: conf.token,
  autorun: true
});

/**
 * waits for the bot to be connected to the server
 */
bot.on('ready', function () {
  console.log('Logged in as %s - %s\n', bot.username, bot.id);
  bot.setPresence({
    status: 'online', // TODO move this to conf
    game: {
      name: 'with little cats' // TODO move this to conf later
    }
  });
});

/**
 * checks each message to see if they are commands or anything else of interest
 * @param  {object} user      the user object returned for each message
 * @param  {string} userID    the user id
 * @param  {string} channelID the channel id
 * @param  {string} message   the message actually sent
 * @param  {object} evt       the event itself
 * @return {undefined}
 */
bot.on('message', function (user, userID, channelID, message, evt) {
  // Listen for messages that will start with `!`
  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      // !ping
      case 'ping':
        bot.sendMessage({
          to: channelID,
          message: 'Pong!',
          typing: true
        });
        break;
      default:
        bot.sendMessage({
          to: channelID,
          message: 'This is not the command you are looking for *mystical hand wave*',
          typing: true
        });
        break;
    }
  }
});

/**
 * monitors the users presence in the server, and what they are doing
 */
bot.on('presence', function (user, userID, status, game, event) {
  // console.log('user => ' + user);
  // console.log('userID => ' + userID);
  // console.log('status => ' + status);
  // console.log(util.inspect(game));
  // console.log(util.inspect(event));

  // send a message in the text chat
  var msg;
  // check if they are playing or aren't playing a game
  if (game === null) {
    if (event.d.status === 'offline') {
      msg = event.d.nick + ' has left the server, may we remember them.';
    }
  } else {
    msg = event.d.nick + ' has just started playing ' + game.name;
  }
  bot.sendMessage({
    to: conf.textChannel,
    message: msg
  });
});

// voiceStateUpdate has an object
/*
d: {
  user_id: '11111111111111111111111',
  suppress: false,
  session_id: 'e2f2798e5f0b13542e7a41c626182820',
  self_video: false,
  self_mute: true,
  self_deaf: true,
  mute: false,
  guild_id: '228814605923647488',
  deaf: false,
  channel_id: '361453424249929728'
}

channel_id will be null if the user disconnected
otherwise it will update to the new channel the user connected to
 */

bot.on('voiceStateUpdate', function (event) {
  console.log(util.inspect(event));
});

/**
 * updates the config file
 * @param  {string} key   the json key to edit
 * @param  {mixed} value the value to set for the json object
 * @return {undefined}       no return
 */
updateJson = function updateJson(key, value) {

  var oldConf;

  // open the file
  fs.readFile('./conf.json', 'utf8', function (error, data) {
    if (error) {
      console.error(error);
    }

    // set the temp object
    var oldConf = JSON.parse(data);

    console.log(util.inspect(data));

    if (oldConf[key]) {
      oldConf[key] = value;
    } else {
      console.error("couldn\'t find key");
    }

    var write = JSON.stringify(oldConf);

    fs.writeFile('./conf.json', write, 'utf8', function (error) {
      if (error) {
        return console.error(error);
      } else {
        console.log('updated conf.json');
      }
    });
  });
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Data = function Data() {
  _classCallCheck(this, Data);

  this.test = "testing";
};

exports.default = Data;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("discord.io");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ })
/******/ ]);