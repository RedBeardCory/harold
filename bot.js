const Discord = require('discord.io');
const conf = require('./conf.json');
const util = require('util');

const bot = new Discord.Client({
  token: conf.token,
  autorun: true,
  // bot: false,
});

bot.on('ready', () => {
  console.log('Logged in as %s - %s\n', bot.username, bot.id);
  bot.setPresence({
    status: 'online',
    game: {
      name: 'with little cats' // move this to conf later
    }
  });
});

bot.on('message', function (user, userID, channelID, message, evt) {
  // Listen for messages that will start with `!`
  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch(cmd) {
      // !ping
      case 'ping':
        bot.simulateTyping( channelID );
        bot.sendMessage({
          to: channelID,
          message: 'Pong!'
        });
      break;
      default:
        bot.sendMessage({
          to: channelID,
          message: 'This is not the command you are looking for *mystical hand wave*'
        })
      break;
    }
  }
});

// need to look at how to check for user joining voice channel
bot.on('presence', ( user, userID, status, game, event ) => {
  console.log('user => ' + user);
  console.log('userID => ' + userID);
  console.log('status => ' + status);
  console.log(util.inspect(game));
  console.log(util.inspect(event));

  // send a message in the text chat
  bot.simulateTyping();

  var msg;
  // check if they are playing or aren't playing a game
  if (game === null) {
    if (event.d.status === 'offline') {
      msg = event.d.nick + ' has left the server, may we remember them.';
    } else {
      msg = event.d.nick + ' has rage quit!';
    }
  } else {
    msg = event.d.nick + ' has just started playing ' + game.name;
  }
  bot.sendMessage({
    to: conf.textChannel,
    message: msg
  });
});

// Automatically reconnect if connection drops
bot.on('disconnect', () => {
  bot.connect();
});

// Monitors a voice channel for particular changes
monitorVoiceChannel = (channelID, serverID) => {
  var users = bot.servers[serverID].channels[channelID].members;
  console.log(utill.inspect(users));
  setInterval(() => {
    // check to see if there are any changes since last time
    var nextUsers = bot.servers[serverID].channels[channelID].members;
    console.log(util.inspect(nextUsers));
  }, 10000);
}
