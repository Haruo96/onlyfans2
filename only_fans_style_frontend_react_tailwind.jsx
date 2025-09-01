import React, { useMemo, useState } from "react";
import { Camera, Flame, Home, MessageCircle, Search, Settings, Shield, Star, Users, Video, Wallet, Bell, Menu, X, Heart, MessageSquare, Share2, MoreVertical, Lock, Play, Image as ImageIcon, ThumbsUp, Send, Gift } from "lucide-react";

// Single-file React app that mimics an OnlyFans-style UI (frontend only)
// - Tailwind CSS for styling
// - No backend/real auth; everything is mocked in-memory
// - Pages: Feed, Discover, Creator Profile, Messages, Settings
// - Components: TopNav, Sidebar, PostCard, CreatorCard, PaywallBanner, SubscribeModal, TipModal
//
// To use in a real project:
// 1) Create a Vite + React + TS app (or Next.js) and add Tailwind.
// 2) Paste this component and export it as a page.
// 3) Wire real APIs for posts, profiles, subscriptions, and payments.

const AVATARS = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
];

const PHOTOS = Array.from({ length: 12 }).map((_, i) => `https://picsum.photos/seed/only${i}/800/600`);

function classNames(...s) { return s.filter(Boolean).join(" "); }
function TopNav({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="lg:hidden p-2 rounded-xl border hover:bg-gray-50" onClick={onToggleSidebar}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-indigo-600" />
            <span className="font-extrabold text-xl tracking-tight">Fanz</span>
          </div>
        </div>
        <div className="hidden md:flex max-w-md flex-1 mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input placeholder="Search creators, posts, tags…" className="w-full rounded-2xl border pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl border hover:bg-gray-50"><Bell className="h-5 w-5"/></button>
          <button className="p-2 rounded-xl border hover:bg-gray-50"><Camera className="h-5 w-5"/></button>
          <img src={AVATARS[2]} alt="me" className="h-8 w-8 rounded-full ring-2 ring-white"/>
        </div>
      </div>
    </header>
  );
}

