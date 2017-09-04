using RimWorld;
using UnityEngine;
using Verse;

namespace RandomThings
{
	public class MainTabWindow_RandomThings : MainTabWindow
	{

		//public Settings settings;
		public IRCClient irc;

		public override void DoWindowContents(Rect inRect)
		{
			base.DoWindowContents(new Rect(0f, 0f, 500f, 300f));
		}

		public MainTabWindow_RandomThings()
		{
			//settings = new Settings();
			irc = new IRCClient();
			Log.Warning("We are alive");
		}
	}
}