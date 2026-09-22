const RC_AVERATHIA_SPELL_AUDIT={"Arcanist/Elf":{"1":{"NOW":["Magic Missile","Shield","Sleep","Light"],"LATER":["Charm Person","Detect Magic","Floating Disc","Hold Portal","Read Languages","Read Magic","Ventriloquism"],"NO":[]},"2":{"NOW":["Mirror Image","Web"],"LATER":["Continual Light","Detect Evil","Detect Invisible","ESP","Invisibility","Knock","Levitate","Locate Object","Wizard Lock"],"NO":[]},"3":{"NOW":["Fireball","Lightning Bolt","Haste","Slow","Hold Person","Protection from Normal Missiles"],"LATER":["Clairvoyance","Create Air","Dispel Magic","Fly","Infravision","Invisibility 10' Radius","Water Breathing"],"NO":[]}},"Cleric":{"1":{"NOW":["Cure Light Wounds","Protection from Evil","Remove Fear","Resist Cold"],"LATER":["Detect Evil","Detect Magic","Light","Purify Food and Water"],"NO":[]},"2":{"NOW":["Bless","Hold Person","Resist Fire"],"LATER":["Find Traps","Know Alignment","Silence 15' Radius","Snake Charm","Speak with Animal"],"NO":[]},"3":{"NOW":["Cure Disease","Striking"],"LATER":["Continual Light","Cure Blindness","Dispel Magic","Growth of Animals","Locate Object","Speak with the Dead"],"NO":[]}}};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],d=n=>1+Math.floor(Math.random()*n);
let sex="Male",avatar=0,cs=[],pick=null,h=null,tab="Weapons",mode="present",risk="Normal",mins=1,timer=null,autonomousCombatRunning=false;
const classSlug=c=>c.toLowerCase();
function artPath(cls,sx,i,kind="full"){return `${classSlug(cls)}_${sx.toLowerCase()}_${i+1}_${kind}.png`;}
const CLASSES=[["Fighter","⚔️","Human"],["Cleric","✦","Human"],["Arcanist","✧","Human"],["Thief","🗝️","Human"],["Elf","🏹","Race-as-class"],["Dwarf","⛏️","Race-as-class"]];
const FN={Male:["Aldric","Edric","Garran","Leofric","Oswin","Roderic","Wulfric","Cedric","Beren","Tobran"],Female:["Alda","Elowen","Mara","Rowena","Isolde","Aveline","Seren","Edith","Brynja","Tamsin"]};
const LN=["Stonefield","Ashford","Blackwood","Thorne","Vale","Ironwood","Hawke","Westmere","Oakheart","Ravenbrook","Greyward","Redfern"];
const SHOP={Weapons:[["Battle Axe",7,"1d8"],["Hand Axe",4,"1d6"],["Short Bow",25,"1d6"],["Long Bow",40,"1d6"],["Light Crossbow",30,"1d6"],["Heavy Crossbow",50,"2d4"],["Club",3,"1d4"],["Throwing Hammer",4,"1d4"],["War Hammer",5,"1d6"],["Mace",5,"1d6"],["Staff",5,"1d6"],["Dagger",3,"1d4"],["Silver Dagger",30,"1d4"],["Halberd",7,"1d10"],["Javelin",1,"1d6"],["Lance",10,"1d10"],["Pike",3,"1d10"],["Polearm",7,"1d10"],["Poleaxe",5,"1d10"],["Spear",3,"1d6"],["Trident",5,"1d6"],["Short Sword",7,"1d6"],["Sword",10,"1d8"],["Bastard Sword (1H)",15,"1d6+1"],["Bastard Sword (2H)",15,"1d8+1"],["Two-Handed Sword",15,"1d10"],["Cestus",5,"1d3"],["Sling",2,"1d4"],],Armor:[["Shield",10,"AC -1"],["Leather Armor",20,"AC 7"],["Scale Mail",30,"AC 6"],["Chain Mail",40,"AC 5"],["Banded Mail",50,"AC 4"],["Plate Mail",60,"AC 3"],["Suit Armor",250,"AC 0"]],Gear:[["Rations — 7 days",5,"7 days food"],["Waterskin",1,"1 quart; reusable"],["Torch",0.17,"1 hour light"],["6 Torches",1,"6 hours light"],["Lantern",10,""],["Oil Flask",2,"4 hours lantern fuel"],["Backpack",5,""],["50-foot Rope",1,""],["Tinder Box",3,""],["Grappling Hook",25,""],["Arrows — 20",5,"20 arrows"],["Quarrels — 30",10,"30 crossbow bolts"],["Sling Stones — 30",1,"30 sling stones"],["Healing Potion",10,"1D6+1 HP"]]};
function mod(v){return v===18?3:v>=16?2:v>=13?1:0}
const CREATION_ABILITY_PRIORITY={
 Fighter:["STR","CON","DEX","CHA","WIS","INT"],
 Thief:["DEX","CON","STR","WIS","CHA","INT"],
 Cleric:["WIS","STR","CON","DEX","CHA","INT"],
 Arcanist:["INT","CON","WIS","DEX","CHA","STR"],
 Dwarf:["STR","CON","DEX","CHA","WIS","INT"],
 Elf:["STR","INT","DEX","CHA","WIS","CON"]
};
function candidate(){
 let r=Array.from({length:6},()=>d(10)+8).sort((a,b)=>b-a);
 let order=CREATION_ABILITY_PRIORITY[chosenClass]||CREATION_ABILITY_PRIORITY.Fighter,s={};
 order.forEach((ability,i)=>s[ability]=r[i]);
 let hd=({Fighter:8,Cleric:6,Thief:4,Arcanist:4,Dwarf:8,Elf:6}[chosenClass]||8);return{stats:s,hp:hd+mod(s.CON),gold:180}
}
function fullName(){return FN[sex][d(FN[sex].length)-1]+" "+LN[d(LN.length)-1]}
function chibiHTML(sx,i,big=false){return `<img src="${artPath(chosenClass,sx,i,"full")}" alt="${sx} ${chosenClass} ${i+1}">`}
function spriteHTML(sx,i,cls=chosenClass){return `<img src="${artPath(cls,sx,i,"sprite")}" alt="">`}
let chosenClass="Fighter";
function renderClasses(){$("#classList").innerHTML=CLASSES.map(c=>`<button class="classChoice ${c[0]===chosenClass?"on":""}" data-class="${c[0]}"><b>${c[0]}</b></button>`).join("");$$("[data-class]").forEach(b=>b.onclick=()=>{chosenClass=b.dataset.class;rerollAll();renderClasses();renderAv()})}
function renderAv(){$("#avatars").innerHTML=[0,1,2].map((a,i)=>`<button class="avatarBtn ${i===avatar?"on":""}" data-av="${i}">${chibiHTML(sex,i)}</button>`).join("");$$("[data-av]").forEach(b=>b.onclick=()=>{avatar=+b.dataset.av;renderAv()});$("#bigAvatar").innerHTML=chibiHTML(sex,avatar,true);$("#previewLabel").textContent=(($("#charName").value||"").trim()||"Selected Character")+" — "+chosenClass}
function renderCandidates(){$("#selectionHint").innerHTML=pick===null?`Select any candidate. You can change your choice before confirmation.`:`${chosenClass} ${pick+1} is currently selected. Click <b>Select</b> on another ${chosenClass} to change it; nothing is final until <b>Choose Character → Town</b>.`;$("#candidates").innerHTML=cs.map((c,i)=>`<div class="card ${pick===i?"sel":""}"><b>${chosenClass} ${i+1}</b><div class="stats">${["STR","DEX","CON","INT","WIS","CHA"].map(a=>`<div class="stat">${a}<br><b>${c.stats[a]}</b></div>`).join("")}</div><p>❤️ ${c.hp} HP · 🪙 ${c.gold} gp</p><button data-pick="${i}" class="${pick===i?'on':''}">${pick===i?'Selected ✓':'Select'}</button></div>`).join("");$$("[data-pick]").forEach(b=>b.onclick=()=>{pick=+b.dataset.pick;$("#chooseCharacter").disabled=false;renderCandidates()})}
function rerollAll(){cs=[candidate(),candidate(),candidate()];pick=null;$("#chooseCharacter").disabled=true;renderCandidates()}
$("#male").onclick=()=>{sex="Male";avatar=0;$("#male").classList.add("on");$("#female").classList.remove("on");renderAv()};
$("#female").onclick=()=>{sex="Female";avatar=0;$("#female").classList.add("on");$("#male").classList.remove("on");renderAv()};
$("#genName").onclick=()=>{$("#charName").value=fullName();renderAv()};
$("#charName").addEventListener("input",renderAv);$("#reroll").onclick=rerollAll;
function addClassStartingItems(){
 const special={Arcanist:["Spellbook"],Elf:["Spellbook"],Cleric:["Holy Symbol"],Thief:["Thief's Tools"]}[chosenClass]||[];
 for(const n of special)h.inv.push({n,kind:"classItem",can:false,eq:false,bound:true,noSell:true});
 const weapon={Fighter:"Sword",Dwarf:"Battle Axe"}[chosenClass];
 if(weapon)h.inv.push({n:weapon,kind:"weapon",can:true,eq:false,bound:true,noSell:true});
}
$("#chooseCharacter").onclick=()=>{if(pick===null)return;let c=structuredClone(cs[pick]);h={...c,maxhp:c.hp,xp:0,level:1,name:$("#charName").value.trim()||fullName(),sex,avatar,className:chosenClass,mechanicsClass:chosenClass,gp:0,sp:0,cp:0,inv:[],rations:0,water:0,waterCapacity:0,lightMinutes:0};h.gp=c.gold;addClassStartingItems();$("#create").classList.add("hide");$("#game").classList.remove("hide");save();home();page("town")};
const CLASS_LEVELS={
 Fighter:{cap:36,hd:8,xp:[0,2000,4000,8000,16000,32000,64000,120000,240000,360000,480000,600000,720000,840000,960000,1080000,1200000,1320000,1440000,1560000,1680000,1800000,1920000,2040000,2160000,2280000,2400000,2520000,2640000,2760000,2880000,3000000,3120000,3240000,3360000,3480000]},
 Cleric:{cap:36,hd:6,xp:[0,1500,3000,6000,12000,25000,50000,100000,200000,300000,400000,500000,600000,700000,800000,900000,1000000,1100000,1200000,1300000,1400000,1500000,1600000,1700000,1800000,1900000,2000000,2100000,2200000,2300000,2400000,2500000,2600000,2700000,2800000,2900000]},
 Thief:{cap:36,hd:4,xp:[0,1200,2400,4800,9600,20000,40000,80000,160000,280000,400000,520000,640000,760000,880000,1000000,1120000,1240000,1360000,1480000,1600000,1720000,1840000,1960000,2080000,2200000,2320000,2440000,2560000,2680000,2800000,2920000,3040000,3160000,3280000,3400000]},
 Arcanist:{cap:36,hd:4,xp:[0,2500,5000,10000,20000,40000,80000,150000,300000,450000,600000,750000,900000,1050000,1200000,1350000,1500000,1650000,1800000,1950000,2100000,2250000,2400000,2550000,2700000,2850000,3000000,3150000,3300000,3450000,3600000,3750000,3900000,4050000,4200000,4350000]},
 Dwarf:{cap:12,hd:8,xp:[0,2200,4400,8800,17000,35000,70000,140000,270000,400000,530000,660000]},
 Elf:{cap:10,hd:6,xp:[0,4000,8000,16000,32000,64000,120000,250000,400000,600000]}
};
function classLevelData(){return CLASS_LEVELS[h.className]||CLASS_LEVELS.Fighter}
function levelForXP(xp=h.xp){let r=classLevelData(),lv=1;for(let i=1;i<r.xp.length;i++)if(xp>=r.xp[i])lv=i+1;return Math.min(r.cap,lv)}
function conHPBonus(){return mod(h.stats.CON)}
function gainLevel(){
 let r=classLevelData(),old=h.level||1;if(old>=r.cap)return false;
 h.level=old+1;
 if(h.level<=9){let roll=d(r.hd),gain=Math.max(1,roll+conHPBonus());h.maxhp+=gain;h.hp+=gain;h.lastLevelGain={level:h.level,hp:gain,roll,con:conHPBonus()}}
 else{let gain={Fighter:2,Thief:2,Cleric:1,Arcanist:1,Dwarf:3,Elf:1}[h.className]??1;h.maxhp+=gain;h.hp+=gain;h.lastLevelGain={level:h.level,hp:gain,roll:null,con:0}}
 if(h.trip?.journal)journal({id:`LEVEL-${h.level}`,type:"Progression",title:`Level ${h.level}`,text:`${h.name} reached level ${h.level}.`,result:"levelUp",xp:0,coins:[0,0,0],hpGain:h.lastLevelGain.hp});
 return true
}
function checkLevelUps(){
 if(!h)return;let target=levelForXP(),changed=false;
 while(h.level<target){gainLevel();changed=true}
 return changed
}
function primeRequisiteXPBonus(){
 let s=h?.stats||{};
 if(h?.className==="Elf"){if((s.STR||0)>=13&&(s.INT||0)>=16)return .10;if((s.STR||0)>=13&&(s.INT||0)>=13)return .05;return 0}
 let key={Fighter:"STR",Dwarf:"STR",Cleric:"WIS",Arcanist:"INT",Thief:"DEX"}[h?.className],v=key?(s[key]||0):0;
 return v>=16?.10:v>=13?.05:0
}
function awardXP(amount){
 let base=Math.max(0,Math.floor(amount||0));if(!base)return 0;
 let gained=Math.floor(base*(1+primeRequisiteXPBonus())+.5);
 h.xp=(h.xp||0)+gained;checkLevelUps();return gained
}
const AT_RATE=24;
function ensureWorldClock(){
 if(!h.worldClock)h.worldClock={realAnchor:Date.now(),atAnchor:Date.now()};
}
function averathiaNow(){
 ensureWorldClock();return h.worldClock.atAnchor+(Date.now()-h.worldClock.realAnchor)*AT_RATE;
}
function atDate(){return new Date(averathiaNow())}
function atClockText(){
 let x=atDate();return `AT ${String(x.getUTCHours()).padStart(2,"0")}:${String(x.getUTCMinutes()).padStart(2,"0")} · Day ${Math.floor(averathiaNow()/86400000)+1}`;
}
function realMsForATHours(hours){return hours*3600000/AT_RATE}
function startLongRest(){
 if(h.trip||h.combat||h.deadUntil)return false;
 h.restUntil=Date.now()+realMsForATHours(8);save();return true
}
function mummyDiseaseActive(){return !!h?.mummyDisease}
function updateRest(){
 if(h?.restUntil&&Date.now()>=h.restUntil){
   h.restUntil=null;let rate=mummyDiseaseActive()?.025:.25;h.hp=Math.min(h.maxhp,h.hp+Math.ceil(h.maxhp*rate));resetDailySpells();save();return true
 }return false
}
function save(){if(h)checkLevelUps();localStorage.setItem("averathia-v041",JSON.stringify(h));refresh()}
const TROPHY_COLLECTIONS={"Arcanist":[["The Violet Codex","Book"],["Atlas of the Hollow Stars","Book"],["The Thirteenth Equation","Book"],["Grimoire of the Glass Moon","Book"],["The Ashen Index","Book"],["Treatise on Silent Doors","Book"]],"Thief":[["The Widow's Ruby","Jewel"],["Emerald of Seven Doors","Jewel"],["The Blackbird Brooch","Jewel"],["Moon-Tear Sapphire","Jewel"],["The Gilded Serpent","Jewel"],["Crownless Diamond","Jewel"]],"Fighter":[["Slayer of the Bridge Ogre","Deed"],["Victor of Blackstone Pass","Deed"],["Defender of Three Wells","Deed"],["Breaker of the Iron Siege","Deed"],["Champion of Raven Ford","Deed"],["The Last Stand at Greywatch","Deed"]],"Cleric":[["Fingerbone of Saint Ordel","Relic"],["Bell of Saint Merra","Relic"],["Ashes of Saint Caldrin","Relic"],["Broken Halo of Saint Vey","Relic"],["Lantern of Saint Edrin","Relic"],["Tear of Saint Alwen","Relic"]],"Dwarf":[["Rune of the First Hearth","Rune"],["Rune of Borun's Exile","Rune"],["Rune of the Seven Sons","Rune"],["Rune of the Deep Anvil","Rune"],["Rune of the Lost Hold","Rune"],["Rune of the Returning Kin","Rune"]],"Elf":[["Silveroak Acorn","Seed"],["Moonwillow Seed","Seed"],["Starbloom Kernel","Seed"],["Heartnut of the Elder Grove","Seed"],["Dawnpine Cone","Seed"],["Whisperleaf Seed","Seed"]]};const TROPHY_TITLES={"Arcanist":"Forbidden Library","Thief":"Crown Jewels","Fighter":"Deeds of Renown","Cleric":"Relics of the Saints","Dwarf":"Ancestral Runes","Elf":"Seeds of the First Wood"};
function ensureTrophies(){if(h&&!Array.isArray(h.trophies))h.trophies=[]}
function unlockTrophy(name){ensureTrophies();if(!h||h.trophies.includes(name))return false;let valid=(TROPHY_COLLECTIONS[h.className]||[]).some(x=>x[0]===name);if(!valid)return false;h.trophies.push(name);save();return true}
function renderTrophies(){let grid=$("#trophyGrid"),intro=$("#trophyIntro");if(!grid||!h)return;ensureTrophies();let list=TROPHY_COLLECTIONS[h.className]||[],got=new Set(h.trophies);intro.textContent=`${TROPHY_TITLES[h.className]||"Collection"} — ${list.filter(x=>got.has(x[0])).length}/${list.length} discovered`;grid.innerHTML=list.map(([name,kind])=>got.has(name)?`<div class="trophyCard unlocked"><div class=trophyIcon>✦</div><b>${name}</b><span>${kind}</span></div>`:`<div class="trophyCard locked"><div class=trophyIcon>?</div><b>???</b><span>Undiscovered</span></div>`).join("")}

function refresh(){if(h?.deadUntil&&Date.now()<h.deadUntil){renderDeathPage();return}renderTrophies();if(h)renderSkills();if($("#lastAdventure")){if(h?.lastAdventure){$("#lastAdventure").classList.remove("hide");$("#lastAdventureText").textContent=h.lastAdventure}else $("#lastAdventure").classList.add("hide")}if(h?.pendingEvent)renderPendingEvent();if(!h)return;updateRest();
 if(h.deadUntil&&Date.now()>=h.deadUntil){h.deadUntil=null;h.hp=Math.max(1,h.maxhp);h.trip=null;h.combat=null;save();page("town");return}
 if($("#worldClock"))$("#worldClock").textContent=atClockText();
 if($("#longRestBtn")){$("#longRestBtn").disabled=!!h.restUntil||!!h.deadUntil;$("#longRestBtn").onclick=()=>startLongRest()}
 if($("#restStatus"))$("#restStatus").textContent=h.deadUntil?`Recall: ${Math.ceil((h.deadUntil-Date.now())/60000)} min`:h.restUntil?`Resting: ${Math.max(0,Math.ceil((h.restUntil-Date.now())/60000))} min RT remaining`:"";
 let classLabel=["Elf","Dwarf"].includes(h.className)?h.className:`Human ${h.className}`;$("#top").innerHTML=`<b>${h.name}</b> — Level ${h.level} ${classLabel} &nbsp; ❤️ ${h.hp}/${h.maxhp} &nbsp; ⭐ ${h.xp} XP${h.level<classLevelData().cap?` / ${classLevelData().xp[h.level]}`:" · MAX"} &nbsp; 🪙 ${Math.trunc(h.gp ?? h.gold ?? 0)} GP · ${Math.trunc(h.sp ?? 0)} SP · ${Math.trunc(h.cp ?? 0)} CP`;let av=chibiHTML(h.sex,h.avatar,true);$("#townAvatar").innerHTML=$("#sheetAvatar").innerHTML=av;let coins=`${Math.trunc(h.gp||0)} GP · ${Math.trunc(h.sp||0)} SP · ${Math.trunc(h.cp||0)} CP`;$("#sheetData").innerHTML=`<b>${h.name}</b> &nbsp; ${h.sex} · ${["Elf","Dwarf"].includes(h.className)?h.className:`Human ${h.className}`}`;let order=["STR","DEX","CON","INT","WIS","CHA"];$("#sheetStats").innerHTML=order.map(k=>`<div class=stat>${k}<br><b>${h.stats[k]}</b></div>`).join("");let ammo=`Arrows: ${ammoCount("Arrows")} · Quarrels: ${ammoCount("Quarrels")} · Sling stones: ${ammoCount("Sling Stones")}`;$("#sheetResources").innerHTML=`Rations: ${h.rations.toFixed(2)} days · Water: ${h.water.toFixed(2)}/${h.waterCapacity} skins · Light: ${(h.lightMinutes/60).toFixed(2)} h · ${ammo}`;sheetInventory();renderShop();$("#requirements").innerHTML=`<p>Needed for ${mins} min: food ${(mins/1440).toFixed(3)} days · water ${(4*mins/1440).toFixed(3)} skins · light ${(mins*2/3).toFixed(1)} min.</p>`}
