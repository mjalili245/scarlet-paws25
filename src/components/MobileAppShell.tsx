"use client";

import { useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getSightingsForShelter } from "@/lib/store";

type AppTab = "stories" | "map" | "camera" | "home" | "chats" | "rescues" | "membership";

const TABS: { id: AppTab; label: string }[] = [
  { id: "stories", label: "Stories" },
  { id: "map", label: "Map" },
  { id: "camera", label: "Camera" },
  { id: "home", label: "Home" },
  { id: "chats", label: "Chats" },
  { id: "rescues", label: "Organizations" },
  { id: "membership", label: "Plan" },
];

const CHAT_ROOMS = [
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
];

const CAT_STORIES = [
  {
    id: "pumpkin",
    name: "Pumpkin",
    status: "From campus lot to foster home in 3 days",
    update: "Now eating well and scheduled for neuter + vaccines this week.",
    supporters: 42,
    thread: [
      "Day 1: Reported near College Ave bookstore behind parked bikes.",
      "Day 2: Volunteer team completed safe trap and intake check.",
      "Day 3: Pumpkin moved to foster home and started regular meals.",
      "Day 7: Vet exam done, neuter and vaccines scheduled.",
    ],
  },
  {
    id: "luna",
    name: "Luna",
    status: "Medical care complete",
    update: "Recovered from eye infection and matched with an adopter in Highland Park.",
    supporters: 67,
    thread: [
      "Week 1: Spotted near Easton Ave with visible eye irritation.",
      "Week 1: Rescue transport completed and clinic treatment started.",
      "Week 2: Recovery check showed strong improvement and appetite.",
      "Week 3: Adoption match confirmed with local family.",
    ],
  },
  {
    id: "shadow",
    name: "Shadow",
    status: "TNR complete",
    update: "Safely returned to monitored colony with daily feeding volunteers.",
    supporters: 31,
    thread: [
      "Night 1: Report submitted from Busch campus housing edge.",
      "Night 2: TNR team trapped Shadow and completed clinic visit.",
      "Night 3: Returned to managed colony with ear-tip and monitor tag.",
      "Ongoing: Volunteers continue feeding and health check-ins.",
    ],
  },
];

const RUTGERS_MAP_SRC_DOC = `<!doctype html>
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
    const map = L.map('map', { zoomControl: true }).setView([40.5008, -74.4474], 14);
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

    L.marker([40.5008, -74.4474], { icon: baseIcon }).addTo(map).bindTooltip('NB Rescue Base');
    L.marker([40.5229, -74.4589], { icon: baseIcon }).addTo(map).bindTooltip('Busch Campus Team');
    L.marker([40.4996, -74.4459], { icon: baseIcon }).addTo(map).bindTooltip('Scarlet Paws Base (College Ave)');
    L.marker([40.4939, -74.4439], { icon: baseIcon }).addTo(map).bindTooltip('Scarlet Foster Hub');
  </script>
</body>
</html>`;

