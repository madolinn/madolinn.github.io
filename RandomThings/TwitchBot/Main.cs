using System;
using UnityEngine;
using Verse;

namespace RandomThings
{
	public class RandomThings : Mod
	{

		public static Settings settings;
		public static IRCClient irc;

		public RandomThings(ModContentPack content) : base(content)
		{
			settings = new Settings();
			settings.bootUp();
			if (Settings.getProperty("TwitchBot", "enabled") == "true")
			{
				irc = new IRCClient();
			}
		}

		public override string SettingsCategory() => "Random Things";

		public override void DoSettingsWindowContents(Rect inRect)
		{
			GUI.BeginGroup(inRect);
			Widgets.Label(new Rect(0f, 0f, 100f, 100f), "What the fuck is this shit");
			if (Widgets.ButtonText(new Rect(100f, 100f, 300f, 25f), "A Button"))
			{
				Log.Warning("I clicked a Button");
			}
			GUI.EndGroup();
		}
	}
}
