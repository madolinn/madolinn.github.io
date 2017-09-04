using System;
using System.Collections.Generic;
using UnityEngine;
using Verse;
using Verse.AI;
using RimWorld;
using System.Reflection;

namespace IceIsNice
{

	public class Zone_IceMine : Zone
	{
		public bool allowIceMine = true;

		public override bool IsMultiselectable
		{
			get
			{
				return true;
			}
		}

		protected override Color NextZoneColor
		{
			get
			{
				return ZoneColorUtility.NextGrowingZoneColor();
			}
		}

		public Zone_IceMine()
		{
		}

		public Zone_IceMine(ZoneManager zoneManager) : base("IceIsNice.IceMiningZone".Translate(), zoneManager)
		{
		}

		public override void ExposeData()
		{
			base.ExposeData();
			Scribe_Values.Look<bool>(ref this.allowIceMine, "IceIsNice.allowIceMine", true, false);
		}

		public override string GetInspectString()
		{
			return "A mineable area of ice.";
		}

		public override IEnumerable<Gizmo> GetGizmos()
		{
			foreach (Gizmo g in base.GetGizmos())
			{
				yield return g;
			}
			yield return new Command_Toggle
			{
				defaultLabel = "IceIsNice.CommandAllowIceMine".Translate(),
				defaultDesc = "IceIsNice.CommandAllowIceMineDesc".Translate(),
				hotKey = KeyBindingDefOf.CommandItemForbid,
				icon = TexCommand.Forbidden,
				isActive = (() => this.allowIceMine),
				toggleAction = delegate
				{
					this.allowIceMine = !this.allowIceMine;
				}
					
			};
		}
	}

	public static class IceDefOf
	{
		public static string IceMineName = "JobDef_IceMine";

	}

	public abstract class IceThingDef
	{
		public static string Ice = "Ice";
	}

	public class Designator_ZoneAdd_IceMine : Designator_ZoneAdd
	{
		protected override string NewZoneLabel
		{
			get
			{
				return "IceIsNice.IceMineZone".Translate();
			}
		}

		public Designator_ZoneAdd_IceMine()
		{
			this.zoneTypeToPlace = typeof(Zone_IceMine);
			this.defaultLabel = "IceIsNice.IceMineZone".Translate();
			this.defaultDesc = "IceIsNice.DesignatorIceMineZoneDesc".Translate();
			this.icon = ContentFinder<Texture2D>.Get("UI/Designators/Mine", true);
			this.hotKey = KeyBindingDefOf.Misc12;
			this.tutorTag = "ZoneAdd_IceMine";
		}

		public override AcceptanceReport CanDesignateCell(IntVec3 c)
		{
			if (!base.CanDesignateCell(c).Accepted)
			{
				return false;
			}
			if (base.Map.Biome.defName == "IceSheet" || base.Map.Biome.defName == "SeaIce")
			{
				if (base.Map.terrainGrid.TerrainAt(c).defName == "Ice")
				{
					return true;
				} else {
					return false;
				}
			}
			Log.Warning(base.Map.Biome.defName);
			return false;
		}

		protected override Zone MakeNewZone()
		{
			PlayerKnowledgeDatabase.KnowledgeDemonstrated(ConceptDefOf.Mining, KnowledgeAmount.Total);
			return new Zone_IceMine(Find.VisibleMap.zoneManager);
		}
	}

	public class JobDriver_IceMine : JobDriver
	{
		private float workLeft = -1000f;
		protected bool clearSnow = true;

		protected int BaseWorkAmount
		{
			get
			{
				return 200;
			}
		}

		protected StatDef SpeedStat
		{
			get
			{
				return StatDefOf.MiningSpeed;
			}
		}