export function MobileAppShell() {
  const { user } = useAuth();
  const sightings = useMemo(() => getSightingsForShelter().slice(0, 4), []);
  const [activeTab, setActiveTab] = useState<AppTab>("camera");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState("Healthy");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<AppTab, HTMLElement | null>>({
    stories: null,
    map: null,
    camera: null,
    home: null,
    chats: null,
    rescues: null,
    membership: null,
  });

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

  const selectedChat = CHAT_ROOMS.find((room) => room.id === selectedChatId) ?? null;
  const selectedStory = CAT_STORIES.find((story) => story.id === selectedStoryId) ?? null;

  return (
    <div className="mx-auto w-full max-w-md px-2 py-3">
      <div className="rounded-3xl border border-stone-300/30 bg-stone-900 p-1 shadow-xl">
        <div className="rounded-[1.35rem] bg-black">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone-300">ScarletPaws</p>
              <p className="text-sm font-medium">{user?.name ?? "Guest"} Mode</p>
            </div>
            <span className="rounded-full bg-scarlet-600/90 px-2 py-1 text-xs">Live Rescue Network</span>
          </div>

          <div
            ref={scrollRef}
            onScroll={onHorizontalScroll}
            className="horizontal-snap flex min-h-[73vh] snap-x snap-mandatory overflow-x-auto"
          >
            <section
              ref={(el) => {
                sectionRefs.current.stories = el;
              }}
              className="mobile-panel bg-gradient-to-b from-fuchsia-950 via-violet-900 to-black text-white"
            >
              <h2 className="text-xl font-semibold">Happy Tails Stories</h2>
              <p className="mt-1 text-sm text-violet-100/85">
                Follow cats from rescue sighting to recovery, TNR, and forever homes.
              </p>
              {!selectedStory ? (
                <div className="mt-4 space-y-3">
                  {CAT_STORIES.map((story) => (
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
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{selectedStory.name} Story Thread</p>
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
                  <div className="space-y-2">
                    {selectedStory.thread.map((entry, idx) => (
                      <div key={entry} className="rounded-xl bg-black/25 p-2">
                        <p className="text-[11px] uppercase tracking-wide text-violet-200/80">
                          Update {idx + 1}
                        </p>
                        <p className="mt-1 text-sm text-violet-100">{entry}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section
              ref={(el) => {
                sectionRefs.current.map = el;
              }}
              className="mobile-panel relative bg-black text-white"
            >
              <div className="absolute left-4 top-4 z-10 rounded-xl bg-black/65 px-3 py-2">
                <h2 className="text-sm font-semibold">Cat Heat Map</h2>
                <p className="mt-1 text-xs text-emerald-100/85">Rutgers New Brunswick + Busch</p>
              </div>
              <div className="relative -mx-4 -mb-4 -mt-5 h-[73vh] overflow-hidden">
                <iframe
                  title="Rutgers New Brunswick hotspot map"
                  className="h-full w-full"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                  srcDoc={RUTGERS_MAP_SRC_DOC}
                />
                <div className="absolute inset-x-4 bottom-5">
                  <button type="button" onClick={() => goToTab("camera")} className="btn-primary w-full shadow-lg">
                    Upload Sighting
                  </button>
                </div>
              </div>
            </section>

            <section
              ref={(el) => {
                sectionRefs.current.camera = el;
              }}
              className="mobile-panel bg-gradient-to-b from-stone-900 via-stone-800 to-black text-white"
            >
              <h2 className="text-xl font-semibold">Camera Report</h2>
              <p className="mt-1 text-sm text-stone-300">
                In the mobile app, this page opens your camera instantly.
              </p>
              <div className="mt-4 flex h-64 items-center justify-center rounded-3xl border border-white/20 bg-gradient-to-br from-stone-700 to-stone-900">
                <div className="rounded-full border border-white/50 px-4 py-2 text-sm text-white/90">
                  Camera Preview Placeholder
                </div>
              </div>
              <div className="mt-4 space-y-3 rounded-2xl border border-white/15 bg-white/5 p-3">
                <label className="block text-xs text-stone-300">Area</label>
                <input
                  readOnly
                  value="College Ave / Easton Ave"
                  className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white"
                />
                <label className="block text-xs text-stone-300">What did you see?</label>
                <textarea
                  readOnly
                  value="Friendly orange tabby near parking lot. Looks hungry."
                  className="h-20 w-full resize-none rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white"
                />
                <label className="block text-xs text-stone-300">Condition</label>
                <div className="flex flex-wrap gap-2">
                  {["Healthy", "Sickly", "Injured", "Needs Urgent Help"].map((condition) => (
                    <button
                      key={condition}
                      type="button"
                      onClick={() => setSelectedCondition(condition)}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        selectedCondition === condition
                          ? "border-scarlet-400 bg-scarlet-500/30 text-white"
                          : "border-white/25 bg-black/20 text-stone-200"
                      }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-stone-300">Selected condition: {selectedCondition}</p>
                <button type="button" className="btn-primary w-full">
                  Submit Sighting In-App
                </button>
              </div>
            </section>

            <section
              ref={(el) => {
                sectionRefs.current.home = el;
              }}
              className="mobile-panel bg-gradient-to-b from-zinc-900 via-zinc-800 to-black text-white"
            >
              <h2 className="text-xl font-semibold">Home</h2>
              <p className="mt-1 text-sm text-zinc-300">Quick actions and shortcuts to every screen.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {TABS.filter((tab) => tab.id !== "home").map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => goToTab(tab.id)}
                    className="rounded-2xl border border-white/15 bg-white/5 px-3 py-5 text-sm font-medium"
                  >
                    Open {tab.label}
                  </button>
                ))}
              </div>
            </section>

            <section
              ref={(el) => {
                sectionRefs.current.chats = el;
              }}
              className="mobile-panel bg-gradient-to-b from-sky-950 via-blue-900 to-black text-white"
            >
              <h2 className="text-xl font-semibold">Shelter Chats</h2>
              <p className="mt-1 text-sm text-sky-100/80">
                Coordination channels for rescues and handoffs.
              </p>
              {!selectedChat ? (
                <div className="mt-4 space-y-2">
                  {CHAT_ROOMS.map((room) => (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setSelectedChatId(room.id)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10"
                    >
                      <p className="text-sm font-medium">{room.name}</p>
                      <p className="mt-1 text-xs text-sky-100/70">{room.preview}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold">{selectedChat.name}</p>
                    <button
                      type="button"
                      onClick={() => setSelectedChatId(null)}
                      className="rounded-md border border-white/20 px-2 py-1 text-xs"
                    >
                      Back
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedChat.messages.map((message, idx) => {
                      const isOutgoing = idx % 2 === 1;
                      return (
                        <div key={message} className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm ${
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
                  <div className="mt-3 rounded-full bg-black/30 px-3 py-2 text-xs text-sky-100/80">
                    iMessage-style thread preview (demo only)
                  </div>
                </div>
              )}
            </section>

            <section
              ref={(el) => {
                sectionRefs.current.rescues = el;
              }}
              className="mobile-panel bg-gradient-to-b from-rose-950 via-rose-900 to-black text-white"
            >
              <h2 className="text-xl font-semibold">Your Organizations</h2>
              <p className="mt-1 text-sm text-rose-100/80">
                Shelter groups you are active in, including pending applications.
              </p>
              <div className="mt-4 space-y-2">
                {[
                  {
                    name: "New Brunswick Cat Rescue",
                    status: "Active Member",
                    members: 28,
                    tnr: 312,
                    capacityCurrent: 22,
                    capacityTotal: 35,
                  },
                  {
                    name: "Rutgers TNR Volunteers",
                    status: "Active Member",
                    members: 64,
                    tnr: 188,
                    capacityCurrent: 17,
                    capacityTotal: 24,
                  },
                  {
                    name: "Middlesex Feline Coalition",
                    status: "Pending Approval",
                    members: 41,
                    tnr: 73,
                    capacityCurrent: 14,
                    capacityTotal: 30,
                  },
                ].map((org) => (
                  <div key={org.name} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{org.name}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] ${
                          org.status === "Pending Approval" ? "bg-amber-400/20 text-amber-100" : "bg-emerald-400/20 text-emerald-100"
                        }`}
                      >
                        {org.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-rose-100/85">Members: {org.members}</p>
                    <p className="text-xs text-rose-100/85">
                      Shelter Capacity: {org.capacityCurrent}/{org.capacityTotal}
                    </p>
                    <p className="text-xs text-rose-100/85">
                      Community Cat Care Actions (TNR): {org.tnr}
                    </p>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => goToTab("chats")} className="btn-primary mt-4 w-full">
                Open Organization Chats
              </button>
            </section>

            <section
              ref={(el) => {
                sectionRefs.current.membership = el;
              }}
              className="mobile-panel bg-gradient-to-b from-amber-950 via-amber-900 to-black text-white"
            >
              <h2 className="text-xl font-semibold">Membership Plans</h2>
              <p className="mt-1 text-sm text-amber-100/80">
                Sustainable pricing for shelters and rescue organizations.
              </p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <p className="text-sm text-amber-200">Monthly</p>
                  <p className="mt-1 text-2xl font-bold">$10</p>
                  <p className="text-xs text-amber-100/70">per organization / month</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <p className="text-sm text-amber-200">Annual</p>
                  <p className="mt-1 text-2xl font-bold">$110</p>
                  <p className="text-xs text-amber-100/70">discounted yearly plan</p>
                </div>
              </div>
              <button type="button" onClick={() => goToTab("camera")} className="btn-primary mt-4 w-full">
                Continue To Camera Reporting
              </button>
            </section>
          </div>

          <div className="grid grid-cols-7 gap-1 border-t border-white/10 bg-black px-2 py-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => goToTab(tab.id)}
                className={`min-h-11 rounded-lg px-2 py-2.5 text-center transition ${
                  activeTab === tab.id ? "bg-white text-black" : "bg-white/5 text-white/85 hover:bg-white/15"
                }`}
              >
                <p className="text-[11px] font-medium leading-none">{tab.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