function renderDeathPage(){if(!h?.deadUntil)return;clearTimeout(timer);$$(".page").forEach(x=>x.classList.add("hide"));let p=$("#death");if(!p)return;p.classList.remove("hide");let left=Math.max(0,h.deadUntil-Date.now()),m=Math.floor(left/60000),s=Math.floor(left/1000)%60;$("#graveName").textContent=h.name;$("#deathCountdown").textContent=`${m}:${String(s).padStart(2,"0")}`;$("#top").innerHTML=`<b>${h.name}</b> — DEAD`;timer=setTimeout(()=>{if(Date.now()>=h.deadUntil){h.deadUntil=null;h.hp=Math.max(1,h.maxhp);h.trip=null;h.combat=null;save();page("town")}else renderDeathPage()},500)}
function page(id){if(h?.deadUntil&&Date.now()<h.deadUntil&&id!=="death"){renderDeathPage();return}$$(".page").forEach(x=>x.classList.add("hide"));$("#"+id).classList.remove("hide");$$("[data-page]").forEach(x=>x.classList.toggle("on",x.dataset.page===id));refresh()}
$$("[data-page]").forEach(b=>b.onclick=()=>page(b.dataset.page));$$("[data-go]").forEach(b=>b.onclick=()=>page(b.dataset.go));
function home(){if(!h)return;h.water=h.waterCapacity;save()}
const RANGED_WEAPONS=new Set(["Short Bow","Long Bow","Light Crossbow","Heavy Crossbow","Sling"]);
const THROWN_WEAPONS=new Set(["Hand Axe","Throwing Hammer","Dagger","Silver Dagger","Javelin","Spear","Trident"]);
const EDGED_WEAPONS=new Set(["Battle Axe","Hand Axe","Dagger","Silver Dagger","Halberd","Javelin","Lance","Pike","Polearm","Poleaxe","Spear","Trident","Short Sword","Sword","Bastard Sword (1H)","Bastard Sword (2H)","Two-Handed Sword"]);
const WEAPON_RANGES={
 "Hand Axe":[10,20,30],"Short Bow":[50,100,150],"Long Bow":[70,140,210],
 "Light Crossbow":[60,120,180],"Heavy Crossbow":[80,160,240],"Throwing Hammer":[10,20,30],
 "Dagger":[10,20,30],"Silver Dagger":[10,20,30],"Javelin":[30,60,90],
 "Spear":[20,40,60],"Trident":[10,20,30],"Sling":[40,80,160]
};
function weaponRangeText(name){let r=WEAPON_RANGES[name];return r?`${r[0]}/${r[1]}/${r[2]}'`:"—"}
const RANGE_BANDS=[{name:"Hand-to-Hand",feet:5},{name:"Close",feet:20},{name:"Medium",feet:80},{name:"Long",feet:150}];
function combatDistance(){
 if(!h?.combat)return 0;
 if(!Number.isFinite(h.combat.distanceFeet)){let b=RANGE_BANDS.find(x=>x.name===(h.combat.range||"Close"))||RANGE_BANDS[1];h.combat.distanceFeet=b.feet}
 return h.combat.distanceFeet
}
function combatBandIndex(){let d=combatDistance();if(d<=5)return 0;if(d<=30)return 1;if(d<=120)return 2;return 3}
function syncCombatRange(){if(h?.combat)h.combat.range=RANGE_BANDS[combatBandIndex()].name}
function setCombatBand(i){if(!h?.combat)return;let b=RANGE_BANDS[Math.max(0,Math.min(RANGE_BANDS.length-1,i))];h.combat.distanceFeet=b.feet;h.combat.range=b.name}
function weaponCanReach(name,distance=combatDistance()){let r=WEAPON_RANGES[name];return !!r&&distance<=r[2]}
function attackModeFor(name){
 let distance=combatDistance();
 if(distance<=5)return RANGED_WEAPONS.has(name)?"missile":"melee";
 if(RANGED_WEAPONS.has(name))return weaponCanReach(name,distance)?"missile":"out-of-range";
 if(THROWN_WEAPONS.has(name))return weaponCanReach(name,distance)?"thrown":"out-of-range";
 return "out-of-range"
}
function throwWeaponItem(item){
 if(!item)return;
 item._thrown=true;item._restoreEq=!!item.eq&&!item._autoReadied;item.eq=false;delete item._autoReadied;
 let next=h.inv.find(x=>x.kind==="weapon"&&x.n===item.n&&!x.eq&&!x._thrown);
 if(next){next.eq=true;next._autoReadied=true;clog(`You ready another ${item.n}.`)}
}
function recoverThrownWeapons(){
 let restore=null;
 for(const x of h.inv||[]){
  if(x._thrown){if(x._restoreEq&&!restore)restore=x;x.eq=false;delete x._thrown;delete x._restoreEq}
  if(x._autoReadied){x.eq=false;delete x._autoReadied}
 }
 if(restore)restore.eq=true
}
const TWO_HANDED=new Set(["Staff","Halberd","Pike","Polearm","Poleaxe","Bastard Sword (2H)","Two-Handed Sword","Short Bow","Long Bow","Light Crossbow","Heavy Crossbow"]);
function itemData(name){for(const x of SHOP.Weapons)if(x[0]===name)return{damage:x[2],two:TWO_HANDED.has(name)};for(const x of SHOP.Armor)if(x[0]===name)return name==="Shield"?{shield:true,acBonus:-1}:{armor:true,ac:+x[2].match(/\d+/)[0]};return{}}
function ammoTypeFor(name){if(name==="Short Bow"||name==="Long Bow")return "Arrows";if(name==="Light Crossbow"||name==="Heavy Crossbow")return "Quarrels";if(name==="Sling")return "Sling Stones";return null}
function ammoCount(type){return (h.ammo&&h.ammo[type])||0}
function spendAmmoFor(name){let type=ammoTypeFor(name);if(!type)return true;h.ammo=h.ammo||{};if(ammoCount(type)<1)return false;h.ammo[type]--;return true}
function equippedWeapons(){let all=h.inv.filter(x=>x.kind==="weapon"&&x.eq),melee=all.find(x=>!RANGED_WEAPONS.has(x.n)),ranged=all.find(x=>RANGED_WEAPONS.has(x.n));return{melee,ranged}}
function activeWeapon(){
 let w=equippedWeapons(),range=h.combat?.range||"Close";
 if(range==="Hand-to-Hand")return w.melee||w.ranged;
 return w.ranged&&ammoCount(ammoTypeFor(w.ranged.n))>0?w.ranged:(w.melee||w.ranged)
}
function combatStats(){let weapon=activeWeapon(),armor=h.inv.find(x=>x.kind==="armor"&&x.eq),shield=h.inv.find(x=>x.kind==="shield"&&x.eq),wd=weapon?itemData(weapon.n):{},ad=armor?itemData(armor.n):{},name=weapon?.n||"Unarmed",dexAC=mod(h.stats.DEX);return{weapon:name,weaponItem:weapon,damage:wd.damage||"1d2",attackMode:attackModeFor(name),rangeText:weaponRangeText(name),armor:armor?.n||"None",shield:shield?.n||"None",dexAC,ac:(ad.ac??9)+(shield?-1:0)-dexAC}}
function sheetInventory(){
 let cs=combatStats(),box=$("#sheetInv");
 box.innerHTML=`<div class="combatSummary">Combat: ${cs.weapon} (${cs.damage}) · AC ${cs.ac}${cs.shield!=="None"?" · Shield":""}</div>`+
 (h.inv.length?h.inv.map((x,i)=>`<div class="sheetEquipRow invDrag" data-inv="${i}"><span>☰ ${x.eq?"✓ ":""}${x.n}</span>${x.can?`<button data-eq="${i}">${x.eq?"Unequip":"Equip"}</button>`:"<span></span>"}</div>`).join(""):"No purchased equipment.");
 enableInventoryDrag(box);
}
function enableInventoryDrag(box){
 let drag=null,gap=document.createElement("div");gap.className="invGap";
 $$(".invDrag").forEach(row=>row.onpointerdown=e=>{
   if(e.target.closest("button"))return;
   drag=row;row.classList.add("dragging");row.setPointerCapture?.(e.pointerId);
 });
 box.onpointermove=e=>{
   if(!drag)return;e.preventDefault();
   let rows=[...box.querySelectorAll(".invDrag:not(.dragging)")],before=rows.find(r=>e.clientY<r.getBoundingClientRect().top+r.offsetHeight/2);
   if(before)box.insertBefore(gap,before);else box.appendChild(gap);
 };
 box.onpointerup=e=>{
   if(!drag)return;
   let from=+drag.dataset.inv,rows=[...box.querySelectorAll(".invDrag:not(.dragging)")];
   let to=gap.parentNode?rows.filter(r=>r.compareDocumentPosition(gap)&Node.DOCUMENT_POSITION_FOLLOWING).length:from;
   let item=h.inv.splice(from,1)[0];if(to>from)to--;h.inv.splice(Math.max(0,Math.min(h.inv.length,to)),0,item);
   drag.classList.remove("dragging");gap.remove();drag=null;save();
 };
 box.onpointercancel=()=>{if(drag)drag.classList.remove("dragging");gap.remove();drag=null};
}
let shopMode="buy";

