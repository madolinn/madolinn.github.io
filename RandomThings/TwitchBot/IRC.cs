using RimWorld;
using Verse;
using System;
using System.IO;
using System.Net.Sockets;

namespace RandomThings
{
	public class IRCClient
	{
		private TcpClient tcpClient;

		private string ip = "irc.twitch.tv";
		private int port = 6667;

		private StreamReader inIO;
		private StreamWriter outIO;

		private string user;
		private string pass;

		public IRCClient()
		{
			this.importSettings();
			Log.Warning(this.user);

			this.tcpClient = new TcpClient();
			this.connect();
		}

		public void importSettings()
		{
			this.user = Settings.getOrDefaultProperty("TwitchBot", "user", "");
			this.pass = Settings.getOrDefaultProperty("TwitchBot", "pass", "");
			RandomThings.settings.saveSettings();
		}

		public void connect()
		{
			if (this.user != "" && this.pass != "")
			{
				this.tcpClient = new TcpClient(this.ip, this.port);
				this.inIO = new StreamReader(this.tcpClient.GetStream());
				this.outIO = new StreamWriter(this.tcpClient.GetStream());
				this.outIO.WriteLine("PASS " + this.pass);
				this.outIO.WriteLine("NICK " + this.user);
				this.outIO.WriteLine("USER " + this.user + " 8 * :" + this.user);
				this.outIO.Flush();
				this.outIO.WriteLine("JOIN #" + this.user);
				this.outIO.Flush();
				this.sendMessage("Bot is now boopin.");
			}
			else
			{
				Log.Warning("Bot failed to Boop.");
			}
		}

		public void sendMessage(string str)
		{
			this.outIO.WriteLine(string.Concat(":", this.user, "!", this.user, "@", this.user, ".tmi.twitch.tv PRIVMSG #", this.user, " :(Bot) ", str));
			this.outIO.Flush();
		}

		public void sendRawText(string str)
		{

		}
	}
}