"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getSightingsForShelter } from "@/lib/store";
import type { CatSighting } from "@/types";

type AppTab = "home" | "map" | "organization" | "account";

const TABS: { id: AppTab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "map", label: "Map" },
  { id: "organization", label: "Organization" },
  { id: "account", label: "Account" },
];

type OrgBoard = {
  id: string;
  name: string;
  preview: string;
  messages: string[];
};

type OrganizationProfile = {
  id: string;
  name: string;
  status: string;
  members: number;
  tnr: number;
  capacityCurrent: number;
  capacityTotal: number;
  address: string;
  phone: string;
  about: string;
  boards: OrgBoard[];
};

const ORGANIZATIONS: OrganizationProfile[] = [
  {
    id: "nb-rescue",
    name: "New Brunswick Cat Rescue",
    status: "Active Member",
    members: 28,
    tnr: 312,
    capacityCurrent: 22,
    capacityTotal: 35,
    address: "123 George St, New Brunswick, NJ 08901",
    phone: "(732) 555-0123",
    about: "TNR, adoption, and rescue coordination for community cats in the Rutgers area.",
    boards: [
      {
        id: "nb-rescue-ops",
        name: "NB Rescue Ops",
        preview: "Claim team for College Ave updated.",
        messages: [
          "Dispatch: orange tabby spotted behind Brower Commons.",
          "NB Rescue: we can send two volunteers at 6:30pm.",
          "ScarletPaws: pin dropped near George St parking lot.",
          "Dispatch: cat is hiding under blue sedan, bring trap.",
        ],
      },
      {
        id: "scarlet-foster",
        name: "Scarlet Foster Network",
        preview: "Need temp foster for orange tabby.",
        messages: [
          "Foster Lead: urgent overnight foster needed for friendly tabby.",
          "Volunteer: I can take the cat through Saturday.",
          "NB Rescue: vet check booked for tomorrow 10am.",
          "Foster Lead: perfect, posting pickup location now.",
        ],
      },
    ],
  },
  {
    id: "rutgers-tnr",
    name: "Rutgers TNR Volunteers",
    status: "Active Member",
    members: 64,
    tnr: 188,
    capacityCurrent: 17,
    capacityTotal: 24,
    address: "Campus-adjacent, New Brunswick, NJ",
    phone: "(732) 555-0789",
    about: "Student and volunteer trap-neuter-return for campus-adjacent colonies.",
    boards: [
      {
        id: "rutgers-tnr",
        name: "Rutgers TNR Volunteers",
        preview: "2 traps available tonight near Easton.",
        messages: [
          "Team A: two humane traps are prepped.",
          "Campus Spotter: black cat sighted near Student Center.",
          "Team B: can transport to shelter intake by 9pm.",
          "Coordinator: mark this zone as medium priority hotspot.",
        ],
      },
    ],
  },
  {
    id: "middlesex",
    name: "Middlesex Feline Coalition",
    status: "Pending Approval",
    members: 41,
    tnr: 73,
    capacityCurrent: 14,
    capacityTotal: 30,
    address: "Middlesex County, NJ",
    phone: "(732) 555-0999",
    about: "Regional coalition for transport and intake coordination.",
    boards: [
      {
        id: "middlesex-coalition",
        name: "Middlesex Cat Coalition",
        preview: "Transport support confirmed for 7pm.",
        messages: [
          "Coalition: transport van leaving from Easton Ave at 7pm.",
          "Shelter Admin: intake ready for two rescues tonight.",
          "Driver: share exact pin once team confirms capture.",
          "Coordinator: route updated to avoid downtown traffic.",
        ],
      },
    ],
  },
];