		protected override IEnumerable<Toil> MakeNewToils()
		{
			ReservationLayerDef floor = ReservationLayerDefOf.Floor;
			yield return Toils_Reserve.Reserve(TargetIndex.A, 1, -1, floor);
			yield return Toils_Goto.GotoCell(TargetIndex.A, PathEndMode.Touch);
			Toil doWork = new Toil();
			doWork.initAction = delegate
			{
				this.workLeft = (float)this.BaseWorkAmount;
			};
			doWork.tickAction = delegate
			{
				Pawn actor = this.CurToil.actor;
				float num = (this.SpeedStat == null) ? 1f : this.pawn.GetStatValue(this.SpeedStat, true);
				this.workLeft -= num;
				if (actor.skills != null)
				{
					actor.skills.Learn(SkillDefOf.Mining, 0.11f, false);
				}
				if (this.clearSnow)
				{
					this.Map.snowGrid.SetDepth(this.TargetLocA, 0f);
				}
				if (this.workLeft <= 0f)
				{
					this.Map.zoneManager.ZoneAt(this.TargetLocA).RemoveCell(this.TargetLocA);
					this.Map.terrainGrid.SetTerrain(this.TargetLocA, DefDatabase<TerrainDef>.GetNamed("WaterMovingShallow", true));
					actor.records.Increment(RecordDefOf.CellsMined);
					//GenSpawn.Spawn(DefDatabase<ThingDef>.GetNamed(IceThingDef.Ice, true), this.TargetLocA, this.Map);
					Thing yield = ThingMaker.MakeThing(DefDatabase<ThingDef>.GetNamed(IceThingDef.Ice, true), null);
					yield.stackCount = 2;
					GenPlace.TryPlaceThing(yield, this.TargetLocA, this.Map, ThingPlaceMode.Near, null);
					this.ReadyForNextToil();
					return;
				}
				
			};
			doWork.FailOnCannotTouch(TargetIndex.A, PathEndMode.Touch);
			doWork.WithProgressBar(TargetIndex.A, () => 1f - this.workLeft / (float)this.BaseWorkAmount, false, -0.5f);
			doWork.defaultCompleteMode = ToilCompleteMode.Never;
			yield return doWork;

		}

		public override void ExposeData()
		{
			base.ExposeData();
			Scribe_Values.Look<float>(ref this.workLeft, "workLeft", 0f, false);
		}
	}


	public class WorkGiver_IceMine : WorkGiver_Scanner
	{

		public override PathEndMode PathEndMode
		{
			get
			{
				return PathEndMode.Touch;
			}
		}

		public override IEnumerable<IntVec3> PotentialWorkCellsGlobal(Pawn pawn)
		{
			Danger maxDanger = pawn.NormalMaxDanger();
			List<Zone> zoneList = pawn.Map.zoneManager.AllZones;
			for (int j = 0; j < zoneList.Count; j++)
			{
				Zone_IceMine iceMineZone = zoneList[j] as Zone_IceMine;
				if (iceMineZone != null)
				{
					if (iceMineZone.cells.Count == 0)
					{
						Log.ErrorOnce("Ice Mining Zone has 0 cells: " + iceMineZone, -563487);
					}
					else
					{
						if (!iceMineZone.ContainsStaticFire && iceMineZone.allowIceMine)
						{
							if (pawn.CanReach(iceMineZone.Cells[0], PathEndMode.Touch, maxDanger, false, TraverseMode.ByPawn))
							{
								for (int k = 0; k < iceMineZone.cells.Count; k++)
								{
									yield return iceMineZone.cells[k];
								}
							}
						}
					}
				}
			}
		}

		public override bool HasJobOnCell(Pawn pawn, IntVec3 c)
		{

			if (pawn == null)
			{
				return false;
			}

			if (c.IsForbidden(pawn))
			{
				return false;
			}
			List<Thing> thingList = c.GetThingList(pawn.Map);
			for (int i = 0; i<thingList.Count; i++)
			{
				Thing thing = thingList[i];
				if ((thing is Blueprint || thing is Frame) && thing.Faction == pawn.Faction)
				{
					return false;
				}
			}
			return true;
		}

		public override Job JobOnCell(Pawn pawn, IntVec3 cell)
		{
			return new Job(DefDatabase<JobDef>.GetNamed(IceDefOf.IceMineName, true), cell);
		}
	}
}