function Sidebar({ active, setActive, open, onClose }) {
  const items = [
    { key: "feed", label: "Feed", icon: Home },
    { key: "discover", label: "Discover", icon: Users },
    { key: "profile", label: "My Profile", icon: Star },
    { key: "messages", label: "Messages", icon: MessageCircle },
    { key: "settings", label: "Settings", icon: Settings },
  ];
  const content = (
    <nav className="p-3">
      <div className="px-2 pb-3">
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-2 font-medium shadow">
          Create Post
        </button>
      </div>
      <ul className="space-y-1">
        {items.map(({ key, label, icon: Icon }) => (
          <li key={key}>
            <button
              onClick={() => { setActive(key); onClose?.(); }}
              className={classNames(
                "w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm",
                active === key ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-2xl border p-3 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-center gap-2 mb-2"><Shield className="h-4 w-4"/><span className="text-xs font-semibold">Safe Creator Tips</span></div>
        <p className="text-xs text-gray-600">Verify your email, enable 2FA, and follow community guidelines.</p>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile drawer */}
      <div className={classNames("fixed inset-0 z-40 bg-black/30 lg:hidden", open ? "block" : "hidden")} onClick={onClose} />
      <aside className={classNames(
        "fixed lg:static z-50 lg:z-auto top-0 left-0 h-full w-72 bg-white border-r shadow-lg lg:shadow-none transform transition-transform", 
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-14 flex items-center justify-between px-4 border-b lg:hidden">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-indigo-600" />
            <span className="font-extrabold text-lg">Fanz</span>
          </div>
          <button className="p-2 rounded-xl border" onClick={onClose}><X className="h-5 w-5"/></button>
        </div>
        {content}
      </aside>
    </>
  );
}

function CreatorBadge({ label }) {
  return <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">{label}</span>;
}

function PostCard({ post, onSubscribe, onTip }) {
  const [liked, setLiked] = useState(false);
  const isLocked = post.locked;
  return (
    <article className="rounded-2xl border bg-white overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 p-3">
        <img src={post.creator.avatar} className="h-9 w-9 rounded-full"/>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            {post.creator.name}
            {post.creator.verified && <CreatorBadge label="Verified"/>}
          </div>
          <div className="text-xs text-gray-500">{post.time}</div>
        </div>
        <button className="p-2 rounded-lg hover:bg-gray-50"><MoreVertical className="h-4 w-4"/></button>
      </div>
      <div className="relative bg-gray-50">
        {isLocked ? (
          <div className="aspect-video grid place-items-center bg-gray-100 relative">
            <Lock className="h-10 w-10 text-gray-400"/>
            <button onClick={onSubscribe} className="absolute bottom-3 left-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-medium shadow">
              Subscribe to unlock
            </button>
          </div>
        ) : post.type === "video" ? (
          <div className="relative">
            <img src={post.cover} className="w-full aspect-video object-cover"/>
            <button className="absolute inset-0 grid place-items-center">
              <span className="p-4 rounded-full bg-black/40 backdrop-blur">
                <Play className="h-8 w-8 text-white"/>
              </span>
            </button>
          </div>
        ) : (
          <img src={post.cover} className="w-full object-cover"/>
        )}
      </div>
      <div className="p-3 space-y-3">
        <p className="text-sm">{post.caption}</p>
        <div className="flex items-center gap-3 text-sm">
          <button onClick={() => setLiked(v=>!v)} className={classNames("inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border", liked ? "bg-rose-50 text-rose-600 border-rose-200" : "hover:bg-gray-50")}> 
            <Heart className="h-4 w-4"/>{liked?"Liked":"Like"}
          </button>
          <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border hover:bg-gray-50"><MessageSquare className="h-4 w-4"/>Comment</button>
          <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border hover:bg-gray-50"><Share2 className="h-4 w-4"/>Share</button>
          <div className="flex-1"/>
          <button onClick={onTip} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border bg-yellow-50 hover:bg-yellow-100">
            <Gift className="h-4 w-4"/> Tip
          </button>
        </div>
      </div>
    </article>
  );
}

function CreatorCard({ c, onOpen }) {
  return (
    <button onClick={() => onOpen(c)} className="text-left rounded-2xl border bg-white overflow-hidden hover:shadow">
      <img src={c.cover} className="w-full aspect-[4/3] object-cover"/>
      <div className="p-3">
        <div className="flex items-center gap-2">
          <img src={c.avatar} className="h-8 w-8 rounded-full"/>
          <div className="font-medium text-sm">{c.name}</div>
          {c.verified && <CreatorBadge label="Verified"/>}
        </div>
        <div className="mt-2 text-xs text-gray-600 line-clamp-2">{c.bio}</div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <Wallet className="h-4 w-4"/>
          <span className="font-semibold">${c.price}/mo</span>
        </div>
      </div>
    </button>
  );
}

function PaywallBanner({ price, onSubscribe }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-indigo-50 via-white to-white p-4 flex items-center justify-between">
      <div>
        <div className="font-semibold">Subscribe to unlock all content</div>
        <div className="text-sm text-gray-600">Full-resolution photos, videos, and DMs.</div>
      </div>
      <button onClick={onSubscribe} className="px-4 py-2 rounded-2xl bg-indigo-600 text-white text-sm font-medium shadow hover:bg-indigo-700">Subscribe ${price}/mo</button>
    </div>
  );
}

function SubscribeModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">Subscribe</div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-50"><X className="h-5 w-5"/></button>
        </div>
        <p className="mt-2 text-sm text-gray-600">This is a demo. Hook up your payment provider here.</p>
        <div className="mt-4 space-y-2">
          <label className="text-xs font-medium">Plan</label>
          <select className="w-full rounded-xl border px-3 py-2 text-sm">
            <option>Monthly - $14.99</option>
            <option>Quarterly - $39.99</option>
            <option>Yearly - $129.99</option>
          </select>
          <button className="w-full mt-3 bg-indigo-600 text-white py-2 rounded-2xl font-medium hover:bg-indigo-700">Confirm Subscription</button>
        </div>
      </div>
    </div>
  );
}

function TipModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl border bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">Send a Tip</div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-50"><X className="h-5 w-5"/></button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[5,10,20,50,100,200].map(v => (
            <button key={v} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">${v}</button>
          ))}
        </div>
        <input placeholder="Custom amount" className="mt-3 w-full rounded-xl border px-3 py-2 text-sm" />
        <button className="w-full mt-3 bg-yellow-500 text-white py-2 rounded-2xl font-medium hover:bg-yellow-600">Send Tip</button>
      </div>
    </div>
  );
}

