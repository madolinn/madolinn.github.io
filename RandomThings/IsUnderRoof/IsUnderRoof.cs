using System;
using Verse;

namespace RimWorld
{
	public class PlaceWorker_IsUnderRoof : PlaceWorker
	{
		public override AcceptanceReport AllowsPlacing(BuildableDef checkingDef, IntVec3 loc, Rot4 rot, Thing thingToIgnore = null)
		{
			if (!base.Map.roofGrid.Roofed(loc))
			{
				return new AcceptanceReport("MustPlaceRoofed".Translate());
			}
			return true;
		}
	}
}

