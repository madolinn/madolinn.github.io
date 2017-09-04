using Verse;
using UnityEngine;
using System;
using System.Linq;
using System.IO;
using System.Collections.Generic;
using System.Xml;
using System.Xml.Linq;

namespace RandomThings
{		
	public class Property : IEquatable<Property>
	{
		public string mod;
		public string prop;

		public Property(string m, string p)
		{
			this.mod = m;
			this.prop = p;
		}

		public override int GetHashCode()
		{
			/// What could possibly go wrong.
			return 13*mod.GetHashCode()*prop.GetHashCode();
		}

		public override bool Equals(object obj)
		{
			return Equals(obj as Property);
		}
		public bool Equals(Property p)
		{
			return p != null && p.mod == this.mod && p.prop == this.prop;
		}	}

	public class Settings
	{

		private string href;

		public Dictionary<Property, string> props = new Dictionary<Property, string>();

		public Settings()
		{
			this.href = GenFilePaths.ModsConfigFilePath;
			this.href = this.href.Replace("ModsConfig", "RandomThings");
		}

		public void bootUp()
		{
			this.loadDefaults();
			this.loadSettings();
		}

		public void loadSettings()
		{
			if (File.Exists(this.href))
			{
				XElement xElement = XElement.Load(this.href);
				IEnumerable<XElement> elements = xElement.Elements();
				foreach (XElement element in elements)
				{
					//Log.Warning(element.Value);
					//Log.Warning(element.Name.LocalName);
					string tag = element.Name.LocalName;
					string[] comp = tag.Split('.');
					string val = element.Value;

					if (comp.Length != 2)
					{
						loggerInfo(String.Concat("RandomThings: Tag ", element.ToString(), " was not formatted correctly. Ignoring."));
						continue;
					}

					Settings.setProperty(new Property(comp[0], comp[1]), val);
					loggerInfo(String.Concat("RandomThings: Loaded Property ", element.ToString()));
				}
				this.saveSettings();
			}
			else
			{
				this.saveSettings();
			}
		}

		public void loadDefaults()
		{
			//this.props.Add(new Property("RandomThings", "setting", "value"));
			Settings.setProperty(new Property("RandomThings", "verbose"), "true");

		}

		public void saveSettings()
		{
			Log.Warning(props.Count.ToString());
			XmlWriterSettings xmlSettings = new XmlWriterSettings();
			xmlSettings.Indent = true;
			xmlSettings.IndentChars = "\t";
			XmlWriter xmlWriter = XmlWriter.Create(href, xmlSettings);
			xmlWriter.WriteStartDocument();
			xmlWriter.WriteComment("Settings file generated via the RandomThings Mod.");
			xmlWriter.WriteStartElement("Settings");
			for (int i = 0; i < this.props.Count(); i++)
			{
				Property key = this.props.Keys.ToList()[i];
				xmlWriter.WriteElementString(String.Concat(key.mod, ".", key.prop), this.props[key]);
				loggerInfo(String.Concat(" I tried to do ", key.ToString()));
			}
			xmlWriter.WriteEndElement();
			xmlWriter.WriteEndDocument();
			xmlWriter.Flush();
			xmlWriter.Close();
		}

		/// <summary>
		/// Adds the property, checking for existing ones.
		/// </summary>
		/// <returns><c>true</c>, if <c>NEW</c> property was added, <c>false</c> otherwise.</returns>
		/// <param name="p">Property Object</param>
		/// <param name="val">Value of Property</param>

		public static bool setProperty(Property p, string val)
		{
			if (RandomThings.settings == null)
			{
				Log.Warning("What the fuck happened");
				return false;
			}

			if (RandomThings.settings.props.ContainsKey(p))
			{
				RandomThings.settings.props[p] = val;
				return false;
			}
			else
			{
				RandomThings.settings.props.Add(p, val);
				return true;
			}
		}

		public static bool setProperty(string m, string pr, string val)
		{
			return Settings.setProperty(new Property(m, pr), val);
		}

		public static string getOrDefaultProperty(Property p, string def)
		{
			string res = Settings.getProperty(p);

			if (res == null)
			{
				Settings.setProperty(p, def);
				return def;
			}
			else
			{
				return res;
			}
		}

		public static string getOrDefaultProperty(string m, string pr, string def)
		{
			return Settings.getOrDefaultProperty(new Property(m, pr), def);
		}

		public static string getProperty(Property p, string def = null)
		{
			if (RandomThings.settings.props.ContainsKey(p))
			{
				return RandomThings.settings.props[p];
			}

			return def;
		}

		public static string getProperty(string m, string pr, string def = null)
		{
			return Settings.getProperty(new Property(m, pr), def);
		}

		public static void loggerInfo(string w)
		{
			if (Settings.getProperty("RandomThings", "verbose") == "true")
			{
				Log.Warning(w);
			}
		}
	}
}