function FeedPage({ onOpenCreator, onSubscribe, onTip }) {
  const posts = useMemo(() => (
    [
      { id: 1, type: "image", cover: PHOTOS[0], caption: "Sunset set sneak peek ☀️", locked: false, time: "2h ago", creator: { name: "Lina", avatar: AVATARS[0], verified: true }},
      { id: 2, type: "video", cover: PHOTOS[1], caption: "New vlog dropped!", locked: true, time: "5h ago", creator: { name: "Mika", avatar: AVATARS[1], verified: false }},
      { id: 3, type: "image", cover: PHOTOS[2], caption: "BTS from today’s shoot", locked: true, time: "1d ago", creator: { name: "Ava", avatar: AVATARS[3], verified: true }},
    ]
  ), []);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {posts.map(p => (
          <PostCard key={p.id} post={p} onSubscribe={onSubscribe} onTip={onTip} />
        ))}
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border p-4 bg-white">
          <div className="font-semibold mb-3">Suggested creators</div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <CreatorCard key={i} c={{
                cover: PHOTOS[i+4],
                avatar: AVATARS[(i+1)%AVATARS.length],
                name: ["Luna","Kira","Nova","Aria"][i],
                verified: i%2===0,
                bio: "Daily sets • Behind the scenes • Q&A",
                price: (9.99 + i*3).toFixed(2)
              }} onOpen={onOpenCreator}/>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border p-4 bg-white">
          <div className="font-semibold mb-2">Trending tags</div>
          <div className="flex flex-wrap gap-2 text-xs">
            {["#bts", "#fitness", "#vlog", "#travel", "#studio"].map(t => (
              <span key={t} className="px-2 py-1 rounded-full border bg-gray-50">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscoverPage({ onOpenCreator }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">Discover</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-xl border text-sm">All</button>
          <button className="px-3 py-1.5 rounded-xl border text-sm">Photos</button>
          <button className="px-3 py-1.5 rounded-xl border text-sm">Videos</button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <CreatorCard key={i} c={{
            cover: PHOTOS[(i+3)%PHOTOS.length],
            avatar: AVATARS[i%AVATARS.length],
            name: ["Jade","Ivy","Rin","Sia","Nori","Ari","Mila","Zoë","Yui"][i],
            verified: i%3===0,
            bio: "Exclusive shoots • Livestreams • Polls",
            price: (12.99 + (i%3)*4).toFixed(2)
          }} onOpen={onOpenCreator}/>
        ))}
      </div>
    </div>
  );
}

function ProfileHeader({ creator, onSubscribe }) {
  return (
    <div className="rounded-2xl overflow-hidden border bg-white">
      <div className="relative">
        <img src={creator.banner} className="w-full h-40 object-cover"/>
        <img src={creator.avatar} className="absolute -bottom-8 left-6 h-20 w-20 rounded-full ring-4 ring-white"/>
      </div>
      <div className="pt-10 px-6 pb-4 flex flex-wrap items-center gap-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold">{creator.name} {creator.verified && <CreatorBadge label="Verified"/>}</div>
          <div className="text-sm text-gray-600">{creator.tagline}</div>
        </div>
        <div className="flex-1"/>
        <button onClick={onSubscribe} className="px-4 py-2 rounded-2xl bg-indigo-600 text-white text-sm font-medium shadow hover:bg-indigo-700">Subscribe ${creator.price}/mo</button>
      </div>
    </div>
  );
}