const CAT_STORIES = [
  {
    id: "pumpkin",
    name: "Pumpkin",
    status: "From campus lot to foster home in 3 days",
    update: "Now eating well and scheduled for neuter + vaccines this week.",
    supporters: 42,
    thread: [
      "Day 1: Report came in near College Ave by the bookstore — orange tabby hanging close to parked bikes and looking hungry, but still curious around people. We flagged it as a high-visibility campus zone and asked for extra eyes on the area. #Rutgers #CollegeAve #CommunityCats #ScarletPaws",
      "Day 2: Volunteer team coordinated a safe plan and completed a humane trap with minimal stress. Intake check looked good (hydration + appetite improving) and we logged the location for future hotspot tracking. Huge thanks to the campus spotter who stayed nearby. #TNR #RescueTeam #NewBrunswick #CatRescue",
      "Day 3: Pumpkin officially moved into a foster home — warm bed, steady meals, and lots of calm decompression time. Already showing sweet “house cat” vibes and letting the foster get close for a gentle check. #FosterLove #HappyTails #AdoptDontShop",
      "Day 7: Vet exam completed and Pumpkin is scheduled for neuter + core vaccines this week. We’ll keep sharing updates so everyone who helped can follow the journey from sighting → safety → healthy future. #VetCare #SpayNeuter #ScarletPawsFamily",
    ],
  },
  {
    id: "luna",
    name: "Luna",
    status: "Medical care complete",
    update: "Recovered from eye infection and matched with an adopter in Highland Park.",
    supporters: 67,
    thread: [
      "Week 1: Luna was spotted near Easton Ave with visible eye irritation — watery discharge and lots of blinking. A community member reported quickly, which made a big difference for early treatment. #EastonAve #NewBrunswick #ReportToRescue #CommunityCare",
      "Week 1: Transport was coordinated the same day and clinic care started immediately. Treatment plan included meds + supportive care, and Luna handled it like a champ. #MedicalRescue #ClinicCare #CatHealth",
      "Week 2: Recovery check showed major improvement — brighter eyes, steady appetite, and more playful behavior. She’s been gaining confidence each day in a quiet foster setup. #RecoveryJourney #FosterUpdate #HappyTails",
      "Week 3: Adoption match confirmed with a loving family in Highland Park. Luna’s story is exactly why reporting matters — one post can turn into a forever home. #AdoptionDay #ForeverHome #ScarletPaws",
    ],
  },
  {
    id: "shadow",
    name: "Shadow",
    status: "TNR complete",
    update: "Safely returned to monitored colony with daily feeding volunteers.",
    supporters: 31,
    thread: [
      "Night 1: Shadow was reported near the Busch campus housing edge — skittish, keeping distance, and moving between shrubs and quieter walkways. We marked the area and coordinated coverage to avoid repeat missed sightings. #BuschCampus #Rutgers #CommunityCats",
      "Night 2: TNR team completed a humane trap and Shadow went in for a clinic visit. Everything went smoothly, and we recorded details to support long-term colony management. #TNRWorks #SpayNeuter #RescueOps",
      "Night 3: Shadow was safely returned to a monitored colony with a standard ear-tip indicator. Volunteers confirmed normal behavior on release and logged the location for the hotspot map. #ColonyCare #ReturnToField #NewBrunswick",
      "Ongoing: Daily feeders continue check-ins and we’re tracking patterns over time so we can prioritize future care and resources. Healthy colonies + organized reporting = real impact. #DataForGood #CatHotspots #ScarletPaws",
    ],
  },
];

