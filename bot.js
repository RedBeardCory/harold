const Discord = require('discord.io');
const conf = require('./conf.json');
const util = require('util');
const fs = require('fs');

/**
 * initialises the bot into the server
 */
const bot = new Discord.Client({
  token: conf.token,
  autorun: true,
});

/**
 * waits for the bot to be connected to the server 
 */
bot.on('ready', () => {
  console.log('Logged in as %s - %s\n', bot.username, bot.id);
  bot.setPresence({
    status: 'online', // move this to conf
    game: {
      name: 'with little cats' // move this to conf later
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
    switch(cmd) {
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
        })
      break;
    }
  }
});

// need to keep a variable with the previous state of users to properly track this better
bot.on('presence', ( user, userID, status, game, event ) => {
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
 */

bot.on('voiceStateUpdate', event => {
  console.log(util.inspect(event));
});

/**
 * updates the config file
 * @param  {string} key   the json key to edit
 * @param  {string} value the value to set for the json object
 * @return {undefined}       no return
 */
updateJson = (key, value) => {

  var oldConf;

  // open the file
  fs.readFile('./conf.json', 'utf8', (error, data) => {
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

    fs.writeFile('./conf.json', write, 'utf8', error => {
      if (error) {
        return console.error(error);
      } else {
        console.log('updated conf.json');
      }
    });
  });
}