function MediaGrid({ locked }) {
  const media = PHOTOS.slice(0, 9);
  return (
    <div className="grid grid-cols-3 gap-2">
      {media.map((src, i) => (
        <div key={i} className="relative group">
          <img src={src} className="w-full aspect-square object-cover rounded-xl"/>
          {locked && (
            <div className="absolute inset-0 grid place-items-center bg-black/40 backdrop-blur rounded-xl">
              <Lock className="h-6 w-6 text-white"/>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CreatorProfile({ creator, onSubscribe }) {
  const [tab, setTab] = useState("posts");
  const locked = true;
  return (
    <div className="space-y-6">
      <ProfileHeader creator={creator} onSubscribe={onSubscribe} />
      {locked && <PaywallBanner price={creator.price} onSubscribe={onSubscribe} />}
      <div className="rounded-2xl border bg-white">
        <div className="flex gap-2 p-2 border-b">
          {[{k:"posts",label:"Posts",icon:ImageIcon},{k:"videos",label:"Videos",icon:Video},{k:"likes",label:"Likes",icon:ThumbsUp}].map(t => (
            <button key={t.k} onClick={()=>setTab(t.k)} className={classNames("inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm", tab===t.k?"bg-gray-100":"hover:bg-gray-50")}> <t.icon className="h-4 w-4"/> {t.label}</button>
          ))}
        </div>
        <div className="p-4">
          {tab === "posts" && <MediaGrid locked={true}/>} 
          {tab === "videos" && <div className="grid grid-cols-2 md:grid-cols-3 gap-2">{PHOTOS.slice(0,6).map((s,i)=>(
            <div key={i} className="relative">
              <img src={s} className="w-full aspect-video object-cover rounded-xl"/>
              <button className="absolute inset-0 grid place-items-center"><span className="p-3 rounded-full bg-black/40"><Play className="h-6 w-6 text-white"/></span></button>
              <div className="absolute bottom-2 right-2 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">00:{(i+1)*7}</div>
            </div>
          ))}</div>}
          {tab === "likes" && <div className="text-sm text-gray-600">Likes are private.</div>}
        </div>
      </div>
    </div>
  );
}

function MessagesPage() {
  const [text, setText] = useState("");
  return (
    <div className="rounded-2xl border bg-white h-[70vh] flex flex-col">
      <div className="p-3 border-b flex items-center gap-2"><Users className="h-5 w-5"/><div className="font-semibold">Messages</div></div>
      <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50">
        <div className="flex gap-2 items-end">
          <img src={AVATARS[1]} className="h-8 w-8 rounded-full"/>
          <div className="rounded-2xl px-3 py-2 bg-white border max-w-xs text-sm">Hey! Thanks for subscribing 💜</div>
        </div>
        <div className="flex gap-2 items-end justify-end">
          <div className="rounded-2xl px-3 py-2 bg-indigo-600 text-white max-w-xs text-sm">Loving the new set! When’s the next drop?</div>
          <img src={AVATARS[2]} className="h-8 w-8 rounded-full"/>
        </div>
      </div>
      <div className="p-3 border-t flex items-center gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message…" className="flex-1 rounded-2xl border px-3 py-2 text-sm"/>
        <button className="p-2 rounded-xl border hover:bg-gray-50"><ImageIcon className="h-5 w-5"/></button>
        <button className="p-2 rounded-xl border bg-indigo-600 text-white hover:bg-indigo-700"><Send className="h-5 w-5"/></button>
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-4">
        <div className="font-semibold mb-2">Account</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs">Display name</label>
            <input className="w-full rounded-xl border px-3 py-2 text-sm" defaultValue="Lina"/>
          </div>
          <div>
            <label className="text-xs">Username</label>
            <input className="w-full rounded-xl border px-3 py-2 text-sm" defaultValue="@lina"/>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs">Bio</label>
            <textarea className="w-full rounded-xl border px-3 py-2 text-sm" defaultValue="Photographer & creator. New sets weekly."/>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <div className="font-semibold mb-2">Subscription</div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-xl border p-3">
            <div className="text-sm font-medium">Monthly price</div>
            <input className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" defaultValue="$14.99"/>
          </div>
          <div className="rounded-xl border p-3">
            <div className="text-sm font-medium">Auto-renew</div>
            <select className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"><option>Enabled</option><option>Disabled</option></select>
          </div>
          <div className="rounded-xl border p-3">
            <div className="text-sm font-medium">Promotions</div>
            <button className="mt-2 w-full rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">Create Discount</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnlyFansStyleApp() {
  const [active, setActive] = useState("feed");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const [openCreator, setOpenCreator] = useState(null);

  const sampleCreator = useMemo(() => ({
    name: "Lina",
    verified: true,
    tagline: "Weekly sets • BTS • livestreams",
    price: "14.99",
    avatar: AVATARS[0],
    banner: PHOTOS[5]
  }), []);

  const onOpenCreator = (c) => {
    setOpenCreator({
      name: c.name,
      verified: c.verified,
      tagline: c.bio,
      price: c.price,
      avatar: c.avatar,
      banner: c.cover,
    });
    setActive("profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <TopNav onToggleSidebar={() => setSidebarOpen(true)} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6 py-6">
        <Sidebar active={active} setActive={setActive} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="space-y-6">
          {active === "feed" && <FeedPage onOpenCreator={onOpenCreator} onSubscribe={() => setSubOpen(true)} onTip={() => setTipOpen(true)} />}
          {active === "discover" && <DiscoverPage onOpenCreator={onOpenCreator} />}
          {active === "profile" && <CreatorProfile creator={openCreator || sampleCreator} onSubscribe={() => setSubOpen(true)} />}
          {active === "messages" && <MessagesPage />}
          {active === "settings" && <SettingsPage />}
        </main>
      </div>

      <SubscribeModal open={subOpen} onClose={() => setSubOpen(false)} />
      <TipModal open={tipOpen} onClose={() => setTipOpen(false)} />

      {/* Bottom nav for mobile */}
      <nav className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-white border rounded-2xl shadow-lg px-2 py-1 flex items-center gap-1">
        {[{k:"feed",icon:Home,label:"Feed"},{k:"discover",icon:Users,label:"Discover"},{k:"profile",icon:Star,label:"Profile"},{k:"messages",icon:MessageCircle,label:"Chats"},{k:"settings",icon:Settings,label:"Settings"}].map(i => (
          <button key={i.k} onClick={()=>setActive(i.k)} className={classNames("px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1", active===i.k?"bg-gray-100":"hover:bg-gray-50")}> <i.icon className="h-4 w-4"/> {i.label}</button>
        ))}
      </nav>

      <footer className="mt-10 py-10 border-t text-center text-xs text-gray-500">
        <div>© {new Date().getFullYear()} Fanz — Demo UI</div>
        <div className="mt-2">This is a frontend prototype. No real payments or accounts.</div>
      </footer>
    </div>
  );
}
