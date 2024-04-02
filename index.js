const { Client, GatewayIntentBits } = require("discord.js");
const ytdl = require("ytdl-core");
const {
  joinVoiceChannel,
  createAudioResource,
  AudioPlayerStatus,
  createAudioPlayer,
  StreamType,
} = require("@discordjs/voice");
const YouTube = require("youtube-sr").default;
require("dotenv").config();

const COMMAND_ALIAS = ">";

/**
 * Returns the command with the alias prefix.
 * @param {string} command - The command to prefix.
 * @returns {string} The prefixed command.
 */
const commandWithAlias = (command) => `${COMMAND_ALIAS}${command}`;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

/**
 * Handles the 'messageCreate' event.
 * @param {Message} message - The message that was created.
 */
client.on("messageCreate", async (message) => {
  if (message.content.startsWith(commandWithAlias("play"))) {
    handlePlayCommand(message);
  } else if (message.content.startsWith(commandWithAlias("searchv"))) {
    handleSearchCommand(message);
  } else if (message.content.startsWith(commandWithAlias("dc"))) {
    handleDisconnectCommand();
  }
});

/**
 * Handles the 'play' command.
 * @param {Message} message - The message that triggered the command.
 */
async function handlePlayCommand(message) {
  console.log(`[${new Date().toISOString()}] play command received`);
  const args = message.content.split(" ");
  const url = args[1];

  if (!message.member.voice.channel) {
    return message.reply("You need to join a voice channel first!");
  }

  if (!ytdl.validateURL(url)) {
    return message.reply("Please provide a valid YouTube URL.");
  }

  playAudio(url, message);
}

/**
 * Handles the 'searchv' command.
 * @param {Message} message - The message that triggered the command.
 */
async function handleSearchCommand(message) {
  console.log(`[${new Date().toISOString()}] searchv command received`);
  const searchQuery = message.content
    .slice(commandWithAlias("searchv").length)
    .trim();

  if (!message.member.voice.channel) {
    return message.reply("You need to join a voice channel first!");
  }

  const searchResult = await YouTube.search(searchQuery, { limit: 1 });
  if (searchResult.length === 0) {
    return message.reply("No videos found for that search query.");
  }

  const video = searchResult[0];
  const url = video.url;

  message.channel.send(`Playing: **${video.title}**\n${video.url}`);

  playAudio(url, message);
}

/**
 * Handles the 'dc' command.
 */
function handleDisconnectCommand() {
  console.log(`[${new Date().toISOString()}] dc command received`);
  if (player) {
    player.stop();
  }
  if (connection) {
    connection.destroy();
  }
  connection = null;
  player = null;
}

/**
 * Plays the audio from the given URL in the voice channel of the message author.
 * @param {string} url - The URL of the audio to play.
 * @param {Message} message - The message that triggered the command.
 */
async function playAudio(url, message) {
  const connection = joinVoiceChannel({
    channelId: message.member.voice.channel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator,
  });

  const stream = ytdl(url, { filter: "audio" });
  stream.on("error", (error) => {
    console.error("Stream error:", error);
  });
  const resource = createAudioResource(stream);
  const player = createAudioPlayer();

  player.play(resource);

  player.on(AudioPlayerStatus.Idle, () => {
    connection.destroy();
  });

  player.on("error", (error) => {
    console.error("Error:", error);
  });

  try {
    connection.subscribe(player);
  } catch (error) {
    console.error("Connection error:", error);
  }
}

client.login(process.env.DISCORD_TOKEN);
