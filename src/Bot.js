const Discord = require('discord.io');
const util = require('util');
const path = require('path');
import IO from './IO';

class Bot {

  constructor() {
    this.io = new IO();
    this.CONF_FILE = './conf.json';
  }

  start = () => {
    this.io.getAllJsonValue(this.CONF_FILE)
    .then(conf => {

      console.log(conf);
      /**
      * initialises the bot into the server
      */
      this.bot = new Discord.Client({
        token: conf.token,
        autorun: true,
      });

      /**
      * waits for the bot to be connected to the server
      */
      this.bot.on('ready', () => {
        // console.log(require('util').inspect(this.bot.channels['366395988601995284'], { depth: null }));
        console.log('Logged in as %s - %s\n', this.bot.username, this.bot.id);
        this.bot.setPresence({
          status: 'online', // TODO move this to conf
          game: {
            name: 'with little cats' // TODO move this to conf later
          }
        });
      });

      /**
      * checks each message to see if they are commands or anything else of interest
      */
      this.bot.on('message', function (user, userID, channelID, message, evt) {
        // Listen for messages that will start with `!`
        if (message.substring(0, 1) == '!') {
          var args = message.substring(1).split(' ');
          var cmd = args[0];

          args = args.splice(1);
          switch(cmd) {
            // !ping
            case 'ping':
            this.bot.sendMessage({
              to: channelID,
              message: 'Pong!',
              typing: true
            });
            break;
            default:
            this.bot.sendMessage({
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
      // this.bot.on('presence', ( user, userID, status, game, event ) => {
      //   // console.log('user => ' + user);
      //   // console.log('userID => ' + userID);
      //   // console.log('status => ' + status);
      //   // console.log(util.inspect(game));
      //   // console.log(util.inspect(event));
      //
      //   // send a message in the text chat
      //   var msg;
      //   // check if they are playing or aren't playing a game
      //   if (game === null) {
      //     if (event.d.status === 'offline') {
      //       msg = event.d.nick + ' has left the server, may we remember them.';
      //     }
      //   } else {
      //     msg = event.d.nick + ' has just started playing ' + game.name;
      //   }
      //   this.bot.sendMessage({
      //     to: conf.textChannel,
      //     message: msg
      //   });
      // });

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

      this.bot.on('voiceStateUpdate', event => {
        let user = this.getUser(event.d.user_id, event.d.channel_id);
        let channel = this.getChannel(event.d.channel_id);
        if (event.d.channel_id) {
          this.bot.sendMessage({
            to: conf.textChannel,
            message: `${user.nick} connected to ${channel.name}`
          });
        }
      });
    })
    .catch(error => {
      console.log(error);
    });
  } // end start

  getUser = (userID, channelID) => {
    return this.bot.servers[this.bot.channels[channelID].guild_id].members[userID];
  }

  getChannel = channelID => {
    return this.bot.channels[channelID];
  }

}


export default Bot;