function buildMapSrcDoc(sightings: Pick<CatSighting, "id" | "location" | "areaLabel" | "description">[]) {
  const sightingMarkers = sightings.map((s) => ({
    id: s.id,
    lat: s.location.lat,
    lng: s.location.lng,
    label: `${s.areaLabel}: ${s.description.slice(0, 40)}${s.description.length > 40 ? "…" : ""}`,
  }));
  const markersJson = JSON.stringify(sightingMarkers);

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; }
    .leaflet-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map', { zoomControl: true }).setView([40.5008, -74.4474], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const heatStyle = (color, radius) => ({
      color,
      fillColor: color,
      fillOpacity: 0.28,
      weight: 1,
      radius
    });

    L.circle([40.5003, -74.4478], heatStyle('#ef4444', 220)).addTo(map).bindTooltip('College Ave hotspot');
    L.circle([40.5232, -74.4581], heatStyle('#dc2626', 220)).addTo(map).bindTooltip('Busch Campus hotspot');
    L.circle([40.4949, -74.4448], heatStyle('#fb923c', 200)).addTo(map).bindTooltip('Downtown NB hotspot');

    const baseIcon = L.divIcon({
      className: '',
      html: '<div style="width:10px;height:10px;border-radius:9999px;background:#38bdf8;border:2px solid #fff;"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
    const catIcon = L.divIcon({
      className: '',
      html: '<div style="width:12px;height:12px;border-radius:9999px;background:#f97316;border:2px solid #fff;"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    L.marker([40.5008, -74.4474], { icon: baseIcon }).addTo(map).bindTooltip('NB Rescue Base');
    L.marker([40.5229, -74.4589], { icon: baseIcon }).addTo(map).bindTooltip('Busch Campus Team');
    L.marker([40.4996, -74.4459], { icon: baseIcon }).addTo(map).bindTooltip('Scarlet Paws Base (College Ave)');
    L.marker([40.4939, -74.4439], { icon: baseIcon }).addTo(map).bindTooltip('Scarlet Foster Hub');

    const sightings = ${markersJson};
    sightings.forEach(function(s) {
      L.marker([s.lat, s.lng], { icon: catIcon }).addTo(map).bindTooltip(s.label);
    });

    window.addEventListener('message', function(e) {
      if (!e.data || e.data.type !== 'flyTo') return;
      var lat = e.data.lat;
      var lng = e.data.lng;
      var zoom = typeof e.data.zoom === 'number' ? e.data.zoom : 17;
      map.setView([lat, lng], zoom);
    });
  </script>
</body>
</html>`;
}

export function MobileAppShell() {
  const { user } = useAuth();
  const sightings = useMemo(() => getSightingsForShelter(), []);
  const mapSrcDoc = useMemo(() => buildMapSrcDoc(sightings), [sightings]);

  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [selectedOrgId, setSelectedOrgId] = useState(ORGANIZATIONS[0].id);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [selectedSightingId, setSelectedSightingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const mapIframeRef = useRef<HTMLIFrameElement | null>(null);
  const sectionRefs = useRef<Record<AppTab, HTMLElement | null>>({
    home: null,
    map: null,
    organization: null,
    account: null,
  });

  const selectedOrg = ORGANIZATIONS.find((o) => o.id === selectedOrgId) ?? ORGANIZATIONS[0];
  const selectedBoard = selectedOrg.boards.find((b) => b.id === selectedBoardId) ?? null;
  const selectedStory = CAT_STORIES.find((story) => story.id === selectedStoryId) ?? null;

  const searchLower = searchQuery.trim().toLowerCase();
  const filteredStories = useMemo(() => {
    if (!searchLower) return CAT_STORIES;
    return CAT_STORIES.filter(
      (s) =>
        s.name.toLowerCase().includes(searchLower) ||
        s.status.toLowerCase().includes(searchLower) ||
        s.update.toLowerCase().includes(searchLower)
    );
  }, [searchLower]);

  const filteredOrgsForSearch = useMemo(() => {
    if (!searchLower) return ORGANIZATIONS;
    return ORGANIZATIONS.filter(
      (o) =>
        o.name.toLowerCase().includes(searchLower) ||
        o.about.toLowerCase().includes(searchLower) ||
        o.address.toLowerCase().includes(searchLower)
    );
  }, [searchLower]);

  const goToTab = (tab: AppTab) => {
    setActiveTab(tab);
    sectionRefs.current[tab]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  };

  const onHorizontalScroll = () => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const width = scroller.clientWidth;
    if (!width) return;
    const index = Math.round(scroller.scrollLeft / width);
    const tab = TABS[index]?.id;
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  const flyMapToSighting = (s: CatSighting) => {
    setSelectedSightingId(s.id);
    goToTab("map");
  };

  useEffect(() => {
    if (activeTab !== "map" || !selectedSightingId) return;
    const s = sightings.find((x) => x.id === selectedSightingId);
    if (!s) return;
    const t = window.setTimeout(() => {
      mapIframeRef.current?.contentWindow?.postMessage(
        { type: "flyTo", lat: s.location.lat, lng: s.location.lng, zoom: 17 },
        "*"
      );
    }, 400);
    return () => window.clearTimeout(t);
  }, [selectedSightingId, activeTab, sightings]);

  return (
    <div className="mx-auto w-full max-w-md px-2 py-3">
      <div className="rounded-3xl border border-stone-300/30 bg-stone-900 p-1 shadow-xl">
        <div className="rounded-[1.35rem] bg-black">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone-300">ScarletPaws</p>
              <p className="text-sm font-medium">{user?.name ?? "Guest"}</p>
            </div>
            <span className="rounded-full bg-scarlet-600/90 px-2 py-1 text-xs">Live Rescue Network</span>
          </div>

          <div
            ref={scrollRef}
            onScroll={onHorizontalScroll}
            className="horizontal-snap flex min-h-[73vh] snap-x snap-mandatory overflow-x-auto"
          >
            {/* Home: search + stories feed */}
            <section
              ref={(el) => {
                sectionRefs.current.home = el;
              }}
              className="mobile-panel bg-gradient-to-b from-violet-950 via-purple-900 to-black text-white"
            >
              <h2 className="text-xl font-semibold">Home</h2>
              <p className="mt-1 text-sm text-violet-200/85">Search cats and organizations, follow rescue stories.</p>
              <div className="mt-3">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cats, stories, organizations…"
                  className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-violet-300/50"
                />
              </div>
              {searchLower && (
                <div className="mt-3 rounded-xl border border-white/15 bg-white/5 p-2 text-xs text-violet-100/90">
                  <p className="font-medium text-violet-100">Organizations matching search</p>
                  {filteredOrgsForSearch.length === 0 ? (
                    <p className="mt-1 text-violet-300/80">No organizations match.</p>
                  ) : (
                    <ul className="mt-1 space-y-1">
                      {filteredOrgsForSearch.map((o) => (
                        <li key={o.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrgId(o.id);
                              setSelectedBoardId(null);
                              goToTab("organization");
                            }}
                            className="text-left text-sky-200 underline decoration-sky-400/50"
                          >
                            {o.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <h3 className="mt-5 text-sm font-semibold text-violet-100">Feed</h3>
              {!selectedStory ? (
                <div className="mt-2 max-h-[46vh] space-y-3 overflow-y-auto pr-1">
                  {filteredStories.length === 0 ? (
                    <p className="text-sm text-violet-300/80">No stories match your search.</p>
                  ) : (
                    filteredStories.map((story) => (
                      <button
                        type="button"
                        key={story.id}
                        onClick={() => setSelectedStoryId(story.id)}
                        className="w-full rounded-2xl border border-white/15 bg-white/10 p-3 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">@{story.name.toLowerCase()}_rescue</p>
                          <span className="text-xs text-violet-200/80">{story.supporters} following</span>
                        </div>
                        <p className="mt-2 text-sm font-medium text-violet-100">{story.name}</p>
                        <p className="mt-1 text-sm text-violet-100/95">{story.status}</p>
                        <p className="mt-1 text-xs text-violet-200/90">{story.update}</p>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="mt-2 rounded-2xl border border-white/15 bg-white/10 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{selectedStory.name} — thread</p>
                      <p className="text-xs text-violet-200/80">@{selectedStory.name.toLowerCase()}_rescue</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedStoryId(null)}
                      className="rounded-md border border-white/20 px-2 py-1 text-xs"
                    >
                      Back
                    </button>
                  </div>
                  <div className="max-h-[46vh] space-y-2 overflow-y-auto pr-1">
                    {selectedStory.thread.map((entry, idx) => (
                      <div key={entry} className="rounded-xl bg-black/25 p-2">
                        <p className="text-[11px] uppercase tracking-wide text-violet-200/80">Update {idx + 1}</p>
                        <p className="mt-1 text-sm text-violet-100">{entry}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Map + sightings list + zoom on click */}
            <section
              ref={(el) => {
                sectionRefs.current.map = el;
              }}
              className="mobile-panel flex min-h-[73vh] flex-col bg-black text-white"
            >
              <div className="relative h-[42vh] min-h-[200px] shrink-0 overflow-hidden">
                <div className="absolute left-3 top-3 z-10 rounded-xl bg-black/70 px-3 py-2">
                  <h2 className="text-sm font-semibold">Cat map</h2>
                  <p className="text-[11px] text-emerald-100/85">Tap a sighting below to zoom</p>
                </div>
                <iframe
                  ref={mapIframeRef}
                  title="Rutgers New Brunswick hotspot map"
                  className="h-full w-full"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                  srcDoc={mapSrcDoc}
                />
                <div className="absolute inset-x-3 bottom-3 z-10">
                  <button
                    type="button"
                    onClick={() => document.getElementById("report-camera")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="btn-primary w-full shadow-lg"
                  >
                    Upload sighting
                  </button>
                </div>
              </div>
              <div className="min-h-0 flex-1 border-t border-white/10 px-1 pb-2 pt-3">
                <h3 className="px-2 text-sm font-semibold">Recent sightings</h3>
                <p className="mb-2 px-2 text-[11px] text-stone-400">Community reports — tap to focus map on location</p>
                <div className="max-h-[28vh] space-y-2 overflow-y-auto px-1">
                  {sightings.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => flyMapToSighting(s)}
                      className={`w-full rounded-xl border p-3 text-left text-sm ${
                        selectedSightingId === s.id
                          ? "border-scarlet-400 bg-scarlet-500/20"
                          : "border-white/15 bg-white/5"
                      }`}
                    >
                      <p className="font-medium text-white">{s.areaLabel}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-stone-300">{s.description}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wide text-stone-500">{s.status}</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Organization: dropdown + info + boards */}
            <section
              ref={(el) => {
                sectionRefs.current.organization = el;
              }}
              className="mobile-panel bg-gradient-to-b from-rose-950 via-rose-900 to-black text-white"
            >
              <h2 className="text-xl font-semibold">Organization</h2>
              <p className="mt-1 text-sm text-rose-100/80">Switch org to see info and message boards.</p>
              <label className="mt-3 block text-xs text-rose-200/90">Your organizations</label>
              <select
                value={selectedOrgId}
                onChange={(e) => {
                  setSelectedOrgId(e.target.value);
                  setSelectedBoardId(null);
                }}
                className="mt-1 w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2.5 text-sm text-white"
              >
                {ORGANIZATIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.status})
                  </option>
                ))}
              </select>
              <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-3">
                <p className="text-sm font-semibold">{selectedOrg.name}</p>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] ${
                    selectedOrg.status === "Pending Approval"
                      ? "bg-amber-400/25 text-amber-100"
                      : "bg-emerald-400/25 text-emerald-100"
                  }`}
                >
                  {selectedOrg.status}
                </span>
                <p className="mt-2 text-xs text-rose-100/90">{selectedOrg.about}</p>
                <p className="mt-2 text-xs text-rose-200/80">{selectedOrg.address}</p>
                <p className="text-xs text-rose-200/80">{selectedOrg.phone}</p>
                <p className="mt-2 text-xs text-rose-100/85">Members: {selectedOrg.members}</p>
                <p className="text-xs text-rose-100/85">
                  Shelter capacity: {selectedOrg.capacityCurrent}/{selectedOrg.capacityTotal}
                </p>
                <p className="text-xs text-rose-100/85">Community cat care (TNR): {selectedOrg.tnr}</p>
              </div>
              <h3 className="mt-4 text-sm font-semibold">Message boards</h3>
              {!selectedBoard ? (
                <div className="mt-2 space-y-2">
                  {selectedOrg.boards.map((board) => (
                    <button
                      key={board.id}
                      type="button"
                      onClick={() => setSelectedBoardId(board.id)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10"
                    >
                      <p className="text-sm font-medium">{board.name}</p>
                      <p className="mt-1 text-xs text-rose-100/70">{board.preview}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold">{selectedBoard.name}</p>
                    <button
                      type="button"
                      onClick={() => setSelectedBoardId(null)}
                      className="rounded-md border border-white/20 px-2 py-1 text-xs"
                    >
                      Back
                    </button>
                  </div>
                  <div className="max-h-[36vh] space-y-2 overflow-y-auto">
                    {selectedBoard.messages.map((message, idx) => {
                      const isOutgoing = idx % 2 === 1;
                      return (
                        <div key={message} className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                              isOutgoing
                                ? "rounded-br-md bg-sky-500 text-white"
                                : "rounded-bl-md bg-white text-slate-900"
                            }`}
                          >
                            {message}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            {/* Account: subscription + profile */}
            <section
              ref={(el) => {
                sectionRefs.current.account = el;
              }}
              className="mobile-panel bg-gradient-to-b from-amber-950 via-amber-900 to-black text-white"
            >
              <h2 className="text-xl font-semibold">Account</h2>
              <p className="mt-1 text-sm text-amber-100/80">Profile and shelter subscription (demo).</p>
              <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-amber-200/80">Profile</p>
                <p className="mt-2 text-sm font-medium">{user?.name ?? "Guest"}</p>
                <p className="text-xs text-amber-100/75">{user?.email ?? "Sign in to sync across devices"}</p>
                <p className="mt-2 text-xs text-amber-100/60">
                  Role: {user?.role === "shelter" ? "Shelter / rescue" : "Community"}
                </p>
              </div>
              <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-amber-200/80">Shelter subscription</p>
                <p className="mt-2 text-sm">$10/month or $110/year per organization</p>
                <p className="mt-1 text-xs text-amber-100/70">Unlocks exact locations, rescue tools, and org dashboards.</p>
              </div>
              <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-amber-200/80">Privacy</p>
                <p className="mt-2 text-xs text-amber-100/75">
                  Exact sighting pins are only shown to verified shelter accounts. Public posts show general areas only.
                </p>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-4 gap-1 border-t border-white/10 bg-black px-1 py-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => goToTab(tab.id)}
                className={`min-h-12 rounded-lg px-1 py-2.5 text-center transition ${
                  activeTab === tab.id ? "bg-white text-black" : "bg-white/5 text-white/85 hover:bg-white/15"
                }`}
              >
                <p className="text-[10px] font-medium leading-tight sm:text-[11px]">{tab.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
