const $=s=>document.querySelector(s), audio=$("#audio");
let queue=[], index=-1, liked=JSON.parse(localStorage.getItem("fw-liked")||"[]"), localTracks=[];
const key=()=>localStorage.getItem("fw-client-id")||"";
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function settings(open=true){$("#settings").classList.toggle("hidden",!open);$("#clientId").value=key();}
$("#settingsBtn").onclick=()=>settings();$("#closeSettings").onclick=()=>settings(false);
$("#saveKey").onclick=()=>{const v=$("#clientId").value.trim();if(!v){alert("Paste your Jamendo client ID first.");return;}localStorage.setItem("fw-client-id",v);settings(false);loadPopular();};
async function api(params={}){if(!key()){settings();throw Error("Add your free Jamendo client ID in settings to start.");}
 const u=new URL("https://api.jamendo.com/v3.0/tracks/");Object.entries({client_id:key(),format:"json",limit:24,audioformat:"mp31",imagesize:300,...params}).forEach(([k,v])=>u.searchParams.set(k,v));
 const r=await fetch(u);if(!r.ok)throw Error("Music catalogue unavailable right now.");const j=await r.json();if(j.headers?.status==="failed")throw Error(j.headers.error_message||"Jamendo API error.");return j.results||[];}
function card(t,compact=false){const art=t.album_image||t.image||"icon.svg";return `<div class="track" data-id="${esc(t.id)}"><img src="${esc(art)}" alt=""><div class="meta"><b>${esc(t.name||t.title||"Untitled")}</b><small>${esc(t.artist_name||"Unknown artist")}</small></div><button class="like ${liked.some(x=>x.id===t.id)?"liked":""}" aria-label="Like track">${liked.some(x=>x.id===t.id)?"♥":"♡"}</button><button class="play" aria-label="Play">▶</button></div>`;}
function render(list,target="#tracks"){const el=$(target);el.innerHTML=list.length?list.map(t=>card(t)).join(''):'<p class="empty">Nothing here yet.</p>';el.querySelectorAll(".track").forEach(row=>{const id=row.dataset.id,t=list.find(x=>String(x.id)===id);row.querySelector(".play").onclick=()=>playFrom(list,t);row.querySelector(".like").onclick=()=>toggleLike(t);});}
function toggleLike(t){const i=liked.findIndex(x=>x.id===t.id);if(i>=0)liked.splice(i,1);else liked.unshift(t);localStorage.setItem("fw-liked",JSON.stringify(liked));render(liked,"#liked");const active=$("#tracks .track[data-id='"+t.id+"'] .like");if(active)active.textContent=i>=0?"♡":"♥";}
async function loadPopular(){ $("#resultsTitle").textContent="Popular discoveries";$("#status").textContent="Finding music...";try{const list=await api({order:"popularity_total"});queue=list;render(list);$("#status").textContent=list.length?`${list.length} independent tracks to explore.`:"No tracks found.";}catch(e){$("#status").textContent=e.message;}}
async function search(q,genre){if(!q&&!genre)return loadPopular();$("#status").textContent="Searching...";$("#resultsTitle").textContent=q?`Results for “${q}”`:`${genre} discoveries`;try{const list=await api({...(q?{search:q}:{}),...(genre?{tags:genre}:{})});queue=list;render(list);$("#status").textContent=`${list.length} tracks found.`;}catch(e){$("#status").textContent=e.message;}}
function playFrom(list,t){queue=list;index=list.findIndex(x=>x.id===t.id);start();}
function start(){const t=queue[index];if(!t)return;const src=t.audio||t.audiodownload;if(!src){$("#status").textContent="This track has no playable stream.";return;}audio.src=src;audio.play().then(()=>{$("#player").classList.remove("hidden");$("#nowTitle").textContent=t.name;$("#nowArtist").textContent=t.artist_name;$("#nowArt").src=t.album_image||"icon.svg";$("#playBtn").textContent="Ⅱ";document.querySelectorAll(".track").forEach(x=>x.classList.toggle("playing",x.dataset.id===String(t.id)));}).catch(()=>{$("#status").textContent="Playback could not start. Try another track.";});}
$("#playBtn").onclick=()=>{if(audio.paused){audio.play();$("#playBtn").textContent="Ⅱ";}else{audio.pause();$("#playBtn").textContent="▶";}};
$("#nextBtn").onclick=()=>{if(queue.length){index=(index+1)%queue.length;start();}};$("#prevBtn").onclick=()=>{if(queue.length){index=(index-1+queue.length)%queue.length;start();}};
audio.addEventListener("timeupdate",()=>{$("#progressFill").style.width=(audio.duration?audio.currentTime/audio.duration*100:0)+"%";});
audio.addEventListener("ended",()=>{if(queue.length){index=(index+1)%queue.length;start();}});
$("#searchBtn").onclick=()=>search($("#searchInput").value.trim());$("#searchInput").addEventListener("keydown",e=>{if(e.key==="Enter")search(e.target.value.trim());});
document.querySelectorAll("[data-genre]").forEach(b=>b.onclick=()=>search("",b.dataset.genre));$("#refreshBtn").onclick=loadPopular;
$("#localFiles").onchange=e=>{localTracks=[...e.target.files].map((f,i)=>({id:"local"+i,name:f.name.replace(/\.[^.]+$/,""),artist_name:"On this device",audio:URL.createObjectURL(f),album_image:"icon.svg"}));render(localTracks,"#localList");$("#localList").querySelectorAll(".track").forEach((row,i)=>row.querySelector(".play").onclick=()=>playFrom(localTracks,localTracks[i]));};
render(liked,"#liked");if(key())loadPopular();else settings(); 
if("mediaSession" in navigator){navigator.mediaSession.setActionHandler("play",()=>audio.play());navigator.mediaSession.setActionHandler("pause",()=>audio.pause());navigator.mediaSession.setActionHandler("previoustrack",()=>$("#prevBtn").click());navigator.mediaSession.setActionHandler("nexttrack",()=>$("#nextBtn").click());}

if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(()=>{});