function shopData(name){for(const cat of Object.keys(SHOP)){let x=SHOP[cat].find(v=>v[0]===name);if(x)return x}return null}
function chaBuyDiscount(){return h.stats.CHA>=18?0.10:h.stats.CHA>=16?0.05:0}
function chaSellBonus(){return h.stats.CHA>=18?0.15:h.stats.CHA>=16?0.10:h.stats.CHA>=13?0.05:0}
function gpToCP(gp){return Math.round(gp*100)}
function buyPriceCP(item){return Math.round(gpToCP(item[1])*(1-chaBuyDiscount()))}
function coinTextCP(cp){cp=Math.max(0,Math.round(cp));let gp=Math.floor(cp/100),sp=Math.floor((cp%100)/10),c=cp%10;return `${gp} GP · ${sp} SP · ${c} CP`}
function walletCP(){return Math.round((h.gp??h.gold??0)*100)+Math.trunc(h.sp||0)*10+Math.trunc(h.cp||0)}
function setWalletCP(cp){cp=Math.max(0,Math.round(cp));h.gp=Math.floor(cp/100);h.gold=h.gp;h.sp=Math.floor((cp%100)/10);h.cp=cp%10}
function addCoins(gp=0,sp=0,cp=0){setWalletCP(walletCP()+Math.trunc(gp||0)*100+Math.trunc(sp||0)*10+Math.trunc(cp||0))}
function sellPriceCP(item){let d=shopData(item.n);if(!d)return 0;return Math.round(gpToCP(d[1])*.5*(1+chaSellBonus()))}
function canSellResource(n){
 if(n==="Rations — 7 days")return h.rations>=7;
 if(n==="Waterskin")return h.waterCapacity>=1;
 if(n==="Torch")return h.lightMinutes>=60;
 if(n==="6 Torches")return h.lightMinutes>=360;
 if(n==="Oil Flask")return h.lightMinutes>=240;
 if(n==="Arrows — 20")return ammoCount("Arrows")>=20;
 if(n==="Quarrels — 30")return ammoCount("Quarrels")>=30;
 if(n==="Sling Stones — 30")return ammoCount("Sling Stones")>=30;
 return true
}
function removeSoldResource(n){
 if(n==="Rations — 7 days")h.rations-=7;
 else if(n==="Waterskin"){h.waterCapacity=Math.max(0,h.waterCapacity-1);h.water=Math.min(h.water,h.waterCapacity)}
 else if(n==="Torch")h.lightMinutes-=60;
 else if(n==="6 Torches")h.lightMinutes-=360;
 else if(n==="Oil Flask")h.lightMinutes-=240;
 else if(n==="Arrows — 20")h.ammo.Arrows-=20;
 else if(n==="Quarrels — 30")h.ammo.Quarrels-=30;
 else if(n==="Sling Stones — 30")h.ammo["Sling Stones"]-=30;
}
function sell(i){
 let q=h.inv[i];if(!q||q.noSell||q.bound)return;
 let price=sellPriceCP(q);if(price<=0||!canSellResource(q.n))return;
 if(q.eq)q.eq=false;
 removeSoldResource(q.n);
 h.inv.splice(i,1);
 setWalletCP(walletCP()+price);
 save();
}
const CLASS_EQUIPMENT={
 Fighter:{armor:"all",weapons:"all"},
 Cleric:{armor:"all",weapons:["Club","Mace","War Hammer","Sling"]},
 Arcanist:{armor:[],weapons:["Dagger","Silver Dagger","Staff"]},
 Thief:{armor:["Leather Armor"],weapons:["Club","Dagger","Hand Axe","Spear","Mace","War Hammer","Short Sword","Sword","Short Bow","Light Crossbow","Sling"]},
 Dwarf:{armor:"all",weapons:["Club","Dagger","Hand Axe","Spear","Mace","War Hammer","Battle Axe","Short Sword","Sword","Short Bow","Light Crossbow","Heavy Crossbow","Sling"]},
 Elf:{armor:"all",weapons:"all"}
};
function classCanUse(name,kind){
 let r=CLASS_EQUIPMENT[h?.className]||CLASS_EQUIPMENT.Fighter;
 if(kind==="armor"||kind==="shield"){
   if(r.armor==="all")return true;
   return kind==="shield"?false:r.armor.includes(name)
 }
 if(kind==="weapon")return r.weapons==="all"||r.weapons.includes(name);
 return true
}
function shopKind(name,section=tab){return section==="Armor"?(name==="Shield"?"shield":"armor"):(section==="Weapons"?"weapon":"gear")}
function renderShop(){
 if(!h)return;
 let bonus=Math.round(chaSellBonus()*100);
 $("#shopItems").innerHTML=
 `<div class="shopMode"><button id="buyMode" class="${shopMode!=="sell"?"on":""}">Buy</button><button id="sellMode" class="${shopMode==="sell"?"on":""}">Sell</button></div>`+
 (shopMode==="sell"
 ? `<div class="small">Resale value: 50% of shop value${bonus?` + ${bonus}% CHA sell bonus`:""}. Prices shown are the amount you receive.</div>`+
   (h.inv.map((x,i)=>{let price=sellPriceCP(x),ok=!x.noSell&&!x.bound&&price>0&&canSellResource(x.n);return `<div class=item><span><b>${x.n}</b><div class=small>${x.eq?"Equipped · ":""}Sell price</div></span><span>${coinTextCP(price)}</span><button data-sell="${i}" ${ok?"":"disabled"}>Sell</button></div>`}).join("")||"<p>Inventory is empty.</p>")
 : SHOP[tab].map((x,i)=>{let kind=shopKind(x[0]),allowed=classCanUse(x[0],kind),price=buyPriceCP(x),disc=Math.round(chaBuyDiscount()*100);return `<div class=item><span><b>${x[0]}</b><div class=small>${x[2]}${allowed?"":" · Restricted for "+h.className}${disc?` · CHA -${disc}%`:""}</div></span><span>${coinTextCP(price)}</span><button data-buy="${i}" ${walletCP()<price||!allowed?"disabled":""}>Buy</button></div>`}).join(""));
 $("#buyMode").onclick=()=>{shopMode="buy";renderShop()};
 $("#sellMode").onclick=()=>{shopMode="sell";renderShop()};
 $$("[data-buy]").forEach(b=>b.onclick=()=>buy(SHOP[tab][+b.dataset.buy]));
 $$("[data-sell]").forEach(b=>b.onclick=()=>sell(+b.dataset.sell));
 $("#owned").innerHTML=h.inv.map((x,i)=>`<div class=item><span>${x.n}</span><span>${x.eq?"✓ Equipped":""}</span>${x.can?`<button data-eq="${i}">${x.eq?"Unequip":"Equip"}</button>`:"<span></span>"}</div>`).join("")||"Nothing purchased.";
}
$$("[data-tab]").forEach(b=>b.onclick=()=>{tab=b.dataset.tab;$$("[data-tab]").forEach(x=>x.classList.toggle("on",x===b));renderShop()});
function buy(x){let kind=shopKind(x[0]);if(!classCanUse(x[0],kind))return;let cost=buyPriceCP(x);if(walletCP()<cost)return;setWalletCP(walletCP()-cost);if(x[0].startsWith("Rations"))h.rations+=7;else if(x[0]==="Arrows — 20"){h.ammo=h.ammo||{};h.ammo.Arrows=(h.ammo.Arrows||0)+20}else if(x[0]==="Quarrels — 30"){h.ammo=h.ammo||{};h.ammo.Quarrels=(h.ammo.Quarrels||0)+30}else if(x[0]==="Sling Stones — 30"){h.ammo=h.ammo||{};h.ammo["Sling Stones"]=(h.ammo["Sling Stones"]||0)+30}else if(x[0]==="Waterskin"){h.waterCapacity++;h.water++}else if(x[0]==="Torch")h.lightMinutes+=60;else if(x[0]==="6 Torches")h.lightMinutes+=360;else if(x[0]==="Oil Flask")h.lightMinutes+=240;let armor=tab==="Armor",weapon=tab==="Weapons";h.inv.push({n:x[0],kind:armor?(x[0]==="Shield"?"shield":"armor"):(weapon?"weapon":"gear"),can:armor||weapon,eq:false});save()}
function equip(i){let q=h.inv[i];if(!q||!q.can)return;if(!classCanUse(q.n,q.kind)){alert(`${h.className} cannot use ${q.n}.`);return}if(q.eq){q.eq=false;save();return}if(q.kind==="armor")h.inv.forEach(z=>{if(z.kind==="armor")z.eq=false});if(q.kind==="weapon"){let ranged=RANGED_WEAPONS.has(q.n);h.inv.forEach(z=>{if(z.kind==="weapon"&&RANGED_WEAPONS.has(z.n)===ranged)z.eq=false});if(itemData(q.n).two)h.inv.forEach(z=>{if(z.kind==="shield")z.eq=false})}if(q.kind==="shield"){let w=h.inv.find(z=>z.kind==="weapon"&&z.eq);if(w&&itemData(w.n).two){alert("A shield cannot be equipped with a two-handed weapon.");return}h.inv.forEach(z=>{if(z.kind==="shield")z.eq=false})}q.eq=true;save()}
document.addEventListener("click",e=>{if(e.target.dataset.eq!==undefined)equip(+e.target.dataset.eq)});
$$("[data-heal]").forEach(b=>b.onclick=()=>{let pct=+b.dataset.heal,cost=gpToCP({10:2,50:10,100:20}[pct]);if(walletCP()<cost){$("#healmsg").textContent="Not enough gold.";return}if(h.hp>=h.maxhp){$("#healmsg").textContent="Already at full health.";return}setWalletCP(walletCP()-cost);h.hp=Math.min(h.maxhp,h.hp+Math.ceil(h.maxhp*pct/100));$("#healmsg").textContent="Healing complete.";save()});
$$("[data-mode]").forEach(b=>b.onclick=()=>{mode=b.dataset.mode;$$("[data-mode]").forEach(x=>x.classList.toggle("on",x===b))});$$("[data-risk]").forEach(b=>b.onclick=()=>{risk=b.dataset.risk;$$("[data-risk]").forEach(x=>x.classList.toggle("on",x===b))});$$("[data-min]").forEach(b=>b.onclick=()=>{mins=+b.dataset.min;$$("[data-min]").forEach(x=>x.classList.toggle("on",x===b));refresh()});
function clock(t){return new Date(t).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
function adventureLog(t,type="Event"){
 if(!h?.trip)return;
 h.trip.adventureLog=h.trip.adventureLog||[];
 h.trip.adventureLog.push({time:Date.now(),type,text:t});
 if(h.trip.adventureLog.length>250)h.trip.adventureLog.shift();
 renderAdventureLog();
}
function renderAdventureLog(){
 let box=$("#adventureLogEntries");if(!box)return;
 let rows=h?.trip?.adventureLog||[];
 box.innerHTML=rows.length?rows.map(e=>`<div class="adventureLogRow"><span class="adventureLogTime">[${clock(e.time)}]</span> <b>${e.type}</b> — ${e.text}</div>`).join(""):`<div class="small">No events recorded yet.</div>`;
 box.scrollTop=box.scrollHeight;
}
function addlog(t){$("#log").insertAdjacentHTML("beforeend",`<p>${t}<span style="float:right;color:#aaa">${clock(Date.now())}</span></p>`);adventureLog(t,"Adventure")}
const CLASS_MISSIONS={"Arcanist":[["Recover a lost arcane volume","A sealed archive is said to contain a forgotten work."],["Seek a vanished scholar's manuscript","Fragments point toward a manuscript lost beyond town."],["Investigate an abandoned magical library","Old records describe books left behind when the place was sealed."]],"Thief":[["Steal a guarded cache","Rumor places a valuable cache behind watchful eyes."],["Find a legendary jewel","A fence has heard whispers of a remarkable gem."],["Raid a forgotten strongroom","An old strongroom may still hold valuables no one reclaimed."]],"Fighter":[["Answer a challenge of arms","A dangerous foe has become a test worthy of renown."],["Break a threat on the road","Travelers speak of a menace no one has yet driven off."],["Win a deed worth remembering","A hard task offers no easy riches, only the chance for glory."]],"Cleric":[["Recover a saint's relic","A forgotten holy site may still shelter an old relic."],["Cleanse a desecrated resting place","Something has disturbed a place once held sacred."],["Seek a lost reliquary","Accounts tell of a reliquary abandoned far from town."]],"Dwarf":[["Recover an ancestral rune","A carved rune may preserve a missing piece of clan history."],["Trace a lost family inscription","Old mine records hint at words left by distant kin."],["Search a forgotten deep hall","A ruined underground hall may carry marks of the ancestors."]],"Elf":[["Protect the woodland","Signs of danger have appeared beyond the familiar paths."],["Seek a rare seed","A rare tree is said to grow in a threatened part of the wild."],["Preserve a vanishing grove","A fragile grove may hold seeds that should not be lost."]]};
function createMission(){
 let pool=CLASS_MISSIONS[h.className]||CLASS_MISSIONS.Fighter,m=pool[d(pool.length)-1];
 let trophyPool=TROPHY_COLLECTIONS[h.className]||[],locked=trophyPool.filter(x=>!h.trophies?.includes(x[0]));
 /* Trophy chance is deliberately uncommon: 20% on a successful boss mission, never guaranteed. */
 let trophyCandidate=locked.length&&d(100)<=20?locked[d(locked.length)-1][0]:null;
 return {title:m[0],brief:m[1],trophyCandidate,bossWon:false,resolved:false}
}
function resolveMissionBoss(){
 if(!h.trip?.mission||h.trip.mission.resolved)return;
 let m=h.trip.mission;m.bossWon=true;m.resolved=true;
 if(m.trophyCandidate&&unlockTrophy(m.trophyCandidate)){
   addlog(`🏆 TROPHY DISCOVERED: ${m.trophyCandidate}. It has been added to your ${TROPHY_TITLES[h.className]}.`);
 }else addlog(`Objective secured: ${m.title}. No rare trophy was found this time.`);
}

function beginTripPause(){if(h?.trip&&!h.trip.pauseStart)h.trip.pauseStart=Date.now()}
function endTripPause(){if(!h?.trip?.pauseStart)return;let dt=Date.now()-h.trip.pauseStart;for(const k of ["start","end","half","nextEvent","resourceAt"])if(Number.isFinite(h.trip[k]))h.trip[k]+=dt;h.trip.pauseStart=null}
function consumeTripSurvivalResources(now=Date.now()){
 if(!h?.trip||h.trip.resourceModel!=="elapsed-v1")return true;
 let last=Number.isFinite(h.trip.resourceAt)?h.trip.resourceAt:h.trip.start,t=Math.max(last,Math.min(now,h.trip.end)),dt=Math.max(0,t-last);
 if(dt>0){h.rations=Math.max(0,(h.rations||0)-dt/86400000);h.water=Math.max(0,(h.water||0)-4*dt/86400000);h.trip.resourceAt=t}
 if(h.water<=0&&t<h.trip.half&&!h.trip.forcedReturnWater){h.trip.forcedReturnWater=true;returnEarly("You are out of water. You turn back toward town.");return false}
 return true
}
function begin(){let rb=$("#recall");if(rb){rb.disabled=false;rb.textContent="↩ Return Early"}if(h.waterCapacity<1){alert("You need at least one Waterskin.");return}let nw=4*mins/1440,nf=mins/1440,nl=mins*2/3;if(h.water<nw){alert("Not enough water.");return}if(h.rations<nf){alert("Not enough rations.");return}if(h.lightMinutes<nl){alert("Not enough light.");return}h.lightMinutes-=nl;let now=Date.now();h.lastAdventure=null;h.pendingEvent=null;ensureTrophies();let mission=createMission();h.trip={journal:[],adventureLog:[],mission,start:now,end:now+mins*60000,half:now+mins*30000,midBossDone:false,mode,risk,resourceModel:"elapsed-v1",resourceAt:now,forcedReturnWater:false,nextEvent:now+Math.min(15000,Math.max(5000,mins*60000/(Math.max(1,{1:1,5:5,10:5,30:6,60:6,120:8,480:8,1440:10}[mins])+1)))};$("#departSetup").classList.add("hide");$("#travel").classList.remove("hide");$("#departedAt").textContent=clock(h.trip.start);$("#returnAt").textContent=clock(h.trip.end);$("#runner").innerHTML=spriteHTML(h.sex,h.avatar,h.className);$("#log").innerHTML="";addlog(`MISSION: ${mission.title} — ${mission.brief}`);renderAdventureLog();save();tick()}
function tick(){clearTimeout(timer);if(!h.trip)return;let now=h.trip.pauseStart||Date.now();if(!consumeTripSurvivalResources(now))return;let total=h.trip.end-h.trip.start,elapsed=Math.max(0,now-h.trip.start),pct=Math.min(1,elapsed/total),outbound=pct<=0.5,runnerPct=outbound?pct*200:(1-pct)*200;let recall=$("#recall");if(recall){recall.disabled=!outbound;recall.textContent=outbound?"↩ Return Early":"Returning…"}$("#fill").style.width="0%";$("#runner").style.left=runnerPct+"%";$("#runner").style.transform=outbound?"translate(-50%,-62%) scaleX(-1)":"translate(-50%,-62%) scaleX(1)";$("#phase").textContent=(outbound?"OUTBOUND / ADVENTURING":"RETURNING")+(h.trip.mission?` · ${h.trip.mission.title}`:"");let remaining=Math.max(0,h.trip.end-now);$("#remainingClock").textContent=`${Math.floor(remaining/60000)}:${String(Math.floor(remaining/1000)%60).padStart(2,"0")}`;$("#returnAt").textContent=clock(h.trip.end);$("#timeText").textContent=`Elapsed ${Math.floor(elapsed/60000)}:${String(Math.floor(elapsed/1000)%60).padStart(2,"0")} · Remaining ${Math.floor(remaining/60000)}:${String(Math.floor(remaining/1000)%60).padStart(2,"0")}`;if(now>=h.trip.half&&!h.trip.midBossDone&&!h.combat&&!h.pendingEvent){h.trip.midBossDone=true;save();if(h.trip.mode==="auto")autonomousCombat(true);else makeCombat(true);if(!h.trip)return}if(now>=h.trip.nextEvent&&now<h.trip.end&&!h.combat){event();if(!h.trip)return;h.trip.nextEvent+=Math.max(5000,total/Math.max(1,{1:1,5:5,10:5,30:6,60:6,120:8,480:8,1440:10}[mins]));save()}if(now>=h.trip.end){addlog("Returned to town.");h.trip=null;$("#travel").classList.add("hide");$("#departSetup").classList.remove("hide");home();page("town");return}timer=setTimeout(tick,500)}
const FIGHTER_EVENTS=[{"id":"FTR-001","type":"Discovery","title":"Abandoned Cart","text":"An overturned merchant cart lies beside the road.","choices":[{"label":"Search","result":"search","xp":2,"coins":[0,1,0]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-002","type":"Discovery","title":"Old Milestone","text":"A weathered milestone bears marks beneath the moss.","choices":[{"label":"Search","result":"search","xp":3,"coins":[1,4,7]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-003","type":"Discovery","title":"Ruined Shrine","text":"A roofless roadside shrine stands among the weeds.","choices":[{"label":"Search","result":"search","xp":4,"coins":[2,7,14]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-004","type":"Discovery","title":"Freshwater Spring","text":"Clear water bubbles from stone beneath an oak.","choices":[{"label":"Search","result":"search","xp":5,"coins":[0,1,4]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-005","type":"Discovery","title":"Hunter's Cache","text":"A waxed bundle is wedged beneath exposed roots.","choices":[{"label":"Search","result":"search","xp":6,"coins":[1,4,11]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-006","type":"Discovery","title":"Collapsed Camp","text":"A cold campfire and torn bedrolls mark an abandoned camp.","choices":[{"label":"Search","result":"search","xp":2,"coins":[2,7,1]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-007","type":"Discovery","title":"Broken Strongbox","text":"A split wooden strongbox lies half-buried in mud.","choices":[{"label":"Search","result":"search","xp":3,"coins":[0,1,8]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-008","type":"Discovery","title":"Lost Satchel","text":"A leather satchel hangs from a thorn bush.","choices":[{"label":"Search","result":"search","xp":4,"coins":[1,4,15]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-009","type":"Discovery","title":"Ancient Cairn","text":"A low cairn of stacked stones rises beside the trail.","choices":[{"label":"Search","result":"search","xp":5,"coins":[2,7,5]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-010","type":"Discovery","title":"Charred Wagon","text":"The blackened frame of a wagon blocks part of the road.","choices":[{"label":"Search","result":"search","xp":6,"coins":[0,1,12]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-011","type":"Discovery","title":"Fallen Courier","text":"A courier's torn pouch lies near a set of hurried tracks.","choices":[{"label":"Search","result":"search","xp":2,"coins":[1,4,2]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-012","type":"Discovery","title":"Hidden Hollow","text":"A narrow hollow opens behind a curtain of ivy.","choices":[{"label":"Search","result":"search","xp":3,"coins":[2,7,9]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-013","type":"Discovery","title":"Old Well","text":"A stone well stands in a clearing, its rope still intact.","choices":[{"label":"Search","result":"search","xp":4,"coins":[0,1,16]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-014","type":"Discovery","title":"Battlefield Remains","text":"Rusting scraps and old bones lie beneath the grass.","choices":[{"label":"Search","result":"search","xp":5,"coins":[1,4,6]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-015","type":"Discovery","title":"Forgotten Pack","text":"A travel pack has been concealed under a fallen log.","choices":[{"label":"Search","result":"search","xp":6,"coins":[2,7,13]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-016","type":"Discovery","title":"River Wreckage","text":"Crates and planks have washed onto the riverbank.","choices":[{"label":"Search","result":"search","xp":2,"coins":[0,1,3]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-017","type":"Discovery","title":"Stone Marker","text":"A carved stone marker points toward an overgrown path.","choices":[{"label":"Search","result":"search","xp":3,"coins":[1,4,10]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-018","type":"Discovery","title":"Hermit's Camp","text":"A tiny camp appears recently abandoned.","choices":[{"label":"Search","result":"search","xp":4,"coins":[2,7,0]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-019","type":"Discovery","title":"Cave Mouth","text":"A shallow cave opens in the hillside.","choices":[{"label":"Search","result":"search","xp":5,"coins":[0,1,7]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-020","type":"Discovery","title":"Rope Bridge Cache","text":"Something glints beneath the far anchor of an old rope bridge.","choices":[{"label":"Search","result":"search","xp":6,"coins":[1,4,14]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-021","type":"Discovery","title":"Buried Jar","text":"Rain has exposed the rim of a clay jar in the path.","choices":[{"label":"Search","result":"search","xp":2,"coins":[2,7,4]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-022","type":"Discovery","title":"Torn Map","text":"A fragment of a hand-drawn map is caught beneath a stone.","choices":[{"label":"Search","result":"search","xp":3,"coins":[0,1,11]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-023","type":"Discovery","title":"Watchman's Post","text":"A ruined wooden watch post overlooks the road.","choices":[{"label":"Search","result":"search","xp":4,"coins":[1,4,1]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-024","type":"Discovery","title":"Smuggler's Nook","text":"Loose stones conceal a narrow storage recess.","choices":[{"label":"Search","result":"search","xp":5,"coins":[2,7,8]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-025","type":"Discovery","title":"Old Orchard","text":"Wild fruit trees surround the remains of a cottage.","choices":[{"label":"Search","result":"search","xp":6,"coins":[0,1,15]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-026","type":"Discovery","title":"Wayside Grave","text":"A lonely grave has been disturbed by recent rain.","choices":[{"label":"Search","result":"search","xp":2,"coins":[1,4,5]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-027","type":"Discovery","title":"Flooded Cellar","text":"Stone steps descend into a partially flooded cellar.","choices":[{"label":"Search","result":"search","xp":3,"coins":[2,7,12]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-028","type":"Discovery","title":"Woodcutter's Shed","text":"An unlocked shed stands deep among the trees.","choices":[{"label":"Search","result":"search","xp":4,"coins":[0,1,2]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-029","type":"Discovery","title":"Forgotten Tollhouse","text":"A ruined tollhouse leans beside an ancient road.","choices":[{"label":"Search","result":"search","xp":5,"coins":[1,4,9]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-030","type":"Discovery","title":"Moonlit Clearing","text":"A ring of pale stones surrounds a quiet clearing.","choices":[{"label":"Search","result":"search","xp":6,"coins":[2,7,16]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-031","type":"Decision","title":"Fork in the Road","text":"The trail divides around a steep wooded ridge.","choices":[{"label":"Take the ridge path","result":"risk","xp":3,"coins":[0,0,0]},{"label":"Take the valley path","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-032","type":"Decision","title":"Distant Cry","text":"A human cry carries from somewhere beyond the trees.","choices":[{"label":"Investigate","result":"risk","xp":4,"coins":[1,2,5]},{"label":"Keep moving","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-033","type":"Decision","title":"Suspicious Tracks","text":"Fresh boot prints leave the road toward dense brush.","choices":[{"label":"Follow them","result":"risk","xp":5,"coins":[0,4,10]},{"label":"Ignore them","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-034","type":"Decision","title":"Blocked Bridge","text":"A fallen tree blocks the safest bridge crossing.","choices":[{"label":"Climb across","result":"risk","xp":6,"coins":[1,6,2]},{"label":"Find another route","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-035","type":"Decision","title":"Stray Horse","text":"A saddled horse wanders alone beside the road.","choices":[{"label":"Approach it","result":"risk","xp":7,"coins":[0,1,7]},{"label":"Leave it","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-036","type":"Decision","title":"Smoke Ahead","text":"A thin column of smoke rises beyond the next hill.","choices":[{"label":"Scout the smoke","result":"risk","xp":8,"coins":[1,3,12]},{"label":"Avoid it","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-037","type":"Decision","title":"Locked Chest","text":"A small iron-bound chest sits beneath a dead tree.","choices":[{"label":"Force it open","result":"risk","xp":3,"coins":[0,5,4]},{"label":"Leave it","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-038","type":"Decision","title":"Narrow Ledge","text":"The direct path crosses a narrow rocky ledge.","choices":[{"label":"Cross carefully","result":"risk","xp":4,"coins":[1,0,9]},{"label":"Take the long way","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-039","type":"Decision","title":"Merchant in Trouble","text":"A merchant struggles with a broken wagon wheel.","choices":[{"label":"Help","result":"risk","xp":5,"coins":[0,2,1]},{"label":"Continue","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-040","type":"Decision","title":"Old Tunnel","text":"A dark tunnel cuts through the hillside.","choices":[{"label":"Enter","result":"risk","xp":6,"coins":[1,4,6]},{"label":"Go around","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-041","type":"Decision","title":"Flooded Ford","text":"The usual ford is running high.","choices":[{"label":"Cross now","result":"risk","xp":7,"coins":[0,6,11]},{"label":"Search upstream","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-042","type":"Decision","title":"Howling in the Woods","text":"Several howls sound uncomfortably close.","choices":[{"label":"Stand your ground","result":"risk","xp":8,"coins":[1,1,3]},{"label":"Move quietly away","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-043","type":"Decision","title":"Dropped Purse","text":"A coin purse lies conspicuously in the road.","choices":[{"label":"Pick it up","result":"risk","xp":3,"coins":[0,3,8]},{"label":"Leave it","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-044","type":"Decision","title":"Wounded Traveller","text":"A wounded traveller sits against a tree.","choices":[{"label":"Offer aid","result":"risk","xp":4,"coins":[1,5,0]},{"label":"Keep distance","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-045","type":"Decision","title":"Rope Across Trail","text":"A thin rope has been stretched across the path.","choices":[{"label":"Inspect it","result":"risk","xp":5,"coins":[0,0,5]},{"label":"Detour","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-046","type":"Decision","title":"Unmarked Door","text":"A stone door is set into a low hillside.","choices":[{"label":"Open it","result":"risk","xp":6,"coins":[1,2,10]},{"label":"Pass by","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-047","type":"Decision","title":"Fresh Campfire","text":"A fire still burns in an apparently empty camp.","choices":[{"label":"Call out","result":"risk","xp":7,"coins":[0,4,2]},{"label":"Avoid the camp","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-048","type":"Decision","title":"Fallen Tree","text":"A huge tree blocks the road.","choices":[{"label":"Climb over","result":"risk","xp":8,"coins":[1,6,7]},{"label":"Go around","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-049","type":"Decision","title":"Shallow Cave","text":"Rain begins as a shallow cave offers shelter.","choices":[{"label":"Take shelter","result":"risk","xp":3,"coins":[0,1,12]},{"label":"Press on","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-050","type":"Decision","title":"Old Ferry","text":"An unattended ferry is tied to the near bank.","choices":[{"label":"Use it","result":"risk","xp":4,"coins":[1,3,4]},{"label":"Follow the river","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-051","type":"Decision","title":"Footprints in Mud","text":"Small footprints circle your own trail.","choices":[{"label":"Track them","result":"risk","xp":5,"coins":[0,5,9]},{"label":"Ignore them","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-052","type":"Decision","title":"Bell in Distance","text":"A lone bell rings somewhere off the road.","choices":[{"label":"Seek it","result":"risk","xp":6,"coins":[1,0,1]},{"label":"Stay on course","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-053","type":"Decision","title":"Cracked Statue","text":"A warrior statue holds a stone bowl.","choices":[{"label":"Inspect the bowl","result":"risk","xp":7,"coins":[0,2,6]},{"label":"Move on","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-054","type":"Decision","title":"Ravens Gathering","text":"Ravens cluster noisily over a nearby field.","choices":[{"label":"Investigate","result":"risk","xp":8,"coins":[1,4,11]},{"label":"Avoid","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-055","type":"Decision","title":"Narrow Ravine","text":"A shortcut descends through a narrow ravine.","choices":[{"label":"Take shortcut","result":"risk","xp":3,"coins":[0,6,3]},{"label":"Stay high","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-056","type":"Decision","title":"Lantern at Night","text":"A lantern moves between distant trees.","choices":[{"label":"Approach","result":"risk","xp":4,"coins":[1,1,8]},{"label":"Extinguish your light","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-057","type":"Decision","title":"Abandoned Boat","text":"A small boat is tied beside a quiet lake.","choices":[{"label":"Search it","result":"risk","xp":5,"coins":[0,3,0]},{"label":"Leave it","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-058","type":"Decision","title":"Old Barricade","text":"A decayed barricade spans the road.","choices":[{"label":"Pass through","result":"risk","xp":6,"coins":[1,5,5]},{"label":"Circle around","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-059","type":"Decision","title":"Crumbling Tower","text":"A ruined tower offers a commanding view.","choices":[{"label":"Climb it","result":"risk","xp":7,"coins":[0,0,10]},{"label":"Continue","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-060","type":"Decision","title":"Unusual Silence","text":"The forest suddenly becomes completely silent.","choices":[{"label":"Investigate cautiously","result":"risk","xp":8,"coins":[1,2,2]},{"label":"Withdraw","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-061","type":"Encounter","title":"Roadside Ambush","text":"Movement erupts from the ditch ahead.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-062","type":"Encounter","title":"Bridge Toll","text":"Armed figures step onto a narrow bridge.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-063","type":"Encounter","title":"Camp Raiders","text":"Shapes move around an abandoned campsite.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-064","type":"Encounter","title":"Forest Stalkers","text":"You hear footsteps matching your pace.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-065","type":"Encounter","title":"Ruined Farm","text":"Something moves inside a ruined farmhouse.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-066","type":"Encounter","title":"Rocky Pass","text":"A hostile silhouette blocks the pass.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-067","type":"Encounter","title":"Riverbank Threat","text":"Figures emerge from reeds along the river.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-068","type":"Encounter","title":"Night Intruders","text":"Branches snap just beyond the firelight.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-069","type":"Encounter","title":"Old Quarry","text":"Voices echo from the quarry below.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-070","type":"Encounter","title":"Hilltop Watchers","text":"Several figures watch from the ridge.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-071","type":"Encounter","title":"Broken Gate","text":"Something waits beyond a broken gate.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-072","type":"Encounter","title":"Marsh Movement","text":"Ripples move against the current.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-073","type":"Encounter","title":"Cave Occupants","text":"A growl comes from the darkness ahead.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-074","type":"Encounter","title":"Abandoned Mill","text":"The mill door swings open from within.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-075","type":"Encounter","title":"Narrow Causeway","text":"Hostile shapes spread across the causeway.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-076","type":"Encounter","title":"Fogbound Road","text":"A figure appears suddenly in the fog.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-077","type":"Encounter","title":"Stone Circle","text":"You are not alone among the standing stones.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-078","type":"Encounter","title":"Forest Crossing","text":"Armed strangers emerge at the crossing.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-079","type":"Encounter","title":"Ravine Ambush","text":"Loose stones tumble from above.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-080","type":"Encounter","title":"Old Mine","text":"Scratching sounds come from the mine entrance.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-081","type":"Encounter","title":"Burned Village","text":"Movement flickers between ruined houses.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-082","type":"Encounter","title":"Watchtower Ruin","text":"A lookout spots you from the tower.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-083","type":"Encounter","title":"Mountain Trail","text":"A hostile group rounds the bend.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-084","type":"Encounter","title":"Swamp Path","text":"Something follows just beneath the reeds.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-085","type":"Encounter","title":"Moonlit Road","text":"Several shapes step into the road.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-086","type":"Encounter","title":"Forgotten Chapel","text":"A shadow moves behind the broken altar.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-087","type":"Encounter","title":"Border Stone","text":"Armed travellers refuse to yield the road.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-088","type":"Encounter","title":"Wooden Palisade","text":"A crude gate opens and armed figures emerge.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-089","type":"Encounter","title":"Dry Riverbed","text":"Movement appears among the boulders.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-090","type":"Encounter","title":"Deep Woods","text":"A sudden rustle becomes an immediate threat.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-091","type":"Quiet","title":"Clear Road","text":"For a time the road is clear and easy.","choices":[],"xp":1,"coins":[0,0,0]},{"id":"FTR-092","type":"Quiet","title":"Cold Wind","text":"A cold wind follows you across open ground.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-093","type":"Quiet","title":"Passing Rain","text":"A brief shower darkens the road.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-094","type":"Quiet","title":"Birdsong","text":"Birdsong returns as the woods thin.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-095","type":"Quiet","title":"Long Climb","text":"The trail climbs steadily toward higher ground.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-096","type":"Quiet","title":"Distant Mountains","text":"Snowy peaks appear briefly through the clouds.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-097","type":"Quiet","title":"Old Road","text":"You follow worn paving stones from an older age.","choices":[],"xp":1,"coins":[0,0,0]},{"id":"FTR-098","type":"Quiet","title":"Quiet Forest","text":"Only leaves and your own footsteps break the silence.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-099","type":"Quiet","title":"Open Fields","text":"The route crosses broad empty fields.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-100","type":"Quiet","title":"River Road","text":"The road follows a slow river for several miles.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-101","type":"Quiet","title":"Morning Mist","text":"Mist hangs low over the ground.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-102","type":"Quiet","title":"Warm Sun","text":"Sunlight breaks through after a long grey stretch.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-103","type":"Quiet","title":"Evening Shadows","text":"Long shadows stretch across the trail.","choices":[],"xp":1,"coins":[0,0,0]},{"id":"FTR-104","type":"Quiet","title":"Distant Thunder","text":"Thunder rolls beyond the horizon.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-105","type":"Quiet","title":"Pine Ridge","text":"The scent of pine fills the cool air.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-106","type":"Quiet","title":"High Meadow","text":"Wildflowers cover a high meadow.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-107","type":"Quiet","title":"Stone Road","text":"Ancient stones make the walking easier.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-108","type":"Quiet","title":"Wind in Grass","text":"Tall grass bends in waves around the path.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-109","type":"Quiet","title":"Cloud Break","text":"A shaft of sunlight crosses the road.","choices":[],"xp":1,"coins":[0,0,0]},{"id":"FTR-110","type":"Quiet","title":"Quiet Stream","text":"A shallow stream runs beside the trail.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-111","type":"Quiet","title":"Frosted Ground","text":"A thin frost crunches beneath your boots.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-112","type":"Quiet","title":"Autumn Leaves","text":"Dry leaves gather in drifts along the road.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-113","type":"Quiet","title":"Distant Bells","text":"Faint bells carry from far away.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-114","type":"Quiet","title":"Old Oak","text":"A huge oak marks a peaceful bend in the road.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-115","type":"Quiet","title":"Night Sky","text":"The clouds clear enough to reveal the stars.","choices":[],"xp":1,"coins":[0,0,0]},{"id":"FTR-116","type":"Quiet","title":"Dawn Light","text":"The horizon brightens as another day begins.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-117","type":"Quiet","title":"Low Hills","text":"The road winds through gentle hills.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-118","type":"Quiet","title":"Cool Shade","text":"Dense trees give welcome shade.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-119","type":"Quiet","title":"Stone Bridge","text":"An old stone bridge crosses a narrow stream.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-120","type":"Quiet","title":"Homeward Thoughts","text":"For a while your thoughts turn toward home.","choices":[],"xp":0,"coins":[0,0,0]}];
const MONSTERS=[{"id":"kobold","n":"Kobold","saveAs":"NM","intelligence":8,"ac":7,"hdDice":1,"hdAdj":-1,"damage":["1d4"],"meleeDamage":"1d4","rangedDamage":"1d4","meleeWeapon":"Dagger","rangedWeapon":"Sling","xp":5,"source":"RC-adapted","humanoid":true},{"id":"goblin","n":"Goblin","saveAs":"NM","intelligence":9,"ac":6,"hdDice":1,"hdAdj":-1,"damage":["1d6"],"meleeDamage":"1d6","rangedDamage":"1d6","meleeWeapon":"Short Sword","rangedWeapon":"Short Bow","xp":5,"source":"RC-adapted","humanoid":true},{"id":"orc","n":"Orc","saveAs":"F1","intelligence":7,"ac":6,"hdDice":1,"hdAdj":0,"damage":["1d6"],"meleeDamage":"1d6","rangedDamage":"1d6","meleeWeapon":"Spear","rangedWeapon":"Short Bow","xp":10,"source":"RC-adapted","humanoid":true},{"id":"hobgoblin","n":"Hobgoblin","saveAs":"F1","intelligence":10,"ac":6,"hdDice":1,"hdAdj":1,"damage":["1d8"],"meleeDamage":"1d8","rangedDamage":"1d6","meleeWeapon":"Sword","rangedWeapon":"Short Bow","xp":15,"source":"RC-adapted","humanoid":true},{"id":"gnoll","n":"Gnoll","saveAs":"F2","intelligence":7,"ac":5,"hdDice":2,"hdAdj":0,"damage":["1d8"],"meleeDamage":"1d8","rangedDamage":"1d6","meleeWeapon":"Battle Axe","rangedWeapon":"Long Bow","xp":20,"source":"RC-adapted","humanoid":true},{"id":"skeleton","n":"Skeleton","saveAs":"F1","intelligence":1,"ac":7,"hdDice":1,"hdAdj":0,"damage":["1d6"],"xp":10,"undead":true,"source":"RC-adapted","humanoid":false},{"id":"zombie","n":"Zombie","saveAs":"F1","intelligence":1,"ac":8,"hdDice":2,"hdAdj":0,"damage":["1d8"],"xp":20,"undead":true,"slow":true,"source":"RC-adapted","humanoid":false},{"id":"ghoul","n":"Ghoul","saveAs":"F2","intelligence":3,"ac":6,"hdDice":2,"hdAdj":0,"damage":["1d3"],"xp":25,"undead":true,"special":"paralysis","rcPowerBonuses":1,"rcAsterisks":1,"source":"RC-adapted","humanoid":false},{"id":"giant_rat","n":"Giant Rat","saveAs":"NM","intelligence":2,"ac":7,"hdDice":1,"hdAdj":-1,"damage":["1d3"],"xp":5,"special":"disease","rcPowerBonuses":1,"rcAsterisks":1,"source":"RC-adapted","humanoid":false},{"id":"wolf","n":"Wolf","saveAs":"F1","intelligence":2,"ac":7,"hdDice":2,"hdAdj":2,"damage":["1d6"],"xp":25,"source":"RC-adapted","humanoid":false},{"id":"dire_wolf","n":"Dire Wolf","saveAs":"F2","intelligence":4,"ac":6,"hdDice":4,"hdAdj":1,"damage":["2d4"],"xp":75,"source":"RC-adapted","humanoid":false},{"id":"bear","n":"Bear","saveAs":"F2","intelligence":2,"ac":6,"hdDice":4,"hdAdj":0,"damage":["1d8"],"xp":75,"source":"RC-adapted","humanoid":false},{"id":"giant_spider","n":"Giant Spider","saveAs":"F1","intelligence":0,"ac":6,"hdDice":2,"hdAdj":0,"damage":["1d8"],"xp":35,"special":"poison","rcPowerBonuses":1,"rcAsterisks":1,"source":"RC-adapted","humanoid":false},{"id":"giant_centipede","n":"Giant Centipede","saveAs":"NM","intelligence":0,"ac":9,"hdDice":1,"hdAdj":-1,"damage":["1"],"xp":6,"special":"poison","rcPowerBonuses":1,"rcAsterisks":1,"source":"RC-adapted","humanoid":false},{"id":"giant_scorpion","n":"Giant Scorpion","saveAs":"F2","intelligence":0,"ac":2,"hdDice":4,"hdAdj":0,"damage":["1d10"],"xp":125,"special":"poison","rcPowerBonuses":1,"rcAsterisks":1,"source":"RC-adapted","humanoid":false},{"id":"giant_snake","n":"Giant Snake","saveAs":"F2","intelligence":2,"ac":6,"hdDice":3,"hdAdj":0,"damage":["1d8"],"xp":50,"special":"poison","rcPowerBonuses":1,"rcAsterisks":1,"source":"RC-adapted","humanoid":false},{"id":"lizard_man","n":"Lizard Man","saveAs":"F2","intelligence":6,"ac":5,"hdDice":2,"hdAdj":1,"damage":["1d6"],"meleeDamage":"1d6","rangedDamage":"1d6","meleeWeapon":"Spear","rangedWeapon":"Javelin","xp":25,"source":"RC-adapted","humanoid":true},{"id":"bandit","n":"Bandit","saveAs":"T1","intelligence":11,"ac":6,"hdDice":1,"hdAdj":0,"damage":["1d6"],"meleeDamage":"1d6","rangedDamage":"1d6","meleeWeapon":"Short Sword","rangedWeapon":"Short Bow","xp":10,"source":"RC-adapted","humanoid":true},{"id":"brigand","n":"Brigand","saveAs":"F1","intelligence":11,"ac":6,"hdDice":1,"hdAdj":0,"damage":["1d6"],"meleeDamage":"1d6","rangedDamage":"1d6","meleeWeapon":"Sword","rangedWeapon":"Light Crossbow","xp":10,"source":"RC-adapted","humanoid":true},{"id":"berserker","n":"Berserker","saveAs":"F1","intelligence":9,"ac":7,"hdDice":1,"hdAdj":1,"damage":["1d8"],"meleeDamage":"1d8","meleeWeapon":"Battle Axe","xp":15,"source":"RC-adapted","humanoid":true},{"id":"ogre","n":"Ogre","saveAs":"F4","intelligence":6,"ac":5,"hdDice":4,"hdAdj":1,"damage":["1d10"],"xp":125,"source":"RC-adapted","humanoid":true},{"id":"troll","n":"Troll","saveAs":"F6","intelligence":6,"ac":4,"hdDice":6,"hdAdj":3,"damage":["1d8"],"xp":650,"special":"regeneration","rcPowerBonuses":1,"rcAsterisks":1,"source":"RC-adapted","humanoid":false},{"id":"minotaur","n":"Minotaur","saveAs":"F6","intelligence":5,"ac":6,"hdDice":6,"hdAdj":0,"damage":["1d10"],"xp":275,"source":"RC-adapted","humanoid":false},{"id":"mummy","n":"Mummy","saveAs":"F5","intelligence":6,"ac":3,"hdDice":5,"hdAdj":1,"damage":["1d12"],"xp":575,"undead":true,"enchanted":true,"mummy":true,"special":"disease","rcPowerBonuses":2,"rcAsterisks":2,"source":"RC-adapted","humanoid":false}];
function rollExpr(x){let m=/(\d+)d(\d+)([+-]\d+)?/i.exec(x);if(!m)return 0;let v=0,n=+m[1];while(n--)v+=d(+m[2]);return Math.max(0,v+(+(m[3]||0)))}
function fighterNeed(ac){let rows=CLASS_ATTACK_BASE?.Fighter||[[1,19]],base=19;for(const [lv,b] of rows)if(h.level>=lv)base=b;return base-ac}
const SAVE_BASE={
 Fighter:[12,13,14,15,16],Cleric:[11,12,14,16,15],Thief:[13,14,13,16,15],
 Arcanist:[13,14,13,16,15],Dwarf:[8,9,10,13,12],Elf:[12,13,13,15,15]
};
const SAVE_NAMES=["Death/Poison","Wands","Paralysis/Stone","Breath","Spells"];
function savingThrow(category,bonus=0,damageType=null){
 if(h?.spells?.buffs){
  bonus+=h.spells.buffs.reduce((n,b)=>n+(b.saveBonus||0),0);
  if(damageType)bonus+=h.spells.buffs.reduce((n,b)=>n+(b.saveBonusVs===damageType?2:0),0)
 }
 let i=typeof category==="number"?category:SAVE_NAMES.indexOf(category);if(i<0)i=4;
 let target=rcSaveTarget(h.className,h.level,SAVE_NAMES[i]),roll=d(20)+bonus;
 return{roll,target,success:roll>=target,category:SAVE_NAMES[i]};
}
function protectionFromEvilActive(){return !!h?.spells?.buffs?.some(b=>b.rc==="Protection from Evil")}
function elementalResistance(type){return h?.spells?.buffs?.find(b=>b.resist===type)||null}
function damageDiceCount(expr){let m=/^(\d+)d\d+/i.exec(String(expr||""));return m?Math.max(1,+m[1]):1}
function applyElementalResistance(dmg,expr,type,magical=true){
 let b=elementalResistance(type);if(!b)return dmg;
 if(!magical&&type==="fire")return 0;
 let dice=damageDiceCount(expr),reduction=(b.damagePerDieReduction||0)*dice;
 return Math.max(dice,dmg-reduction)
}
const CLASS_ATTACK_BASE={
 Fighter:[[1,19],[4,17],[7,15],[10,13],[13,11],[16,9],[19,7],[22,5],[25,3],[28,1],[31,-1],[34,-3]],
 Dwarf:[[1,19],[4,17],[7,15],[10,13]],
 Elf:[[1,19],[4,17],[7,15],[10,13]],
 Cleric:[[1,19],[5,17],[9,15],[13,13],[17,11],[21,9],[25,7],[29,5],[33,3],[36,1]],
 Thief:[[1,19],[5,17],[9,15],[13,13],[17,11],[21,9],[25,7],[29,5],[33,3],[36,1]],
 Arcanist:[[1,19],[6,17],[11,15],[16,13],[21,11],[26,9],[31,7],[36,5]]
};
function attackBase(cls=h.className,level=h.level){
 let rows=CLASS_ATTACK_BASE[cls]||CLASS_ATTACK_BASE.Fighter,base=rows[0][1];
 for(const [lv,b] of rows)if(level>=lv)base=b;
 return base
}
function characterNeed(ac){return attackBase()-ac}
function monsterHitModifier(e){
 let hd=Math.max(.5,Number(e.hdDice)||1),plus=(Number(e.hdAdj)||0)>0;
 if(hd<=9)return Math.min(9,Math.floor(hd)+(plus?1:0));
 if(hd<=11)return 10;
 if(hd<=13)return 11;
 if(hd<=15)return 12;
 if(hd<=17)return 13;
 if(hd<=19)return 14;
 if(hd<=21)return 15;
 if(hd<=23)return 16;
 if(hd<=25)return 17;
 if(hd<=27)return 18;
 if(hd<=29)return 19;
 if(hd<=31)return 20;
 if(hd<=33)return 21;
 if(hd<=35)return 22;
 return 23;
}
function monsterNeed(e){return Math.max(2,(20-monsterHitModifier(e))-effectiveAC(false))}
function clog(s){
 h.combat.log.push(s);if(h.combat.log.length>40)h.combat.log.shift();
 let box=$("#combatLog");if(box){box.insertAdjacentHTML("beforeend",`<div>${s}</div>`);box.scrollTop=box.scrollHeight}
 adventureLog(s,"Combat")
}
function living(){return h?.combat?.enemies?.filter(e=>e.hp>0)||[]}
// RC Rules Cyclopedia, Balancing Encounters (pp.100-101): TPL -> IAHD -> challenge %.
function rcTPL(){
 let level=Math.max(1,h.level||1),maxhp=Math.max(1,h.maxhp||combatStats().maxhp||1),hp=Math.max(0,h.hp??maxhp);
 let damage=Math.max(0,maxhp-hp);
 let lost=Math.floor(damage/level);
 let floor=Math.max(1,Math.floor(level/2));
 return Math.max(floor,level-lost);
}
function rcAdjustedHD(m){
 let base=Math.max(.5,m.hdDice||1),adjusted=base,adj=m.hdAdj||0;
 if(adj>0)adjusted+=Math.ceil(adj/5);
 else if(adj<0)adjusted-=Math.ceil(Math.abs(adj)/2)*.5;
 adjusted=Math.max(.5,adjusted);
 let powers=Math.max(0,m.rcPowerBonuses||0);
 return +(adjusted+(base*.5*powers)).toFixed(2);
}
function rcChallengePct(totalIAHD,tpl=rcTPL()){return +(totalIAHD/Math.max(.5,tpl)*100).toFixed(1)}
function rcChallengeName(pct){
 if(pct>=110)return"Extremely dangerous";
 if(pct>=90)return"Risky";
 if(pct>=70)return"Major";
 if(pct>=50)return"Challenging";
 if(pct>=30)return"Good fight";
 if(pct>=20)return"Distraction";
 if(pct>=10)return"Minor";
 return"Too easy";
}
// Averathia adventure stance selects among RC challenge bands; the bands/math themselves are RC.
function rcTargetBand(isBoss=false){
 if(isBoss)return[70,110]; // Major through Risky; never intentionally Extremely Dangerous.
 let risk=h.trip?.risk||"Normal";
 if(risk==="Cautious")return[10,50];   // Minor through Good fight.
 if(risk==="Bold")return[50,90];       // Challenging through Major.
 return[30,70];                        // Good fight through Challenging.
}
function buildEncounter(isBoss=false){
 let tpl=rcTPL(),[lo,hi]=rcTargetBand(isBoss),min=tpl*lo/100,max=tpl*hi/100;
 let eligible=MONSTERS.filter(m=>rcAdjustedHD(m)<=max+.0001);
 if(!eligible.length){
   // At very low TPL the lightest legal creature may exceed the requested band.
   // Choose the lightest available creature, but never silently call it balanced.
   let low=Math.min(...MONSTERS.map(rcAdjustedHD));
   eligible=MONSTERS.filter(m=>rcAdjustedHD(m)===low);
 }
 if(isBoss){
   let inBand=eligible.filter(m=>rcAdjustedHD(m)>=min-.0001),q=inBand.length?inBand:eligible;
   return[q[d(q.length)-1]];
 }
 let best=null;
 for(let attempt=0;attempt<80;attempt++){
   let out=[],total=0,tries=0;
   while(out.length<6&&tries++<30){
     let choices=eligible.filter(m=>total+rcAdjustedHD(m)<=max+.0001);
     if(!choices.length)break;
     let m=choices[d(choices.length)-1];out.push(m);total+=rcAdjustedHD(m);
     if(total>=min&&Math.random()<.55)break;
   }
   if(out.length&&total>=min&&total<=max)return out;
   if(out.length&&(!best||Math.abs(total-(min+max)/2)<Math.abs(best.total-(min+max)/2)))best={out,total};
 }
 return best?.out||[eligible[d(eligible.length)-1]];
}
function makeCombat(isBoss=false){
 beginTripPause();
 let picks=buildEncounter(isBoss),en=[];
 for(let i=0;i<picks.length;i++){
   let b=picks[i],hp=0;for(let k=0;k<b.hdDice;k++)hp+=d(8);hp=Math.max(1,hp+(b.hdAdj||0));
   en.push({...b,id:i,lane:i%3,hp,maxhp:hp,damage:b.damage[0],ammo:b.rangedDamage?d(6):0,boss:isBoss,iahd:rcAdjustedHD(b)})
 }
 let total=+en.reduce((a,e)=>a+e.iahd,0).toFixed(2),tpl=rcTPL(),pct=rcChallengePct(total,tpl);
 let startBand=d(3);h.combat={round:1,enemies:en,target:0,log:[],skipNext:false,isBoss,range:RANGE_BANDS[startBand].name,distanceFeet:RANGE_BANDS[startBand].feet,rcTPL:tpl,rcIAHD:total,rcChallengePct:pct,rcChallenge:rcChallengeName(pct)};
 let names=en.map(x=>x.n).join(", ");
 clog((isBoss?`BOSS BATTLE — ${names}. `:`Encounter — ${names}. `)+`RC challenge: ${rcChallengeName(pct)} (${pct}%).`);
 applyMummyFear();save();renderCombat()
}
const UNDEAD={
 skeleton:{id:"skeleton",n:"Skeleton",saveAs:"F1",intelligence:1,ac:7,hdDice:1,hdAdj:0,damage:"1d6",xp:10,undead:true,turnType:"Skeleton"},
 zombie:{id:"zombie",n:"Zombie",saveAs:"F1",intelligence:1,ac:8,hdDice:2,hdAdj:0,damage:"1d8",xp:20,undead:true,turnType:"Zombie"},
 ghoul:{id:"ghoul",n:"Ghoul",saveAs:"F2",intelligence:3,ac:6,hdDice:2,hdAdj:0,damage:"1d3",xp:25,undead:true,turnType:"Ghoul"}
};
function turnValue(type,level){
 const rows={
  Skeleton:[[1,7],[2,"T"],[3,"T"],[4,"D"]],
  Zombie:[[1,9],[2,7],[3,"T"],[4,"T"],[5,"D"]],
  Ghoul:[[1,11],[2,9],[3,7],[4,"T"],[5,"T"],[6,"D"]]
 };
 let row=rows[type]||[],v="—";for(const [lv,val] of row)if(level>=lv)v=val;return v
}
function makeUndeadGroup(){
 let key=h.level>=2&&d(100)<=35?"ghoul":(d(100)<=55?"zombie":"skeleton"),b=UNDEAD[key];
 let count=key==="ghoul"?d(2):d(4),en=[];
 for(let i=0;i<count;i++){let hp=0;for(let k=0;k<b.hdDice;k++)hp+=d(8);hp=Math.max(1,hp);en.push({...b,id:i,lane:i%3,hp,maxhp:hp})}
 return en
}
function startUndeadCombat(en,opening){
 if(!en.length){addlog("No undead remain to fight.");save();page("depart");refresh();return}
 beginTripPause();en.forEach((e,i)=>e.id=i);
 h.combat={round:1,enemies:en,target:0,log:[],skipNext:false,isBoss:false,range:"Close",distanceFeet:RANGE_BANDS[1].feet};
 clog(opening||`${en.length} undead remain and attack.`);save();
 if(h.trip?.mode==="auto")runAutonomousCombat();else renderCombat()
}
function resolveTurnUndead(ev){
 let resumeAfter=h.pendingEvent===ev,en=makeUndeadGroup(),type=en[0].turnType,val=turnValue(type,h.level),roll=d(6)+d(6);
 let success=val==="T"||val==="D"||(typeof val==="number"&&roll>=val),destroy=val==="D";
 let affectedHD=success?d(6)+d(6):0,affected=[],used=0,remain=[];
 if(success){
  for(const e of en){if(used+e.hdDice<=affectedHD){affected.push(e);used+=e.hdDice}else remain.push(e)}
  if(!affected.length&&en.length){affected.push(en[0]);remain=en.slice(1)}
 }else remain=en.slice();
 let verb=destroy?"destroyed":"turned",baseXP=success?(ev.choices?.find(c=>c.result==="clericTurn")?.xp||0):0,xp=baseXP?awardXP(baseXP):0;
 let result=success?`SUCCESS — ${affected.length} ${type}${affected.length===1?"":"s"} ${verb}`:"FAILURE";
 journal({id:ev.id,type:ev.type,title:ev.title,text:ev.text,choice:"Turn Undead",result,xp,coins:[0,0,0],roll,target:val,affected:affected.length,remaining:remain.length});
 addlog(`${ev.title}: Turn Undead — ${result}. ${remain.length} remain.${xp?` +${xp} XP.`:""}`);
 h.pendingEvent=null;save();renderPendingEvent();
 if(remain.length)startUndeadCombat(remain,`${affected.length?affected.length+" "+type+(affected.length===1?" is":"s are")+" "+verb+". ":""}${remain.length} undead remain — combat begins.`);
 else{addlog("All undead are driven off. No combat remains.");endTripPause();save();page("depart");refresh();if(resumeAfter)tick()}
}
function startClericUndeadFight(ev){
 let en=makeUndeadGroup();h.pendingEvent=null;
 journal({id:ev.id,type:ev.type,title:ev.title,text:ev.text,choice:"Fight",result:"combat",xp:0,coins:[0,0,0],remaining:en.length});
 save();renderPendingEvent();startUndeadCombat(en,`${en.length} undead attack.`)
}
function autoPotionThreshold(){return{Cautious:.65,Normal:.45,Bold:.25}[h.trip?.risk||"Normal"]}
function autoSpellScore(s){
 if(s.kind==="heal")return h.hp/h.maxhp<.55?100:0;
 if(s.rc==="Striking"&&living().some(e=>e.mummy))return 95;
 if(s.kind==="buff")return living().length>1?55:30;
 return 40+s.sl*8;
}
function autonomousCanHarm(target=living()[0]){
 if(!target)return true;
 let cs=combatStats(),item=cs.weaponItem,at=ammoTypeFor(cs.weapon),weaponUsable=attackModeFor(cs.weapon)!=="out-of-range"&&(!at||ammoCount(at)>0);
 if(!target.mummy)return weaponUsable||availableCombatSpells().some(s=>["damage","area","line"].includes(s.kind));
 let weaponQualifies=weaponUsable&&(!!item?.magical||Number(item?.magicBonus)>0||item?.damageType==="fire"||h.spells?.buffs?.some(b=>b.damageBonus));
 let spellQualifies=availableCombatSpells().some(s=>["damage","area","line"].includes(s.kind)||(s.rc==="Striking"));
 return weaponQualifies||spellQualifies
}
function runAutonomousCombat(){
 let guard=0,previous=autonomousCombatRunning;autonomousCombatRunning=true;
 try{
  while(h.combat&&living().length&&h.hp>0&&guard++<100){
   if(h.combat.paralyzed){
     clog(`Autonomous: ${h.name} is paralyzed and loses the round.`);
     if(enemyStrike()===false)break;
     if(h.combat){tickSpellBuffs();tickEnemySpellEffects();tickPlayerConditions();h.combat.round++;save()}
     continue
   }
   let ratio=h.hp/h.maxhp,pi=h.inv.findIndex(x=>x.n==="Healing Potion");
   if(ratio<=autoPotionThreshold()&&pi>=0){usePotionCombat();continue}
   let spells=availableCombatSpells()
     .filter(s=>!s.enemyTarget||!Number.isFinite(s.rangeFeet)||combatDistance()<=s.rangeFeet)
     .sort((a,b)=>autoSpellScore(b)-autoSpellScore(a));
   if(spells.length&&autoSpellScore(spells[0])>=45){castCombatSpell(spells[0].id);continue}
   let cs=combatStats(),at=ammoTypeFor(cs.weapon);
   if(attackModeFor(cs.weapon)==="out-of-range"){changeRange("closer");continue}
   if((at&&ammoCount(at)<=0&&!equippedWeapons().melee)||!autonomousCanHarm()){clog("Autonomous: the current fight cannot be won with available attacks; attempting retreat.");retreatCombat();continue}
   resolveAttack()
  }
  if(h.combat&&h.hp>0&&!living().length)finishCombat();
  if(h.combat&&h.hp>0&&living().length&&guard>=100){clog("Autonomous: combat safety limit reached; attempting retreat.");retreatCombat()}
  return h.hp>0
 }finally{autonomousCombatRunning=previous}
}
function autonomousCombat(isBoss=false){makeCombat(isBoss);return runAutonomousCombat()}
function applyMummyFear(){if(!h?.combat||h.combat.mummyFearChecked)return;let m=living().find(e=>e.mummy);if(!m)return;h.combat.mummyFearChecked=true;let s=savingThrow("Paralysis/Stone");clog(`Mummy fear save ${s.roll} vs ${s.target}: ${s.success?"success":"FAIL"}.`);if(!s.success){h.combat.paralyzed=true;h.combat.fearParalyzed=true;h.combat.paralyzedRounds=null;clog(`${h.name} is paralyzed with fear while the Mummy remains in sight.`)}}
function playerStrike(){
 if(h.combat?.paralyzed){clog(`${h.name} is paralyzed and cannot act.`);return}
 let haste=h.spells?.buffs?.some(b=>b.extraAttack);
 playerStrikeSingle();
 if(haste&&h.combat&&living().length){clog("Quickening grants a second weapon attack.");playerStrikeSingle()}
}
function playerStrikeSingle(){
 let c=h.combat,t=c.enemies[c.target];if(!t||t.hp<=0){t=living()[0];if(!t)return;c.target=t.id}
 let cs=combatStats(),w=cs.weapon,item=cs.weaponItem,mode=attackModeFor(w);
 if(c.skipNext){clog("Critical fumble: you lose this initiative.");c.skipNext=false;return}
 if(mode==="melee"&&t.enchanted&&protectionFromEvilActive()&&!c.protEvilBarrierBroken){c.protEvilBarrierBroken=true;clog("You attack an enchanted creature in melee; Sacred Guard no longer bars its touch, though its attack/save modifiers remain.")}
 if(t.sleeping&&c.range==="Hand-to-Hand"&&EDGED_WEAPONS.has(w)){let dmg=t.hp;t.hp=0;t.sleeping=false;t.disabledRounds=0;clog(`Sleeping ${t.n} is slain with a single edged-weapon blow (${dmg} HP).`);let gained=awardXP(t.xp);clog(`${t.n} defeated. +${gained} XP.`);return}
 if(mode==="out-of-range"){clog(`${w} cannot reach a target at ${c.range} range. Close to Hand-to-Hand or use a ranged/thrown weapon.`);return}
 if(mode==="missile"&&c.range==="Hand-to-Hand"&&(t.disabledRounds||0)<=0){clog(`${w} cannot be used effectively at Hand-to-Hand against a mobile target.`);return}
 if(w==="Heavy Crossbow"&&h.stats.STR<18&&c.heavyCrossbowNextRound&&c.round<c.heavyCrossbowNextRound){clog(`Heavy Crossbow is still reloading; it can fire again on round ${c.heavyCrossbowNextRound}.`);return}
 let at=ammoTypeFor(w);if(at&&!spendAmmoFor(w)){clog(`No ${at.toLowerCase()} left for ${w}.`);return}
 if(mode==="thrown")throwWeaponItem(item);
 if(w==="Heavy Crossbow"&&h.stats.STR<18)c.heavyCrossbowNextRound=c.round+2;
 let r=d(20),isMissile=mode==="missile",isThrown=mode==="thrown",atkMod=(isMissile||isThrown)?mod(h.stats.DEX):mod(h.stats.STR),dmgMod=isMissile?0:mod(h.stats.STR);
 if(r===1){clog("Natural 1 — critical fumble. Next initiative is lost.");c.skipNext=true}
 else if(r===20||r+atkMod+spellAttackBonus()+((isMissile||isThrown)?rangeAttackMod(w):0)>=characterNeed(t.ac+(t.blindRounds>0?4:0))){
  let extra=h.spells?.buffs?.filter(b=>b.damageBonus&&(!b.boundWeapon||b.boundWeapon===w)).reduce((n,b)=>n+rollExpr(b.damageBonus),0)||0,flat=h.spells?.buffs?.reduce((n,b)=>n+(b.flatDamageBonus||0),0)||0;
  let base=Math.max(1,rollExpr(cs.damage)+dmgMod+flat),dmg=base+extra;if(r===20){base*=2;extra*=2;dmg=base+extra}if(t.mummy){let magical=!!item?.magical||Number(item?.magicBonus)>0,fire=item?.damageType==="fire";dmg=magical||fire?Math.floor(dmg/2):Math.floor(extra/2);if(dmg<=0){clog(`${w} cannot harm ${t.n}; only spells, fire, or magical weapons can damage it.`);return}clog(`${t.n} resists the attack; only half qualifying damage gets through.`)}t.hp=Math.max(0,t.hp-dmg);
  clog(`${r===20?"Critical hit! ":""}You ${isThrown?"throw "+w+" and ":""}hit ${t.n} for ${dmg}.`);
  if(t.sleeping&&t.hp>0){t.sleeping=false;t.disabledRounds=0;clog(`${t.n} awakens from the blow.`)}
  if(t.hp<=0){let gained=awardXP(t.xp);clog(`${t.n} defeated. +${gained} XP.`)}
 }else clog(`You ${isThrown?"throw "+w+" and ":""}miss ${t.n}.`)
}
function monsterRangeStep(e){
 if(e.disabledRounds>0){clog(`${e.n} cannot change range while immobilized.`);return false}
 let i=combatBandIndex(),dist=combatDistance(),rangedMax=e.rangedWeapon&&WEAPON_RANGES[e.rangedWeapon]?.[2]||Infinity;
 if(e.rangedDamage&&e.meleeDamage){
  if(((e.ammo||0)<=0||dist>rangedMax)&&i>0){setCombatBand(i-1);clog(`${e.n} closes the distance to ${h.combat.range} (${combatDistance()}').`);return true}
  return false
 }
 if(!e.rangedDamage&&i>0){setCombatBand(i-1);clog(`${e.n} closes the distance to ${h.combat.range} (${combatDistance()}').`);return true}
 if(e.rangedDamage&&!e.meleeDamage&&i<3){setCombatBand(i+1);clog(`${e.n} opens the distance to ${h.combat.range} (${combatDistance()}').`);return true}
 return false
}
function combatDeath(reason=""){
 if(reason)clog(reason);
 clog(`You are DEAD. Resurrection in ${h.level*5} minutes.`);
 h.lastAdventure=`FAILED — ${h.name} died. Adventure progress reset to zero.`;
 recoverThrownWeapons();h.trip=null;h.pendingEvent=null;h.combat=null;h.deadUntil=Date.now()+h.level*5*60000;h.hp=0;
 localStorage.setItem("averathia-v041",JSON.stringify(h));renderDeathPage();return false
}
function enemyStrike(){
 for(const e of living()){
  if(e.disabledRounds>0)continue;
  if(e.slowRounds>0&&h.combat.round%2===0){clog(`${e.n} is slowed and cannot act this round.`);continue}
  if(e.skipNext){clog(`${e.n} loses this initiative after its fumble.`);e.skipNext=false;continue}
  if(monsterRangeStep(e))continue;
  if((h.combat?.range||"Close")==="Hand-to-Hand"&&e.enchanted&&protectionFromEvilActive()&&!h.combat.protEvilBarrierBroken){clog(`${e.n} cannot touch you through Sacred Guard.`);continue}
  let r=d(20),blindPenalty=e.blindRounds>0?-6:0;
  if(r===1){clog(`${e.n} rolls a natural 1 — critical fumble. Next initiative is lost.`);e.skipNext=true;continue}
  let mr=h.combat?.range||"Close",dist=combatDistance(),maxR=e.rangedWeapon&&WEAPON_RANGES[e.rangedWeapon]?.[2]||Infinity,useRanged=false;if(e.rangedDamage&&mr!=="Hand-to-Hand"&&(e.ammo||0)>0&&dist<=maxR){e.damage=e.rangedDamage;e.activeWeapon=e.rangedWeapon||"Ranged weapon";e.ammo--;useRanged=true}else if(e.meleeDamage){e.damage=e.meleeDamage;e.activeWeapon=e.meleeWeapon||"Melee weapon"}let need=Math.max(2,(20-monsterHitModifier(e))-effectiveAC(useRanged));if(r===20||r+blindPenalty>=need){
   let mirror=h.spells?.buffs?.find(b=>b.kind==="images"&&b.images>0);if(mirror){mirror.images--;clog(`${e.n} destroys a mirror image.`);continue}
   if(h.spells?.buffs?.some(b=>b.missileWard)&&e.activeWeapon===e.rangedWeapon){clog(`${e.n}'s missile is stopped by your ward.`);continue}let dmg=rollExpr(e.damage);if(r===20)dmg*=2;if(e.damageType)dmg=applyElementalResistance(dmg,e.damage,e.damageType,e.damageNature!=="normal");h.hp=Math.max(0,h.hp-dmg);
   clog(`${e.n} hits with ${e.activeWeapon||"its attack"} for ${dmg}${r===20?" — critical":""}.`);
   if(e.special==="poison"){
    let s=savingThrow("Death/Poison");clog(`Poison save ${s.roll} vs ${s.target}: ${s.success?"success":"FAIL"}.`);
    if(!s.success){h.hp=0;clog("The poison is lethal.")}
   }
   if(e.special==="paralysis"){
    if(e.id==="ghoul"&&h.className==="Elf"){clog(`${h.name}'s elven nature resists the ghoul's paralyzing touch.`)}
    else {let s=savingThrow("Paralysis/Stone");clog(`Paralysis save ${s.roll} vs ${s.target}: ${s.success?"success":"FAIL"}.`);
    if(!s.success){h.combat.paralyzed=true;h.combat.paralyzedRounds=(d(4)+d(4))*RC_ROUNDS_PER_TURN;clog(`${h.name} is paralyzed for ${Math.ceil(h.combat.paralyzedRounds/RC_ROUNDS_PER_TURN)} turn(s) and cannot act.`)}}
   }
   if(e.special==="disease"){
    h.conditions=h.conditions||[];
    if(e.mummy){if(!h.conditions.includes("Diseased"))h.conditions.push("Diseased");h.mummyDisease=true;clog("Mummy disease contracted — magical healing is blocked and natural healing is reduced until Cure Disease.")}
    else{let s=savingThrow("Death/Poison");if(!s.success){if(!h.conditions.includes("Diseased"))h.conditions.push("Diseased");clog("Disease contracted.")}}
   }
  }else clog(`${e.n} misses.`);
  if(h.hp<=0)return combatDeath()
 }
 for(const e of living())if(e.special==="regeneration"){
  let heal=Math.min(3,e.maxhp-e.hp);if(heal>0){e.hp+=heal;clog(`${e.n} regenerates ${heal} HP.`)}
 }
 return true
}

// v1.0.7: usable Averathia spell registry. Mechanics are adapted from the audited RC low-level spell set.
const SPELL_PROGRESS={
 Arcanist:{1:[1],2:[2],3:[2,1],4:[2,2],5:[2,2,1],6:[2,2,2],7:[3,2,2,1],8:[3,3,2,2],9:[3,3,3,2,1],10:[3,3,3,3,2]},
 Elf:{1:[1],2:[2],3:[2,1],4:[2,2],5:[2,2,1],6:[2,2,2],7:[3,2,2,1],8:[3,3,2,2],9:[3,3,3,2,1],10:[3,3,3,3,2]},
 Cleric:{1:[],2:[1],3:[2],4:[2,1],5:[2,2],6:[2,2,1],7:[2,2,2],8:[3,2,2,1],9:[3,3,2,2],10:[3,3,3,2,1]}
};
const ARCANE_NOW=[
 {id:"magic_missile",name:"Arcane Dart",rc:"Magic Missile",sl:1,kind:"damage",damage:"1d6+1",autoHit:true,missilesByLevel:true,enemyTarget:true,rangeFeet:150},
 {id:"shield",name:"Arcane Ward",rc:"Shield",sl:1,kind:"buff",fixedAC:4,fixedMissileAC:2,magicMissileSave:true,durationTurns:2},
 {id:"sleep",name:"Dreamfall",rc:"Sleep",sl:1,kind:"sleep",save:null,durationTurnsDice:"4d4",enemyTarget:true,rangeFeet:240,areaFeet:40},
 {id:"light",name:"Mage Light",rc:"Light",sl:1,kind:"blind",save:"Spells",enemyTarget:true,rangeFeet:120,durationTurnsBase:6,durationTurnsPerLevel:1},
 {id:"mirror_image",name:"Mirror Phantoms",rc:"Mirror Image",sl:2,kind:"images",images:"1d4",durationTurns:6},
 {id:"web",name:"Binding Web",rc:"Web",sl:2,kind:"web",durationTurns:48,enemyTarget:true,rangeFeet:10,areaFeet:10},
 {id:"fireball",name:"Flameburst",rc:"Fireball",sl:3,kind:"area",perLevel:true,save:"Spells",half:true,damageType:"fire",enemyTarget:true,rangeFeet:240,areaFeet:40},
 {id:"lightning_bolt",name:"Storm Lance",rc:"Lightning Bolt",sl:3,kind:"line",perLevel:true,save:"Spells",half:true,enemyTarget:true,rangeFeet:180,lineLengthFeet:60,lineWidthFeet:5},
 {id:"haste",name:"Quickening",rc:"Haste",sl:3,kind:"buff",extraAttack:true,durationTurns:3},
 {id:"slow",name:"Time Drag",rc:"Slow",sl:3,kind:"debuff",save:"Spells",durationTurns:3,enemyTarget:true,rangeFeet:240,areaFeet:60,maxTargets:24},
 {id:"hold_person",name:"Binding Word",rc:"Hold Person",sl:3,kind:"hold",save:"Spells",durationTurnsPerLevel:1,maxTargets:4,humanoidOnly:true,enemyTarget:true,rangeFeet:120},
 {id:"prot_missiles",name:"Missile Ward",rc:"Protection from Normal Missiles",sl:3,kind:"buff",missileWard:true,durationTurns:12}
];
const CLERIC_NOW=[
 {id:"cure_light",name:"Mending Light",rc:"Cure Light Wounds",sl:1,kind:"heal",heal:"1d6+1"},
 {id:"prot_evil",name:"Sacred Guard",rc:"Protection from Evil",sl:1,kind:"buff",ac:-1,saveBonus:1,durationTurns:12},
 {id:"remove_fear",name:"Steady Heart",rc:"Remove Fear",sl:1,kind:"cleanse",condition:"Afraid"},
 {id:"resist_cold",name:"Winter Ward",rc:"Resist Cold",sl:1,kind:"buff",resist:"cold",saveBonusVs:"cold",damagePerDieReduction:1,durationTurns:6},
 {id:"bless",name:"Battle Blessing",rc:"Bless",sl:2,kind:"buff",attack:1,flatDamageBonus:1,morale:1,durationTurns:6},
 {id:"hold_person_c",name:"Sacred Binding",rc:"Hold Person",sl:2,kind:"hold",save:"Spells",durationTurns:9,maxTargets:4,humanoidOnly:true,enemyTarget:true,rangeFeet:180},
 {id:"resist_fire",name:"Flame Ward",rc:"Resist Fire",sl:2,kind:"buff",resist:"fire",saveBonusVs:"fire",damagePerDieReduction:1,durationTurns:2},
 {id:"cure_disease",name:"Restoring Grace",rc:"Cure Disease",sl:3,kind:"cleanse",condition:"Diseased"},
 {id:"striking",name:"War Prayer",rc:"Striking",sl:3,kind:"buff",damageBonus:"1d6",durationTurns:1}
];
const SPELLS={Arcanist:ARCANE_NOW,Elf:ARCANE_NOW.map(x=>({...x,id:"elf_"+x.id,name:x.name.replace("Arcane","Star")})),Cleric:CLERIC_NOW};

function spellSlotsFor(cls=h.className,level=h.level){
 let t=SPELL_PROGRESS[cls];if(!t)return[];
 let key=Math.max(...Object.keys(t).map(Number).filter(x=>x<=level),0);return key?t[key].slice():[]
}
function ensureSpellState(){
 if(!h.spells)h.spells={used:{},buffs:[],memorized:{},spentMem:[]};
 if(!h.spells.used)h.spells.used={};if(!h.spells.buffs)h.spells.buffs=[];if(!h.spells.memorized)h.spells.memorized={};if(!h.spells.spentMem)h.spells.spentMem=[];
}
function availableCombatSpells(){
 ensureSpellState();let slots=spellSlotsFor(),list=SPELLS[h.className]||[];
 return list.filter(s=>{
   if(s.sl>slots.length)return false;
   if(["Arcanist","Elf"].includes(h.className)){
     let mem=h.spells.memorized[s.sl]||[],spent=h.spells.spentMem||[];
     return mem.some((id,i)=>id===s.id&&!spent.includes(`${s.sl}:${i}`));
   }
   return (h.spells.used[s.sl]||0)<(slots[s.sl-1]||0);
 });
}
function consumeSpell(s){
 ensureSpellState();
 if(["Arcanist","Elf"].includes(h.className)){
   let mem=h.spells.memorized[s.sl]||[],spent=h.spells.spentMem||[];
   let i=mem.findIndex((id,i)=>id===s.id&&!spent.includes(`${s.sl}:${i}`));
   if(i<0)return false;spent.push(`${s.sl}:${i}`);h.spells.spentMem=spent;return true;
 }
 h.spells.used[s.sl]=(h.spells.used[s.sl]||0)+1;return true;
}
function rollSpellDamage(s){if(s.perLevel){let n=Math.max(1,Math.min(h.level,10)),v=0;while(n--)v+=d(6);return v}return Math.max(1,rollExpr(s.damage))}
const RC_ROUNDS_PER_TURN=60;
function spellDuration(s){
 if(s.durationTurnsDice)return Math.max(1,rollExpr(s.durationTurnsDice)*RC_ROUNDS_PER_TURN);
 if(s.durationTurnsBase||s.durationTurnsPerLevel)return Math.max(1,((s.durationTurnsBase||0)+h.level*(s.durationTurnsPerLevel||0))*RC_ROUNDS_PER_TURN);
 if(s.durationTurns)return Math.max(1,s.durationTurns*RC_ROUNDS_PER_TURN);
 if(s.durationPerLevel)return Math.max(1,h.level*s.durationPerLevel);
 return s.duration||3
}
function magicMissileCount(){return 1+Math.floor(Math.max(0,h.level-1)/5)}
const RC_SAVE_ROWS={
 Fighter:[{min:0,max:0,v:[14,15,16,17,17]},{min:1,max:3,v:[12,13,14,15,16]},{min:4,max:6,v:[10,11,12,13,14]},{min:7,max:9,v:[8,9,10,11,12]},{min:10,max:12,v:[6,7,8,9,10]},{min:13,max:15,v:[6,6,7,8,9]},{min:16,max:18,v:[5,6,6,7,8]},{min:19,max:21,v:[5,5,6,6,7]},{min:22,max:24,v:[4,5,5,5,6]},{min:25,max:27,v:[4,5,5,4,5]},{min:28,max:30,v:[3,4,5,3,4]},{min:31,max:33,v:[3,4,4,2,3]},{min:34,max:36,v:[2,3,3,2,2]}],
 Cleric:[{min:1,max:4,v:[11,12,14,16,15]},{min:5,max:8,v:[9,10,12,14,13]},{min:9,max:12,v:[7,8,10,12,11]},{min:13,max:16,v:[6,7,8,10,9]},{min:17,max:20,v:[5,6,6,8,7]},{min:21,max:24,v:[4,5,5,6,5]},{min:25,max:28,v:[3,4,4,4,4]},{min:29,max:32,v:[2,3,3,3,3]},{min:33,max:36,v:[2,2,2,2,2]}],
 Arcanist:[{min:1,max:5,v:[13,14,13,16,15]},{min:6,max:10,v:[11,12,11,14,12]},{min:11,max:15,v:[9,10,9,12,9]},{min:16,max:20,v:[7,8,7,10,6]},{min:21,max:24,v:[5,6,5,8,4]},{min:25,max:28,v:[4,4,4,6,3]},{min:29,max:32,v:[3,3,3,4,2]},{min:33,max:36,v:[2,2,2,2,2]}],
 Thief:[{min:1,max:4,v:[13,14,13,16,15]},{min:5,max:8,v:[11,12,11,14,13]},{min:9,max:12,v:[9,10,9,12,11]},{min:13,max:16,v:[7,8,7,10,9]},{min:17,max:20,v:[5,6,5,8,7]},{min:21,max:24,v:[4,5,4,6,5]},{min:25,max:28,v:[3,4,3,4,4]},{min:29,max:32,v:[2,3,2,3,3]},{min:33,max:36,v:[2,2,2,2,2]}],
 Dwarf:[{min:1,max:3,v:[8,9,10,13,12]},{min:4,max:6,v:[6,7,8,10,9]},{min:7,max:9,v:[4,5,6,7,6]},{min:10,max:12,v:[2,3,4,4,3]}],
 Elf:[{min:1,max:3,v:[12,13,13,15,15]},{min:4,max:6,v:[8,10,10,11,11]},{min:7,max:9,v:[4,7,7,7,7]},{min:10,max:10,v:[2,4,4,3,3]}],
 Halfling:[{min:1,max:3,v:[8,9,10,13,12]},{min:4,max:6,v:[5,6,7,9,8]},{min:7,max:8,v:[2,3,4,5,4]}]
};
function rcSaveTarget(cls,level,category="Spells"){
 let key=cls==="Magic-User"?"Arcanist":cls,i=SAVE_NAMES.indexOf(category);if(i<0)i=4;
 let rows=RC_SAVE_ROWS[key]||RC_SAVE_ROWS.Fighter,row=rows.find(r=>level>=r.min&&level<=r.max)||rows[rows.length-1];
 return row.v[i]
}
function parseSaveAs(m){
 let raw=String(m?.saveAs||"").toUpperCase();
 if(raw==="NM")return{cls:"Fighter",level:0,label:"Normal Man"};
 let mm=/^([FCMTDEH])(\d+)$/.exec(raw);
 if(mm){let names={F:"Fighter",C:"Cleric",M:"Arcanist",T:"Thief",D:"Dwarf",E:"Elf",H:"Halfling"};return{cls:names[mm[1]]||"Fighter",level:+mm[2],label:raw}}
 let hd=Math.max(.5,Number(m?.hdDice)||1),intel=Number(m?.intelligence);
 let level=Math.max(1,Math.ceil(Number.isFinite(intel)&&intel<=2?hd/2:hd));
 return{cls:"Fighter",level,label:`F${level} fallback`}
}
function monsterSpellSave(m,category="Spells"){
 let p=parseSaveAs(m),roll=d(20)+(m?.blindRounds>0?-4:0),target=rcSaveTarget(p.cls,p.level,category);
 return{roll,target,success:roll>=target,level:p.level,saveAs:p.label}
}
function gridlessLane(x){return Number.isFinite(x?.lane)?x.lane:(x?.id||0)%3}
function gridlessLaneOffset(x){return (gridlessLane(x)-1)*10}
function gridlessLineTargets(primary){
 let alive=living();if(!alive.length)return[];
 let p=primary&&primary.hp>0?primary:alive[0],lane=gridlessLane(p);
 return alive.filter(x=>gridlessLane(x)===lane)
}
function gridlessAreaTargets(primary,diameterFeet=40){
 let alive=living();if(!alive.length)return[];
 let p=primary&&primary.hp>0?primary:alive[0],center=gridlessLaneOffset(p),radius=Math.max(5,diameterFeet/2);
 return alive.filter(x=>Math.abs(gridlessLaneOffset(x)-center)<=radius)
}
function resolveSpellEffect(s,t=null,autonomous=false,holdMode=null){
 ensureSpellState();let targets=[];
 if(s.kind==="damage"||s.kind==="area"||s.kind==="line"){
  targets=s.kind==="area"?gridlessAreaTargets(t,s.areaFeet||40):s.kind==="line"?gridlessLineTargets(t):[t||living()[0]];
  if(s.missilesByLevel){let q=t||living()[0],n=magicMissileCount();if(q){let dmg=0;for(let i=0;i<n;i++)dmg+=rollExpr(s.damage);if(q.mummy)dmg=Math.floor(dmg/2);q.hp=Math.max(0,q.hp-dmg);clog(`${s.name} launches ${n} dart${n===1?"":"s"} and automatically hits ${q.n} for ${dmg} damage.`);if(q.hp<=0){let gained=awardXP(q.xp);clog(`${q.n} defeated. +${gained} XP.`)}}return}
  let sharedDamage=(s.kind==="area"||s.kind==="line")?rollSpellDamage(s):null;for(const q of targets.filter(Boolean)){let dmg=sharedDamage??rollSpellDamage(s);if(s.save){let sv=monsterSpellSave(q,s.save||"Spells");clog(`${q.n} save ${sv.roll} vs ${sv.target}${sv.saveAs?` [${sv.saveAs}]`:""}: ${sv.success?"success":"FAIL"}.`);if(sv.success&&s.half)dmg=Math.floor(dmg/2)}if(q.mummy)dmg=Math.floor(dmg/2);q.hp=Math.max(0,q.hp-dmg);clog(`${autonomous?"Autonomous: ":""}${s.name} strikes ${q.n} for ${dmg} damage.`);if(s.damageType==="fire"&&q.webbed&&q.hp>0){let burn=d(6);if(q.mummy)burn=Math.floor(burn/2);q.hp=Math.max(0,q.hp-burn);q.disabledRounds=0;q.webbed=false;clog(`The web burns away around ${q.n}; ${q.n} takes ${burn} fire damage.`)}if(q.hp<=0){let gained=awardXP(q.xp);clog(`${q.n} defeated. +${gained} XP.`)}}if(s.kind==="area"&&s.damageType==="fire"&&combatDistance()<=((s.areaFeet||40)/2)&&h.combat){let base=sharedDamage??rollSpellDamage(s),sv=savingThrow("Spells",0,"fire"),dmg=sv.success?Math.floor(base/2):base;dmg=applyElementalResistance(dmg,Math.max(1,Math.min(h.level,10))+"d6","fire",true);h.hp=Math.max(0,h.hp-dmg);clog(`You are caught in the blast: save ${sv.roll} vs ${sv.target} — ${sv.success?"success":"FAIL"}; ${dmg} fire damage.`);if(h.hp<=0)return combatDeath("Your own fireball engulfs you.")}
 }else if(s.kind==="heal"){if(mummyDiseaseActive()){clog(`${s.name} cannot heal through Mummy disease.`)}else{let heal=rollExpr(s.heal),before=h.hp;h.hp=Math.min(h.maxhp,h.hp+heal);clog(`${autonomous?"Autonomous: ":""}${s.name} restores ${h.hp-before} HP.`)}}
 else if(s.kind==="buff"){
  if(s.rc==="Bless"&&h.combat?.range==="Hand-to-Hand"){clog(`${s.name} cannot affect you once you are already in melee.`)}
  else{let buff={...s,rounds:spellDuration(s)};if(s.rc==="Striking")buff.boundWeapon=combatStats().weapon;h.spells.buffs.push(buff);clog(s.rc==="Striking"?`${s.name} empowers ${buff.boundWeapon}.`:`${s.name} takes effect.`)}
 }
 else if(s.kind==="cleanse"){h.conditions=h.conditions||[];let before=h.conditions.length;h.conditions=h.conditions.filter(x=>x!==s.condition);if(s.rc==="Cure Disease"&&before!==h.conditions.length)h.mummyDisease=false;clog(before!==h.conditions.length?`${s.name} removes ${s.condition}.`:`${s.name} finds nothing to remove.`)}
 else if(s.kind==="images"){let n=rollExpr(s.images);h.spells.buffs.push({...s,images:n,rounds:spellDuration(s)});clog(`${s.name} creates ${n} illusory images.`)}
 else if(s.kind==="sleep"){let eligible=gridlessAreaTargets(t,s.areaFeet||40).filter(q=>!q.undead&&(Number(q.hdDice)||1)<=4.5).sort((a,b)=>(Number(a.hdDice)||1)-(Number(b.hdDice)||1)),hdBudget=d(8)+d(8),rounds=spellDuration(s),affected=0;for(const q of eligible){let hd=Math.max(1,Number(q.hdDice)||1);if(hd>hdBudget)continue;hdBudget-=hd;q.disabledRounds=Math.max(q.disabledRounds||0,rounds);q.sleeping=true;affected++;clog(`${q.n} falls asleep for ${Math.ceil(rounds/RC_ROUNDS_PER_TURN)} turn(s).`)}if(!affected)clog(`${s.name} finds no eligible living creature of 4+1 HD or less.`)}
 else if(s.kind==="web"){for(const q of gridlessAreaTargets(t,s.areaFeet||10)){let hd=Number(q.hdDice)||1,strong=q.webStrength==="great"||hd>=8,rounds=strong?2:(d(4)+d(4))*RC_ROUNDS_PER_TURN;q.disabledRounds=Math.min(rounds,spellDuration(s));q.webbed=true;clog(`${q.n} is caught in the web${strong?" and can tear free in 2 rounds":` for ${Math.ceil(rounds/RC_ROUNDS_PER_TURN)} turn(s)`}.`)}}
 else if(s.kind==="hold"){let valid=living().filter(q=>(!s.humanoidOnly||q.humanoid===true)&&!q.mummy),single=holdMode==="single",count=single?1:Math.min(d(4),s.maxTargets||4),qs=single?(t&&valid.includes(t)?[t]:[]):valid.slice(0,count),penalty=single?2:0;for(const q of qs){let sv=monsterSpellSave(q,s.save||"Spells");if(penalty)sv.roll-=penalty;sv.success=sv.roll>=sv.target;clog(`${q.n} save ${sv.roll} vs ${sv.target}${sv.saveAs?` [${sv.saveAs}]`:""}${penalty?" (-2 single-target penalty)":""}: ${sv.success?"success":"FAIL"}.`);if(!sv.success){q.disabledRounds=Math.max(q.disabledRounds||0,spellDuration(s));q.held=true;clog(`${q.n} is held.`)}else clog(`${q.n} resists ${s.name}.`)}if(!qs.length)clog(`${s.name} has no valid humanoid target.`)}
 else if(s.kind==="debuff"){let qs=s.rc==="Slow"?gridlessAreaTargets(t,s.areaFeet||60).slice(0,s.maxTargets||24):[t||living()[0]];for(const q of qs.filter(Boolean)){let sv=monsterSpellSave(q,s.save||"Spells");clog(`${q.n} save ${sv.roll} vs ${sv.target}${sv.saveAs?` [${sv.saveAs}]`:""}: ${sv.success?"success":"FAIL"}.`);if(!sv.success){q.slowRounds=spellDuration(s);clog(`${q.n} is slowed.`)}else clog(`${q.n} resists ${s.name}.`)}}
 else if(s.kind==="blind"){let q=t||living()[0];if(q){let sv=monsterSpellSave(q,s.save||"Spells");clog(`${q.n} save ${sv.roll} vs ${sv.target}${sv.saveAs?` [${sv.saveAs}]`:""}: ${sv.success?"success":"FAIL"}.`);if(!sv.success){q.blindRounds=spellDuration(s);clog(`${q.n} is blinded by ${s.name}.`)}else clog(`${s.name} fails to blind ${q.n}.`)}}
 else if(s.kind==="utility"){clog(`${s.name} is active; no current combat target effect.`)}
}
function castCombatSpell(id,holdMode=null){
 let s=(SPELLS[h.className]||[]).find(x=>x.id===id),c=h.combat;if(!s||!c||!availableCombatSpells().some(x=>x.id===id))return;if(c.paralyzed){clog(`${h.name} is paralyzed and cannot cast.`);return renderCombat()}if(s.enemyTarget&&Number.isFinite(s.rangeFeet)&&combatDistance()>s.rangeFeet){clog(`${s.name} is out of range: target is ${combatDistance()} ft away; spell range is ${s.rangeFeet} ft.`);return renderCombat()}
 // RC: casting is the caster's action for the round. If the enemy wins initiative and disturbs the caster, the spell is lost.
 let pr=d(6),er=d(6);while(pr===er){pr=d(6);er=d(6)}clog(`Spell initiative: you ${pr}, enemies ${er}.`);
 if(!consumeSpell(s))return;
 if(er>pr){
   let hpBefore=h.hp,conditionsBefore=(h.conditions||[]).length;
   enemyStrike();if(!h.combat)return;
   if(h.hp<hpBefore||(h.conditions||[]).length>conditionsBefore){clog(`${s.name} is disrupted and lost.`);tickSpellBuffs();tickEnemySpellEffects();tickPlayerConditions();c.round++;save();renderCombat();return}
 }
 let t=c.enemies[c.target];if(!t||t.hp<=0)t=living()[0];resolveSpellEffect(s,t,false,holdMode);
 if(!h.combat)return;if(!living().length)return finishCombat();
 if(pr>er)enemyStrike();
 if(h.combat){tickSpellBuffs();tickEnemySpellEffects();tickPlayerConditions();h.combat.round++;save();renderCombat()}
}
function tickEnemySpellEffects(){if(!h.combat)return;for(const e of living()){if(e.disabledRounds>0)e.disabledRounds--;if(e.disabledRounds<=0&&e.webbed){e.webbed=false;clog(`${e.n} breaks free of the web.`)}if(e.disabledRounds<=0&&e.sleeping){e.sleeping=false;clog(`${e.n} awakens.`)}if(e.disabledRounds<=0&&e.held){e.held=false;clog(`${e.n} is no longer held.`)}if(e.slowRounds>0)e.slowRounds--;if(e.blindRounds>0){e.blindRounds--;if(e.blindRounds<=0)clog(`${e.n} can see again.`)}}}
function tickPlayerConditions(){if(!h?.combat)return;if(h.combat.fearParalyzed&&!living().some(e=>e.mummy)){h.combat.fearParalyzed=false;h.combat.paralyzed=false;h.combat.paralyzedRounds=0;clog(`${h.name} can move again now that the Mummy is out of sight.`)}if(h.combat.paralyzed&&!h.combat.fearParalyzed){if(!Number.isFinite(h.combat.paralyzedRounds))h.combat.paralyzedRounds=1;h.combat.paralyzedRounds--;if(h.combat.paralyzedRounds<=0){h.combat.paralyzed=false;h.combat.paralyzedRounds=0;clog(`${h.name} can move again.`)}}}
function spellAttackBonus(){ensureSpellState();return h.spells.buffs.reduce((a,b)=>a+(b.attack||0),0)}
function spellACBonus(){ensureSpellState();return h.spells.buffs.reduce((a,b)=>a+(b.ac||0),0)}
function effectiveAC(isMissile=false){let ac=combatStats().ac+spellACBonus();for(const b of h.spells.buffs){let fixed=isMissile?b.fixedMissileAC:b.fixedAC;if(fixed!=null)ac=Math.min(ac,fixed)}return ac}
function tickSpellBuffs(){ensureSpellState();h.spells.buffs.forEach(b=>b.rounds--);h.spells.buffs=h.spells.buffs.filter(b=>b.rounds>0)}
function resetDailySpells(){ensureSpellState();h.spells.used={};h.spells.spentMem=[];h.spells.buffs=[]}
function renderSpellButton(){
 let b=$("#spellBtn");if(!b||!h?.combat)return;let spells=availableCombatSpells();
 b.classList.toggle("hide",!spells.length);b.textContent=spells.length?`✨ Spell (${spells.length})`:"✨ Spell";
 b.onclick=()=>{let menu=$("#spellMenu");if(!menu)return;$("#rangeMenu")?.classList.add("hide");menu.innerHTML=spells.flatMap(s=>{let oor=s.enemyTarget&&Number.isFinite(s.rangeFeet)&&combatDistance()>s.rangeFeet,rt=Number.isFinite(s.rangeFeet)?` · ${s.rangeFeet} ft`:"";return s.kind==="hold"?[`<button class="spellChoice" data-cast-spell="${s.id}" data-hold-mode="single" ${oor?"disabled":""}><b>${s.name}</b> <span class="small">Single · -2 save${rt}${oor?" · OUT OF RANGE":""}</span></button>`,`<button class="spellChoice" data-cast-spell="${s.id}" data-hold-mode="group" ${oor?"disabled":""}><b>${s.name}</b> <span class="small">Group · up to 4${rt}${oor?" · OUT OF RANGE":""}</span></button>`]:[`<button class="spellChoice" data-cast-spell="${s.id}" ${oor?"disabled":""}><b>${s.name}</b> <span class="small">L${s.sl}${rt}${oor?" · OUT OF RANGE":""}</span></button>`]}).join("");menu.classList.toggle("hide");$$("[data-cast-spell]").forEach(x=>x.onclick=()=>{menu.classList.add("hide");castCombatSpell(x.dataset.castSpell,x.dataset.holdMode||null)})}
}
function rangeAttackMod(weapon=combatStats().weapon){
 let ranges=WEAPON_RANGES[weapon],dist=combatDistance();if(!ranges)return 0;
 if(dist<=ranges[0])return 1;if(dist<=ranges[1])return 0;if(dist<=ranges[2])return -1;return -99
}
function renderRangeButton(){
 let b=$("#rangeBtn"),menu=$("#rangeMenu");if(!b||!menu||!h?.combat)return;
 syncCombatRange();let i=combatBandIndex(),haste=h.spells?.buffs?.some(x=>x.extraAttack);
 b.textContent=haste?"📏 Change Range ⚡":"📏 Change Range";
 b.onclick=()=>{i=combatBandIndex();$("#spellMenu")?.classList.add("hide");let choices=[];if(i>0)choices.push('<button data-range-dir="closer">⬅ Closer</button>');if(i<RANGE_BANDS.length-1)choices.push('<button data-range-dir="farther">Farther ➡</button>');if(haste)choices.push('<span class="small">Quickening: move up to 2 range bands</span>');menu.innerHTML=choices.join("");menu.classList.toggle("hide");$$("[data-range-dir]").forEach(x=>x.onclick=()=>changeRange(x.dataset.rangeDir))}
}
function changeRange(direction){
 if(!h?.combat)return;if(h.combat.paralyzed){clog("You cannot change range while paralyzed.");return renderCombat()}
 let i=combatBandIndex(),haste=h.spells?.buffs?.some(x=>x.extraAttack),steps=haste?2:1,ni=direction==="farther"?Math.min(RANGE_BANDS.length-1,i+steps):Math.max(0,i-steps);
 if(ni===i){clog(`You are already at ${RANGE_BANDS[i].name} range.`);return renderCombat()}
 setCombatBand(ni);$("#rangeMenu")?.classList.add("hide");clog(`You move ${direction==="farther"?"farther away":"closer"}${haste?" under Quickening":""}: ${h.combat.range} (${combatDistance()}').`);enemyStrike();
 if(h.combat){tickSpellBuffs();tickEnemySpellEffects();tickPlayerConditions();h.combat.round++;save();renderCombat()}
}
function resolveAttack(){let c=h.combat,pr=d(6),er=d(6);while(pr===er){pr=d(6);er=d(6)}clog(`Initiative: you ${pr}, enemies ${er}.`);if(pr>er){playerStrike();if(living().length)enemyStrike()}else{enemyStrike();if(h.combat&&h.hp>0&&living().length)playerStrike()}if(!h.combat)return;if(!living().length)return finishCombat();tickSpellBuffs();tickEnemySpellEffects();tickPlayerConditions();c.round++;save();renderCombat()}
function finishCombat(){
 let boss=!!h.combat?.isBoss,gp=d(3)-1+(boss?d(3):0),sp=d(8)+(boss?d(6):0),cp=d(12)-1;
 addCoins(gp,sp,cp);
 addlog(`${boss?"Boss defeated":"Combat won"}. Treasure: ${gp} GP, ${sp} SP, ${cp} CP.`);
 if(boss)resolveMissionBoss();
 recoverThrownWeapons();h.combat=null;endTripPause();save();page("depart");refresh();if(!autonomousCombatRunning)tick()
}
function usePotionCombat(){if(h?.combat?.paralyzed){clog(`${h.name} is paralyzed and cannot use a potion.`);return renderCombat()}let i=h.inv.findIndex(x=>x.n==="Healing Potion");if(i<0){clog("No Healing Potion.");return renderCombat()}h.inv.splice(i,1);if(mummyDiseaseActive()){clog("Healing Potion is consumed, but Mummy disease prevents it from restoring HP.")}else{let heal=d(6)+1;h.hp=Math.min(h.maxhp,h.hp+heal);clog(`Potion restores ${heal} HP.`)}enemyStrike();if(h.combat){tickSpellBuffs();tickEnemySpellEffects();tickPlayerConditions();h.combat.round++;save();renderCombat()}}
function retreatCombat(){if(h?.combat?.paralyzed){clog(`${h.name} is paralyzed and cannot retreat.`);return renderCombat()}if(d(6)>=3){addlog("You escape the encounter.");recoverThrownWeapons();h.combat=null;endTripPause();save();page("depart");refresh();if(!autonomousCombatRunning)tick()}else{clog("Retreat fails.");enemyStrike();if(h.combat){tickSpellBuffs();tickEnemySpellEffects();tickPlayerConditions();h.combat.round++;save();renderCombat()}}}
function renderCombat(){if(!h?.combat)return;page("combat");let c=h.combat,cs=combatStats(),at=ammoTypeFor(cs.weapon),ammo=at?` · 🎯 ${at}: ${ammoCount(at)}`:"",wr=cs.rangeText!=="—"?` · S/M/L ${cs.rangeText}`:"",reload=cs.weapon==="Heavy Crossbow"&&h.stats.STR<18&&c.heavyCrossbowNextRound&&c.round<c.heavyCrossbowNextRound?` · ⏳ reload → R${c.heavyCrossbowNextRound}`:"";$("#combatRound").textContent=`Round ${c.round}`;$("#combatStatus").innerHTML=`❤️ HP ${h.hp}/${h.maxhp} · 🛡 AC ${cs.ac} · ⚔ ${cs.weapon} (${cs.damage})${wr}${ammo}${reload} · 📏 ${c.range||"Close"} @ ${combatDistance()}\'`;$("#combatEnemies").innerHTML=c.enemies.map(e=>`<button class="enemyCard ${c.target===e.id?"target":""}" data-target="${e.id}" ${e.hp<=0?"disabled":""}><b>${e.boss?"👑 BOSS — ":""}${e.n}</b> · HP ${e.hp}/${e.maxhp} · AC ${e.ac} · Line ${(e.lane??e.id%3)+1}</button>`).join("");$("#combatLog").innerHTML=c.log.map(x=>`<div>${x}</div>`).join("");$("#combatLog").scrollTop=$("#combatLog").scrollHeight;$$("[data-target]").forEach(b=>b.onclick=()=>{c.target=+b.dataset.target;save();renderCombat()});renderSpellButton();renderRangeButton();let locked=!!c.paralyzed;$("#attackBtn").textContent=locked?"⏳ End Round (Paralyzed)":"⚔ Attack";for(const id of ["#spellBtn","#rangeBtn","#potionBtn","#retreatBtn"])if($(id))$(id).disabled=locked}
function journal(entry){h.trip.journal=h.trip.journal||[];h.trip.journal.push({time:Date.now(),...entry})}
const CLERIC_EVENTS=[{"id":"CLE-001","type":"Encounter","title":"Restless Crypt","text":"The crypt door yawns open and dead hands scrape against stone.","choices":[{"label":"Turn Undead","result":"clericTurn","xp":4},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-002","type":"Encounter","title":"Bone Chapel","text":"Skeletons rise among the shattered pews of a burial chapel.","choices":[{"label":"Turn Undead","result":"clericTurn","xp":4},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-003","type":"Encounter","title":"Grave Watch","text":"Restless dead move between leaning grave markers.","choices":[{"label":"Turn Undead","result":"clericTurn","xp":4},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-004","type":"Encounter","title":"Catacomb Procession","text":"A procession of the dead blocks the narrow catacomb passage.","choices":[{"label":"Turn Undead","result":"clericTurn","xp":4},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-005","type":"Encounter","title":"Desecrated Tomb","text":"The corpse within a broken tomb lurches upright.","choices":[{"label":"Turn Undead","result":"clericTurn","xp":4},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-006","type":"Encounter","title":"Ashen Ossuary","text":"Dry bones knit themselves together around the ossuary.","choices":[{"label":"Turn Undead","result":"clericTurn","xp":4},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-007","type":"Encounter","title":"Sunken Mausoleum","text":"Dead guardians climb from black water around a sunken mausoleum.","choices":[{"label":"Turn Undead","result":"clericTurn","xp":4},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-008","type":"Encounter","title":"Bell-Tower Dead","text":"A dead bell-keeper descends the ruined tower stairs.","choices":[{"label":"Turn Undead","result":"clericTurn","xp":4},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-009","type":"Encounter","title":"Sepulchral Guard","text":"Ancient corpses stand between you and the inner sepulchre.","choices":[{"label":"Turn Undead","result":"clericTurn","xp":4},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-010","type":"Encounter","title":"Necropolis Gate","text":"The dead gather beneath the cracked arch of the necropolis.","choices":[{"label":"Turn Undead","result":"clericTurn","xp":4},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-011","type":"Decision","title":"Sealed Ossuary","text":"Sacred markings cover a sealed ossuary. Something about them feels wrong.","choices":[{"label":"Read the sacred signs","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-012","type":"Decision","title":"Broken Shrine","text":"A neglected shrine has been deliberately defaced.","choices":[{"label":"Reconsecrate the shrine","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-013","type":"Decision","title":"Funeral Bell","text":"A bell rings somewhere beneath the earth although no living hand pulls its rope.","choices":[{"label":"Follow the omen","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-014","type":"Decision","title":"Forbidden Reliquary","text":"A reliquary has been forced open and its wards disturbed.","choices":[{"label":"Examine the wards","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-015","type":"Decision","title":"Pilgrim's Warning","text":"A frightened pilgrim insists the burial road is cursed.","choices":[{"label":"Judge the warning","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-016","type":"Decision","title":"Black Candles","text":"Black candles burn before an empty tomb without melting.","choices":[{"label":"Test the profane rite","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-017","type":"Decision","title":"Unquiet Grave","text":"Fresh soil moves on a grave that has stood for generations.","choices":[{"label":"Perform a calming rite","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-018","type":"Decision","title":"Chapel Threshold","text":"A cold pressure hangs across the chapel threshold.","choices":[{"label":"Bless the threshold","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-019","type":"Decision","title":"Nameless Sarcophagus","text":"Every name has been chiselled from an ancient sarcophagus.","choices":[{"label":"Study the desecration","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-020","type":"Decision","title":"Whispering Vault","text":"Whispers answer every prayer spoken near a sealed vault.","choices":[{"label":"Discern the voices","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-021","type":"Discovery","title":"Saint's Niche","text":"A hidden niche contains an old devotional token.","choices":[{"label":"Examine the niche","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-022","type":"Discovery","title":"Catacomb Map","text":"Faded devotional marks form a map of forgotten passages.","choices":[{"label":"Interpret the markings","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-023","type":"Discovery","title":"Consecrated Spring","text":"Clear water gathers beneath a weathered sacred carving.","choices":[{"label":"Recognize the blessing","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-024","type":"Discovery","title":"Burial Ledger","text":"A stone ledger records generations of forgotten burials.","choices":[{"label":"Study the names","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-025","type":"Discovery","title":"Ancient Epitaph","text":"An inscription records why this crypt was sealed.","choices":[{"label":"Interpret the epitaph","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-026","type":"Discovery","title":"Reliquary Fragment","text":"A fragment of a small reliquary lies beneath fallen masonry.","choices":[{"label":"Identify the fragment","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-027","type":"Discovery","title":"Votive Chamber","text":"Hundreds of tiny offerings cover a chamber wall.","choices":[{"label":"Read their pattern","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-028","type":"Discovery","title":"Saint Ordel's Mark","text":"An unfamiliar carved symbol resembles accounts of Saint Ordel.","choices":[{"label":"Recall the tradition","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-029","type":"Discovery","title":"Processional Mosaic","text":"A damaged mosaic depicts an old funerary procession.","choices":[{"label":"Study the mosaic","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-030","type":"Discovery","title":"Hidden Vestry","text":"A concealed vestry holds mouldering vestments and records.","choices":[{"label":"Search the records","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-031","type":"Quiet","title":"Silent Nave","text":"Only dust moves through the ruined chapel.","choices":[]},{"id":"CLE-032","type":"Quiet","title":"Candle Alcove","text":"An abandoned candle alcove offers a sheltered pause.","choices":[]},{"id":"CLE-033","type":"Quiet","title":"Old Cemetery","text":"The cemetery lies quiet beneath the grey sky.","choices":[]},{"id":"CLE-034","type":"Quiet","title":"Crypt Landing","text":"Nothing stirs on the broad stone landing.","choices":[]},{"id":"CLE-035","type":"Quiet","title":"Monastery Ruin","text":"Wind passes through the empty cloister.","choices":[]},{"id":"CLE-036","type":"Quiet","title":"Wayside Shrine","text":"A small roadside shrine remains undisturbed.","choices":[]},{"id":"CLE-037","type":"Quiet","title":"Stone Cloister","text":"Rain taps softly against the old cloister roof.","choices":[]},{"id":"CLE-038","type":"Quiet","title":"Pilgrim Steps","text":"Worn steps offer a place to rest before the climb.","choices":[]},{"id":"CLE-039","type":"Quiet","title":"Memorial Garden","text":"Dead leaves gather around weathered memorial stones.","choices":[]},{"id":"CLE-040","type":"Quiet","title":"Dawn Chapel","text":"Pale morning light enters through a roofless chapel.","choices":[]}];
const THIEF_EVENTS=[{"id":"THI-001","type":"Encounter","title":"Warehouse Patrol","text":"Lantern-bearing guards round the warehouse corner.","choices":[{"label":"Slip past quietly","result":"thiefSkill","skill":"moveSilently","xp":3},{"label":"Confront them","result":"passed"}]},{"id":"THI-002","type":"Encounter","title":"Rooftop Watch","text":"A watchman scans the roofs from a bell tower.","choices":[{"label":"Melt into the shadows","result":"thiefSkill","skill":"hideInShadows","xp":3},{"label":"Withdraw","result":"passed"}]},{"id":"THI-003","type":"Encounter","title":"Manor Guard","text":"A guard pauses outside the room you entered.","choices":[{"label":"Listen through the door","result":"thiefSkill","skill":"hearNoise","xp":3},{"label":"Risk the corridor","result":"passed"}]},{"id":"THI-004","type":"Encounter","title":"Guild Enforcer","text":"A guild enforcer has his back to you in a narrow passage.","choices":[{"label":"Get behind him","result":"thiefSkill","skill":"moveSilently","xp":3},{"label":"Back away","result":"passed"}]},{"id":"THI-005","type":"Encounter","title":"Courtyard Patrol","text":"Bootsteps approach across the manor courtyard.","choices":[{"label":"Hide in the arcade","result":"thiefSkill","skill":"hideInShadows","xp":3},{"label":"Run","result":"passed"}]},{"id":"THI-006","type":"Encounter","title":"Cellar Sentry","text":"A sentry guards the cellar stairs beneath a tavern.","choices":[{"label":"Sneak past","result":"thiefSkill","skill":"moveSilently","xp":3},{"label":"Leave","result":"passed"}]},{"id":"THI-007","type":"Encounter","title":"Sleeping Guard","text":"A guard dozes beside the counting-room door.","choices":[{"label":"Lift his key","result":"thiefSkill","skill":"pickPockets","xp":3},{"label":"Leave him","result":"passed"}]},{"id":"THI-008","type":"Encounter","title":"Rooftop Pursuit","text":"Watchmen are gaining on you across wet rooftops.","choices":[{"label":"Scale the next wall","result":"thiefSkill","skill":"climbWalls","xp":3},{"label":"Take the stairs","result":"passed"}]},{"id":"THI-009","type":"Encounter","title":"Closed Gate","text":"The alley ends at a high locked gate as pursuers approach.","choices":[{"label":"Pick the gate lock","result":"thiefSkill","skill":"openLocks","xp":3},{"label":"Turn and fight","result":"passed"}]},{"id":"THI-010","type":"Encounter","title":"Dark Stairwell","text":"Someone is climbing the stairs below you.","choices":[{"label":"Listen and judge the approach","result":"thiefSkill","skill":"hearNoise","xp":3},{"label":"Hide blindly","result":"passed"}]},{"id":"THI-011","type":"Decision","title":"Counting House Door","text":"A reinforced side door protects a merchant counting house.","choices":[{"label":"Pick the lock","result":"thiefSkill","skill":"openLocks","xp":3},{"label":"Move on","result":"passed"}]},{"id":"THI-012","type":"Decision","title":"Upper Window","text":"A second-floor window stands above a narrow alley.","choices":[{"label":"Climb to the window","result":"thiefSkill","skill":"climbWalls","xp":3},{"label":"Move on","result":"passed"}]},{"id":"THI-013","type":"Decision","title":"Jeweller's Back Room","text":"A delicate lock protects the jeweller's back room.","choices":[{"label":"Work the lock","result":"thiefSkill","skill":"openLocks","xp":3},{"label":"Leave","result":"passed"}]},{"id":"THI-014","type":"Decision","title":"Merchant's Pocket","text":"A wealthy merchant watches a street performance.","choices":[{"label":"Lift his purse","result":"thiefSkill","skill":"pickPockets","xp":3},{"label":"Leave him","result":"passed"}]},{"id":"THI-015","type":"Decision","title":"Guard Rotation","text":"There is a short gap between two patrols.","choices":[{"label":"Cross silently","result":"thiefSkill","skill":"moveSilently","xp":3},{"label":"Wait","result":"passed"}]},{"id":"THI-016","type":"Decision","title":"Lamplit Gallery","text":"A servant crosses the gallery at irregular intervals.","choices":[{"label":"Use the shadows","result":"thiefSkill","skill":"hideInShadows","xp":3},{"label":"Withdraw","result":"passed"}]},{"id":"THI-017","type":"Decision","title":"Suspicious Floor","text":"One flagstone sits slightly higher than the others.","choices":[{"label":"Check for a trap","result":"thiefSkill","skill":"findTraps","xp":3},{"label":"Step over it","result":"passed"}]},{"id":"THI-018","type":"Decision","title":"Trapped Strongbox","text":"A wire disappears beneath the lid of a strongbox.","choices":[{"label":"Disarm the trap","result":"thiefSkill","skill":"removeTraps","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"THI-019","type":"Decision","title":"Office Door","text":"Voices may be coming from behind the office door.","choices":[{"label":"Listen at the door","result":"thiefSkill","skill":"hearNoise","xp":3},{"label":"Open it","result":"passed"}]},{"id":"THI-020","type":"Decision","title":"Noble's Balcony","text":"The balcony above leads directly into the private apartments.","choices":[{"label":"Scale the facade","result":"thiefSkill","skill":"climbWalls","xp":3},{"label":"Find another route","result":"passed"}]},{"id":"THI-021","type":"Discovery","title":"Locked Cashbox","text":"A small iron cashbox is hidden beneath loose floorboards.","choices":[{"label":"Open the cashbox","result":"thiefSkill","skill":"openLocks","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"THI-022","type":"Discovery","title":"Needle Trap","text":"A tiny hole beside the chest lock looks suspicious.","choices":[{"label":"Inspect the mechanism","result":"thiefSkill","skill":"findTraps","xp":3},{"label":"Ignore it","result":"passed"}]},{"id":"THI-023","type":"Discovery","title":"Armed Chest","text":"You identify a trap mechanism protecting an old chest.","choices":[{"label":"Disarm it","result":"thiefSkill","skill":"removeTraps","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"THI-024","type":"Discovery","title":"Loose Purse","text":"A distracted gambler has a heavy purse at his belt.","choices":[{"label":"Take the purse","result":"thiefSkill","skill":"pickPockets","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"THI-025","type":"Discovery","title":"High Cache","text":"A smuggler's cache is visible above a sheer warehouse wall.","choices":[{"label":"Climb to it","result":"thiefSkill","skill":"climbWalls","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"THI-026","type":"Discovery","title":"Secret Meeting","text":"Muffled voices come through a thin cellar wall.","choices":[{"label":"Listen closely","result":"thiefSkill","skill":"hearNoise","xp":3},{"label":"Move on","result":"passed"}]},{"id":"THI-027","type":"Discovery","title":"Moonlit Courtyard","text":"A bright courtyard separates you from an open study window.","choices":[{"label":"Cross unseen","result":"thiefSkill","skill":"hideInShadows","xp":3},{"label":"Go around","result":"passed"}]},{"id":"THI-028","type":"Discovery","title":"Servants' Passage","text":"A narrow servants' passage leads deeper into the manor.","choices":[{"label":"Proceed silently","result":"thiefSkill","skill":"moveSilently","xp":3},{"label":"Leave","result":"passed"}]},{"id":"THI-029","type":"Discovery","title":"Locked Ledger Desk","text":"A merchant's desk has a sophisticated lock.","choices":[{"label":"Pick the desk lock","result":"thiefSkill","skill":"openLocks","xp":3},{"label":"Leave","result":"passed"}]},{"id":"THI-030","type":"Discovery","title":"Suspicious Rug","text":"A rug conceals an oddly shaped seam in the floor.","choices":[{"label":"Examine it carefully","result":"thiefSkill","skill":"findTraps","xp":3},{"label":"Ignore it","result":"passed"}]},{"id":"THI-031","type":"Quiet","title":"Sleeping Street","text":"The district lies quiet beneath shuttered windows.","choices":[]},{"id":"THI-032","type":"Quiet","title":"Empty Rooftop","text":"Rain taps softly on an empty rooftop.","choices":[]},{"id":"THI-033","type":"Quiet","title":"Canal Walk","text":"Black water moves beside silent warehouses.","choices":[]},{"id":"THI-034","type":"Quiet","title":"Abandoned Loft","text":"A dusty loft offers a concealed place to rest.","choices":[]},{"id":"THI-035","type":"Quiet","title":"Market After Dark","text":"Canvas awnings flap over deserted market stalls.","choices":[]},{"id":"THI-036","type":"Quiet","title":"Bell Tower","text":"The city spreads below the silent bell tower.","choices":[]},{"id":"THI-037","type":"Quiet","title":"Back Alley","text":"For once, no footsteps follow you through the alley.","choices":[]},{"id":"THI-038","type":"Quiet","title":"Warehouse Rafters","text":"You pause unseen among the rafters.","choices":[]},{"id":"THI-039","type":"Quiet","title":"Sewer Junction","text":"Only running water echoes through the brick tunnels.","choices":[]},{"id":"THI-040","type":"Quiet","title":"Inn Roof","text":"Warm chimney smoke drifts across the quiet roof.","choices":[]}];
const ARCANIST_EVENTS=[{"id":"ARC-001","type":"Encounter","title":"Tower Familiar","text":"A hostile magical creature circles the stair of an abandoned arcane tower.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ARC-002","type":"Encounter","title":"Unstable Summoning","text":"A summoned creature strains against a failing containment circle.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ARC-003","type":"Encounter","title":"Arcane Sentinel","text":"An enchanted guardian wakes beside a sealed laboratory.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ARC-004","type":"Encounter","title":"Rift Creature","text":"Something clawed crawls through a dimensional tear.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ARC-005","type":"Encounter","title":"Living Spell","text":"Loose magic condenses into a violent, shifting form.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ARC-006","type":"Encounter","title":"Glass Golem","text":"A crystalline guardian steps from a shattered display chamber.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ARC-007","type":"Encounter","title":"Aether Parasite","text":"A pale creature feeds on the glow of an arcane conduit.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ARC-008","type":"Encounter","title":"Mirror Double","text":"A hostile reflection steps free of a black mirror.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ARC-009","type":"Encounter","title":"Runic Guardian","text":"A rune-carved construct blocks the archive stairs.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ARC-010","type":"Encounter","title":"Portal Hunter","text":"A strange predator emerges from a portal and fixes on you.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ARC-011","type":"Decision","title":"Dimensional Door","text":"A thin doorway opens onto impossible stars.","choices":[{"label":"Analyse the doorway","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ARC-012","type":"Decision","title":"Runed Observatory","text":"The observatory controls are covered in shifting runes.","choices":[{"label":"Decode the controls","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ARC-013","type":"Decision","title":"Broken Portal","text":"A damaged portal flickers between unknown destinations.","choices":[{"label":"Stabilise the pattern","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ARC-014","type":"Decision","title":"Forbidden Formula","text":"An unfinished formula covers an entire wall.","choices":[{"label":"Complete the reasoning","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ARC-015","type":"Decision","title":"Mirror Passage","text":"A black mirror reflects a corridor that is not here.","choices":[{"label":"Test the reflection","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ARC-016","type":"Decision","title":"Clockwork Orrery","text":"A brass model of unknown worlds turns by itself.","choices":[{"label":"Reconstruct its sequence","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ARC-017","type":"Decision","title":"Arcane Lock","text":"A door is sealed by interlocking magical symbols.","choices":[{"label":"Solve the sigil","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ARC-018","type":"Decision","title":"Gravity Well","text":"Loose stones hang motionless above a dark stair.","choices":[{"label":"Calculate a safe route","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ARC-019","type":"Decision","title":"Memory Prism","text":"A prism projects fragments of another scholar's memories.","choices":[{"label":"Order the fragments","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ARC-020","type":"Decision","title":"Shifting Library","text":"Shelves rearrange whenever you stop looking at them.","choices":[{"label":"Predict the pattern","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ARC-021","type":"Discovery","title":"Spell Fragment","text":"A surviving page contains a fragment of arcane notation.","choices":[{"label":"Interpret the notation","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ARC-022","type":"Discovery","title":"Aether Crystal","text":"A humming crystal rests in a brass cradle.","choices":[{"label":"Identify its function","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ARC-023","type":"Discovery","title":"Tower Archive","text":"A sealed cabinet preserves old magical records.","choices":[{"label":"Study the archive","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ARC-024","type":"Discovery","title":"Planar Residue","text":"Strange residue marks where another dimension touched this one.","choices":[{"label":"Analyse the residue","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ARC-025","type":"Discovery","title":"Astral Lens","text":"A cracked lens still reveals distant lights.","choices":[{"label":"Calibrate the lens","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ARC-026","type":"Discovery","title":"Sealed Thesis","text":"A metal tube protects a forgotten magical thesis.","choices":[{"label":"Evaluate the thesis","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ARC-027","type":"Discovery","title":"Portal Coordinates","text":"A slate records a sequence of impossible coordinates.","choices":[{"label":"Decode the sequence","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ARC-028","type":"Discovery","title":"Failed Homunculus","text":"Notes beside an inert construct document a failed experiment.","choices":[{"label":"Study the notes","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ARC-029","type":"Discovery","title":"Star Map","text":"A ceiling chart shows constellations that do not belong to this sky.","choices":[{"label":"Compare the pattern","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ARC-030","type":"Discovery","title":"Ciphered Grimoire","text":"A damaged book is written in a dense arcane cipher.","choices":[{"label":"Break the cipher","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ARC-031","type":"Quiet","title":"Empty Laboratory","text":"Cold burners and dusty glassware fill the silent room.","choices":[]},{"id":"ARC-032","type":"Quiet","title":"Tower Balcony","text":"The ruined tower offers a clear view of the land below.","choices":[]},{"id":"ARC-033","type":"Quiet","title":"Dormant Circle","text":"An old summoning circle lies cold and inactive.","choices":[]},{"id":"ARC-034","type":"Quiet","title":"Dusty Archive","text":"Nothing moves among the shelves but drifting dust.","choices":[]},{"id":"ARC-035","type":"Quiet","title":"Observatory Dome","text":"The great dome stands open beneath the night sky.","choices":[]},{"id":"ARC-036","type":"Quiet","title":"Scribe's Chamber","text":"Dry ink pots and blank parchment remain on a scholar's desk.","choices":[]},{"id":"ARC-037","type":"Quiet","title":"Quiet Portal Hall","text":"Every portal frame is dark and still.","choices":[]},{"id":"ARC-038","type":"Quiet","title":"Abandoned Lecture Room","text":"Rows of stone benches face a cracked slate.","choices":[]},{"id":"ARC-039","type":"Quiet","title":"Aether Garden","text":"Harmless motes of light drift through a glass-roofed chamber.","choices":[]},{"id":"ARC-040","type":"Quiet","title":"Silent Study","text":"A heavy desk and extinguished lamp offer a safe pause.","choices":[]}];
const DWARF_EVENTS=[{"id":"DWA-001","type":"Encounter","title":"Mine Tunnel Ambush","text":"Movement breaks the darkness in an abandoned mine tunnel.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"DWA-002","type":"Encounter","title":"Cavern Predator","text":"A subterranean predator emerges between the rocks.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"DWA-003","type":"Encounter","title":"Collapsed Gallery","text":"Something waits beyond a recently collapsed mining gallery.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"DWA-004","type":"Encounter","title":"Deep Delvers","text":"Hostile figures appear farther down the tunnel.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"DWA-005","type":"Encounter","title":"Underground Nest","text":"A nest blocks the narrow cave passage.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"DWA-006","type":"Encounter","title":"Mushroom Cavern","text":"A creature crashes through a forest of giant cave fungi.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"DWA-007","type":"Encounter","title":"Old Guard Post","text":"Hostile squatters occupy a forgotten underground guard post.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"DWA-008","type":"Encounter","title":"Deep Chasm","text":"Something climbs from a chasm beside the trail.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"DWA-009","type":"Encounter","title":"Ore Cart Ambush","text":"An abandoned ore cart hides movement in the dark.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"DWA-010","type":"Encounter","title":"Buried Hall","text":"A beast has made its lair inside an ancestral stone hall.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"DWA-011","type":"Decision","title":"Forked Mine","text":"The old mine splits into a worked tunnel and a natural cave.","choices":[{"label":"Read the stonework","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"DWA-012","type":"Decision","title":"Unstable Supports","text":"Rotten timbers hold up the passage ahead.","choices":[{"label":"Judge the structure","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"DWA-013","type":"Decision","title":"Flooded Shaft","text":"A mine shaft descends into black water.","choices":[{"label":"Assess the shaft","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"DWA-014","type":"Decision","title":"Ore Vein","text":"A promising vein disappears behind fractured stone.","choices":[{"label":"Examine the vein","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"DWA-015","type":"Decision","title":"Sealed Deep Door","text":"A heavy stone door closes an ancient tunnel.","choices":[{"label":"Inspect the masonry","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"DWA-016","type":"Decision","title":"False Wall","text":"One stretch of rock looks subtly different from the rest.","choices":[{"label":"Test the stone","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"DWA-017","type":"Decision","title":"Ancient Lift","text":"A counterweighted mining lift hangs over a deep shaft.","choices":[{"label":"Inspect the mechanism","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"DWA-018","type":"Decision","title":"Fault Line","text":"A fresh crack runs across the cavern roof.","choices":[{"label":"Judge the danger","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"DWA-019","type":"Decision","title":"Ventilation Shaft","text":"A narrow shaft carries warm air from somewhere below.","choices":[{"label":"Trace the airflow","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"DWA-020","type":"Decision","title":"Lost Hold Gate","text":"An immense gate bears weathered clan marks.","choices":[{"label":"Read the construction","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"DWA-021","type":"Discovery","title":"Forgotten Tools","text":"Old mining tools remain where their owners left them.","choices":[{"label":"Inspect the workmanship","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"DWA-022","type":"Discovery","title":"Miner's Cache","text":"A hidden niche contains a miner's emergency cache.","choices":[{"label":"Find its purpose","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"DWA-023","type":"Discovery","title":"Crystal Cavern","text":"Natural crystals glitter across the cavern walls.","choices":[{"label":"Assess the formation","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"DWA-024","type":"Discovery","title":"Old Survey Marks","text":"Chiselled marks reveal the mine's forgotten layout.","choices":[{"label":"Read the survey marks","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"DWA-025","type":"Discovery","title":"Buried Strongbox","text":"A battered strongbox protrudes from a cave-in.","choices":[{"label":"Examine the hiding place","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"DWA-026","type":"Discovery","title":"Ancestral Carving","text":"A wall carving records names from a forgotten dwarf line.","choices":[{"label":"Read the genealogy","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"DWA-027","type":"Discovery","title":"Worked Seam","text":"Tool marks reveal where miners followed a vanished ore seam.","choices":[{"label":"Reconstruct the work","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"DWA-028","type":"Discovery","title":"Stone Cistern","text":"A carefully built cistern still collects clean cave water.","choices":[{"label":"Inspect the engineering","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"DWA-029","type":"Discovery","title":"Rune Fragment","text":"A broken stone bears part of an old family rune.","choices":[{"label":"Interpret the fragment","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"DWA-030","type":"Discovery","title":"Foundation Stone","text":"A massive dressed stone carries the mason's original mark.","choices":[{"label":"Identify the mason mark","result":"classAbility","ability":"INT","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"DWA-031","type":"Quiet","title":"Dry Cavern","text":"A broad dry cavern offers a safe place to pause.","choices":[]},{"id":"DWA-032","type":"Quiet","title":"Old Mine Office","text":"A stone desk stands untouched in a forgotten mine office.","choices":[]},{"id":"DWA-033","type":"Quiet","title":"Deep Hearth","text":"A cold hearth remains in an abandoned underground hall.","choices":[]},{"id":"DWA-034","type":"Quiet","title":"Echo Chamber","text":"Only the sound of dripping water crosses the cavern.","choices":[]},{"id":"DWA-035","type":"Quiet","title":"Tool Alcove","text":"An empty tool alcove provides shelter from the tunnel.","choices":[]},{"id":"DWA-036","type":"Quiet","title":"Stone Bridge","text":"An old bridge spans a silent underground stream.","choices":[]},{"id":"DWA-037","type":"Quiet","title":"Abandoned Forge","text":"The forge is cold, but its stonework remains sound.","choices":[]},{"id":"DWA-038","type":"Quiet","title":"Survey Chamber","text":"Faded maps cover the walls of an otherwise empty room.","choices":[]},{"id":"DWA-039","type":"Quiet","title":"Deep Well","text":"A covered well stands beside a quiet passage.","choices":[]},{"id":"DWA-040","type":"Quiet","title":"Ancestral Hall","text":"Rows of worn stone pillars disappear into the darkness.","choices":[]}];
const ELF_EVENTS=[{"id":"ELF-001","type":"Encounter","title":"Forest Stalker","text":"Something follows silently between the trees.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ELF-002","type":"Encounter","title":"Ruined Grove","text":"Hostile movement disturbs an ancient grove.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ELF-003","type":"Encounter","title":"Woodland Ambush","text":"Shapes shift among the ferns beside the trail.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ELF-004","type":"Encounter","title":"Riverbank Predator","text":"A predator emerges near the forest river.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ELF-005","type":"Encounter","title":"Overgrown Ruin","text":"Something has made its lair in a vine-covered ruin.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ELF-006","type":"Encounter","title":"Blighted Clearing","text":"A hostile creature prowls a clearing where the plants have blackened.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ELF-007","type":"Encounter","title":"Canopy Hunter","text":"Branches shake overhead as a predator follows from tree to tree.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ELF-008","type":"Encounter","title":"Poacher Camp","text":"Armed intruders guard traps set along an animal trail.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ELF-009","type":"Encounter","title":"Root-Cave Lair","text":"A beast bursts from beneath the roots of an ancient tree.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ELF-010","type":"Encounter","title":"Thorn Hollow","text":"Something dangerous moves inside a dense hollow of thorns.","choices":[{"label":"Face the threat","result":"combat"},{"label":"Avoid it","result":"avoided"}]},{"id":"ELF-011","type":"Decision","title":"Hidden Trail","text":"A barely visible trail leaves the main woodland path.","choices":[{"label":"Read the trail","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ELF-012","type":"Decision","title":"Ancient Grove","text":"Old trees encircle a place untouched by axes.","choices":[{"label":"Sense the grove","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ELF-013","type":"Decision","title":"River Crossing","text":"The forest river runs fast after recent rain.","choices":[{"label":"Choose a safe crossing","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ELF-014","type":"Decision","title":"Fallen Oak","text":"A gigantic fallen oak conceals a hollow beneath its roots.","choices":[{"label":"Inspect the hollow","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ELF-015","type":"Decision","title":"Moonlit Stones","text":"Standing stones glow faintly in a moonlit clearing.","choices":[{"label":"Read the signs","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ELF-016","type":"Decision","title":"Storm-Damaged Path","text":"Windfall has erased the trail ahead.","choices":[{"label":"Find the true path","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ELF-017","type":"Decision","title":"Wounded Stag","text":"A wounded stag watches from beneath the trees.","choices":[{"label":"Approach carefully","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ELF-018","type":"Decision","title":"Withered Copse","text":"A small stand of trees has withered without obvious cause.","choices":[{"label":"Trace the cause","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ELF-019","type":"Decision","title":"Forked Game Trail","text":"Two animal trails split around a wooded ridge.","choices":[{"label":"Read the tracks","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ELF-020","type":"Decision","title":"Encroaching Bramble","text":"An unnatural wall of bramble chokes an old woodland route.","choices":[{"label":"Find a passage","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Move on","result":"passed"}]},{"id":"ELF-021","type":"Discovery","title":"Herbal Clearing","text":"Useful herbs grow in a sheltered clearing.","choices":[{"label":"Identify the herbs","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ELF-022","type":"Discovery","title":"Hunter's Marker","text":"An old woodland marker points toward a forgotten route.","choices":[{"label":"Interpret the marker","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ELF-023","type":"Discovery","title":"Forest Spring","text":"Clear water rises between moss-covered stones.","choices":[{"label":"Judge the spring","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ELF-024","type":"Discovery","title":"Overgrown Shrine","text":"Roots curl around a small forgotten shrine.","choices":[{"label":"Examine the growth","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ELF-025","type":"Discovery","title":"Ancient Tree","text":"Carvings on an immense tree record an old journey.","choices":[{"label":"Read the carvings","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ELF-026","type":"Discovery","title":"Rare Seedpod","text":"An unfamiliar seedpod hangs from a single old branch.","choices":[{"label":"Identify the seed","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ELF-027","type":"Discovery","title":"Animal Crossing","text":"Tracks from many species converge at one narrow place.","choices":[{"label":"Study the tracks","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ELF-028","type":"Discovery","title":"Old Boundary Oak","text":"Faint cuts in an oak mark an ancient forest boundary.","choices":[{"label":"Recognise the boundary","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ELF-029","type":"Discovery","title":"Hidden Orchard","text":"Wild descendants of an old orchard grow deep in the forest.","choices":[{"label":"Study the trees","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ELF-030","type":"Discovery","title":"Burned Glade","text":"New green shoots rise through the remains of an old fire.","choices":[{"label":"Read the recovery","result":"classAbility","ability":"WIS","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"ELF-031","type":"Quiet","title":"Green Canopy","text":"Sunlight filters peacefully through the leaves.","choices":[]},{"id":"ELF-032","type":"Quiet","title":"Forest Pool","text":"A still pool reflects the branches above.","choices":[]},{"id":"ELF-033","type":"Quiet","title":"Mossy Hollow","text":"Soft moss covers a sheltered hollow between roots.","choices":[]},{"id":"ELF-034","type":"Quiet","title":"Old Oak","text":"An immense oak offers shade and a dry place to rest.","choices":[]},{"id":"ELF-035","type":"Quiet","title":"Fern Clearing","text":"Nothing stirs beyond insects among the ferns.","choices":[]},{"id":"ELF-036","type":"Quiet","title":"Willow Bank","text":"Willows hang over a slow, quiet stream.","choices":[]},{"id":"ELF-037","type":"Quiet","title":"Pine Ridge","text":"Wind moves softly through high pine branches.","choices":[]},{"id":"ELF-038","type":"Quiet","title":"Deer Meadow","text":"A small meadow lies undisturbed between the woods.","choices":[]},{"id":"ELF-039","type":"Quiet","title":"Rain Shelter","text":"Dense branches keep the forest floor almost dry.","choices":[]},{"id":"ELF-040","type":"Quiet","title":"Dawn Grove","text":"Morning light slowly reaches the floor of an ancient grove.","choices":[]}];

const THIEF_RC_SKILLS={"openLocks":[15,20,25,30,35,40,45,50,54,58,62,66,69,72,75,78,81,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120],"findTraps":[10,15,20,25,30,35,40,45,50,54,58,62,66,70,73,76,80,83,86,89,92,94,96,98,99,100,101,102,103,104,105,106,107,108,109,110],"removeTraps":[10,15,20,25,30,34,38,42,46,50,54,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,130],"climbWalls":[87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,118,119,119,120],"moveSilently":[20,25,30,35,40,44,48,52,55,58,61,64,66,68,70,72,74,76,78,80,82,84,86,88,89,90,91,92,93,94,95,96,97,98,99,100],"hideInShadows":[10,15,20,24,28,32,35,38,41,44,47,50,53,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100],"pickPockets":[20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195],"hearNoise":[30,35,40,45,50,54,58,62,66,70,74,78,81,84,87,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,130]};
function thiefSkillChance(skill,level=h?.level||1){
 let t=THIEF_RC_SKILLS[skill];if(!t)return 0;
 return t[Math.max(1,Math.min(36,level))-1];
}
function thiefSkillCheck(skill,modifier=0){
 if(!h||h.className!=="Thief")return {success:false,roll:null,chance:0};
 let chance=thiefSkillChance(skill)+modifier,roll=d(100);
 return {success:roll<=chance,roll,chance,skill};
}
function thiefAbilities(level=h?.level||1){
 return {
  openLocks:thiefSkillChance("openLocks",level),
  findTraps:thiefSkillChance("findTraps",level),
  removeTraps:thiefSkillChance("removeTraps",level),
  climbWalls:thiefSkillChance("climbWalls",level),
  moveSilently:thiefSkillChance("moveSilently",level),
  hideInShadows:thiefSkillChance("hideInShadows",level),
  pickPockets:thiefSkillChance("pickPockets",level),
  hearNoise:thiefSkillChance("hearNoise",level),
  backstab:{available:true,attackBonus:4,damageMultiplier:2},
  readLanguages:{available:level>=4,chance:level>=4?80:0},
  magicUserScrolls:{available:level>=10,backfireChance:level>=10?10:0}
 };
}

const CLASS_SPECIALS={
 Elf:[
  ["Ghoul Touch Immunity","Immune to a ghoul's paralyzing touch; other paralysis still works normally."],
  ["Infravision","Can see heat patterns in darkness where infravision applies."],
  ["Secret Doors","Better chance to notice concealed and secret doors when the event system supports them."]
 ],
 Dwarf:[
  ["Infravision","Can see heat patterns in darkness where infravision applies."],
  ["Stonecraft","1-in-3 chance to detect stone traps, sliding walls, slopes and recent stone construction when relevant."]
 ]
};
const SKILL_LABELS={openLocks:"Open Locks",findTraps:"Find Traps",removeTraps:"Remove Traps",climbWalls:"Climb Walls",moveSilently:"Move Silently",hideInShadows:"Hide in Shadows",pickPockets:"Pick Pockets",hearNoise:"Hear Noise"};
const SPELL_BRIEFS={
 "Arcane Dart":"Automatic direct magical damage.","Arcane Ward":"Protective magical ward.","Dreamfall":"Attempts to put a foe to sleep.","Mage Light":"Creates magical light.",
 "Mirror Phantoms":"Creates illusory duplicates that can absorb attacks.","Binding Web":"Attempts to restrain a foe.","Flameburst":"Fire damage to all foes; successful save halves damage.","Storm Lance":"Heavy lightning damage; successful save halves damage.",
 "Quickening":"Combat speed/attack support.","Time Drag":"Attempts to slow a foe.","Binding Word":"Attempts to hold a foe.","Missile Ward":"Protection from ordinary missiles.",
 "Sacred Guard":"Protective divine ward.","Steady Heart":"Removes fear.","Winter Ward":"Protection against cold.","Sacred Binding":"Attempts to hold a foe.","Flame Ward":"Protection against fire.",

 "Arcane Bolt":"Direct arcane damage.","Ember Lance":"Focused fire damage.","Storm Shard":"Lightning damage.","Flame Sphere":"Area-style fire damage.",
 "Frost Spear":"Cold damage.","Thunder Chain":"Electrical damage.","Violet Ray":"Arcane damage.","Starfall":"Heavy arcane damage.",
 "Star Arrow":"Ranged magical damage.","Thorn Spark":"Nature-infused damage.","Moonfire":"Lunar magical damage.","Wildfire Burst":"Fire damage.",
 "Silver Briar":"Nature damage.","Sun Shaft":"Radiant damage.","Green Comet":"Heavy nature damage.","Wrath of the Grove":"Heavy nature damage.",
 "Mending Light":"Restores HP.","Battle Blessing":"Combat support buff.","Guardian Prayer":"Defensive support buff.","Greater Mending":"Restores more HP.",
 "Warding Light":"Defensive support.","War Prayer":"Combat support.","Restoring Grace":"Healing support.","Saint's Aegis":"Strong defensive support."
};
function classHasSkills(){return ["Thief","Elf","Dwarf","Arcanist"].includes(h?.className)}
function renderSkills(){
 let nav=$("#skillsNav");if(nav)nav.classList.toggle("hide",!classHasSkills());
 let box=$("#skillsContent");if(!box||!h)return;
 let out=[];
 if(h.className==="Thief"){
  let a=thiefAbilities();
  for(const k of Object.keys(SKILL_LABELS))out.push(`<div class=skillCard><span class=skillPct>${a[k]}%</span><b>${SKILL_LABELS[k]}</b><span class=small>RC progression; no points to allocate.</span></div>`);
  out.push(`<div class=skillCard><b>Backstab</b><span class=small>+4 attack; ×2 damage when the backstab conditions are met.</span></div>`);
  if(h.level>=4)out.push(`<div class=skillCard><b>Read Languages</b><span class=small>80% chance.</span></div>`);
  if(h.level>=10)out.push(`<div class=skillCard><b>Magic-user Scrolls</b><span class=small>Can attempt scroll use; 10% backfire chance.</span></div>`);
 }
 for(const [name,desc] of (CLASS_SPECIALS[h.className]||[]))out.push(`<div class=skillCard><b>${name}</b><span class=small>${desc}</span></div>`);
 if(["Arcanist","Elf"].includes(h.className)){
  ensureSpellState();let slots=spellSlotsFor(),list=SPELLS[h.className]||[];
  out.push(`<div class=skillCard><b>Memorized Spells</b><span class=small>Choose the spells prepared for the current daily slots. Rest restores expended memorized spells.</span></div>`);
  for(let sl=1;sl<=slots.length;sl++){
   let cap=slots[sl-1]||0;if(!cap)continue;
   let known=list.filter(s=>s.sl===sl),mem=(h.spells.memorized?.[sl]||[]);
   out.push(`<div class=skillCard><b>Spell Level ${sl} — ${mem.length}/${cap} memorized</b>`+
    known.map(s=>{let copies=mem.filter(id=>id===s.id).length;return `<div class=spellPick><span>${s.name}<br><span class=small>${SPELL_BRIEFS[s.name]||"Spell effect."} · Prepared: ${copies}</span></span><span><button data-mem-add="${s.id}" data-sl="${sl}" ${mem.length>=cap?"disabled":""}>+</button> <button data-mem-remove="${s.id}" data-sl="${sl}" ${copies?"":"disabled"}>−</button></span></div>`}).join("")+`</div>`);
  }
 }
 box.innerHTML=out.join("")||`<div class=small>No class skills or special abilities to manage.</div>`;
 $$("[data-mem-add]").forEach(b=>b.onclick=()=>changeMemorized(b.dataset.memAdd,+b.dataset.sl,1)); $$("[data-mem-remove]").forEach(b=>b.onclick=()=>changeMemorized(b.dataset.memRemove,+b.dataset.sl,-1));
}
function changeMemorized(id,sl,delta){
 ensureSpellState();h.spells.memorized=h.spells.memorized||{};let a=h.spells.memorized[sl]||[],cap=spellSlotsFor()[sl-1]||0;
 if(delta>0&&a.length<cap)a.push(id);
 if(delta<0){let i=a.lastIndexOf(id);if(i>=0)a.splice(i,1)}
 h.spells.memorized[sl]=a;
 h.spells.spentMem=(h.spells.spentMem||[]).filter(k=>!k.startsWith(sl+":"));
 save();renderSkills();
}
function pickEvent(){
 let pools={Fighter:FIGHTER_EVENTS,Cleric:CLERIC_EVENTS,Arcanist:ARCANIST_EVENTS,Thief:THIEF_EVENTS,Elf:ELF_EVENTS,Dwarf:DWARF_EVENTS};
 let source=pools[h.className]||FIGHTER_EVENTS,used=new Set((h.trip.journal||[]).map(x=>x.id));
 let available=source.filter(e=>!used.has(e.id));if(!available.length)available=source;
 let roll=d(100),wanted=roll<=40?"Encounter":roll<=60?"Decision":roll<=80?"Discovery":"Quiet";
 let typed=available.filter(e=>e.type===wanted);let pool=typed.length?typed:available;
 return pool[d(pool.length)-1]
}
function clericWisCheck(difficulty="Normal"){
 let adj=difficulty==="Easy"?4:difficulty==="Hard"?-4:0,target=Math.max(1,Math.min(19,h.stats.WIS+adj)),roll=d(20);
 return{roll,target,success:roll<=target}
}
function applyEventChoice(ev,ch){
 let resumeAfter=h.pendingEvent===ev;
 if(ch?.result==="clericTurn"){resolveTurnUndead(ev);return}
 if(ch?.result==="combat"&&ev?.id?.startsWith("CLE-")&&ev.type==="Encounter"){startClericUndeadFight(ev);return}
 if(ch?.result==="clericWis"){
   let test=clericWisCheck(ch.difficulty||"Normal"),baseXP=test.success?(ch.xp||0):0,xp=baseXP?awardXP(baseXP):0;
   let outcome=test.success?"SUCCESS":"FAILURE";
   journal({id:ev.id,type:ev.type,title:ev.title,text:ev.text,choice:ch.label,result:outcome,xp,coins:[0,0,0],ability:"WIS",roll:test.roll,target:test.target});
   addlog(`${ev.title}: ${ch.label} — ${outcome} (WIS ${test.roll} / ${test.target}).${xp?` +${xp} XP.`:""}`);
   h.pendingEvent=null;endTripPause();save();renderPendingEvent();if(resumeAfter)tick();return
 }
 if(ch?.result==="classAbility"){
   let adj=ch.difficulty==="Easy"?4:ch.difficulty==="Hard"?-4:0,ability=ch.ability||"WIS";
   let target=Math.max(1,Math.min(19,(h.stats[ability]||9)+adj)),roll=d(20),success=roll<=target,baseXP=success?(ch.xp||0):0,xp=baseXP?awardXP(baseXP):0;
   let outcome=success?"SUCCESS":"FAILURE";
   journal({id:ev.id,type:ev.type,title:ev.title,text:ev.text,choice:ch.label,result:outcome,xp,coins:[0,0,0],ability,roll,target});
   addlog(`${ev.title}: ${ch.label} — ${outcome} (${ability} ${roll} / ${target}).${xp?` +${xp} XP.`:""}`);
   h.pendingEvent=null;endTripPause();save();renderPendingEvent();if(resumeAfter)tick();return
 }
 if(ch?.result==="thiefSkill"){
   let test=thiefSkillCheck(ch.skill),baseXP=test.success?(ch.xp||0):0,xp=baseXP?awardXP(baseXP):0;
   let outcome=test.success?"SUCCESS":"FAILURE";
   journal({id:ev.id,type:ev.type,title:ev.title,text:ev.text,choice:ch.label,result:outcome,xp,coins:[0,0,0],skill:ch.skill,roll:test.roll,chance:test.chance});
   addlog(`${ev.title}: ${ch.label} — ${outcome} (${test.roll} / ${test.chance}%).${xp?` +${xp} XP.`:""}`);
   h.pendingEvent=null;endTripPause();save();renderPendingEvent();if(resumeAfter)tick();return
 }
 let baseXP=ch?.xp??ev.xp??0,xp=baseXP?awardXP(baseXP):0,coin=ch?.coins??ev.coins??[0,0,0];
 if(coin)addCoins(coin[0]||0,coin[1]||0,coin[2]||0)
 let result=ch?.result||"observed";
 journal({id:ev.id,type:ev.type,title:ev.title,text:ev.text,choice:ch?.label||null,result,xp,coins:coin});
 addlog(`${ev.title}: ${ch?.label?ch.label+". ":""}${xp?`+${xp} XP. `:""}${coin&&(coin[0]||coin[1]||coin[2])?`${coin[0]||0} GP, ${coin[1]||0} SP, ${coin[2]||0} CP.`:""}`);
 if(result==="combat"){h.pendingEvent=null;save();if(h.trip?.mode==="auto")autonomousCombat(false);else makeCombat();return}
 h.pendingEvent=null;endTripPause();save();renderPendingEvent();if(resumeAfter)tick()
}
function autonomousChoice(ev){
 let choices=ev?.choices||[];if(!choices.length)return null;
 let target=Math.max(1,Math.min(19,h.stats?.WIS||9)),roll=d(20),success=roll<=target,choice;
 if(!success)choice=choices[d(choices.length)-1];
 else if(choices.some(x=>x.result==="clericTurn"))choice=choices.find(x=>x.result==="clericTurn");
 else if((h.trip?.risk||"Normal")==="Cautious"){
   let safe=/avoid|withdraw|leave|move on|keep moving|detour|wait|back away|go around|stay high|ignore|extinguish/i;
   choice=choices.find(x=>["avoid","avoided","safe","left"].includes(x.result)||safe.test(x.label||""));
   if(!choice&&h.className==="Thief")choice=choices.find(x=>x.result==="thiefSkill");
   choice=choice||choices[choices.length-1]
 }else choice=choices[0];
 addlog(`Autonomous judgment: WIS ${roll}/${target} — ${success?"success":"failure"}; chooses ${choice.label}.`);
 return choice
}
function event(){
 if(!h||!h.trip||h.combat||h.pendingEvent)return;
 let ev=pickEvent();
 if(ev.choices.length&&h.trip.mode==="present"){beginTripPause();h.pendingEvent=ev;renderPendingEvent();save();return}
 if(ev.choices.length){applyEventChoice(ev,autonomousChoice(ev));return}
 applyEventChoice(ev,null)
}
function renderPendingEvent(){
 let box=$("#eventChoice");if(!box)return;
 let ev=h?.pendingEvent;if(!ev){box.classList.add("hide");box.innerHTML="";return}
 box.classList.remove("hide");box.innerHTML=`<div class=eventCard><div class=eyebrow>${ev.type}</div><h3>${ev.title}</h3><p>${ev.text}</p><div class=eventButtons>${ev.choices.map((c,i)=>`<button data-choice="${i}">${c.label}</button>`).join("")}</div></div>`;
 $$("[data-choice]").forEach(b=>b.onclick=()=>applyEventChoice(ev,ev.choices[+b.dataset.choice]))
}
function buildAdventureReport(){
 let j=h?.trip?.journal||[];if(!j.length)return "Nothing noteworthy happened on this journey.";
 return j.map((e,i)=>`${i+1}. ${e.title} — ${e.choice?e.choice+": ":""}${e.xp?`+${e.xp} XP; `:""}${e.coins&&(e.coins[0]||e.coins[1]||e.coins[2])?`${e.coins[0]} GP, ${e.coins[1]} SP, ${e.coins[2]} CP. `:""}${e.text}`).join("\n")
}
function returnEarly(msg="You decide to return early."){
 if(!h.trip)return;let rb=$("#recall");if(rb){rb.disabled=true;rb.textContent="Returning…"}
 addlog(msg);endTripPause();let now=Date.now(),away=Math.max(0,now-h.trip.start);
 h.trip.midBossDone=true;
 if(h.trip.mission)h.trip.mission.resolved=true;
 h.pendingEvent=null;
 h.trip.half=now;h.trip.end=now+Math.max(5000,away);
 save();page("depart");refresh();tick()
}
$("#start").onclick=begin;$("#recall").onclick=()=>returnEarly();
renderClasses();renderAv();rerollAll();
$("#attackBtn").onclick=resolveAttack;$("#potionBtn").onclick=usePotionCombat;$("#retreatBtn").onclick=retreatCombat;

// Persistent save bootstrap
(function loadPersistentCharacter(){
 try{
  const raw=localStorage.getItem("averathia-v041");
  if(!raw)return;
  const saved=JSON.parse(raw);
  if(!saved||!saved.name||!saved.className)return;
  h=saved;
  if(h.gp==null)h.gp=Number(h.gold)||0;if(h.sp==null)h.sp=0;if(h.cp==null)h.cp=0;setWalletCP(walletCP());
  chosenClass=h.className||h.mechanicsClass||"Fighter";
  sex=h.sex||"Male"; avatar=Number.isInteger(h.avatar)?h.avatar:0;
  $("#create").classList.add("hide");
  $("#game").classList.remove("hide");
  ensureWorldClock();
  if(h.deadUntil&&Date.now()<h.deadUntil){renderDeathPage();return}
  if(h.combat){page("combat");renderCombat();return}
  if(h.trip){page("depart");refresh();tick();return}
  page("town");refresh();
 }catch(err){console.error("Could not restore Averathia save",err)}
})();

// v1.0.8 PWA bootstrap
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(err=>console.warn("Service worker registration failed",err)))}
