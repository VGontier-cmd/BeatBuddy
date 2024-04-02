# BeatBuddy

## Description
This project is a basic Discord bot designed to be run locally. It can play music from YouTube in a voice channel. The bot supports commands to play a specific video, search for a video, and disconnect from the voice channel. Its primary purpose is for local use, providing a personal music bot for your Discord server.

## Dependencies
- [discord.js](https://discord.js.org/#/) - Version 14.14.1
- [ytdl-core](https://www.npmjs.com/package/ytdl-core) - Version 4.11.5
- [@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice) - Version 0.16.1
- [youtube-sr](https://www.npmjs.com/package/youtube-sr) - Version 4.3.10
- [dotenv](https://www.npmjs.com/package/dotenv) - Version 16.4.5

## Installation
1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Create a `.env` file in the root directory of the project, and add your Discord token like so: `DISCORD_TOKEN=your_discord_token`.

## Usage
1. Run `npm start` to start the bot.
2. In Discord, use the following commands:
    - `>play [YouTube URL]` to play a specific video.
    - `>searchv [search query]` to search for a video and play the first result.
    - `>dc` to disconnect the bot from the voice channel.

## Contributing
Contributions are welcome. Please open an issue first to discuss what you would like to change.

## License
MIT