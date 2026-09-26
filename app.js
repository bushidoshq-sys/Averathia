const AV_AVERATHIA_SPELL_AUDIT={"Arcanist/Elf":{"1":{"NOW":["Magic Missile","Shield","Sleep","Light"],"LATER":["Charm Person","Detect Magic","Floating Disc","Hold Portal","Read Languages","Read Magic","Ventriloquism"],"NO":[]},"2":{"NOW":["Mirror Image","Web"],"LATER":["Continual Light","Detect Evil","Detect Invisible","ESP","Invisibility","Knock","Levitate","Locate Object","Wizard Lock"],"NO":[]},"3":{"NOW":["Fireball","Lightning Bolt","Haste","Slow","Hold Person","Protection from Normal Missiles"],"LATER":["Clairvoyance","Create Air","Dispel Magic","Fly","Infravision","Invisibility 10' Radius","Water Breathing"],"NO":[]}},"Cleric":{"1":{"NOW":["Cure Light Wounds","Protection from Evil","Remove Fear","Resist Cold"],"LATER":["Detect Evil","Detect Magic","Light","Purify Food and Water"],"NO":[]},"2":{"NOW":["Bless","Hold Person","Resist Fire"],"LATER":["Find Traps","Know Alignment","Silence 15' Radius","Snake Charm","Speak with Animal"],"NO":[]},"3":{"NOW":["Cure Disease","Striking"],"LATER":["Continual Light","Cure Blindness","Dispel Magic","Growth of Animals","Locate Object","Speak with the Dead"],"NO":[]}}};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],d=n=>1+Math.floor(Math.random()*n);
let sex="Male",avatar=0,cs=[],pick=null,h=null,tab="Weapons",inventoryTab="Inventory",mode="present",risk="Normal",mins=1,customDurationActive=false,timer=null,autonomousCombatRunning=false,homeCoinMode="take",homeCoinDenom="gp",homeCoinAmount="";
const classSlug=c=>c.toLowerCase();
function artPath(cls,sx,i,kind="full"){return `${classSlug(cls)}_${sx.toLowerCase()}_${i+1}_${kind}.png`;}
const CLASSES=[["Fighter","⚔️","Human"],["Cleric","✦","Human"],["Arcanist","✧","Human"],["Thief","🗝️","Human"],["Elf","🏹","Race-as-class"],["Dwarf","⛏️","Race-as-class"]];
const FN={Male:["Aldric","Edric","Garran","Leofric","Oswin","Roderic","Wulfric","Cedric","Beren","Tobran"],Female:["Alda","Elowen","Mara","Rowena","Isolde","Aveline","Seren","Edith","Brynja","Tamsin"]};
const LN=["Stonefield","Ashford","Blackwood","Thorne","Vale","Ironwood","Hawke","Westmere","Oakheart","Ravenbrook","Greyward","Redfern"];
const SHOP={Weapons:[["Battle Axe",7,"1d8"],["Hand Axe",4,"1d6"],["Short Bow",25,"1d6"],["Long Bow",40,"1d6"],["Light Crossbow",30,"1d6"],["Heavy Crossbow",50,"2d4"],["Club",3,"1d4"],["Throwing Hammer",4,"1d4"],["War Hammer",5,"1d6"],["Mace",5,"1d6"],["Staff",5,"1d6"],["Dagger",3,"1d4"],["Silver Dagger",30,"1d4"],["Halberd",7,"1d10"],["Javelin",1,"1d6"],["Lance",10,"1d10"],["Pike",3,"1d10"],["Polearm",7,"1d10"],["Poleaxe",5,"1d10"],["Spear",3,"1d6"],["Trident",5,"1d6"],["Short Sword",7,"1d6"],["Sword",10,"1d8"],["Bastard Sword (1H)",15,"1d6+1"],["Bastard Sword (2H)",15,"1d8+1"],["Two-Handed Sword",15,"1d10"],["Cestus",5,"1d3"],["Sling",2,"1d4"],],Armor:[["Shield",10,"AC -1"],["Leather Armor",20,"AC 7"],["Scale Mail",30,"AC 6"],["Chain Mail",40,"AC 5"],["Banded Mail",50,"AC 4"],["Plate Mail",60,"AC 3"],["Suit Armor",250,"AC 0"]],Gear:[["Rations — 7 days",5,"7 days food"],["Waterskin",1,"1 quart; reusable"],["Torch",0.2,"1 hour light"],["6 Torches",1,"6 hours light"],["Lantern",10,""],["Oil Flask",2,"4 hours lantern fuel"],["Backpack",5,"Required for Journey · carries all non-worn gear"],["50-foot Rope",1,""],["Tinder Box",3,""],["Grappling Hook",25,""],["Garlic",5,""],["Hammer",2,"Small hammer"],["Holy Water",25,"1d8 vs undead · 10/30/50 ft"],["Iron Spike",0.1,"One spike"],["12 Iron Spikes",1,"Twelve spikes"],["Steel Mirror",5,""],["10-foot Pole",1,"Wooden pole"],["Belt Pouch",0.5,"Protects against theft"],["Quiver",1,"For arrows or quarrels"],["Small Sack",1,"Suitable small container"],["Large Sack",2,"Suitable large container"],["3 Stakes + Mallet",3,""],["Wine — 1 quart",1,"Wineskin not included"],["Wolfsbane",10,""],["Arrows — 20",5,"20 arrows"],["Quarrels — 30",10,"30 crossbow bolts"],["Sling Stones — 30",1,"30 sling stones"],["Healing Potion",10,"1D6+1 HP"]],Clothing:[["Belt",0.2,"Belt"],["Plain Boots",1,"Plain boots"],["Riding Boots",5,"Riding / swash-topped boots"],["Short Cloak",0.5,"Short cloak"],["Long Cloak",1,"Long cloak"],["Plain Clothes",0.5,"Plain clothes"],["Middle-Class Clothes",5,"Middle-class clothes"],["Fine Clothes",20,"Fine clothes"],["Extravagant Clothes",50,"Extravagant clothes"],["Hat or Cap",0.2,"Standard headgear"],["Shoes",0.5,"Shoes"]]};
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
function chibiHTML(sx,i,big=false){let key=`avatar-art-${classSlug(chosenClass)}-${sx.toLowerCase()}-${i+1}`;return `<img class="avatarArt ${key}" src="${artPath(chosenClass,sx,i,"full")}" alt="${sx} ${chosenClass} ${i+1}">`}
function spriteHTML(sx,i,cls=chosenClass){return `<img src="${artPath(cls,sx,i,"sprite")}" alt="">`}
let chosenClass="Fighter";
function removeObsoleteCreationNotes(){document.querySelectorAll("#create p,#create .small").forEach(el=>{let t=String(el.textContent||"").toLowerCase();if(t.includes("fighter")&&(t.includes("only")||t.includes("currently")||t.includes("other class")||t.includes("other classes")))el.remove()})}
function renderClasses(){$("#classList").innerHTML=CLASSES.map(c=>`<button class="classChoice ${c[0]===chosenClass?"on":""}" data-class="${c[0]}"><b>${c[0]}</b></button>`).join("");removeObsoleteCreationNotes();$$("[data-class]").forEach(b=>b.onclick=()=>{chosenClass=b.dataset.class;rerollAll();renderClasses();renderAv()})}
function renderAv(){let grid=$("#avatars");grid.innerHTML=[0,1,2].map((a,i)=>`<button class="avatarBtn ${i===avatar?"on":""}" data-av="${i}" aria-pressed="${i===avatar?"true":"false"}">${chibiHTML(sex,i)}</button>`).join("");grid.onclick=e=>{let b=e.target.closest("[data-av]");if(!b||!grid.contains(b))return;avatar=+b.dataset.av;renderAv()}}
function renderCandidates(){let c=cs[0];if(!c)return;$("#selectionHint").textContent="Want different stats? Press Reroll.";$("#candidates").innerHTML=`<div class="card sel"><b>Rolled Stats</b><div class="stats">${["STR","DEX","CON","INT","WIS","CHA"].map(a=>`<div class="stat">${a}<br><b>${c.stats[a]}</b></div>`).join("")}</div><p>❤️ ${c.hp} HP · 🪙 ${c.gold} gp</p></div>`}
function rerollAll(){cs=[candidate()];pick=0;$("#chooseCharacter").disabled=false;renderCandidates()}
$("#male").onclick=()=>{sex="Male";avatar=0;$("#male").classList.add("on");$("#female").classList.remove("on");renderAv()};
$("#female").onclick=()=>{sex="Female";avatar=0;$("#female").classList.add("on");$("#male").classList.remove("on");renderAv()};
$("#genName").onclick=()=>{$("#charName").value=fullName();renderAv()};
$("#charName").addEventListener("input",renderAv);$("#reroll").onclick=rerollAll;
function starterClothingItems(){return[
 {n:"Basic Canvas Shoes",kind:"clothing",can:false,eq:false,starterClothing:true},
 {n:"Canvas Tunic",kind:"clothing",can:false,eq:false,starterClothing:true},
 {n:"Hemp Rope Belt",kind:"clothing",can:false,eq:false,starterClothing:true}
]}
function addStarterClothing(){
 for(const x of starterClothingItems())if(!h.inv.some(i=>i.n===x.n))h.inv.push(x);
 h.clothingStarterV1=true
}
function addClassStartingItems(){
 const special={Arcanist:["Spellbook"],Elf:["Spellbook"],Cleric:["Holy Symbol"],Thief:["Thief's Tools"]}[chosenClass]||[];
 for(const n of special)h.inv.push({n,kind:"classItem",can:false,eq:false,bound:true,noSell:true});
 const weapon={Fighter:"Sword",Dwarf:"Battle Axe"}[chosenClass];
 if(weapon)h.inv.push({n:weapon,kind:"weapon",can:true,eq:false,bound:true,noSell:true});
 addStarterClothing()
}
$("#chooseCharacter").onclick=()=>{if(!cs[0])return;let c=structuredClone(cs[0]);h={...c,maxhp:c.hp,xp:0,level:1,name:$("#charName").value.trim()||fullName(),sex,avatar,className:chosenClass,mechanicsClass:chosenClass,gp:0,sp:0,cp:0,inv:[],rations:0,water:0,waterCapacity:0,lightStock:{torchMinutes:0,oilMinutes:0,legacyMinutes:0},lightMinutes:0,buffAgeAt:Date.now(),diseases:[],trollWeaknessKnown:false,mummyWeaknessKnown:false,timedConditions:[],timedConditionAgeAt:Date.now(),inn:{name:generateInnName(),checkedIn:false,lastChargedDay:Math.floor(Date.now()/86400000),lastStreetEventDay:Math.floor(Date.now()/86400000),lastStreetEvent:null}};h.gp=c.gold;addClassStartingItems();$("#create").classList.add("hide");$("#game").classList.remove("hide");save();home();page("town")};
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
 else{let gain={Fighter:2,Thief:2,Cleric:1,Arcanist:1,Dwarf:3,Elf:2}[h.className]??1;h.maxhp+=gain;h.hp+=gain;h.lastLevelGain={level:h.level,hp:gain,roll:null,con:0}}
 if(h.trip?.journal){journal({id:`LEVEL-${h.level}`,type:"Progression",title:`Level ${h.level}`,text:`${h.name} reached level ${h.level}.`,result:"levelUp",xp:0,coins:[0,0,0],hpGain:h.lastLevelGain.hp});adventureLog(`${h.name} reached Level ${h.level}. Max HP +${h.lastLevelGain.hp}.`,"Progression")}
 if(PREPARED_CASTERS.has(h.className))ensureSpellState();
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
const JOURNEY_ACTIVE_AT_HOURS=16;
const JOURNEY_SLEEP_AT_HOURS=8;
const JOURNEY_DAY_AT_HOURS=JOURNEY_ACTIVE_AT_HOURS+JOURNEY_SLEEP_AT_HOURS;
function journeyActivityBudgetForRTMinutes(minutes){
 let atHours=Math.max(0,Number(minutes)||0)*AT_RATE/60;
 let fullDays=Math.floor(atHours/JOURNEY_DAY_AT_HOURS),rem=atHours-fullDays*JOURNEY_DAY_AT_HOURS;
 let activeHours=fullDays*JOURNEY_ACTIVE_AT_HOURS+Math.min(rem,JOURNEY_ACTIVE_AT_HOURS);
 let sleepHours=fullDays*JOURNEY_SLEEP_AT_HOURS+Math.max(0,rem-JOURNEY_ACTIVE_AT_HOURS);
 return{atHours,activeHours,sleepHours,days:atHours/24}
}
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
function atDaysForRTMinutes(minutes){return Math.max(0,Number(minutes)||0)*AT_RATE/1440}

const HOME_TIER_NAMES=["None","Room","House","Estate"];
const HOME_TOTAL_PRICE_GP=[0,1000,10000,50000];
const CLASS_HOME_PLACE={Fighter:"Training Yard",Cleric:"Private Shrine",Arcanist:"Private Library",Thief:"Hidden Room",Dwarf:"Workshop",Elf:"Private Grove"};
const RIDING_HORSE_PRICE_GP=75;
const MOUNT_FEED_WEEK_GP=10;
const MOUNT_FEED_PACK_DAYS=7;
const RETAINER_CARRY_BP=1600;
const WISHING_WELL_CHANCE=100;
const INN_PREFIXES=["Golden","Silver","Copper","Red","Blue","Green","Black","White","Laughing","Sleeping"];
const INN_SUFFIXES=["Lion","Stag","Boar","Fox","Hound","Dragon","Crown","Lantern","Tankard","Oak"];
const INN_DAILY_COST_CP=20;
function generateInnName(){return "The "+INN_PREFIXES[d(INN_PREFIXES.length)-1]+" "+INN_SUFFIXES[d(INN_SUFFIXES.length)-1]}
function ensureInnState(obj=h){
 if(!obj)return;
 if(!obj.inn||typeof obj.inn!=="object")obj.inn={};
 if(!obj.inn.name)obj.inn.name=generateInnName();
 if(typeof obj.inn.checkedIn!=="boolean")obj.inn.checkedIn=false;
 obj.inn.lastChargedDay=Math.max(0,Math.trunc(Number(obj.inn.lastChargedDay)||Math.floor(diseaseNowFor(obj)/86400000)));
 if(!Number.isFinite(Number(obj.inn.lastStreetEventDay)))obj.inn.lastStreetEventDay=innCurrentDay(obj);else obj.inn.lastStreetEventDay=Math.max(0,Math.trunc(Number(obj.inn.lastStreetEventDay)));
}
function innCurrentDay(obj=h){return Math.floor(diseaseNowFor(obj)/86400000)}
function processInnLodging(){
 if(!h)return;ensureInnState();if(hasRoom()){h.inn.checkedIn=false;return}
 let day=innCurrentDay();
 if(h.inn.checkedIn){
  let due=Math.max(0,day-h.inn.lastChargedDay);
  while(due>0){
   if(walletCP()<INN_DAILY_COST_CP){h.inn.checkedIn=false;break}
   setWalletCP(walletCP()-INN_DAILY_COST_CP);h.inn.lastChargedDay++;due--;
  }
 }
}
function resolveStreetSleepEvent(){
 ensureInnState();let day=innCurrentDay();if(h.inn.lastStreetEventDay===day)return null;
 h.inn.lastStreetEventDay=day;
 if(d(100)>85){h.inn.lastStreetEvent=null;return null}
 let event={day,type:"Mugging",combat:true,text:"A mugger approaches while you sleep on the street. Combat begins."};
 h.inn.lastStreetEvent=event;return event
}
function checkInInn(){if(!h||hasRoom()||h.trip||h.combat)return false;ensureInnState();if(walletCP()<INN_DAILY_COST_CP)return false;setWalletCP(walletCP()-INN_DAILY_COST_CP);h.inn.checkedIn=true;h.inn.lastChargedDay=innCurrentDay();h.inn.lastStreetEvent=null;save();return true}
function checkOutInn(){if(!h||hasRoom())return false;ensureInnState();h.inn.checkedIn=false;save();return true}
const HOME_COIN_STORAGE=[
 {name:"None",capacity:0},
 {name:"Coin Chest",capacity:10000},
 {name:"Strongbox",capacity:50000},
 {name:"Vault",capacity:250000}
];
function ensureHomeState(obj=h){
 if(!obj)return;
 ensureInnState(obj);
 obj.homeTier=Math.max(0,Math.min(3,Math.trunc(Number(obj.homeTier)||0)));
 obj.homeStorage=Array.isArray(obj.homeStorage)?obj.homeStorage:[];
 obj.homeCoins=obj.homeCoins&&typeof obj.homeCoins==="object"?obj.homeCoins:{};
 obj.homeCoins.gp=Math.max(0,Math.trunc(Number(obj.homeCoins.gp)||0));
 obj.homeCoins.sp=Math.max(0,Math.trunc(Number(obj.homeCoins.sp)||0));
 obj.homeCoins.cp=Math.max(0,Math.trunc(Number(obj.homeCoins.cp)||0));
 for(const x of obj.homeStorage){
  if(!x||x.oreSack)continue;
  let base=x.emptySackName||x.n;
  if(x.coinSack||base==="Small Sack of GP"||base==="Large Sack of GP"){
   if(base==="Small Sack of GP")base="Small Sack";if(base==="Large Sack of GP")base="Large Sack";
   x.emptySackName=base==="Large Sack"?"Large Sack":"Small Sack";x.coinSack=true;x.storedGP=Math.max(0,Math.trunc(Number(x.storedGP)||0));
   let cap=x.emptySackName==="Large Sack"?600:200;x.storedGP=Math.min(cap,x.storedGP);x.bp=(x.emptySackName==="Large Sack"?5:1)+x.storedGP;
   x.n=x.storedGP?x.emptySackName+" of GP":x.emptySackName;x.eventKey=!x.storedGP
  }
 }
 obj.mounts=obj.mounts&&typeof obj.mounts==="object"?obj.mounts:{};
 obj.mounts.horses=Math.max(0,Math.trunc(Number(obj.mounts.horses)||0));
 obj.mounts.feedDays=Math.max(0,Number(obj.mounts.feedDays)||0);
 if(typeof obj.mounts.useOnJourney!=="boolean")obj.mounts.useOnJourney=true;
 obj.retainer=obj.retainer&&typeof obj.retainer==="object"?obj.retainer:{};
 if(typeof obj.retainer.takeOnJourney!=="boolean")obj.retainer.takeOnJourney=true;
 if(typeof obj.retainer.autoRation!=="boolean")obj.retainer.autoRation=true;
 if(typeof obj.retainer.autoWater!=="boolean")obj.retainer.autoWater=true;
 if(typeof obj.retainer.autoFeed!=="boolean")obj.retainer.autoFeed=true;
}
function homeTier(obj=h){ensureHomeState(obj);return obj?obj.homeTier:0}
function homeCoinStorageSpec(obj=h){let t=homeTier(obj);return HOME_COIN_STORAGE[t]||HOME_COIN_STORAGE[0]}
function homeCoinCount(obj=h){ensureHomeState(obj);return Math.max(0,obj?.homeCoins?.gp||0)+Math.max(0,obj?.homeCoins?.sp||0)+Math.max(0,obj?.homeCoins?.cp||0)}
function homeCoinValueCP(obj=h){ensureHomeState(obj);return Math.max(0,obj?.homeCoins?.gp||0)*100+Math.max(0,obj?.homeCoins?.sp||0)*10+Math.max(0,obj?.homeCoins?.cp||0)}
function homeSpendableCP(){return walletCP()+homeCoinValueCP()}
function setHomeCoinValueCP(cp){
 ensureHomeState();cp=Math.max(0,Math.round(Number(cp)||0));
 h.homeCoins.gp=Math.floor(cp/100);h.homeCoins.sp=Math.floor((cp%100)/10);h.homeCoins.cp=cp%10
}
function spendFromWalletAndHome(cp){
 cp=Math.max(0,Math.round(Number(cp)||0));if(homeSpendableCP()<cp)return false;
 let fromWallet=Math.min(walletCP(),cp);setWalletCP(walletCP()-fromWallet);cp-=fromWallet;
 if(cp>0)setHomeCoinValueCP(homeCoinValueCP()-cp);
 return true
}
function homeWalletDenom(k){return Math.max(0,Math.trunc(Number(k==="gp"?(h.gp??h.gold):h[k])||0))}
function setHomeWalletDenom(k,v){v=Math.max(0,Math.trunc(Number(v)||0));if(k==="gp"){h.gp=v;h.gold=v}else h[k]=v}
function homeCoinTransferLimit(direction=homeCoinMode,k=homeCoinDenom){
 ensureHomeState();if(!["gp","sp","cp"].includes(k))k="gp";
 if(direction==="store")return Math.max(0,Math.min(homeWalletDenom(k),homeCoinStorageSpec().capacity-homeCoinCount()));
 let freeBP=Math.max(0,Math.floor(maxCarryBP()-carriedBulkPoints()+1e-9));
 return Math.max(0,Math.min(Math.max(0,Math.trunc(Number(h.homeCoins[k])||0)),freeBP))
}
function homeCoinAmountNumber(){return Math.max(0,Math.trunc(Number(homeCoinAmount)||0))}
function homeCoinSetPreset(kind){
 let max=homeCoinTransferLimit(),v=kind==="all"?max:Math.max(max?1:0,Math.floor(max/2));
 homeCoinAmount=v?String(v):"";renderHome()
}
function homeCoinKey(key){
 if(key==="clear")homeCoinAmount="";
 else if(key==="back")homeCoinAmount=homeCoinAmount.slice(0,-1);
 else if(/^\d$/.test(key)){let next=(homeCoinAmount+key).replace(/^0+(?=\d)/,"");homeCoinAmount=next.slice(0,7)}
 renderHome()
}
function transferHomeCoins(){
 if(!hasRoom()||h.trip||h.combat)return;ensureHomeState();
 let k=homeCoinDenom,ask=homeCoinAmountNumber(),limit=homeCoinTransferLimit(),move=Math.min(ask,limit);
 if(move<1)return;
 if(homeCoinMode==="store"){setHomeWalletDenom(k,homeWalletDenom(k)-move);h.homeCoins[k]+=move}
 else{h.homeCoins[k]-=move;setHomeWalletDenom(k,homeWalletDenom(k)+move)}
 homeCoinAmount="";save()
}
function hasRoom(obj=h){return homeTier(obj)>=1}
function hasHouse(obj=h){return homeTier(obj)>=2}
function hasEstate(obj=h){return homeTier(obj)>=3}
function homePlaceName(obj=h){return CLASS_HOME_PLACE[obj?.className]||"Private Room"}
function retainerSelected(obj=h){ensureHomeState(obj);return !!(hasEstate(obj)&&(obj?.trip?obj.trip.retainer:obj.retainer.takeOnJourney))}
function plannedHorseCount(obj=h){ensureHomeState(obj);if(!hasHouse(obj)||!obj.mounts.useOnJourney||obj.mounts.horses<1)return 0;let need=retainerSelected(obj)?2:1;return obj.mounts.horses>=need?need:0}
function journeyWaterSkinsRequired(ret=retainerSelected()){return 4*(ret?2:1)}
function survivalNeedsForMinutes(minutes){let budget=journeyActivityBudgetForRTMinutes(minutes),days=budget.days,ret=retainerSelected();return{foodDays:days*(ret?2:1),waterSkins:journeyWaterSkinsRequired(ret),mountFeedDays:days*plannedHorseCount(),activeATHours:budget.activeHours,sleepATHours:budget.sleepHours}}
function mountedTravelReady(obj=h,minutes=mins){let used=plannedHorseCount(obj),days=journeyActivityBudgetForRTMinutes(minutes).days;return !!(used&&(obj.mounts.feedDays||0)+1e-9>=days*used)}
function homeUpgradeCostCP(obj=h){let t=homeTier(obj);return t>=3?0:gpToCP(HOME_TOTAL_PRICE_GP[t+1]-HOME_TOTAL_PRICE_GP[t])}
function horseBuyPriceCP(){return Math.round(gpToCP(RIDING_HORSE_PRICE_GP)*(1-chaBuyDiscount()))}
function horseSellPriceCP(){return Math.round(gpToCP(RIDING_HORSE_PRICE_GP)*.5*(1+chaSellBonus()))}
function feedPackPriceCP(){return Math.round(gpToCP(MOUNT_FEED_WEEK_GP)*(1-chaBuyDiscount()))}
function buyHomeUpgrade(){
 if(h.trip||h.combat)return;let t=homeTier();if(t>=3)return;let cost=homeUpgradeCostCP();
 if(homeSpendableCP()<cost){alert("Not enough money for "+HOME_TIER_NAMES[t+1]+".");return}
 spendFromWalletAndHome(cost);h.homeTier=t+1;ensureHomeState();if(hasRoom()&&h.inn)h.inn.checkedIn=false;processTownAutomation();save()
}
function storeAtHome(i){
 if(!hasRoom()||h.trip||h.combat)return;let x=h.inv[i];if(!x)return;if(x.eq)x.eq=false;h.homeStorage.push(x);h.inv.splice(i,1);save()
}
function takeFromHome(i){
 if(!hasRoom()||h.trip||h.combat)return;let x=h.homeStorage[i];if(!x)return;
 if(carriedBulkPoints()+itemBulkPoints(x)>maxCarryBP()+1e-9){alert("Not enough BP to take that item with you.");return}
 h.inv.push(x);h.homeStorage.splice(i,1);save()
}
function gpSackBaseName(x){
 if(!x||x.oreSack)return null;
 let n=x.emptySackName||x.n;
 if(n==="Small Sack of GP")n="Small Sack";if(n==="Large Sack of GP")n="Large Sack";
 return n==="Small Sack"||n==="Large Sack"?n:null
}
function gpSackCapacity(x){let n=gpSackBaseName(x);return n==="Large Sack"?600:n==="Small Sack"?200:0}
function syncGpSack(x){
 let base=gpSackBaseName(x);if(!base)return x;
 let cap=base==="Large Sack"?600:200,stored=Math.max(0,Math.min(cap,Math.trunc(Number(x.storedGP)||0)));
 x.emptySackName=base;x.storedGP=stored;x.coinSack=stored>0;x.n=stored?base+" of GP":base;x.bp=(base==="Large Sack"?5:1)+stored;x.eventKey=!stored;
 if(!stored){delete x.coinSack;delete x.storedGP;delete x.emptySackName;delete x.bp}
 return x
}
function storeGpInHomeSack(i){
 if(!hasRoom()||h.trip||h.combat)return;let x=h.homeStorage[i],cap=gpSackCapacity(x);if(!x||!cap)return;
 let held=Math.max(0,Math.trunc(Number(h.gp??h.gold)||0)),stored=Math.max(0,Math.trunc(Number(x.storedGP)||0)),move=Math.min(held,cap-stored);
 if(move<=0)return;
 h.gp=held-move;h.gold=h.gp;x.emptySackName=gpSackBaseName(x);x.storedGP=stored+move;syncGpSack(x);save()
}
function takeGpFromHomeSack(i){
 if(!hasRoom()||h.trip||h.combat)return;let x=h.homeStorage[i],stored=Math.max(0,Math.trunc(Number(x?.storedGP)||0));if(!x||!stored)return;
 h.gp=Math.max(0,Math.trunc(Number(h.gp??h.gold)||0))+stored;h.gold=h.gp;x.storedGP=0;syncGpSack(x);save()
}
function buyHorse(){
 if(!hasHouse()||h.trip||h.combat)return;let cost=horseBuyPriceCP();if(walletCP()<cost){alert("Not enough money for a Riding Horse.");return}
 setWalletCP(walletCP()-cost);h.mounts.horses++;save()
}
function sellHorse(){
 if(!hasHouse()||h.trip||h.combat||h.mounts.horses<1)return;h.mounts.horses--;setWalletCP(walletCP()+horseSellPriceCP());save()
}
function buyMountFeed(packs=1){
 if(!hasHouse()||h.trip||h.combat)return false;packs=Math.max(1,Math.trunc(packs||1));let cost=feedPackPriceCP()*packs;
 if(walletCP()<cost){alert("Not enough money for Mount Feed.");return false}
 setWalletCP(walletCP()-cost);h.mounts.feedDays+=MOUNT_FEED_PACK_DAYS*packs;save();return true
}
function processTownAutomation(){
 if(!h)return;ensureHomeState();let notes=[];
 if(hasEstate()&&h.retainer.autoWater&&h.waterCapacity>0&&h.water<h.waterCapacity){h.water=h.waterCapacity;notes.push("waterskins refilled")}
 if(hasEstate()&&h.retainer.autoRation&&h.rations<=0){
  let ration=SHOP.Gear.find(function(x){return x[0]==="Rations — 7 days"}),cost=ration?buyPriceCP(ration):gpToCP(5);
  if(walletCP()>=cost){setWalletCP(walletCP()-cost);h.rations+=7;notes.push("rations bought")}
 }
 if(hasEstate()&&h.retainer.autoFeed&&h.mounts.horses>0&&h.mounts.feedDays<=0){
  let unit=feedPackPriceCP(),want=h.mounts.horses,afford=Math.min(want,Math.floor(walletCP()/unit));
  if(afford>0){setWalletCP(walletCP()-unit*afford);h.mounts.feedDays+=MOUNT_FEED_PACK_DAYS*afford;notes.push("mount feed bought")}
 }
 h.townAutomationMsg=notes.length?"Retainer: "+notes.join(", ")+".":"";
}
function fillWaterskinsManual(){
 if(!h)return;ensureHomeState();let msg=$("#wellMsg");
 if(h.waterCapacity<1){if(msg)msg.textContent="You do not own a Waterskin.";return}
 if(h.water>=h.waterCapacity-1e-9){if(msg)msg.textContent="All Waterskins are already full.";return}
 let freeWater=hasHouse()||(!hasRoom()&&h.inn?.checkedIn),cost=freeWater?0:2;if(walletCP()<cost){if(msg)msg.textContent="The well costs 2 CP.";return}
 if(cost)setWalletCP(walletCP()-cost);h.water=h.waterCapacity;let found=d(WISHING_WELL_CHANCE)===1;
 if(found){setWalletCP(walletCP()+100);if(msg)msg.textContent="🪙 Something glitters in the wishing well... +1 GP!"}
 else if(msg)msg.textContent=freeWater?"Waterskins filled — free.":"Waterskins filled — 2 CP.";
 save()
}
function setRetainerFlag(key,value){if(!hasEstate())return;ensureHomeState();h.retainer[key]=!!value;processTownAutomation();save()}
function setMountUse(value){if(!hasHouse())return;ensureHomeState();h.mounts.useOnJourney=!!value;save()}
function renderTown(){
 if(!h)return;ensureHomeState();processInnLodging();let freeWater=hasHouse()||(!hasRoom()&&h.inn?.checkedIn),cost=freeWater?0:2,full=h.water>=h.waterCapacity-1e-9;
 if($("#wellStatus"))$("#wellStatus").textContent=h.waterCapacity?"Water: "+h.water.toFixed(2)+"/"+h.waterCapacity+" skins · "+(freeWater?(hasHouse()?"Free with House":"Free while checked in at "+h.inn.name):"2 CP per refill"):"Buy a Waterskin in the Shop first.";
 if($("#fillWaterskinsBtn")){$("#fillWaterskinsBtn").textContent=freeWater?"Fill Waterskins — FREE":"Fill Waterskins — 2 CP";$("#fillWaterskinsBtn").disabled=h.waterCapacity<1||full||(cost>0&&walletCP()<cost)}
 if($("#wellMsg")&&h.townAutomationMsg)$("#wellMsg").textContent=h.townAutomationMsg;
}
function renderHome(){
 let box=$("#homeContent");if(!box||!h)return;ensureHomeState();let t=homeTier(),next=t<3?HOME_TIER_NAMES[t+1]:null,cost=homeUpgradeCostCP(),out=[];
 processInnLodging();let head='<div class="settingsSection"><h3>'+(t?HOME_TIER_NAMES[t]:(h.inn?.checkedIn?"Lodging at the Inn":"Sleeping on the Street"))+'</h3><p class="small">'+(t?"Permanent property in town.":(h.inn?.checkedIn?("Checked in at "+h.inn.name+" · 2 SP per day · well water is free."):"No paid lodging. Sleeping on the street may trigger one night event, often a mugging attempt."))+'</p>';
 if(next)head+='<button id="buyHomeTier" class="primary">'+(t?"Upgrade to ":"Buy ")+next+" — "+coinTextCP(cost)+'</button>';else head+='<b>Maximum tier: Estate</b>';
 out.push(head+"</div>");
 if(!hasRoom()){
  let streetNote=h.inn?.lastStreetEvent?'<p class="small">Last night: '+h.inn.lastStreetEvent.text+'</p>':'';
  out.push('<div class="settingsSection"><h3>🛏 '+h.inn.name+'</h3><p class="small">'+(h.inn.checkedIn?'You are checked in. No street-night events can occur. The inn well is free to use.':'You are not checked in. If you sleep on the street, at most one night event can occur.')+'</p>'+streetNote+'<div class="row"><button id="innToggleBtn" class="'+(h.inn.checkedIn?'':'primary')+'">'+(h.inn.checkedIn?'Check Out':'Check In — 2 SP/day')+'</button><button id="homeRestBtn" '+(h.restUntil?'disabled':'')+'>Sleep 8 AT hours</button></div></div>');
 }
 if(hasRoom()){
  if(h.lastAdventure)out.push('<div id="lastAdventure" class="settingsSection"><details id="lastAdventureDetails"><summary id="lastAdventureSummary">📖 Journey Log</summary><div id="lastAdventureText"></div></details></div>');
  let stored=h.homeStorage.map(function(x,i){let cap=gpSackCapacity(x),gp=Math.max(0,Math.trunc(Number(x.storedGP)||0)),money=cap?'<div class="small">GP '+gp+'/'+cap+'</div>':'',controls=cap?'<div class="row"><button data-home-gp-store="'+i+'" '+(gp>=cap||Math.trunc(Number(h.gp??h.gold)||0)<1?'disabled':'')+'>Store GP</button><button data-home-gp-take="'+i+'" '+(gp<1?'disabled':'')+'>Take GP</button><button data-home-take="'+i+'">Take Sack</button></div>':'<button data-home-take="'+i+'">Take</button>';return '<div class="item"><span><b>'+x.n+'</b><div class="small">'+formatBP(itemBulkPoints(x))+' BP stored</div>'+money+'</span>'+controls+'</div>'}).join("")||'<div class="small">Nothing stored.</div>';
  let carry=h.inv.map(function(x,i){return '<div class="item"><span><b>'+x.n+'</b><div class="small">'+formatBP(itemBulkPoints(x))+' BP</div></span><button data-home-store="'+i+'">Store</button></div>'}).join("")||'<div class="small">No carried items.</div>';
  let coinStore=homeCoinStorageSpec(),coinCount=homeCoinCount(),den=homeCoinDenom.toUpperCase(),limit=homeCoinTransferLimit(),amount=homeCoinAmountNumber();
  let modeButtons='<div class="homeCoinToggle homeCoinModeToggle"><button data-home-coin-mode="store" class="'+(homeCoinMode==="store"?"on":"")+'">Store</button><button data-home-coin-mode="take" class="'+(homeCoinMode==="take"?"on":"")+'">Take</button></div>';
  let denomButtons='<div class="homeCoinToggle homeCoinDenomToggle">'+["gp","sp","cp"].map(k=>'<button data-home-coin-denom="'+k+'" class="'+(homeCoinDenom===k?"on":"")+'">'+k.toUpperCase()+'</button>').join("")+'</div>';
  let keypad='<div class="homeCoinKeypad">'+["1","2","3","4","5","6","7","8","9","clear","0","back"].map(k=>'<button data-home-coin-key="'+k+'">'+(k==="clear"?"C":k==="back"?"⌫":k)+'</button>').join("")+'</div>';
  out.push('<div class="settingsSection"><h3>🛏 Home Rest</h3><p class="small">Rest 8 Averathia hours at home.</p><button id="homeRestBtn" '+(h.restUntil?"disabled":"")+'>Rest</button></div>');
  out.push('<div class="settingsSection homeCoinPanel"><h3>🪙 '+coinStore.name+'</h3><p class="small">Stored coins do not count toward Journey BP.</p><p><b>'+coinCount+' / '+coinStore.capacity+' coins</b></p><div class="small">Chest: '+h.homeCoins.gp+' GP · '+h.homeCoins.sp+' SP · '+h.homeCoins.cp+' CP</div><div class="small">Carried: '+homeWalletDenom("gp")+' GP · '+homeWalletDenom("sp")+' SP · '+homeWalletDenom("cp")+' CP · Free BP '+formatBP(Math.max(0,maxCarryBP()-carriedBulkPoints()))+'</div>'+modeButtons+denomButtons+'<label class="small" for="homeCoinAmountInput">Amount · max '+limit+' '+den+'</label><input id="homeCoinAmountInput" class="homeCoinInput" type="number" min="0" step="1" inputmode="numeric" value="'+(homeCoinAmount||"")+'" placeholder="0">'+keypad+'<div class="homeCoinActions"><button data-home-coin-preset="half" '+(limit<1?"disabled":"")+'>Half</button><button data-home-coin-preset="all" '+(limit<1?"disabled":"")+'>All</button><button id="homeCoinConfirm" class="primary" '+(amount<1||amount>limit?"disabled":"")+'>'+(homeCoinMode==="store"?"Store ":"Take ")+den+'</button></div></div>');
  out.push('<div class="settingsSection"><h3>📦 Home Storage</h3><p class="small">Stored items do not count toward Journey BP. Sacks can still be used for portable GP storage.</p><b>Stored</b>'+stored+'<b>Carried</b>'+carry+'</div>');
 }
 if(hasHouse()){
  out.push('<div class="settingsSection"><h3>'+homePlaceName()+'</h3><p class="small">A private part of the property belonging to your '+h.className+'.</p></div>');
  out.push('<div class="settingsSection"><h3>🐎 Stable</h3><p>Riding Horses: <b>'+h.mounts.horses+'</b></p><div class="row"><button id="buyHorseBtn">Buy — '+coinTextCP(horseBuyPriceCP())+'</button><button id="sellHorseBtn" '+(h.mounts.horses<1?"disabled":"")+'>Sell — '+coinTextCP(horseSellPriceCP())+'</button></div><p>Mount Feed reserve: <b>'+h.mounts.feedDays.toFixed(2)+' horse-days</b></p><button id="buyFeedBtn">Mount Feed — 7 days · '+coinTextCP(feedPackPriceCP())+'</button><label class="skillCard"><input id="useMountToggle" type="checkbox" '+(h.mounts.useOnJourney?"checked":"")+'> Use horse on Journeys</label></div>');
 }
 box.innerHTML=out.join("");
 if(hasRoom()&&h.lastAdventure&&$("#lastAdventureText")){$("#lastAdventureText").textContent=h.lastAdventure;if($("#lastAdventureSummary"))$("#lastAdventureSummary").textContent="📖 "+(h.lastAdventureTitle||"Journey Log")}
 if($("#buyHomeTier"))$("#buyHomeTier").onclick=buyHomeUpgrade;if($("#homeRestBtn"))$("#homeRestBtn").onclick=startLongRest;if($("#innToggleBtn"))$("#innToggleBtn").onclick=()=>{if(h.inn?.checkedIn)checkOutInn();else checkInInn();renderHome();renderTown()};
 document.querySelectorAll("[data-home-coin-mode]").forEach(b=>b.onclick=()=>{homeCoinMode=b.dataset.homeCoinMode;homeCoinAmount="";renderHome()});
 document.querySelectorAll("[data-home-coin-denom]").forEach(b=>b.onclick=()=>{homeCoinDenom=b.dataset.homeCoinDenom;homeCoinAmount="";renderHome()});
 document.querySelectorAll("[data-home-coin-key]").forEach(b=>b.onclick=()=>homeCoinKey(b.dataset.homeCoinKey));
 document.querySelectorAll("[data-home-coin-preset]").forEach(b=>b.onclick=()=>homeCoinSetPreset(b.dataset.homeCoinPreset));
 if($("#homeCoinAmountInput"))$("#homeCoinAmountInput").oninput=e=>{homeCoinAmount=String(Math.max(0,Math.trunc(Number(e.target.value)||0))).slice(0,7);let b=$("#homeCoinConfirm"),v=homeCoinAmountNumber(),lim=homeCoinTransferLimit();if(b)b.disabled=v<1||v>lim};
 if($("#homeCoinConfirm"))$("#homeCoinConfirm").onclick=transferHomeCoins;
 document.querySelectorAll("[data-home-store]").forEach(function(b){b.onclick=function(){storeAtHome(+b.dataset.homeStore)}});document.querySelectorAll("[data-home-take]").forEach(function(b){b.onclick=function(){takeFromHome(+b.dataset.homeTake)}});document.querySelectorAll("[data-home-gp-store]").forEach(function(b){b.onclick=function(){storeGpInHomeSack(+b.dataset.homeGpStore)}});document.querySelectorAll("[data-home-gp-take]").forEach(function(b){b.onclick=function(){takeGpFromHomeSack(+b.dataset.homeGpTake)}});
 if($("#buyHorseBtn"))$("#buyHorseBtn").onclick=buyHorse;if($("#sellHorseBtn"))$("#sellHorseBtn").onclick=sellHorse;if($("#buyFeedBtn"))$("#buyFeedBtn").onclick=function(){buyMountFeed(1)};
 if($("#useMountToggle"))$("#useMountToggle").onchange=function(e){setMountUse(e.target.checked)};
}
function renderRetainer(){
 let nav=$("#retainerNav"),box=$("#retainerContent");if(nav)nav.classList.toggle("hide",!hasEstate());if(!box||!h)return;if(!hasEstate()){box.innerHTML="";return}ensureHomeState();
 box.innerHTML='<div class="settingsSection"><p>Your Retainer is your private servant and can travel with you, adding <b>'+RETAINER_CARRY_BP+' BP</b> to party carrying capacity.</p><label class="skillCard"><input id="retTake" type="checkbox" '+(h.retainer.takeOnJourney?"checked":"")+'> Take Retainer on Journey</label><label class="skillCard"><input id="retRation" type="checkbox" '+(h.retainer.autoRation?"checked":"")+'> Auto-buy rations when empty</label><label class="skillCard"><input id="retWater" type="checkbox" '+(h.retainer.autoWater?"checked":"")+'> Auto-refill Waterskins in town</label><label class="skillCard"><input id="retFeed" type="checkbox" '+(h.retainer.autoFeed?"checked":"")+'> Auto-buy Mount Feed when empty</label><p class="small">Automatic purchases use your money. A Retainer on a Journey also consumes food. Mounted travel with the Retainer requires two horses.</p></div>';
 [["retTake","takeOnJourney"],["retRation","autoRation"],["retWater","autoWater"],["retFeed","autoFeed"]].forEach(function(pair){$("#"+pair[0]).onchange=function(e){setRetainerFlag(pair[1],e.target.checked)}})
}
function renderJourneySupport(){
 let box=$("#journeySupport");if(!box||!h)return;ensureHomeState();let r=retainerSelected(),needed=r?2:1,horseAttempt=hasHouse()&&h.mounts.useOnJourney,horseOkay=horseAttempt&&h.mounts.horses>=needed,mounted=mountedTravelReady(),days=atDaysForRTMinutes(mins),feedNeed=horseOkay?days*needed:0,bits=[];
 if(hasEstate())bits.push("Retainer: <b>"+(r?"ON":"OFF")+"</b> · party carry "+formatBP(maxCarryBP())+" BP");
 if(hasHouse()){bits.push("Horse: <b>"+(h.mounts.useOnJourney?"ON":"OFF")+"</b> · owned "+h.mounts.horses);if(horseAttempt&&!horseOkay)bits.push("⚠ Need "+needed+" horse"+(needed===1?"":"s")+" for mounted travel");else if(horseAttempt)bits.push("Feed needed: "+feedNeed.toFixed(3)+" horse-days · "+(mounted?"ready":"NOT ENOUGH FEED"))}
 box.innerHTML=bits.length?'<div class="settingsSection"><b>Journey Support</b><p class="small">'+bits.join("<br>")+"</p></div>":"";
}

function startLongRest(){
 if(h.trip||h.combat||h.deadUntil)return false;
 ensureInnState();
 h.restLocation=hasRoom()?"home":(h.inn.checkedIn?"inn":"street");
 h.restUntil=Date.now()+realMsForATHours(8);save();return true
}
function cureDiseaseCostGP(level=h?.level||1){level=Math.max(1,Math.trunc(Number(level)||1));return 10*level*(level+1)}
function curePoisonCostGP(level=h?.level||1){level=Math.max(1,Math.trunc(Number(level)||1));return 5*level*(level+1)}
function diseaseNowFor(obj=h){
 if(obj===h)return averathiaNow();
 let wc=obj?.worldClock;if(wc&&Number.isFinite(Number(wc.atAnchor))&&Number.isFinite(Number(wc.realAnchor)))return Number(wc.atAnchor)+(Date.now()-Number(wc.realAnchor))*AT_RATE;
 return Date.now()
}
function syncDiseaseCondition(obj=h){
 if(!obj)return;obj.conditions=Array.isArray(obj.conditions)?obj.conditions:[];
 obj.conditions=obj.conditions.filter(x=>x!=="Diseased");if(Array.isArray(obj.diseases)&&obj.diseases.some(x=>x?.type!=="centipede"))obj.conditions.push("Diseased")
}
function ensureDiseases(obj=h){
 if(!obj)return[];obj.diseases=Array.isArray(obj.diseases)?obj.diseases:[];
 if(obj.mummyDisease&&!obj.diseases.some(x=>x.type==="mummy"))obj.diseases.push({id:`legacy-tomb-rot-${Date.now()}`,type:"mummy",name:"Tomb Rot",source:"Mummy",contractedAtAT:diseaseNowFor(obj),magicalHealingBlocked:true,naturalHealingMultiplier:.1});
 obj.mummyDisease=obj.diseases.some(x=>x.type==="mummy");syncDiseaseCondition(obj);return obj.diseases
}
function hasDisease(){return ensureDiseases().some(x=>x?.type!=="centipede")}
function hasCurableDisease(){return ensureDiseases().some(x=>x?.type!=="centipede")}
function activePoisonTimedConditions(){return ensureTimedConditions().filter(x=>(Number(x.rounds)||0)>0&&(x.type==="lethalSpiderPoison"||x.type==="tarantellaDance"))}
function activePoisonDiseases(){return ensureDiseases().filter(x=>x?.type==="centipede")}
function hasActivePoison(){return activePoisonDiseases().length>0||activePoisonTimedConditions().length>0}
function mummyDiseaseActive(){return ensureDiseases().some(x=>x.type==="mummy")}
function magicalHealingBlockedByDisease(){return ensureDiseases().some(x=>x.magicalHealingBlocked)}
function diseaseNaturalHealingMultiplier(){let m=1;for(const x of ensureDiseases())if(Number.isFinite(Number(x.naturalHealingMultiplier)))m=Math.min(m,Number(x.naturalHealingMultiplier));return m}
function diseaseBedRestUntilAT(){return ensureDiseases().reduce((m,x)=>Math.max(m,Number(x.bedRestUntilAT)||0),0)}
function diseaseActivityBlockedUntilAT(){return ensureDiseases().reduce((m,x)=>Math.max(m,Number(x.activityBlockedUntilAT)||0),0)}
function journeyBlockingCondition(){let now=averathiaNow();return ensureDiseases().find(x=>(Number(x.bedRestUntilAT)||0)>now||(Number(x.activityBlockedUntilAT)||0)>now)||null}
function diseaseJourneyBlocked(){return Math.max(diseaseBedRestUntilAT(),diseaseActivityBlockedUntilAT())>averathiaNow()}
function ensureTimedConditions(obj=h){if(!obj)return[];obj.timedConditions=Array.isArray(obj.timedConditions)?obj.timedConditions:[];return obj.timedConditions}
function timedConditionStatusText(){
 return ensureTimedConditions().map(x=>{let turns=Math.max(0,Math.ceil((Number(x.rounds)||0)/AV_ROUNDS_PER_TURN)),bits=[x.name||"Condition",turns?`${turns} turn${turns===1?"":"s"}`:"ending"];if(x.helpless)bits.push("helpless");return bits.join(" · ")}).join(" | ")
}
function timedConditionJourneyBlocked(){return ensureTimedConditions().some(x=>x.blocksJourney&&(Number(x.rounds)||0)>0)}
function timedConditionBlockingName(){return ensureTimedConditions().find(x=>x.blocksJourney&&(Number(x.rounds)||0)>0)?.name||"Current condition"}
function playerTimedAttackModifier(){return ensureTimedConditions().some(x=>x.type==="tarantellaDance"&&(Number(x.rounds)||0)>0)?-4:0}
function enemyTimedAttackBonus(){return ensureTimedConditions().some(x=>x.type==="tarantellaDance"&&(Number(x.rounds)||0)>0)?4:0}
function timedConditionHelpless(){return ensureTimedConditions().some(x=>x.type==="tarantellaDance"&&x.helpless&&(Number(x.rounds)||0)>0)}
function recordLastAdventureFromTrip(trip=h?.trip,opts={}){
 if(!h)return false;
 if(!hasRoom()||!trip){h.lastAdventure=null;h.lastAdventureTitle=null;return false}
 h.lastAdventureTitle=trip?.mission?.title||(opts.ending==="death"?"Failed Journey":"Adventure Tale");
 h.lastAdventure=buildAdventureTale(trip,opts);
 return true
}
function timedConditionDeath(effect){
 h.timedConditions=ensureTimedConditions().filter(x=>x.id!==effect.id);
 if(h.trip){adventureLog("The Journey ends in death.","Summary");adventureLog(`Recall will occur in ${h.level*5} minutes.`,"Home")}recordLastAdventureFromTrip(h.trip,{ending:"death"});recoverThrownWeapons();h.trip=null;h.pendingEvent=null;h.combat=null;h.deadUntil=Date.now()+h.level*5*60000;h.hp=0;
 localStorage.setItem("averathia-v041",JSON.stringify(h));renderDeathPage();return false
}
function addTimedCondition(effect){
 let x={id:effect.id||`${effect.type||"condition"}-${Date.now()}-${d(100000)}`,...effect};ensureTimedConditions().push(x);h.timedConditionAgeAt=Date.now();return x
}
function ageTimedConditionsByRounds(rounds,inCombat=false){
 rounds=Math.max(0,Number(rounds)||0);if(!rounds)return true;
 for(const x of [...ensureTimedConditions()]){
  let before=Math.max(0,Number(x.rounds)||0),used=Math.min(before,rounds);x.rounds=Math.max(0,before-used);x.elapsedRounds=(Number(x.elapsedRounds)||0)+used;
  if(x.type==="tarantellaDance"&&!x.helpless&&x.elapsedRounds>=5*AV_ROUNDS_PER_TURN&&x.rounds>0){
   x.helpless=true;
   if(inCombat&&h.combat){h.combat.paralyzed=true;h.combat.tarantellaHelpless=true;clog(`${h.name} collapses from the Tarantella dance and is helpless.`)}
  }
  if(x.rounds<=0){
   h.timedConditions=ensureTimedConditions().filter(y=>y.id!==x.id);
   if(x.lethalOnExpire){
    if(inCombat&&h.combat)return combatDeath(`${x.name||"Poison"} reaches its lethal end.`);
    return timedConditionDeath(x)
   }
   if(x.type==="tarantellaDance"&&h?.combat?.tarantellaHelpless){h.combat.tarantellaHelpless=false;h.combat.paralyzed=false;h.combat.paralyzedRounds=0;clog(`${h.name}'s forced dance finally ends.`)}
  }
 }
 return true
}
function ageTimedConditionsClock(now=Date.now()){
 if(!h)return true;ensureTimedConditions();now=Number(now)||Date.now();let last=Number(h.timedConditionAgeAt);
 if(!Number.isFinite(last)){h.timedConditionAgeAt=now;return true}
 if(h.combat||h.pendingEvent||h.trip?.pauseStart){h.timedConditionAgeAt=now;return true}
 let dt=Math.max(0,now-last);h.timedConditionAgeAt=now;if(!dt)return true;
 return ageTimedConditionsByRounds(dt*AT_RATE/10000,false)
}
function diseaseSave(){let con=mod(h.stats.CON),sv=savingThrow("Death/Poison",con);return{...sv,conBonus:con}}
function addDisease(dis){
 let ds=ensureDiseases(),existing=ds.find(x=>x.type===dis.type);if(existing)return existing;
 let item={id:dis.id||`${dis.type}-${Date.now()}-${d(100000)}`,contractedAtAT:averathiaNow(),...dis};ds.push(item);h.mummyDisease=ds.some(x=>x.type==="mummy");syncDiseaseCondition();return item
}
function nextDiseaseForCure(){
 let ds=ensureDiseases().filter(x=>x?.type!=="centipede");if(!ds.length)return null;
 return [...ds].sort((a,b)=>(Number(!!b.magicalHealingBlocked)-Number(!!a.magicalHealingBlocked))||(Number(!!b.fatalAtAT)-Number(!!a.fatalAtAT))||(Number(a.contractedAtAT)||0)-(Number(b.contractedAtAT)||0))[0]
}
function cureOneDisease(){let target=nextDiseaseForCure();if(!target)return null;h.diseases=ensureDiseases().filter(x=>x.id!==target.id);h.mummyDisease=h.diseases.some(x=>x.type==="mummy");syncDiseaseCondition();return target}
function nextPoisonForCure(){let timed=activePoisonTimedConditions().sort((a,b)=>(Number(!!b.lethalOnExpire)-Number(!!a.lethalOnExpire))||(Number(a.rounds)||0)-(Number(b.rounds)||0));if(timed.length)return{kind:"timed",effect:timed[0]};let diseases=activePoisonDiseases();return diseases.length?{kind:"disease",effect:diseases[0]}:null}
function cureOnePoison(){let target=nextPoisonForCure();if(!target)return null;if(target.kind==="timed")h.timedConditions=ensureTimedConditions().filter(x=>x.id!==target.effect.id);else h.diseases=ensureDiseases().filter(x=>x.id!==target.effect.id);syncDiseaseCondition();return target.effect}
function diseaseTimeLeftText(until){let ms=Math.max(0,Number(until)-averathiaNow()),hours=ms/3600000;return hours<24?`${Math.max(1,Math.ceil(hours))}h`:`${Math.max(1,Math.ceil(hours/24))}d`}
function diseaseStatusText(){
 let now=averathiaNow();return ensureDiseases().filter(x=>x?.type!=="centipede").map(x=>{let bits=[x.name||"Disease"];if(x.magicalHealingBlocked)bits.push("magical healing blocked");if(Number(x.bedRestUntilAT)>now)bits.push(`bed rest ${diseaseTimeLeftText(x.bedRestUntilAT)}`);if(Number(x.activityBlockedUntilAT)>now)bits.push(`physical activity blocked ${diseaseTimeLeftText(x.activityBlockedUntilAT)}`);return bits.join(" · ")}).join(" | ")
}
function centipedePoisonStatusText(){
 let now=averathiaNow();return activePoisonDiseases().map(x=>{let bits=["Centipede Poison → "+(x.name||"Centipede Sickness")];if(Number(x.activityBlockedUntilAT)>now)bits.push(`physical activity blocked ${diseaseTimeLeftText(x.activityBlockedUntilAT)}`);return bits.join(" · ")}).join(" | ")
}
function journeyBlockingStatusText(){return[diseaseStatusText(),centipedePoisonStatusText()].filter(Boolean).join(" | ")}
function diseaseDeath(dis){
 h.diseases=ensureDiseases().filter(x=>x.id!==dis.id);h.mummyDisease=h.diseases.some(x=>x.type==="mummy");syncDiseaseCondition();
 if(h.trip){adventureLog("The Journey ends in death.","Summary");adventureLog(`Recall will occur in ${h.level*5} minutes.`,"Home")}recordLastAdventureFromTrip(h.trip,{ending:"death"});recoverThrownWeapons();h.trip=null;h.pendingEvent=null;h.combat=null;h.deadUntil=Date.now()+h.level*5*60000;h.hp=0;
 localStorage.setItem("averathia-v041",JSON.stringify(h));renderDeathPage();return true
}
function updateDiseases(){
 if(!h)return false;let now=averathiaNow(),changed=false;
 for(const x of [...ensureDiseases()]){
  if(x.fatalAtAT&&now>=x.fatalAtAT)return diseaseDeath(x);
  if(x.autoRecoverAtAT&&now>=x.autoRecoverAtAT){h.diseases=h.diseases.filter(y=>y.id!==x.id);changed=true}
 }
 if(changed){h.mummyDisease=h.diseases.some(x=>x.type==="mummy");syncDiseaseCondition();localStorage.setItem("averathia-v041",JSON.stringify(h))}
 return false
}
function contractWastingFever(source="Wasting Fever"){
 let sv=diseaseSave();clog(`Wasting Fever save ${sv.roll} vs ${sv.target}${sv.conBonus?` (CON ${sv.conBonus>0?"+":""}${sv.conBonus})`:""}: ${sv.success?"success":"FAIL"}.`);if(sv.success)return false;
 let days=d(6),until=averathiaNow()+days*86400000,fatal=d(4)===1;addDisease({type:"general",name:"Wasting Fever",source,bedRestUntilAT:until,autoRecoverAtAT:fatal?null:until,fatalAtAT:fatal?until:null});
 clog(`Wasting Fever contracted — ${days} day(s) of complete bed rest required.`);return true
}
function contractPlague(e){
 if(d(20)!==1)return false;e.xp=Math.max(Number(e.xp)||0,6);clog(`${e.n} carries Plague.`);
 let sv=diseaseSave();clog(`Plague save ${sv.roll} vs ${sv.target}${sv.conBonus?` (CON ${sv.conBonus>0?"+":""}${sv.conBonus})`:""}: ${sv.success?"success":"FAIL"}.`);if(sv.success)return false;
 let fatal=d(4)===1;if(fatal){let days=d(6),until=averathiaNow()+days*86400000;addDisease({type:"rat",name:"Plague",source:e.n,bedRestUntilAT:until,fatalAtAT:until});clog(`Plague contracted. Bed rest is mandatory.`)}
 else{let until=averathiaNow()+30*86400000;addDisease({type:"rat",name:"Plague",source:e.n,bedRestUntilAT:until,autoRecoverAtAT:until});clog(`Plague contracted — one month of bed rest required.`)}return true
}
function contractTombRot(e){let before=ensureDiseases().some(x=>x.type==="mummy"),x=addDisease({type:"mummy",name:"Tomb Rot",source:e?.n||"Mummy",magicalHealingBlocked:true,naturalHealingMultiplier:.1});clog(before?"Tomb Rot is already present.":`Tomb Rot contracted — magical healing is blocked and natural healing is reduced until Cure Disease.`);return x}
function contractCentipedeSickness(e){
 if(poisonImmuneFor(e)){clog(`Potion of Antidote neutralizes ${e.n} poison.`);return false}
 let p=poisonProtection(),sv=savingThrow("Death/Poison",p.bonus);clog(`Centipede poison save ${sv.roll} vs ${sv.target}: ${sv.success?"success":"FAIL"}.`);if(sv.success)return false;
 let until=averathiaNow()+10*86400000;addDisease({type:"centipede",name:"Centipede Sickness",cause:"Centipede Poison",source:e?.n||"Giant Centipede",activityBlockedUntilAT:until,autoRecoverAtAT:until});
 clog("Centipede Poison causes Centipede Sickness — physical activity is blocked for 10 Averathia days. The Journey must end after this encounter.");return true
}
function updateRest(){
 if(h?.restUntil&&Date.now()>=h.restUntil){
   let sleptAt=h.restLocation||"home";h.restUntil=null;h.restLocation=null;
   let rate=.25*diseaseNaturalHealingMultiplier();h.hp=Math.min(h.maxhp,h.hp+Math.ceil(h.maxhp*rate));resetDailySpells();
   let streetEvent=sleptAt==="street"&&!hasRoom()&&!h.inn?.checkedIn?resolveStreetSleepEvent():null;
   save();
   if(streetEvent?.combat)startStreetMuggingCombat();
   return true
 }return false
}
function save(){if(h){processInnLodging();ensureLightStock();normalizeInventoryOrder();checkLevelUps()}localStorage.setItem("averathia-v041",JSON.stringify(h));refresh()}
const TROPHY_COLLECTIONS={"Arcanist":[["The Violet Codex","Book"],["Atlas of the Hollow Stars","Book"],["The Thirteenth Equation","Book"],["Grimoire of the Glass Moon","Book"],["The Ashen Index","Book"],["Treatise on Silent Doors","Book"]],"Thief":[["The Widow's Ruby","Jewel"],["Emerald of Seven Doors","Jewel"],["The Blackbird Brooch","Jewel"],["Moon-Tear Sapphire","Jewel"],["The Gilded Serpent","Jewel"],["Crownless Diamond","Jewel"]],"Fighter":[["Slayer of the Bridge Ogre","Deed"],["Victor of Blackstone Pass","Deed"],["Defender of Three Wells","Deed"],["Breaker of the Iron Siege","Deed"],["Champion of Raven Ford","Deed"],["The Last Stand at Greywatch","Deed"]],"Cleric":[["Fingerbone of Saint Ordel","Relic"],["Bell of Saint Merra","Relic"],["Ashes of Saint Caldrin","Relic"],["Broken Halo of Saint Vey","Relic"],["Lantern of Saint Edrin","Relic"],["Tear of Saint Alwen","Relic"]],"Dwarf":[["Rune of the First Hearth","Rune"],["Rune of Borun's Exile","Rune"],["Rune of the Seven Sons","Rune"],["Rune of the Deep Anvil","Rune"],["Rune of the Lost Hold","Rune"],["Rune of the Returning Kin","Rune"]],"Elf":[["Silveroak Acorn","Seed"],["Moonwillow Seed","Seed"],["Starbloom Kernel","Seed"],["Heartnut of the Elder Grove","Seed"],["Dawnpine Cone","Seed"],["Whisperleaf Seed","Seed"]]};const TROPHY_TITLES={"Arcanist":"Forbidden Library","Thief":"Crown Jewels","Fighter":"Deeds of Renown","Cleric":"Relics of the Saints","Dwarf":"Ancestral Runes","Elf":"Seeds of the First Wood"};
function trophyDisplayName(obj=h){
 let tier=homeTier(obj);
 return tier>=3?"Trophy Hall":tier===2?"Trophy Cabinet":tier===1?"Trophy Shelf":"Trophies"
}
function ensureTrophies(){if(h&&!Array.isArray(h.trophies))h.trophies=[]}
function unlockTrophy(name){ensureTrophies();if(!h||h.trophies.includes(name))return false;let valid=(TROPHY_COLLECTIONS[h.className]||[]).some(x=>x[0]===name);if(!valid)return false;h.trophies.push(name);save();return true}
function renderTrophies(){let grid=$("#trophyGrid"),intro=$("#trophyIntro"),heading=$("#trophyHeading"),nav=$("#trophyNav");if(!grid||!h)return;ensureTrophies();let display=trophyDisplayName(),list=TROPHY_COLLECTIONS[h.className]||[],got=new Set(h.trophies);if(heading)heading.textContent="🏆 "+display;if(nav)nav.textContent=display;intro.textContent=`${TROPHY_TITLES[h.className]||"Collection"} — ${list.filter(x=>got.has(x[0])).length}/${list.length} discovered`;grid.innerHTML=list.map(([name,kind])=>got.has(name)?`<div class="trophyCard unlocked"><div class=trophyIcon>✦</div><b>${name}</b><span>${kind}</span></div>`:`<div class="trophyCard locked"><div class=trophyIcon>?</div><b>???</b><span>Undiscovered</span></div>`).join("")}

function refresh(){updateNavigationLock();if(h){processInnLodging();ageTimedBuffsClock(Date.now());if(ageTimedConditionsClock(Date.now())===false)return;if(updateDiseases())return}if(h?.deadUntil&&Date.now()<h.deadUntil){renderDeathPage();return}renderTrophies();if(h)renderSkills();renderPendingEvent();if(!h)return;updateRest();
 if(h.deadUntil&&Date.now()>=h.deadUntil){h.deadUntil=null;h.hp=Math.max(1,h.maxhp);h.trip=null;h.combat=null;vibrateJourneyReturn();save();page("town");return}
 if($("#worldClock"))$("#worldClock").textContent=atClockText();
 if($("#longRestBtn")){$("#longRestBtn").disabled=!!h.restUntil||!!h.deadUntil;$("#longRestBtn").onclick=()=>startLongRest()}if($("#cureDiseaseHealer")){$("#cureDiseaseHealer").textContent=`Cure Disease — ${cureDiseaseCostGP()} gp`;$("#cureDiseaseHealer").disabled=!hasCurableDisease()}if($("#curePoisonHealer")){$("#curePoisonHealer").textContent=`Cure Poison — ${curePoisonCostGP()} gp`;$("#curePoisonHealer").disabled=!hasActivePoison()}
 if($("#restStatus"))$("#restStatus").textContent=h.deadUntil?`Recall: ${Math.ceil((h.deadUntil-Date.now())/60000)} min`:h.restUntil?`Resting: ${Math.max(0,Math.ceil((h.restUntil-Date.now())/60000))} min RT remaining`:"";
 let carry=carriedBulkPoints(),carryMax=maxCarryBP(),backpack=hasBackpack(),overBulk=carry>carryMax+1e-9;
 $("#top").innerHTML=`<div class="topIdentity"><div class="topName">${h.name}</div><div class="topMeta">${characterTopMeta()}</div></div><div class="topVitals">❤️ ${h.hp}/${h.maxhp} &nbsp;&nbsp; ⭐ ${h.xp} XP${h.level<classLevelData().cap?` / ${classLevelData().xp[h.level]}`:" · MAX"}</div><div class="topCoins">${topCoinStatusHTML()}</div><div class="topCarry ${overBulk?"overCarry":""}">🎒 ${formatBP(carry)} / ${formatBP(carryMax)} BP${overBulk?" · OVER CAPACITY":""}</div>${hasDisease()?`<div class="topDisease">🦠 ${diseaseStatusText()}</div>`:""}${activePoisonDiseases().length?`<div class="topDisease">☠️ ${centipedePoisonStatusText()}</div>`:""}${ensureTimedConditions().length?`<div class="topDisease">🕷️ ${timedConditionStatusText()}</div>`:""}`;
 let av=chibiHTML(h.sex,h.avatar,true);$("#townAvatar").innerHTML=$("#sheetAvatar").innerHTML=av;
 let order=["STR","DEX","CON","INT","WIS","CHA"];$("#sheetStats").innerHTML=order.map(k=>`<div class=stat>${k}<br><b>${h.stats[k]}</b></div>`).join("");
 let resourceParts=[`Rations: ${h.rations.toFixed(2)} days`,`Water: ${h.water.toFixed(2)}/${h.waterCapacity} skins`,`Light: ${(totalLightMinutes()/60).toFixed(2)} h`,...visibleAmmoStatus()];
 $("#sheetResources").innerHTML=resourceParts.join(" · ")+`${hasDisease()?`<br>🦠 ${diseaseStatusText()}`:""}${activePoisonDiseases().length?`<br>☠️ ${centipedePoisonStatusText()}`:""}${ensureTimedConditions().length?`<br>🕷️ ${timedConditionStatusText()}`:""}`;sheetInventory();renderShop();renderTown();renderHome();renderRetainer();renderJourneySupport();let needs=survivalNeedsForMinutes(mins),needLight=mins*2/3,diseaseBlocked=diseaseJourneyBlocked(),timedBlocked=timedConditionJourneyBlocked(),bed=diseaseBlocked||timedBlocked,horseAttempt=hasHouse()&&h.mounts.useOnJourney,horseCountOK=!horseAttempt||plannedHorseCount()>0,feedOK=!horseAttempt||!horseCountOK||mountedTravelReady();$("#requirements").innerHTML=`<p>Needed for ${mins} min (${(mins*AT_RATE/60).toFixed(1)} AT h): food ${needs.foodDays.toFixed(3)} days · water ${needs.waterSkins} full skins (refilled during normal travel) · light ${needLight.toFixed(1)} min (2/3 of adventure)${plannedHorseCount()?` · mount feed ${needs.mountFeedDays.toFixed(3)} horse-days`:""}.</p><p>🎒 Carry: ${formatBP(carry)} / ${formatBP(carryMax)} BP · Backpack: ${backpack?"ready":"MISSING"}</p>${!backpack?`<p class="small">A Backpack is required before a Journey can begin.</p>`:""}${overBulk?`<p class="small">Reduce carried BP before beginning a Journey.</p>`:""}${horseAttempt&&!horseCountOK?`<p class="small">🐎 Not enough horses for the selected travelling party.</p>`:""}${horseAttempt&&horseCountOK&&!feedOK?`<p class="small">🐎 Not enough Mount Feed.</p>`:""}${diseaseBlocked?`<p class="small">${hasDisease()?"🦠":"☠️"} ${journeyBlockingStatusText()} — Journey unavailable while recovery is required.</p>`:""}${timedBlocked?`<p class="small">🕷️ ${timedConditionStatusText()} — Journey unavailable while this condition is active.</p>`:""}`;if($("#start"))$("#start").disabled=bed||!backpack||overBulk||(horseAttempt&&(!horseCountOK||!feedOK))}
function renderDeathPage(){if(!h?.deadUntil)return;clearTimeout(timer);$$(".page").forEach(x=>x.classList.add("hide"));let p=$("#death");if(!p)return;p.classList.remove("hide");let left=Math.max(0,h.deadUntil-Date.now()),m=Math.floor(left/60000),s=Math.floor(left/1000)%60;$("#graveName").textContent=h.name;$("#deathCountdown").textContent=`${m}:${String(s).padStart(2,"0")}`;$("#top").innerHTML=`<b>${h.name}</b> — DEAD`;timer=setTimeout(()=>{if(Date.now()>=h.deadUntil){h.deadUntil=null;h.hp=Math.max(1,h.maxhp);h.trip=null;h.combat=null;vibrateJourneyReturn();save();page("town")}else renderDeathPage()},500)}
function updateNavigationLock(){
 let lockedTarget=h?.combat?"combat":h?.trip?"depart":null;
 $$("[data-page]").forEach(b=>{let allowed=!lockedTarget||b.dataset.page===lockedTarget;b.disabled=!allowed;b.classList.toggle("journeyLocked",!allowed)});
}
function page(id){
 if(h?.combat)id="combat";
 else if(h?.trip&&id!=="depart")id="depart";
 if(h?.deadUntil&&Date.now()<h.deadUntil&&id!=="death"&&id!=="settings"){renderDeathPage();return}
 $$(".page").forEach(x=>x.classList.add("hide"));$("#"+id).classList.remove("hide");$$("[data-page]").forEach(x=>x.classList.toggle("on",x.dataset.page===id));updateNavigationLock();if(id!=="settings")refresh()
}
$$("[data-page]").forEach(b=>b.onclick=()=>page(b.dataset.page));$$("[data-go]").forEach(b=>b.onclick=()=>page(b.dataset.go));
function journeyReturnVibrationEnabled(){return localStorage.getItem("averathia-vibrate-journey-return")!=="0"}
function setJourneyReturnVibrationEnabled(on){localStorage.setItem("averathia-vibrate-journey-return",on?"1":"0")}
function vibrateJourneyReturn(){if(!journeyReturnVibrationEnabled()||typeof navigator==="undefined"||typeof navigator.vibrate!=="function")return;try{navigator.vibrate([300,150,300])}catch(e){}}
function home(){if(!h)return;processTownAutomation();save()}
const RANGED_WEAPONS=new Set(["Short Bow","Long Bow","Light Crossbow","Heavy Crossbow","Sling"]);
const THROWN_WEAPONS=new Set(["Hand Axe","Throwing Hammer","Dagger","Silver Dagger","Javelin","Spear","Trident"]);
const EDGED_WEAPONS=new Set(["Battle Axe","Hand Axe","Dagger","Silver Dagger","Halberd","Javelin","Lance","Pike","Polearm","Poleaxe","Spear","Trident","Short Sword","Sword","Bastard Sword (1H)","Bastard Sword (2H)","Two-Handed Sword"]);
const WEAPON_RANGES={
 "Hand Axe":[10,20,30],"Short Bow":[50,100,150],"Long Bow":[70,140,210],
 "Light Crossbow":[60,120,180],"Heavy Crossbow":[80,160,240],"Throwing Hammer":[10,20,30],
 "Dagger":[10,20,30],"Silver Dagger":[10,20,30],"Javelin":[30,60,90],
 "Spear":[20,40,60],"Trident":[10,20,30],"Sling":[40,80,160],"Holy Water":[10,30,50]
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
function weaponCanReach(name,distance=combatDistance()){let r=WEAPON_RANGES[weaponBaseName(name)];return !!r&&distance<=r[2]}
function attackModeFor(itemOrName){
 let item=typeof itemOrName==="object"?itemOrName:null,distance=combatDistance(),base=weaponBaseName(itemOrName),slot=item?.eqSlot||null;
 if(distance<=5){
  if(RANGED_WEAPONS.has(base))return"missile";
  return"melee"
 }
 if(slot==="melee")return"out-of-range";
 if(RANGED_WEAPONS.has(base))return weaponCanReach(base,distance)?"missile":"out-of-range";
 if(THROWN_WEAPONS.has(base))return weaponCanReach(base,distance)?"thrown":"out-of-range";
 return"out-of-range"
}
const TWO_HANDED=new Set(["Staff","Halberd","Pike","Polearm","Poleaxe","Bastard Sword (2H)","Two-Handed Sword","Short Bow","Long Bow","Light Crossbow","Heavy Crossbow"]);
function weaponBaseName(itemOrName){let item=typeof itemOrName==="object"?itemOrName:null,name=item?.baseWeapon||item?.n||String(itemOrName||"");if(!item){let m=/^(.*) \+\d(?:, .*|$)/.exec(name);if(m)name=m[1]}return name}
function isRangedWeapon(itemOrName){return RANGED_WEAPONS.has(weaponBaseName(itemOrName))}
function isThrownWeapon(itemOrName){return THROWN_WEAPONS.has(weaponBaseName(itemOrName))}
function weaponSlotOptions(itemOrName){
 let base=weaponBaseName(itemOrName);
 if(RANGED_WEAPONS.has(base))return["ranged"];
 if(THROWN_WEAPONS.has(base))return["melee","ranged"];
 return["melee"]
}
function itemData(itemOrName){
 let item=typeof itemOrName==="object"?itemOrName:null,name=item?.baseWeapon||item?.baseArmor||item?.n||String(itemOrName||""),bonus=Math.max(0,Number(item?.magicBonus)||0);
 for(const x of SHOP.Weapons)if(x[0]===name)return{damage:x[2],two:TWO_HANDED.has(name),magicBonus:bonus};
 for(const x of SHOP.Armor)if(x[0]===name)return name==="Shield"?{shield:true,acBonus:-(1+bonus),magicBonus:bonus}:{armor:true,ac:+x[2].match(/\d+/)[0]-bonus,magicBonus:bonus};
 return{}
}
function ammoTypeFor(itemOrName){let name=weaponBaseName(itemOrName);if(name==="Short Bow"||name==="Long Bow")return"Arrows";if(name==="Light Crossbow"||name==="Heavy Crossbow")return"Quarrels";if(name==="Sling")return"Sling Stones";return null}
function ammoCount(type){return type?((h.ammo&&h.ammo[type])||0):Infinity}
function spendAmmoFor(name){let type=ammoTypeFor(name);if(!type)return true;h.ammo=h.ammo||{};if(ammoCount(type)<1)return false;h.ammo[type]--;return true}
function equippedWeapons(){
 let all=(h.inv||[]).filter(x=>x.kind==="weapon"&&x.eq);
 return{melee:all.find(x=>x.eqSlot==="melee"),ranged:all.find(x=>x.eqSlot==="ranged")}
}
function activeWeapon(){
 let w=equippedWeapons(),distance=combatDistance();
 if(distance<=5)return w.melee||w.ranged||null;
 if(w.ranged){
  let ammo=ammoTypeFor(w.ranged);
  if(!ammo||ammoCount(ammo)>0)return w.ranged
 }
 return w.melee||null
}
function throwWeaponItem(item){
 if(!item)return;
 item._thrown=true;item._restoreEq=!!item.eq&&!item._autoReadied;item._restoreSlot=item.eqSlot||null;
 item.eq=false;delete item.eqSlot;delete item._autoReadied;
 let next=h.inv.find(x=>x.kind==="weapon"&&weaponBaseName(x)===weaponBaseName(item)&&!x.eq&&!x._thrown);
 if(next&&item._restoreSlot){next.eq=true;next.eqSlot=item._restoreSlot;next._autoReadied=true;clog(`You ready another ${item.n}.`)}
}
function recoverThrownWeapons(){
 let restores=[];
 for(const x of h.inv||[]){
  if(x._thrown){if(x._restoreEq&&x._restoreSlot)restores.push({x,slot:x._restoreSlot});x.eq=false;delete x.eqSlot;delete x._thrown;delete x._restoreEq;delete x._restoreSlot}
  if(x._autoReadied){x.eq=false;delete x.eqSlot;delete x._autoReadied}
 }
 for(const r of restores){let occupied=(h.inv||[]).some(x=>x.kind==="weapon"&&x.eq&&x.eqSlot===r.slot);if(!occupied){r.x.eq=true;r.x.eqSlot=r.slot}}
}
function combatStats(){
 let weapon=activeWeapon(),armor=h.inv.find(x=>x.kind==="armor"&&x.eq),shield=h.inv.find(x=>x.kind==="shield"&&x.eq),wd=weapon?itemData(weapon):{},ad=armor?itemData(armor):{},shieldEffective=!!shield&&!wd.two,sd=shieldEffective?itemData(shield):{},name=weapon?.n||"Unarmed",baseWeapon=weaponBaseName(weapon)||"Unarmed",dexAC=mod(h.stats.DEX);
 return{weapon:name,weaponKey:baseWeapon,weaponItem:weapon,damage:wd.damage||"1d2",magicBonus:wd.magicBonus||0,attackMode:attackModeFor(weapon||baseWeapon),rangeText:weaponRangeText(baseWeapon),armor:armor?.n||"None",shield:shieldEffective?(shield?.n||"None"):"None",dexAC,ac:(ad.ac??9)+(shieldEffective?(sd.acBonus??-1):0)-dexAC}
}
function isInventoryEquipable(x){return !!x?.can&&x?.kind!=="clothing"}
function normalizeInventoryOrder(){
 if(!h||!Array.isArray(h.inv))return;
 h.inv=h.inv.filter(x=>!isResourceSku(x?.n));
 let equip=[],other=[];for(const x of h.inv)(isInventoryEquipable(x)?equip:other).push(x);
 h.inv=[...equip,...other]
}
const RESOURCE_SKUS=new Set(["Rations — 7 days","Waterskin","Torch","6 Torches","Oil Flask","Arrows — 20","Quarrels — 30","Sling Stones — 30"]);
function isResourceSku(name){return RESOURCE_SKUS.has(name)}

const BP_BASE_CAPACITY=1600;
const AV_ARMOR_BP={"Shield":100,"Leather Armor":200,"Scale Mail":300,"Chain Mail":400,"Banded Mail":450,"Plate Mail":500,"Suit Armor":750};
const AV_WEAPON_BP={
 "Battle Axe":60,"Hand Axe":30,"Short Bow":10,"Long Bow":20,"Light Crossbow":40,"Heavy Crossbow":70,
 "Club":50,"Throwing Hammer":25,"War Hammer":50,"Mace":30,"Staff":40,"Dagger":10,"Silver Dagger":10,
 "Halberd":150,"Javelin":20,"Lance":180,"Pike":80,"Polearm":150,"Poleaxe":120,"Spear":30,"Trident":25,
 "Short Sword":30,"Sword":60,"Bastard Sword (1H)":80,"Bastard Sword (2H)":80,"Two-Handed Sword":100,"Cestus":10,"Sling":14
};
const AV_GEAR_BP={
 "Backpack":20,"50-foot Rope":50,"Tinder Box":5,"Grappling Hook":80,"Garlic":1,"Hammer":10,"Holy Water":1,
 "Iron Spike":1,"12 Iron Spikes":5,"Steel Mirror":5,"10-foot Pole":100,"Belt Pouch":2,"Quiver":5,
 "Small Sack":1,"Large Sack":5,"3 Stakes + Mallet":10,"Wine — 1 quart":30,"Wolfsbane":1,"Healing Potion":10,
 "Belt":5,"Plain Boots":10,"Riding Boots":15,"Short Cloak":10,"Long Cloak":15,"Plain Clothes":20,
 "Middle-Class Clothes":20,"Fine Clothes":20,"Extravagant Clothes":30,"Hat or Cap":3,"Shoes":8,
 "Basic Canvas Shoes":8,"Canvas Tunic":20,"Hemp Rope Belt":5,"Holy Symbol":1,"Thief's Tools":10,"Spellbook":200
};
function maxCarryBP(obj=h){let s=Math.max(9,Math.trunc(Number(obj?.stats?.STR)||9)),base=BP_BASE_CAPACITY+(s>=18?300:s>=16?200:s>=13?100:0);return base+(retainerSelected(obj)?RETAINER_CARRY_BP:0)}
function avJewelryBulkPoints(value){value=Math.max(0,Number(value)||0);return value>=20000?50:value>=3000?25:10}
function avMagicBulkPoints(item){
 let cat=item?.avCategory||"",name=String(item?.avItem||item?.n||"");
 if(cat==="potion")return 10;if(cat==="scroll")return 1;if(cat==="ring")return 1;
 if(cat==="wandStaffRod"){if(/^Staff\b/i.test(name))return 40;if(/^Rod\b/i.test(name))return 20;return 10}
 if(/Crystal Ball/i.test(name))return 130;if(/\bBroom\b/i.test(name))return 40;if(/\bBoots\b/i.test(name))return 10;
 if(/\bCloak\b/i.test(name))return 15;if(/Gauntlet/i.test(name))return 20;if(/Girdle/i.test(name))return 10;
 if(/Helm/i.test(name))return 30;if(/Horn/i.test(name))return 30;if(/\bNail\b/i.test(name))return 1;if(/\bEgg\b/i.test(name))return 3;
 return 10
}
function itemBulkPoints(item){
 if(!item)return 0;
 if(Number.isFinite(Number(item.bp)))return Math.max(0,Number(item.bp));
 if(Number.isFinite(Number(item.avEncumbrance)))return Math.max(0,Number(item.avEncumbrance));
 if(item.avGem)return 1;if(item.avJewelry)return avJewelryBulkPoints(item.gpValue);
 let base=item.baseWeapon||item.baseArmor||item.n;
 if(Object.prototype.hasOwnProperty.call(AV_WEAPON_BP,base))return AV_WEAPON_BP[base];
 if(Object.prototype.hasOwnProperty.call(AV_ARMOR_BP,base))return AV_ARMOR_BP[base];
 if(Object.prototype.hasOwnProperty.call(AV_GEAR_BP,base))return AV_GEAR_BP[base];
 if(item.avMagic)return avMagicBulkPoints(item);
 return 0
}
function resourceBulkPoints(obj=h){
 if(!obj)return 0;let ls=ensureLightStock(obj),ammo=obj.ammo||{};
 let food=Math.max(0,Number(obj.rations)||0)*(200/7);
 let water=Math.max(0,Number(obj.waterCapacity)||0)*5+Math.max(0,Number(obj.water)||0)*25;
 let light=Math.max(0,Number(ls.torchMinutes)||0)*(20/60)+Math.max(0,Number(ls.oilMinutes)||0)*(10/240)+Math.max(0,Number(ls.legacyMinutes)||0)*(20/60);
 let missiles=Math.max(0,Number(ammo.Arrows)||0)/2+Math.max(0,Number(ammo.Quarrels)||0)/3+Math.max(0,Number(ammo["Sling Stones"])||0)/5;
 return food+water+light+missiles
}
function coinBulkPoints(obj=h){if(!obj)return 0;return Math.max(0,Math.trunc(Number(obj.gp??obj.gold)||0))+Math.max(0,Math.trunc(Number(obj.sp)||0))+Math.max(0,Math.trunc(Number(obj.cp)||0))}
function carriedBulkPoints(obj=h){if(!obj)return 0;return coinBulkPoints(obj)+resourceBulkPoints(obj)+(Array.isArray(obj.inv)?obj.inv.reduce((s,x)=>s+itemBulkPoints(x),0):0)}
function formatBP(v){v=Math.max(0,Number(v)||0);return Math.abs(v-Math.round(v))<.05?String(Math.round(v)):v.toFixed(1)}
function hasBackpack(obj=h){return !!obj?.inv?.some(x=>x?.n==="Backpack")}
function canCarryAdditionalBP(bp,obj=h){return carriedBulkPoints(obj)+Math.max(0,Number(bp)||0)<=maxCarryBP(obj)+1e-9}
function normalizedCoinCountFromCP(cp){cp=Math.max(0,Math.round(cp));return Math.floor(cp/100)+Math.floor((cp%100)/10)+(cp%10)}
function coinArrayFromCP(cp){cp=Math.max(0,Math.round(cp));return[Math.floor(cp/100),Math.floor((cp%100)/10),cp%10]}
function maxWalletCPWithinCoinCount(maxCp,coinLimit){
 maxCp=Math.max(0,Math.floor(maxCp));coinLimit=Math.max(0,Math.floor(coinLimit));let best=0;
 for(let r=0;r<100;r++){let remainderCP=Math.floor(r/10)+(r%10),g=Math.min(coinLimit-remainderCP,Math.floor((maxCp-r)/100));if(g>=0)best=Math.max(best,g*100+r)}
 return best
}
function creditWalletValueCP(value,respectCarry=!!h?.trip){
 value=Math.max(0,Math.round(Number(value)||0));let before=walletCP();if(!value)return{cpValue:0,leftCP:0};
 if(!respectCarry){setWalletCP(before+value);return{cpValue:value,leftCP:0}}
 let nonCoin=Math.max(0,carriedBulkPoints()-coinBulkPoints()),coinLimit=Math.max(0,Math.floor(maxCarryBP()-nonCoin+1e-9));
 let best=maxWalletCPWithinCoinCount(before+value,coinLimit),accepted=Math.max(0,Math.min(value,best-before));
 setWalletCP(before+accepted);return{cpValue:accepted,leftCP:value-accepted}
}
function shopPurchaseBulkPoints(x,section=tab){
 let n=x?.[0];if(n==="Rations — 7 days")return 200;if(n==="Waterskin")return 30;if(n==="Torch")return 20;if(n==="6 Torches")return 120;
 if(n==="Oil Flask")return 10;if(n==="Arrows — 20")return 10;if(n==="Quarrels — 30")return 10;if(n==="Sling Stones — 30")return 6;
 return itemBulkPoints({n,kind:shopKind(n,section)})
}
function projectedBulkAfterPurchase(x,section=tab){
 let cost=buyPriceCP(x),afterCoins=normalizedCoinCountFromCP(Math.max(0,walletCP()-cost)),nonCoin=Math.max(0,carriedBulkPoints()-coinBulkPoints());
 return nonCoin+afterCoins+shopPurchaseBulkPoints(x,section)
}
function ensureLightStock(obj=h){
 if(!obj)return{torchMinutes:0,oilMinutes:0,legacyMinutes:0};
 if(!obj.lightStock||typeof obj.lightStock!=="object"){obj.lightStock={torchMinutes:0,oilMinutes:0,legacyMinutes:Math.max(0,numOr(obj.lightMinutes,0))}}
 obj.lightStock.torchMinutes=Math.max(0,numOr(obj.lightStock.torchMinutes,0));
 obj.lightStock.oilMinutes=Math.max(0,numOr(obj.lightStock.oilMinutes,0));
 obj.lightStock.legacyMinutes=Math.max(0,numOr(obj.lightStock.legacyMinutes,0));
 obj.lightMinutes=obj.lightStock.torchMinutes+obj.lightStock.oilMinutes+obj.lightStock.legacyMinutes;
 return obj.lightStock
}
function totalLightMinutes(obj=h){ensureLightStock(obj);return Math.max(0,numOr(obj?.lightMinutes,0))}
function addLightStock(kind,minutes,obj=h){let ls=ensureLightStock(obj),k=kind==="oil"?"oilMinutes":kind==="legacy"?"legacyMinutes":"torchMinutes";ls[k]=Math.max(0,ls[k]+numOr(minutes,0));obj.lightMinutes=ls.torchMinutes+ls.oilMinutes+ls.legacyMinutes;return obj.lightMinutes}
function consumeLightMinutes(minutes,obj=h){
 let ls=ensureLightStock(obj),left=Math.max(0,numOr(minutes,0));
 for(const k of ["legacyMinutes","torchMinutes","oilMinutes"]){let use=Math.min(ls[k],left);ls[k]-=use;left-=use;if(left<=1e-9)break}
 obj.lightMinutes=ls.torchMinutes+ls.oilMinutes+ls.legacyMinutes;
 return left<=1e-9
}
function journeyUsableLightMinutes(obj=h){
 let ls=ensureLightStock(obj),hasLantern=!!obj?.inv?.some(x=>x?.n==="Lantern");
 return ls.torchMinutes+ls.legacyMinutes+(hasLantern?ls.oilMinutes:0)
}
function consumeJourneyLight(minutes,obj=h){
 let ls=ensureLightStock(obj),left=Math.max(0,numOr(minutes,0)),hasLantern=!!obj?.inv?.some(x=>x?.n==="Lantern"),usedOil=0,usedTorch=0,usedLegacy=0;
 let order=hasLantern?["oilMinutes","torchMinutes","legacyMinutes"]:["torchMinutes","legacyMinutes"];
 for(const k of order){
  let use=Math.min(ls[k],left);ls[k]-=use;left-=use;
  if(k==="oilMinutes")usedOil+=use;else if(k==="torchMinutes")usedTorch+=use;else usedLegacy+=use;
  if(left<=1e-9)break
 }
 obj.lightMinutes=ls.torchMinutes+ls.oilMinutes+ls.legacyMinutes;
 return{ok:left<=1e-9,source:usedOil>0?"lamp":"torch",usedOil,usedTorch,usedLegacy}
}
function resourceSummaryRows(cls="sheetEquipRow"){
 if(!h)return"";let rows=[],ls=ensureLightStock();
 if(h.rations>0)rows.push(`<div class="${cls}"><span>Rations — ${h.rations.toFixed(2)} days</span><span></span></div>`);
 let water=waterskinSummaryRows();if(water)rows.push(cls==="sheetEquipRow"?water:water.replaceAll("sheetEquipRow",cls));
 if(ls.legacyMinutes>0)rows.push(`<div class="${cls}"><span>Light Reserve — ${(ls.legacyMinutes/60).toFixed(2)} h</span><span></span></div>`);
 if(ls.torchMinutes>0)rows.push(`<div class="${cls}"><span>Torch Light — ${(ls.torchMinutes/60).toFixed(2)} h</span><span></span></div>`);
 if(ls.oilMinutes>0)rows.push(`<div class="${cls}"><span>Lantern Oil — ${(ls.oilMinutes/240).toFixed(2)} flask(s)</span><span></span></div>`);
 for(const [label,key] of [["Arrows","Arrows"],["Quarrels","Quarrels"],["Sling Stones","Sling Stones"]]){let n=ammoCount(key);if(n>0)rows.push(`<div class="${cls}"><span>${label} ×${n}</span><span></span></div>`)}
 return rows.join("")
}
function resourceSellRows(){
 let names=["Rations — 7 days","Waterskin","Torch","6 Torches","Oil Flask","Arrows — 20","Quarrels — 30","Sling Stones — 30"];
 return names.filter(canSellResource).map(n=>{let price=sellPriceCP({n}),d=shopData(n);return `<div class=item><span><b>${n}</b><div class=small>Resource stock · ${d?.[2]||""}</div></span><span>${coinTextCP(price)}</span><button data-sell-resource="${n}">Sell</button></div>`}).join("")
}
function sellResource(name){if(!canSellResource(name))return;let price=sellPriceCP({n:name});removeSoldResource(name);setWalletCP(walletCP()+price);save()}
function waterskinSummaryRows(){
 let cap=Math.max(0,Math.trunc(h?.waterCapacity||0)),water=Math.max(0,Math.min(cap,Number(h?.water)||0));
 let full=Math.min(cap,Math.floor(water+1e-9)),partial=Math.max(0,water-full),used=full+(partial>0.0001?1:0),empty=Math.max(0,cap-used),rows=[];
 if(full)rows.push(`<div class="sheetEquipRow"><span>Full Waterskin ×${full}</span><span></span></div>`);
 if(partial>0.0001)rows.push(`<div class="sheetEquipRow"><span>Half-drunk Waterskin (${partial.toFixed(2)})</span><span></span></div>`);
 if(empty)rows.push(`<div class="sheetEquipRow"><span>Empty Waterskin ×${empty}</span><span></span></div>`);
 return rows.join("")
}
function discardInventoryItem(i){let q=h.inv[i];if(!q||q.kind!=="clothing")return;h.inv.splice(i,1);save()}
function avMagicUseKind(item){
 if(!item?.avMagic)return null;
 if(item.avCategory==="potion"&&item.avItem==="Super-Healing")return"superHeal";
 if(item.avCategory==="potion"&&item.avItem==="Fire Resistance")return"fireResistPotion";
 if(item.avCategory==="potion"&&item.avItem==="Speed")return"speedPotion";
 if(item.avCategory==="potion"&&item.avItem==="Defense")return"defensePotion";
 if(item.avCategory==="potion"&&item.avItem==="Freedom")return"freedomPotion";
 if(item.avCategory==="potion"&&item.avItem==="Antidote")return"antidotePotion";
 if(item.avCategory==="wandStaffRod"&&item.avItem==="Wand of Fireballs")return"wandFireball";
 if(item.avCategory==="wandStaffRod"&&item.avItem==="Wand of Lightning Bolts")return"wandLightning";
 if(item.avCategory==="wandStaffRod"&&item.avItem==="Staff of Healing")return"staffHeal";
 if(item.avCategory==="wandStaffRod"&&item.avItem==="Rod of Health")return"rodHeal";
 return null
}
function avMagicDailyDay(){return Math.floor(averathiaNow()/86400000)}
function avMagicCanClassUse(item){
 let k=avMagicUseKind(item);
 if(k==="wandFireball"||k==="wandLightning")return ["Arcanist","Elf"].includes(h.className);
 if(k==="staffHeal"||k==="rodHeal")return h.className==="Cleric";
 return !!k
}
function avMagicHealReady(item){let k=avMagicUseKind(item);return !["staffHeal","rodHeal"].includes(k)||item.lastRcHealDay!==avMagicDailyDay()}
function avMagicItemStatus(item){
 let k=avMagicUseKind(item),bits=[];
 if(Number.isFinite(Number(item?.charges)))bits.push(`${Math.max(0,Math.trunc(item.charges))} charge${Math.trunc(item.charges)===1?"":"s"}`);
 if(["staffHeal","rodHeal"].includes(k))bits.push(avMagicHealReady(item)?"heal ready":"heal used today");
 if(k&&!avMagicCanClassUse(item))bits.push("class restricted");
 return bits.length?` · ${bits.join(" · ")}`:""
}
function avMagicTownUsable(item){let k=avMagicUseKind(item);return ["superHeal","staffHeal","rodHeal"].includes(k)&&avMagicCanClassUse(item)&&avMagicHealReady(item)&&h.hp<h.maxhp}
function avMagicCombatUsable(item){
 let k=avMagicUseKind(item);if(!k||!avMagicCanClassUse(item))return false;
 if(["wandFireball","wandLightning"].includes(k))return Number(item.charges)>0&&combatDistance()<=240;
 if(["staffHeal","rodHeal"].includes(k))return avMagicHealReady(item)&&h.hp<h.maxhp;
 if(k==="superHeal")return h.hp<h.maxhp;
 if(["fireResistPotion","speedPotion","defensePotion","freedomPotion","antidotePotion"].includes(k))return true;
 return false
}
function resolveRcMagicHeal(item,index,inCombat=false){
 let k=avMagicUseKind(item);if(!["superHeal","staffHeal","rodHeal"].includes(k)||!avMagicCanClassUse(item)||!avMagicHealReady(item))return false;
 if(k==="superHeal")h.inv.splice(index,1);
 if(["staffHeal","rodHeal"].includes(k))item.lastRcHealDay=avMagicDailyDay();
 if(magicalHealingBlockedByDisease()){let msg=`${item.avItem||item.n} is used, but Tomb Rot prevents magical healing.`;inCombat?clog(msg):addlog(msg)}
 else{let heal=k==="superHeal"?d(6)+d(6)+d(6)+3:d(6)+1,before=h.hp;h.hp=Math.min(h.maxhp,h.hp+heal);let msg=`${item.avItem||item.n} restores ${h.hp-before} HP.`;inCombat?clog(msg):addlog(msg)}
 return true
}
function useRcMagicItemTown(index){
 if(h?.trip||h?.combat)return false;let item=h.inv[index];if(!item||!avMagicTownUsable(item))return false;
 if(resolveRcMagicHeal(item,index,false)){save();return true}return false
}
function avMagicFixedDamage(expr="6d6"){let total=0,n=+expr.split("d")[0]||1,sides=+expr.split("d")[1]||6;while(n--)total+=d(sides);return total}
function resolveRcWandAttack(item){
 let k=avMagicUseKind(item),t=h.combat?.enemies?.find(e=>e.id===h.combat.target&&monsterCombatActive(e))||living()[0];
 if(!t||!["wandFireball","wandLightning"].includes(k)||!avMagicCanClassUse(item)||Number(item.charges)<=0||combatDistance()>240)return false;
 item.charges=Math.max(0,Math.trunc(item.charges)-1);
 let targets=k==="wandFireball"?gridlessAreaTargets(t,40):gridlessLineTargets(t),base=avMagicFixedDamage("6d6");
 for(const q of targets){
  let dmg=base,sv=monsterSpellSave(q,"Wands");if(sv.success)dmg=Math.floor(dmg/2);if(q.mummy)dmg=Math.floor(dmg/2);
  applyMonsterDamage(q,dmg,k==="wandFireball"?"fire":"magic");
  clog(`${item.avItem}: ${q.n} save ${sv.roll} vs ${sv.target} [${sv.saveAs||"Averathia"}] — ${sv.success?"success":"FAIL"}; ${dmg} damage.`);
  if(k==="wandFireball"&&q.webbed&&q.hp>0){let burn=d(6);if(q.mummy)burn=Math.floor(burn/2);applyMonsterDamage(q,burn,"fire");q.disabledRounds=Math.min(Math.max(1,q.disabledRounds||2),2);clog(`The burning web deals ${burn} extra fire damage to ${q.n}.`)}
  if(q.hp<=0)resolveMonsterDefeat(q)
 }
 return true
}
function activeRcTimedPotion(){ensureSpellState();return h.spells.buffs.find(b=>b.potionEffect)||null}
function resolveRcTimedPotion(item,index){
 let k=avMagicUseKind(item);if(!["fireResistPotion","speedPotion","defensePotion","freedomPotion","antidotePotion"].includes(k))return false;
 h.inv.splice(index,1);ensureSpellState();
 let active=activeRcTimedPotion();
 if(active){
  h.spells.buffs=h.spells.buffs.filter(b=>!b.potionEffect);
  h.combat.paralyzed=true;h.combat.fearParalyzed=false;h.combat.potionSick=true;h.combat.paralyzedRounds=3*AV_ROUNDS_PER_TURN;
  clog(`Mixing active potions makes ${h.name} violently sick; both potion effects end and ${h.name} cannot act for 3 turns.`);
  return true
 }
 let turns=k==="defensePotion"?1:d(6)+6,rounds=turns*AV_ROUNDS_PER_TURN;
 if(k==="fireResistPotion"){h.spells.buffs.push({av:"Potion of Fire Resistance",potionEffect:true,resist:"fire",saveBonusVs:"fire",damagePerDieReduction:1,normalFireImmune:true,rounds});clog(`Potion of Fire Resistance takes effect for ${turns} turns.`)}
 else if(k==="speedPotion"){h.spells.buffs.push({av:"Potion of Speed",potionEffect:true,speedSource:"potion",rounds});clog(`Potion of Speed takes effect for ${turns} turns.`)}
 else if(k==="defensePotion"){let roll=d(10),bonus=roll<=3?1:roll<=5?2:roll<=7?3:roll<=9?4:5;h.spells.buffs.push({av:"Potion of Defense",potionEffect:true,ac:-bonus,defenseBonus:bonus,rounds});clog(`Potion of Defense grants AC +${bonus} for 1 turn (roll ${roll}).`)}
 else if(k==="freedomPotion"){h.spells.buffs.push({av:"Potion of Freedom",potionEffect:true,immuneParalysis:true,rounds});clog(`Potion of Freedom prevents paralysis for ${turns} turns.`)}
 else{let roll=d(10),limit=roll<=4?3:roll<=7?7:roll<=9?15:Infinity;h.spells.buffs.push({av:"Potion of Antidote",potionEffect:true,poisonSaveBonus:2,poisonHdImmunity:limit,rounds});clog(`Potion of Antidote protects for ${turns} turns: +2 poison saves and immunity to ${Number.isFinite(limit)?`${limit}-HD or weaker poison`:"all poison"}.`)}
 return true
}
function useRcMagicItemCombat(index){
 if(!h?.combat||h.combat.paralyzed)return false;let item=h.inv[index];if(!item||!avMagicCombatUsable(item))return false;
 if(!preemptiveEnemiesAct())return false;
 let k=avMagicUseKind(item),ok=["wandFireball","wandLightning"].includes(k)?resolveRcWandAttack(item):["fireResistPotion","speedPotion","defensePotion","freedomPotion","antidotePotion"].includes(k)?resolveRcTimedPotion(item,index):resolveRcMagicHeal(item,index,true);if(!ok)return false;
 if(!living().length)return finishCombat();
 enemyStrike(e=>!e.alwaysWinInitiative);if(h.combat)advanceCombatRound(h.combat,true);return true
}
function supportedRcMagicItems(){return h.inv.map((item,index)=>({item,index})).filter(x=>avMagicUseKind(x.item))}
function renderMagicItemButton(){
 let b=$("#magicItemBtn"),menu=$("#magicItemMenu");if(!b||!menu||!h?.combat)return;
 let items=supportedRcMagicItems(),usable=items.filter(x=>avMagicCombatUsable(x.item));b.classList.toggle("hide",!items.length);b.disabled=!!h.combat.paralyzed||!usable.length;b.textContent=items.length?`🔮 Magic Item (${usable.length}/${items.length})`:"🔮 Magic Item";
 b.onclick=()=>{menu.innerHTML=items.map(({item,index})=>{let k=avMagicUseKind(item),range=["wandFireball","wandLightning"].includes(k)?" · 240 ft":"",disabled=!avMagicCombatUsable(item);return `<button data-magic-use="${index}" ${disabled?"disabled":""}><b>${item.avItem||item.n}</b><span class="small">${avMagicItemStatus(item)}${range}${disabled&&!avMagicCanClassUse(item)?" · WRONG CLASS":""}</span></button>`}).join("");menu.classList.toggle("hide");$("[data-cast-spell]")?.closest("#spellMenu")?.classList.add("hide");$$("[data-magic-use]").forEach(x=>x.onclick=()=>{menu.classList.add("hide");useRcMagicItemCombat(+x.dataset.magicUse)})}
}
function autoRcHealingIndex(){
 let ratio=h.hp/h.maxhp;if(ratio>autoPotionThreshold())return-1;
 let ranked=supportedRcMagicItems().filter(x=>["staffHeal","rodHeal","superHeal"].includes(avMagicUseKind(x.item))&&avMagicCombatUsable(x.item)).sort((a,b)=>{let ka=avMagicUseKind(a.item),kb=avMagicUseKind(b.item),r={staffHeal:0,rodHeal:1,superHeal:2};return r[ka]-r[kb]});
 return ranked.length?ranked[0].index:-1
}
function autoRcOffensiveIndex(){return supportedRcMagicItems().find(x=>["wandFireball","wandLightning"].includes(avMagicUseKind(x.item))&&avMagicCombatUsable(x.item))?.index??-1}
function sheetInventory(){
 normalizeInventoryOrder();
 let cs=combatStats(),box=$("#sheetInv"),tabs=`<div class="row inventoryTabs"><button data-invtab="Inventory" class="${inventoryTab==="Inventory"?"on":""}">Inventory</button><button data-invtab="Clothing" class="${inventoryTab==="Clothing"?"on":""}">Clothing</button></div>`;
 if(inventoryTab==="Clothing"){
  let rows=h.inv.map((x,i)=>({x,i})).filter(o=>o.x.kind==="clothing");
  box.innerHTML=`<div class="combatSummary">Combat: ${cs.weapon} (${cs.damage}) · AC ${cs.ac}${cs.shield!=="None"?" · Shield":""}</div>`+tabs+
   (rows.length?rows.map(({x,i})=>`<div class="sheetEquipRow"><span>${x.n}${x.starterClothing?" · starter":""}</span><button data-discard="${i}">Discard</button></div>`).join(""):"No clothing.");
  $$("[data-discard]").forEach(b=>b.onclick=()=>discardInventoryItem(+b.dataset.discard))
 }else{
  let equip=h.inv.map((x,i)=>({x,i})).filter(o=>isInventoryEquipable(o.x)),other=h.inv.map((x,i)=>({x,i})).filter(o=>!isInventoryEquipable(o.x)&&o.x.kind!=="clothing");
  box.innerHTML=`<div class="combatSummary">Combat: ${cs.weapon} (${cs.damage}) · AC ${cs.ac}${cs.shield!=="None"?" · Shield":""}</div>`+tabs+
   `<div class="inventoryGroupLabel">Equippable</div>`+
   (equip.length?equip.map(({x,i},order)=>{let buttons;if(x.kind==="weapon"){let opts=weaponSlotOptions(x);buttons=opts.map(slot=>`<button data-eq="${i}" data-eq-slot="${slot}">${x.eq&&x.eqSlot===slot?"Unequip":slot==="melee"?"Melee":"Ranged"}</button>`).join(" ")}else buttons=`<button data-eq="${i}">${x.eq?"Unequip":"Equip"}</button>`;let mark=x.kind==="weapon"&&x.eq?`✓ ${x.eqSlot==="ranged"?"Ranged":"Melee"} · `:(x.eq?"✓ ":"");return `<div class="sheetEquipRow invDrag" data-equip-index="${order}" data-inv="${i}"><span>☰ ${mark}${x.n}</span><span>${buttons}</span></div>`}).join(""):"<div class=small>None.</div>")+
   `<div class="inventoryGroupLabel">Resources</div>`+resourceSummaryRows()+
   `<div class="inventoryGroupLabel">Gear & Items</div>`+
   (other.length?other.map(({x,i})=>`<div class="sheetEquipRow"><span>${x.n}${avMagicItemStatus(x)}</span>${avMagicTownUsable(x)?`<button data-av-town-use="${i}">Use</button>`:"<span></span>"}</div>`).join(""):"<div class=small>No other items.</div>");
  enableInventoryDrag(box);$$("[data-av-town-use]").forEach(b=>b.onclick=()=>useRcMagicItemTown(+b.dataset.avTownUse))
 }
 $$("[data-invtab]").forEach(b=>b.onclick=()=>{inventoryTab=b.dataset.invtab;sheetInventory()})
}
function enableInventoryDrag(box){
 let drag=null,gap=document.createElement("div");gap.className="invGap";
 box.querySelectorAll(".invDrag").forEach(row=>row.onpointerdown=e=>{
   if(e.target.closest("button"))return;
   drag=row;row.classList.add("dragging");row.setPointerCapture?.(e.pointerId)
 });
 box.onpointermove=e=>{
   if(!drag)return;e.preventDefault();
   let rows=[...box.querySelectorAll(".invDrag:not(.dragging)")],before=rows.find(r=>e.clientY<r.getBoundingClientRect().top+r.offsetHeight/2);
   if(before)box.insertBefore(gap,before);else{let last=rows.at(-1);if(last)last.insertAdjacentElement("afterend",gap)}
 };
 box.onpointerup=()=>{
   if(!drag)return;
   let equip=h.inv.filter(isInventoryEquipable),rest=h.inv.filter(x=>!isInventoryEquipable(x)),from=+drag.dataset.equipIndex;
   let others=[...box.querySelectorAll(".invDrag:not(.dragging)")],to=gap.parentNode?others.filter(r=>r.compareDocumentPosition(gap)&Node.DOCUMENT_POSITION_FOLLOWING).length:from;
   let moved=equip.splice(from,1)[0];equip.splice(Math.max(0,Math.min(equip.length,to)),0,moved);h.inv=[...equip,...rest];
   drag.classList.remove("dragging");gap.remove();drag=null;save()
 };
 box.onpointercancel=()=>{if(drag)drag.classList.remove("dragging");gap.remove();drag=null}
}
let shopMode="buy";

function shopData(name){for(const cat of Object.keys(SHOP)){let x=SHOP[cat].find(v=>v[0]===name);if(x)return x}return null}
function chaBuyDiscount(){return h.stats.CHA>=18?0.10:h.stats.CHA>=16?0.05:0}
function chaSellBonus(){return h.stats.CHA>=18?0.15:h.stats.CHA>=16?0.10:h.stats.CHA>=13?0.05:0}
function gpToCP(gp){return Math.round(gp*100)}
function buyPriceCP(item){return Math.round(gpToCP(item[1])*(1-chaBuyDiscount()))}
function coinTextCP(cp){cp=Math.max(0,Math.round(cp));let gp=Math.floor(cp/100),sp=Math.floor((cp%100)/10),c=cp%10;return `${gp} GP · ${sp} SP · ${c} CP`}
function topCoinStatusHTML(){
 return `<span class="coinValue"><span class="coinIcon coinGold" aria-hidden="true"></span>${Math.trunc(h.gp??h.gold??0)} GP</span><span class="coinValue"><span class="coinIcon coinSilver" aria-hidden="true"></span>${Math.trunc(h.sp??0)} SP</span><span class="coinValue"><span class="coinIcon coinCopper" aria-hidden="true"></span>${Math.trunc(h.cp??0)} CP</span>`
}
function characterRaceName(){return ["Elf","Dwarf"].includes(h?.className)?h.className:"Human"}
function characterTopMeta(){return ["Elf","Dwarf"].includes(h?.className)?`${h.className} · ${h.sex} · Level ${h.level}`:`Human · ${h.sex} · ${h.className} · Level ${h.level}`}
function visibleAmmoStatus(){
 let out=[];
 for(const [label,key] of [["Arrows","Arrows"],["Quarrels","Quarrels"],["Sling stones","Sling Stones"]]){let n=ammoCount(key);if(n>0)out.push(`${label}: ${n}`)}
 return out
}
function walletCP(){return Math.round((h.gp??h.gold??0)*100)+Math.trunc(h.sp||0)*10+Math.trunc(h.cp||0)}
function setWalletCP(cp){cp=Math.max(0,Math.round(cp));h.gp=Math.floor(cp/100);h.gold=h.gp;h.sp=Math.floor((cp%100)/10);h.cp=cp%10}
function addCoins(gp=0,sp=0,cp=0){return creditWalletValueCP(Math.trunc(gp||0)*100+Math.trunc(sp||0)*10+Math.trunc(cp||0),!!h?.trip)}
function avTreasureCashFeePct(item){
 if(Number.isFinite(Number(item?.avCashFeePct)))return Math.max(item.avGem?1:2,Math.min(item.avGem?5:12,Math.trunc(Number(item.avCashFeePct))));
 let key=`${item?.n||""}|${item?.gpValue||0}|${item?.avQuantity||0}`,hash=0;for(let i=0;i<key.length;i++)hash=((hash<<5)-hash+key.charCodeAt(i))|0;
 let min=item?.avGem?1:2,max=item?.avGem?5:12;return min+(Math.abs(hash)%(max-min+1))
}
function avTreasureSalePriceCP(item){
 let value=Math.max(0,Math.trunc(Number(item?.treasureValueCP)||0));if(!value)return 0;
 if(item.avGem||item.avJewelry){let fee=avTreasureCashFeePct(item);return Math.round(value*(100-fee)/100)}
 if(item.avSpecial)return value;
 return 0
}
function sellPriceCP(item){
 if(item?.oreSack)return Math.max(0,Math.trunc(Number(item.oreValueCP)||0));
 if(item?.avTreasure)return avTreasureSalePriceCP(item);
 if(item?.starterClothing)return (h?.stats?.CHA||0)>=16?1:0;
 let d=shopData(item.n);if(!d)return 0;return Math.round(gpToCP(d[1])*.5*(1+chaSellBonus()))
}
function sellDescriptor(item){
 if(item?.oreSack)return "Ore value · empty sack returned";
 if(item?.avGem)return `Cashing fee ${avTreasureCashFeePct(item)}%`;
 if(item?.avJewelry)return `Cashing fee ${avTreasureCashFeePct(item)}%`;
 if(item?.avSpecial)return "Market value";
 if(item?.starterClothing)return (h?.stats?.CHA||0)>=16?"High CHA found a 1 CP buyer":"Starter clothing · discard / 0 CP";
 return "Sell price"
}
function canSellResource(n){
 let ls=ensureLightStock();
 if(n==="Rations — 7 days")return h.rations>=7;
 if(n==="Waterskin")return h.waterCapacity>=1;
 if(n==="Torch")return ls.torchMinutes>=60;
 if(n==="6 Torches")return ls.torchMinutes>=360;
 if(n==="Oil Flask")return ls.oilMinutes>=240;
 if(n==="Arrows — 20")return ammoCount("Arrows")>=20;
 if(n==="Quarrels — 30")return ammoCount("Quarrels")>=30;
 if(n==="Sling Stones — 30")return ammoCount("Sling Stones")>=30;
 return true
}
function removeSoldResource(n){
 if(n==="Rations — 7 days")h.rations=Math.max(0,h.rations-7);
 else if(n==="Waterskin"){h.waterCapacity=Math.max(0,h.waterCapacity-1);h.water=Math.min(h.water,h.waterCapacity)}
 else if(n==="Torch")addLightStock("torch",-60);
 else if(n==="6 Torches")addLightStock("torch",-360);
 else if(n==="Oil Flask")addLightStock("oil",-240);
 else if(n==="Arrows — 20")h.ammo.Arrows=Math.max(0,h.ammo.Arrows-20);
 else if(n==="Quarrels — 30")h.ammo.Quarrels=Math.max(0,h.ammo.Quarrels-30);
 else if(n==="Sling Stones — 30")h.ammo["Sling Stones"]=Math.max(0,h.ammo["Sling Stones"]-30);
}
function sell(i){
 let q=h.inv[i];if(!q||q.noSell||q.bound)return;
 let price=sellPriceCP(q);if((price<=0&&!q.starterClothing)||!canSellResource(q.n))return;
 if(q.eq)q.eq=false;
 if(q.oreSack){
  let empty=q.emptySackName==="Large Sack"?"Large Sack":"Small Sack";
  h.inv[i]={n:empty,kind:"gear",can:false,eq:false,eventKey:true};
  setWalletCP(walletCP()+price);
  save();return
 }
 removeSoldResource(q.n);
 h.inv.splice(i,1);
 setWalletCP(walletCP()+price);
 if(q.avSpecial){let baseXP=Math.floor(price/100);if(baseXP)awardXP(baseXP)}
 save()
}
const CLASS_EQUIPMENT={
 Fighter:{armor:"all",weapons:"all"},
 Cleric:{armor:"all",weapons:["Club","Mace","War Hammer","Sling"]},
 Arcanist:{armor:[],weapons:["Dagger","Silver Dagger","Staff"]},
 Thief:{armor:["Leather Armor"],weapons:["Club","Dagger","Hand Axe","Spear","Mace","War Hammer","Short Sword","Sword","Short Bow","Light Crossbow","Sling"]},
 Dwarf:{armor:"all",weapons:["Club","Dagger","Silver Dagger","Cestus","Throwing Hammer","Hand Axe","Spear","Mace","War Hammer","Battle Axe","Short Sword","Sword","Short Bow","Light Crossbow","Heavy Crossbow","Sling"]},
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
function shopKind(name,section=tab){
 return section==="Armor"?(name==="Shield"?"shield":"armor"):(section==="Weapons"?"weapon":section==="Clothing"?"clothing":"gear")
}
function compactOwnedNumber(v){
 v=Math.max(0,Number(v)||0);let rounded=Math.round(v*10)/10;
 return Number.isInteger(rounded)?String(rounded):rounded.toFixed(1)
}
function shopOwnedText(name){
 if(!h)return"0";
 if(name==="Rations — 7 days")return compactOwnedNumber(h.rations||0)+" days";
 if(name==="Waterskin")return String(Math.max(0,Math.trunc(Number(h.waterCapacity)||0)));
 if(name==="Torch"||name==="6 Torches")return compactOwnedNumber((ensureLightStock().torchMinutes||0)/60)+" torches";
 if(name==="Oil Flask")return compactOwnedNumber((ensureLightStock().oilMinutes||0)/240)+" flasks";
 if(name==="Arrows — 20")return String(Math.max(0,Math.trunc(Number(h.ammo?.Arrows)||0)));
 if(name==="Quarrels — 30")return String(Math.max(0,Math.trunc(Number(h.ammo?.Quarrels)||0)));
 if(name==="Sling Stones — 30")return String(Math.max(0,Math.trunc(Number(h.ammo?.["Sling Stones"])||0)));
 return String((h.inv||[]).filter(x=>(x.baseWeapon||x.baseArmor||x.n)===name).length)
}
function renderShop(){
 if(!h)return;
 let bonus=Math.round(chaSellBonus()*100);
 $("#shopItems").innerHTML=
 `<div class="shopMode"><button id="buyMode" class="${shopMode!=="sell"?"on":""}">Buy</button><button id="sellMode" class="${shopMode==="sell"?"on":""}">Sell</button></div>`+
 (shopMode==="sell"
 ? `<div class="small">Ordinary gear resale: 50% of shop value${bonus?` + ${bonus}% CHA sell bonus`:""}. Resources are sold from their real stock, not duplicate inventory rows. Starter clothing is normally worthless; CHA 16+ can get 1 CP. Gems, jewelry and special treasure use their own cashing rules.</div>`+
   ((h.inv.map((x,i)=>{let price=sellPriceCP(x),ok=!x.noSell&&!x.bound&&(price>0||x.starterClothing),action=x.starterClothing&&price===0?"Discard":"Sell";return `<div class=item><span><b>${x.n}</b><div class=small>${x.eq?"Equipped · ":""}${sellDescriptor(x)}</div></span><span>${coinTextCP(price)}</span><button data-sell="${i}" ${ok?"":"disabled"}>${action}</button></div>`}).join("")+resourceSellRows())||"<p>Inventory is empty.</p>")
 : SHOP[tab].map((x,i)=>{let kind=shopKind(x[0]),allowed=classCanUse(x[0],kind),price=buyPriceCP(x),disc=Math.round(chaBuyDiscount()*100),bp=shopPurchaseBulkPoints(x,tab),projected=projectedBulkAfterPurchase(x,tab),fits=projected<=maxCarryBP()+1e-9;return `<div class=item><span><b>${x[0]}</b><div class=small>${x[2]}${x[2]?" · ":""}Owned: ${shopOwnedText(x[0])} · ${formatBP(bp)} BP${allowed?"":" · Restricted for "+h.className}${disc?` · CHA -${disc}%`:""}${fits?"":" · Too much to carry"}</div></span><span>${coinTextCP(price)}</span><button data-buy="${i}" ${walletCP()<price||!allowed||!fits?"disabled":""}>Buy</button></div>`}).join(""));
 $("#buyMode").onclick=()=>{shopMode="buy";renderShop()};
 $("#sellMode").onclick=()=>{shopMode="sell";renderShop()};
 $$("[data-buy]").forEach(b=>b.onclick=()=>buy(SHOP[tab][+b.dataset.buy]));
 $$("[data-sell]").forEach(b=>b.onclick=()=>sell(+b.dataset.sell));
 $$("[data-sell-resource]").forEach(b=>b.onclick=()=>sellResource(b.dataset.sellResource));
 $("#owned").innerHTML=(h.inv.map(x=>`<div class=item><span>${x.n}</span><span>${x.eq?"✓ Equipped":""}</span>${x.can?`<button data-eq="${h.inv.indexOf(x)}">${x.eq?"Unequip":"Equip"}</button>`:"<span></span>"}</div>`).join("")+resourceSummaryRows("item"))||"Nothing purchased."
}
$$("[data-tab]").forEach(b=>b.onclick=()=>{tab=b.dataset.tab;$$("[data-tab]").forEach(x=>x.classList.toggle("on",x===b));renderShop()});
function buy(x){
 let kind=shopKind(x[0]);if(!classCanUse(x[0],kind))return;let cost=buyPriceCP(x);if(walletCP()<cost)return;
 if(projectedBulkAfterPurchase(x,tab)>maxCarryBP()+1e-9){alert(`Too much to carry. ${formatBP(carriedBulkPoints())}/${formatBP(maxCarryBP())} BP currently.`);return}
 setWalletCP(walletCP()-cost);
 let resource=isResourceSku(x[0]);
 if(x[0].startsWith("Rations"))h.rations+=7;
 else if(x[0]==="Arrows — 20"){h.ammo=h.ammo||{};h.ammo.Arrows=(h.ammo.Arrows||0)+20}
 else if(x[0]==="Quarrels — 30"){h.ammo=h.ammo||{};h.ammo.Quarrels=(h.ammo.Quarrels||0)+30}
 else if(x[0]==="Sling Stones — 30"){h.ammo=h.ammo||{};h.ammo["Sling Stones"]=(h.ammo["Sling Stones"]||0)+30}
 else if(x[0]==="Waterskin"){h.waterCapacity++}
 else if(x[0]==="Torch")addLightStock("torch",60);
 else if(x[0]==="6 Torches")addLightStock("torch",360);
 else if(x[0]==="Oil Flask")addLightStock("oil",240);
 if(!resource){let armor=tab==="Armor",weapon=tab==="Weapons",clothing=tab==="Clothing";h.inv.push({n:x[0],kind:armor?(x[0]==="Shield"?"shield":"armor"):(weapon?"weapon":clothing?"clothing":"gear"),can:armor||weapon,eq:false,eventKey:typeof EVENT_KEY_ITEMS!=="undefined"&&EVENT_KEY_ITEMS.has(x[0])})}
 save()
}
function equip(i,slot=null){
 let q=h.inv[i];if(!q||!q.can)return;
 if(!classCanUse(q.baseWeapon||q.baseArmor||q.n,q.kind)){alert(`${h.className} cannot use ${q.n}.`);return}
 if(q.kind==="weapon"){
  let options=weaponSlotOptions(q),target=slot&&options.includes(slot)?slot:options[0];
  if(q.eq&&q.eqSlot===target){q.eq=false;delete q.eqSlot;save();return}
  h.inv.forEach(z=>{if(z.kind==="weapon"&&z.eqSlot===target){z.eq=false;delete z.eqSlot}});
  q.eq=true;q.eqSlot=target;save();return
 }
 if(q.eq){q.eq=false;save();return}
 if(q.kind==="armor")h.inv.forEach(z=>{if(z.kind==="armor")z.eq=false});
 if(q.kind==="shield")h.inv.forEach(z=>{if(z.kind==="shield")z.eq=false});
 q.eq=true;save()
}
document.addEventListener("click",e=>{if(e.target.dataset.eq!==undefined)equip(+e.target.dataset.eq,e.target.dataset.eqSlot||null)});

$$("[data-heal]").forEach(b=>b.onclick=()=>{let pct=+b.dataset.heal,cost=gpToCP({10:2,50:10,100:20}[pct]);if(magicalHealingBlockedByDisease()){$("#healmsg").textContent="Tomb Rot blocks magical healing. Cure the disease first.";return}if(walletCP()<cost){$("#healmsg").textContent="Not enough gold.";return}if(h.hp>=h.maxhp){$("#healmsg").textContent="Already at full health.";return}setWalletCP(walletCP()-cost);h.hp=Math.min(h.maxhp,h.hp+Math.ceil(h.maxhp*pct/100));$("#healmsg").textContent="Healing complete.";save()});if($("#cureDiseaseHealer"))$("#cureDiseaseHealer").onclick=()=>{let target=nextDiseaseForCure(),price=cureDiseaseCostGP(),cost=gpToCP(price);if(!target){$("#healmsg").textContent="No disease to cure.";return}if(walletCP()<cost){$("#healmsg").textContent=`Cure Disease costs ${price} gp.`;return}setWalletCP(walletCP()-cost);let cured=cureOneDisease();$("#healmsg").textContent=`${cured.name} cured for ${price} gp.`;save()};if($("#curePoisonHealer"))$("#curePoisonHealer").onclick=()=>{let target=nextPoisonForCure(),price=curePoisonCostGP(),cost=gpToCP(price);if(!target){$("#healmsg").textContent="No poison to cure.";return}if(walletCP()<cost){$("#healmsg").textContent=`Cure Poison costs ${price} gp.`;return}setWalletCP(walletCP()-cost);let cured=cureOnePoison();$("#healmsg").textContent=`${cured.name} cured for ${price} gp.`;save()};
if($("#fillWaterskinsBtn"))$("#fillWaterskinsBtn").onclick=fillWaterskinsManual;
document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{mode=b.dataset.mode;$$("[data-mode]").forEach(x=>x.classList.toggle("on",x===b))});
$$("[data-risk]").forEach(b=>b.onclick=()=>{risk=b.dataset.risk;$$("[data-risk]").forEach(x=>x.classList.toggle("on",x===b))});
function setCustomDurationFromInputs(){
 let hours=Math.max(0,Math.trunc(Number($("#customHours")?.value)||0)),minutes=Math.max(0,Math.trunc(Number($("#customMinutes")?.value)||0));
 if(minutes>59)minutes=59;if(hours>24)hours=24;
 let total=hours*60+minutes;if(total<1)total=1;if(total>1440)total=1440;
 hours=Math.floor(total/60);minutes=total%60;
 if($("#customHours"))$("#customHours").value=hours;if($("#customMinutes"))$("#customMinutes").value=minutes;
 mins=total;customDurationActive=true;
 $$("[data-min]").forEach(x=>x.classList.remove("on"));if($("#customDurationBtn"))$("#customDurationBtn").classList.add("on");
 refresh()
}
$$("[data-min]").forEach(b=>b.onclick=()=>{mins=+b.dataset.min;customDurationActive=false;$$("[data-min]").forEach(x=>x.classList.toggle("on",x===b));if($("#customDurationBtn"))$("#customDurationBtn").classList.remove("on");if($("#customDurationFields"))$("#customDurationFields").classList.add("hide");refresh()});
if($("#customDurationBtn"))$("#customDurationBtn").onclick=()=>{customDurationActive=true;$("#customDurationBtn").classList.add("on");$$("[data-min]").forEach(x=>x.classList.remove("on"));if($("#customDurationFields"))$("#customDurationFields").classList.remove("hide");let h=Math.floor(mins/60),m=mins%60;$("#customHours").value=h;$("#customMinutes").value=m;setCustomDurationFromInputs()};
for(const id of ["#customHours","#customMinutes"])if($(id)){$(id).onchange=setCustomDurationFromInputs;$(id).oninput=()=>{if(customDurationActive)setCustomDurationFromInputs()}};
function clock(t){return new Date(t).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
const ADVENTURE_LOG_ICONS={Departure:"🧭",Travel:"🧭",Encounter:"⚠️",Combat:"⚔️",Loot:"💰",Discovery:"🔎",Decision:"🎲",Check:"🎲",Rest:"💤",Objective:"🏁",Progression:"⭐",Home:"🏠",Quiet:"…","Secret Door":"🔎",Event:"📜",Adventure:"📜",Summary:"📋"};
function adventureLogIcon(type){return ADVENTURE_LOG_ICONS[type]||"📜"}
function inferAdventureLogType(text){
 text=String(text||"");
 if(/\b(?:Treasure|treasure|GP found|SP found|CP found|left behind at the carry limit|kept\.)/.test(text))return"Loot";
 if(/\b(?:Combat won|Boss defeated|BOSS BATTLE|combat begins|escape the encounter)\b/i.test(text))return"Combat";
 if(/\b(?:SUCCESS|FAILURE|WIS \d+\/|INT \d+\/|DEX \d+\/|STR \d+\/|CON \d+\/|CHA \d+\/)/.test(text))return"Check";
 if(/\b(?:Return|Returning|Returned|Destination reached|turn back|venture forward)\b/i.test(text))return"Travel";
 if(/\b(?:Short Rest|restores? \d+ HP|rested)\b/i.test(text))return"Rest";
 return"Adventure"
}
function adventureLog(t,type="Event",meta={}){
 if(!h?.trip)return;
 h.trip.adventureLog=h.trip.adventureLog||[];
 h.trip.adventureLog.push({time:Date.now(),type:type||inferAdventureLogType(t),text:t,...meta});
 if(h.trip.adventureLog.length>250)h.trip.adventureLog.shift();
 renderAdventureLog();
}
function adventureOutcomeClass(text){
 text=String(text||"");if(/\bFAILURE\b/.test(text))return"logFailure";if(/\bSUCCESS\b/.test(text))return"logSuccess";return""
}
function renderAdventureLog(){
 let box=$("#adventureLogEntries");if(!box)return;
 let rows=h?.trip?.adventureLog||[];
 box.innerHTML=rows.length?rows.map(e=>`<div class="adventureLogRow ${adventureOutcomeClass(e.text)}"><span class="adventureLogTime">[${clock(e.time)}]</span> <b>${adventureLogIcon(e.type)} ${e.type}</b> — ${e.text}</div>`).join(""):`<div class="small">No events recorded yet.</div>`;
 box.scrollTop=box.scrollHeight;
}
function addlog(t,type=null){let cls=adventureOutcomeClass(t),legacy=$("#log");if(legacy)legacy.insertAdjacentHTML("beforeend",`<p class="${cls}">${t}<span style="float:right;color:#aaa">${clock(Date.now())}</span></p>`);adventureLog(t,type||inferAdventureLogType(t))}
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
 awardMissionObjectiveTreasure();
 if(m.trophyCandidate&&unlockTrophy(m.trophyCandidate)){
   addlog(`TROPHY DISCOVERED: ${m.trophyCandidate}. It has been added to your ${TROPHY_TITLES[h.className]}.`,"Objective");
 }else addlog(`Objective secured: ${m.title}. No rare trophy was found this time.`,"Objective");
}

function ageTimedBuffsClock(now=Date.now()){
 if(!h)return 0;ensureSpellState();now=Number(now)||Date.now();
 let last=Number(h.buffAgeAt);if(!Number.isFinite(last)){h.buffAgeAt=now;return 0}
 if(h.combat||h.pendingEvent||h.trip?.pauseStart){h.buffAgeAt=now;return 0}
 let dt=Math.max(0,now-last);h.buffAgeAt=now;if(!dt)return 0;
 let rounds=dt*AT_RATE/10000;if(rounds<=0)return 0;let expired=[];
 for(const b of h.spells.buffs){if(Number.isFinite(Number(b.rounds))){b.rounds=Math.max(0,Number(b.rounds)-rounds);if(b.rounds<=0)expired.push(b)}}
 if(expired.length)h.spells.buffs=h.spells.buffs.filter(b=>!expired.includes(b));
 return rounds
}
function beginTripPause(){if(h?.trip&&!h.trip.pauseStart){ageTimedBuffsClock(Date.now());ageTimedConditionsClock(Date.now());h.trip.pauseStart=Date.now();h.buffAgeAt=h.trip.pauseStart;h.timedConditionAgeAt=h.trip.pauseStart}}
function endTripPause(){if(!h?.trip?.pauseStart)return;let now=Date.now(),dt=now-h.trip.pauseStart;for(const k of ["start","end","half","nextEvent","resourceAt"])if(Number.isFinite(h.trip[k]))h.trip[k]+=dt;h.trip.pauseStart=null;h.buffAgeAt=now;h.timedConditionAgeAt=now}
function advanceJourneyMinutes(minutes){
 if(!h?.trip)return 0;
 let ms=Math.max(0,Number(minutes)||0)*60000;if(!ms)return 0;
 // Consuming Journey time moves all future Journey milestones earlier; planned duration remains unchanged for rewards/summary.
 for(const k of ["end","half","nextEvent"])if(Number.isFinite(Number(h.trip[k])))h.trip[k]=Number(h.trip[k])-ms;
 h.trip.timeConsumedByEventsMinutes=Math.max(0,Number(h.trip.timeConsumedByEventsMinutes)||0)+ms/60000;
 return ms
}
const MISSION_OBJECTIVE_TREASURE_GP={1:"1d4",5:"1d6+2",10:"2d6+3",30:"3d6+5",60:"4d6+10",120:"6d6+20",240:"10d6+30",480:"20d6+50",1440:"30d6+100"};
const MISSION_OBJECTIVE_TREASURE_MINUTES=Object.keys(MISSION_OBJECTIVE_TREASURE_GP).map(Number).sort((a,b)=>a-b);
function diceExpressionRange(expr){
 let m=/^(\d+)d(\d+)(?:\+(\d+))?$/i.exec(String(expr||""));if(!m)return null;
 let n=+m[1],die=+m[2],add=+(m[3]||0);return{min:n+add,max:n*die+add}
}
function missionObjectiveBaseGP(minutes){
 let m=Math.max(1,Math.min(1440,Math.round(Number(minutes)||1))),exact=MISSION_OBJECTIVE_TREASURE_GP[m];
 if(exact)return avRollScaled(exact);
 let hi=MISSION_OBJECTIVE_TREASURE_MINUTES.find(x=>x>m)||1440,lo=[...MISSION_OBJECTIVE_TREASURE_MINUTES].reverse().find(x=>x<m)||1;
 let a=diceExpressionRange(MISSION_OBJECTIVE_TREASURE_GP[lo]),b=diceExpressionRange(MISSION_OBJECTIVE_TREASURE_GP[hi]);
 if(!a||!b)return 0;
 let t=(m-lo)/(hi-lo),min=Math.round(a.min+(b.min-a.min)*t),max=Math.round(a.max+(b.max-a.max)*t);
 return min+d(Math.max(1,max-min+1))-1
}
function missionObjectiveTreasureGP(minutes=h?.trip?.durationMinutes||1,level=h?.level||1){
 return missionObjectiveBaseGP(minutes)*Math.max(1,Math.trunc(Number(level)||1))
}
function awardMissionObjectiveTreasure(){
 if(!h?.trip?.mission||h.trip.mission.objectiveTreasureAwarded)return null;
 let gp=missionObjectiveTreasureGP(h.trip.durationMinutes,h.level),credit=addCoins(gp,0,0);
 h.trip.mission.objectiveTreasureAwarded=true;
 h.trip.mission.objectiveTreasureRolledGP=gp;
 h.trip.mission.objectiveTreasureKeptCP=credit.cpValue;
 if(credit.cpValue>0)h.trip.avTreasureXpCP=Math.max(0,Number(h.trip.avTreasureXpCP)||0)+credit.cpValue;
 journal({id:"MISSION-OBJECTIVE-TREASURE",type:"Treasure",title:"Mission Objective Treasure",text:`Mission objective secured: ${gp} GP found.`,result:"objectiveTreasure",xp:0,coins:coinArrayFromCP(credit.cpValue),leftCoinCP:credit.leftCP||0});
 addlog(`Mission Objective Treasure: ${gp} GP found.${credit.cpValue?` ${coinTextCP(credit.cpValue)} kept.`:""}${credit.leftCP?` ${coinTextCP(credit.leftCP)} left behind at the carry limit.`:""}`,"Loot");
 return{rolledGP:gp,...credit}
}
function adventureEventTarget(minutes){
 minutes=Math.max(1,Math.min(1440,Math.round(Number(minutes)||1)));
 if(minutes===1)return 1;
 if(minutes<=10)return 5;
 if(minutes<=60)return 6;
 if(minutes<=480)return 8;
 return 10
}
function ensureTripSchedule(trip=h?.trip){
 if(!trip||!Number.isFinite(Number(trip.start))||!Number.isFinite(Number(trip.end)))return trip;
 trip.start=Number(trip.start);trip.end=Number(trip.end);
 let total=Math.max(1000,trip.end-trip.start);
 trip.durationMinutes=Math.max(1,Number.isFinite(Number(trip.durationMinutes))?Number(trip.durationMinutes):total/60000);
 trip.eventTarget=Math.max(1,Math.trunc(Number(trip.eventTarget)||adventureEventTarget(trip.durationMinutes)));
 trip.eventIntervalMs=Math.max(5000,Number(trip.eventIntervalMs)||total/trip.eventTarget);
 if(!Number.isFinite(Number(trip.half)))trip.half=trip.start+total/2;else trip.half=Number(trip.half);
 if(typeof trip.midBossDone!=="boolean")trip.midBossDone=!!trip.mission?.bossWon||!!trip.mission?.resolved;
 if(!Array.isArray(trip.journal))trip.journal=[];
 if(!Array.isArray(trip.adventureLog))trip.adventureLog=[];
 if(!Number.isFinite(Number(trip.avTreasureXpCP)))trip.avTreasureXpCP=0;
 if(!Number.isFinite(Number(trip.nextEvent))){
  let firstDelay=Math.min(15000,Math.max(5000,total/(trip.eventTarget+1))),done=trip.journal.length;
  trip.nextEvent=trip.start+firstDelay+done*trip.eventIntervalMs;
 }else trip.nextEvent=Number(trip.nextEvent);
 if(Number.isFinite(Number(trip.pauseStart))&&!h?.combat&&!h?.pendingEvent)trip.pauseStart=null;
 return trip
}
function journeyElapsedATMinutes(now=Date.now(),trip=h?.trip){
 if(!trip)return 0;
 let rt=Math.max(0,Math.min(Number(now)||Date.now(),Number(trip.end)||Date.now())-(Number(trip.start)||Date.now()));
 return rt*AT_RATE/60000
}
function journeyCompletedSleeps(now=Date.now(),trip=h?.trip){
 if(!trip)return 0;
 let atMinutes=journeyElapsedATMinutes(now,trip);
 return Math.max(0,Math.floor(atMinutes/(JOURNEY_DAY_AT_HOURS*60)))
}
function journeyInSleepWindow(now=Date.now(),trip=h?.trip){
 if(!trip)return false;
 let atMinutes=journeyElapsedATMinutes(now,trip),within=atMinutes%(JOURNEY_DAY_AT_HOURS*60);
 return within>=JOURNEY_ACTIVE_AT_HOURS*60
}
function processJourneySleep(now=Date.now()){
 if(!h?.trip)return 0;
 let completed=journeyCompletedSleeps(now,h.trip),done=Math.max(0,Math.trunc(Number(h.trip.completedSleeps)||0));
 if(completed<=done)return 0;
 let count=completed-done;
 for(let i=0;i<count;i++){
  let before=h.hp,rate=.25*diseaseNaturalHealingMultiplier();
  h.hp=Math.min(h.maxhp,h.hp+Math.ceil(h.maxhp*rate));
  if(PREPARED_CASTERS.has(h.className))resetDailySpells();
  h.trip.completedSleeps++;
  journal({id:"JOURNEY-SLEEP-"+h.trip.completedSleeps,type:"Rest",title:"Night's Rest",text:"Eight Averathia hours of sleep during the Journey.",result:"longRest",xp:0,coins:[0,0,0],hpHealed:h.hp-before,spellsRefreshed:PREPARED_CASTERS.has(h.className)});
  let bits=["Night's Rest — 8 AT hours asleep."];
  if(h.hp-before)bits.push("+"+(h.hp-before)+" HP restored.");
  if(PREPARED_CASTERS.has(h.className))bits.push("Daily magic restored.");
  addlog(bits.join(" "),"Rest");
 }
 return count
}
function consumeTripSurvivalResources(now=Date.now()){
 if(!h?.trip||!["elapsed-v1","at-elapsed-v2","at-elapsed-v3-water-refill"].includes(h.trip.resourceModel))return true;
 let last=Number.isFinite(h.trip.resourceAt)?h.trip.resourceAt:h.trip.start,t=Math.max(last,Math.min(now,h.trip.end)),dt=Math.max(0,t-last),scale=h.trip.resourceModel==="elapsed-v1"?1:AT_RATE;
 if(dt>0){
  ageTimedBuffsClock(t);let days=scale*dt/86400000;
  h.rations=Math.max(0,(h.rations||0)-days*(h.trip.retainer?2:1));
  if(h.trip.resourceModel==="at-elapsed-v3-water-refill"&&h.trip.waterRefillMode==="normal"){
   let rate=4*(h.trip.retainer?2:1),elapsedDays=Math.max(0,scale*(t-h.trip.start)/86400000);
   if(elapsedDays<1)h.water=Math.max(0,Math.min(h.waterCapacity,Number(h.trip.waterStart??h.water)||0)-rate*elapsedDays);
   else{let frac=elapsedDays-Math.floor(elapsedDays+1e-9);if(frac<0)frac=0;h.water=Math.max(0,Math.min(h.waterCapacity,h.waterCapacity-rate*frac))}
  }else h.water=Math.max(0,(h.water||0)-4*days*(h.trip.retainer?2:1));
  if(h.trip.mountsUsed)h.mounts.feedDays=Math.max(0,(h.mounts.feedDays||0)-days*h.trip.mountsUsed);
  h.trip.resourceAt=t
 }
 if(h.water<=0&&t<h.trip.half&&!h.trip.forcedReturnWater){h.trip.forcedReturnWater=true;returnEarly("You are out of water. You turn back toward town.");return false}
 return true
}
function begin(){let rb=$("#recall");if(rb){rb.disabled=false;rb.textContent="↩ Return Early"}if(!hasBackpack()){alert("You need a Backpack before beginning a Journey.");return}if(carriedBulkPoints()>maxCarryBP()+1e-9){alert(`You are carrying ${formatBP(carriedBulkPoints())}/${formatBP(maxCarryBP())} BP. Reduce your load before beginning a Journey.`);return}if(diseaseJourneyBlocked()){alert(`${journeyBlockingCondition()?.name||"Current condition"} prevents travel. You cannot begin a Journey.`);return}if(timedConditionJourneyBlocked()){alert(`${timedConditionBlockingName()} prevents travel. You cannot begin a Journey.`);return}let ret=retainerSelected(),mounts=plannedHorseCount(),horseAttempt=hasHouse()&&h.mounts.useOnJourney;if(horseAttempt&&!mounts){alert("Not enough Riding Horses for mounted travel with this party.");return}let needs=survivalNeedsForMinutes(mins),nw=needs.waterSkins,nf=needs.foodDays,nl=needs.activeATHours*60/AT_RATE;if(h.waterCapacity<nw){alert(`You need ${nw} Waterskins for this party.`);return}if(h.water+1e-9<nw){alert(`Fill ${nw} Waterskins before beginning the Journey.`);return}if(h.rations<nf){alert("Not enough rations.");return}if(mounts&&h.mounts.feedDays+1e-9<needs.mountFeedDays){alert("Not enough Mount Feed.");return}if(journeyUsableLightMinutes()<nl){alert("Not enough usable light. A Lantern is required to use lamp oil.");return}let journeyLight=consumeJourneyLight(nl);if(!journeyLight.ok){alert("Not enough usable light.");return}let now=Date.now(),total=mins*60000,eventTarget=adventureEventTarget(mins),eventIntervalMs=Math.max(5000,total/eventTarget);if(!hasRoom()){h.lastAdventure=null;h.lastAdventureTitle=null}h.pendingEvent=null;ensureTrophies();let mission=createMission();h.trip={journal:[],adventureLog:[],mission,start:now,end:now+total,half:now+total/2,midBossDone:false,avTreasureXpCP:0,mode,risk,durationMinutes:mins,eventTarget,eventIntervalMs,resourceModel:"at-elapsed-v3-water-refill",resourceAt:now,waterRefillMode:"normal",waterStart:h.water,forcedReturnWater:false,retainer:ret,mountsUsed:mounts,mountedTravel:!!mounts,lightSource:journeyLight.source,plannedActiveATHours:needs.activeATHours,plannedSleepATHours:needs.sleepATHours,startHP:h.hp,startXP:h.xp,startWalletCP:walletCP(),completedSleeps:0,nextEvent:now+Math.min(15000,Math.max(5000,total/(eventTarget+1)))};$("#departSetup").classList.add("hide");$("#travel").classList.remove("hide");$("#departedAt").textContent=clock(h.trip.start);$("#returnAt").textContent=clock(h.trip.end);$("#runner").innerHTML=spriteHTML(h.sex,h.avatar,h.className);$("#log").innerHTML="";addlog(`${mission.title} — ${mission.brief} Planned duration: ${mins} min. Risk: ${risk}. Mode: ${mode==="auto"?"Autonomous":"Player-present"}.`,"Departure");
 let mountText=mounts===1?" Mount secured.":mounts>1?" Mounts secured.":"";
 addlog(`Destination reached.${mountText} You light your ${journeyLight.source} and venture forward.`,"Travel");
 renderAdventureLog();save();tick()}
function journeySummaryText(trip=h?.trip){
 if(!trip)return"";
 let xp=Math.max(0,(h.xp||0)-Math.max(0,Number(trip.startXP)||0)),coinDelta=walletCP()-Math.max(0,Number(trip.startWalletCP)||0),hp0=Number.isFinite(Number(trip.startHP))?Number(trip.startHP):h.hp;
 let outcome=trip?.mission?.bossWon?"Objective completed":trip?.returnedEarly?"Returned early":"Journey completed";
 let coinText=coinDelta===0?"Coins unchanged":(coinDelta>0?"+":"")+coinTextCP(Math.abs(coinDelta))+(coinDelta<0?" net":" net");
 let eventTime=Math.max(0,Number(trip.timeConsumedByEventsMinutes)||0),eventTimeText=eventTime?` · ${eventTime} min spent on Journey events`:"",sleepCount=Math.max(0,Number(trip.completedSleeps)||0),sleepText=sleepCount?` · ${sleepCount} full sleep${sleepCount===1?"":"s"}`:"",plannedSleep=Math.max(0,Number(trip.plannedSleepATHours)||0),plannedSleepText=plannedSleep?` · ${plannedSleep.toFixed(1)} AT h sleep planned`:"";return `${outcome} · ${trip.durationMinutes} min planned${plannedSleepText}${eventTimeText}${sleepText} · HP ${hp0}/${h.maxhp} → ${h.hp}/${h.maxhp} · +${xp} XP · ${coinText}`
}
function tick(){clearTimeout(timer);if(ageTimedConditionsClock(Date.now())===false)return;if(!h.trip)return;ensureTripSchedule();let now=h.trip.pauseStart||Date.now();processJourneySleep(now);if(!consumeTripSurvivalResources(now))return;let total=h.trip.end-h.trip.start,elapsed=Math.max(0,now-h.trip.start),pct=Math.min(1,elapsed/total),outbound=pct<=0.5,runnerPct=outbound?pct*200:(1-pct)*200;let recall=$("#recall");if(recall){recall.disabled=!outbound;recall.textContent=outbound?"↩ Return Early":"Returning…"}$("#fill").style.width="0%";$("#runner").style.left=runnerPct+"%";$("#runner").style.transform=outbound?"translate(-50%,-62%) scaleX(-1)":"translate(-50%,-62%) scaleX(1)";$("#phase").textContent=(journeyInSleepWindow(now)?"SLEEPING":(outbound?"OUTBOUND / ADVENTURING":"RETURNING"))+(h.trip.mission?` · ${h.trip.mission.title}`:"");let remaining=Math.max(0,h.trip.end-now);$("#remainingClock").textContent=`${Math.floor(remaining/60000)}:${String(Math.floor(remaining/1000)%60).padStart(2,"0")}`;$("#returnAt").textContent=clock(h.trip.end);$("#timeText").textContent=`Elapsed ${Math.floor(elapsed/60000)}:${String(Math.floor(elapsed/1000)%60).padStart(2,"0")} · Remaining ${Math.floor(remaining/60000)}:${String(Math.floor(remaining/1000)%60).padStart(2,"0")}`;if(now>=h.trip.half&&!h.trip.midBossDone&&!h.combat&&!h.pendingEvent&&!journeyInSleepWindow(now)){if(h.trip.mode==="auto")autonomousCombat(true);else makeCombat(true);if(!h.trip)return;h.trip.midBossDone=true;save()}if(now>=h.trip.nextEvent&&now<h.trip.end&&!h.combat&&!h.pendingEvent&&!journeyInSleepWindow(now)){event();if(!h.trip)return;h.trip.nextEvent+=h.trip.eventIntervalMs;save()}if(now>=h.trip.end){if(h.trip.trollLessonReturn&&!h.trollWeaknessKnown){h.trollWeaknessKnown=true}addlog("Returned to town.","Home");settleTripTreasureXP();addlog(journeySummaryText(h.trip),"Summary");recordLastAdventureFromTrip(h.trip);h.trip=null;vibrateJourneyReturn();$("#travel").classList.add("hide");$("#departSetup").classList.remove("hide");home();page("town");return}timer=setTimeout(tick,500)}
const FIGHTER_EVENTS=[{"id":"FTR-001","type":"Discovery","title":"Abandoned Cart","text":"An overturned merchant cart lies beside the road.","choices":[{"label":"Search","result":"search","xp":2,"coins":[0,1,0]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-002","type":"Discovery","title":"Old Milestone","text":"A weathered milestone bears marks beneath the moss.","choices":[{"label":"Search","result":"search","xp":3,"coins":[1,4,7]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-003","type":"Discovery","title":"Ruined Shrine","text":"A roofless roadside shrine stands among the weeds.","choices":[{"label":"Search","result":"search","xp":4,"coins":[2,7,14]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-004","type":"Discovery","title":"Freshwater Spring","text":"Clear water bubbles from stone beneath an oak.","choices":[{"label":"Search","result":"search","xp":5,"coins":[0,1,4]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-005","type":"Discovery","title":"Hunter's Cache","text":"A waxed bundle is wedged beneath exposed roots.","choices":[{"label":"Search","result":"search","xp":6,"coins":[1,4,11]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-006","type":"Discovery","title":"Collapsed Camp","text":"A cold campfire and torn bedrolls mark an abandoned camp.","choices":[{"label":"Search","result":"search","xp":2,"coins":[2,7,1]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-007","type":"Discovery","title":"Broken Strongbox","text":"A split wooden strongbox lies half-buried in mud.","choices":[{"label":"Search","result":"search","xp":3,"coins":[0,1,8]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-008","type":"Discovery","title":"Lost Satchel","text":"A leather satchel hangs from a thorn bush.","choices":[{"label":"Search","result":"search","xp":4,"coins":[1,4,15]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-009","type":"Discovery","title":"Ancient Cairn","text":"A low cairn of stacked stones rises beside the trail.","choices":[{"label":"Search","result":"search","xp":5,"coins":[2,7,5]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-010","type":"Discovery","title":"Charred Wagon","text":"The blackened frame of a wagon blocks part of the road.","choices":[{"label":"Search","result":"search","xp":6,"coins":[0,1,12]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-011","type":"Discovery","title":"Fallen Courier","text":"A courier's torn pouch lies near a set of hurried tracks.","choices":[{"label":"Search","result":"search","xp":2,"coins":[1,4,2]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-012","type":"Discovery","title":"Hidden Hollow","text":"A narrow hollow opens behind a curtain of ivy.","choices":[{"label":"Search","result":"search","xp":3,"coins":[2,7,9]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-013","type":"Discovery","title":"Old Well","text":"A stone well stands in a clearing, its rope still intact.","choices":[{"label":"Search","result":"search","xp":4,"coins":[0,1,16]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-014","type":"Discovery","title":"Battlefield Remains","text":"Rusting scraps and old bones lie beneath the grass.","choices":[{"label":"Search","result":"search","xp":5,"coins":[1,4,6]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-015","type":"Discovery","title":"Forgotten Pack","text":"A travel pack has been concealed under a fallen log.","choices":[{"label":"Search","result":"search","xp":6,"coins":[2,7,13]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-016","type":"Discovery","title":"River Wreckage","text":"Crates and planks have washed onto the riverbank.","choices":[{"label":"Search","result":"search","xp":2,"coins":[0,1,3]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-017","type":"Discovery","title":"Stone Marker","text":"A carved stone marker points toward an overgrown path.","choices":[{"label":"Search","result":"search","xp":3,"coins":[1,4,10]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-018","type":"Discovery","title":"Hermit's Camp","text":"A tiny camp appears recently abandoned.","choices":[{"label":"Search","result":"search","xp":4,"coins":[2,7,0]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-019","type":"Discovery","title":"Cave Mouth","text":"A shallow cave opens in the hillside.","choices":[{"label":"Search","result":"search","xp":5,"coins":[0,1,7]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-020","type":"Discovery","title":"Rope Bridge Cache","text":"Something glints beneath the far anchor of an old rope bridge.","choices":[{"label":"Search","result":"search","xp":6,"coins":[1,4,14]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-021","type":"Discovery","title":"Buried Jar","text":"Rain has exposed the rim of a clay jar in the path.","choices":[{"label":"Search","result":"search","xp":2,"coins":[2,7,4]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-022","type":"Discovery","title":"Torn Map","text":"A fragment of a hand-drawn map is caught beneath a stone.","choices":[{"label":"Search","result":"search","xp":3,"coins":[0,1,11]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-023","type":"Discovery","title":"Watchman's Post","text":"A ruined wooden watch post overlooks the road.","choices":[{"label":"Search","result":"search","xp":4,"coins":[1,4,1]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-024","type":"Discovery","title":"Smuggler's Nook","text":"Loose stones conceal a narrow storage recess.","choices":[{"label":"Search","result":"search","xp":5,"coins":[2,7,8]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-025","type":"Discovery","title":"Old Orchard","text":"Wild fruit trees surround the remains of a cottage.","choices":[{"label":"Search","result":"search","xp":6,"coins":[0,1,15]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-026","type":"Discovery","title":"Wayside Grave","text":"A lonely grave has been disturbed by recent rain.","choices":[{"label":"Search","result":"search","xp":2,"coins":[1,4,5]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-027","type":"Discovery","title":"Flooded Cellar","text":"Stone steps descend into a partially flooded cellar.","choices":[{"label":"Search","result":"search","xp":3,"coins":[2,7,12]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-028","type":"Discovery","title":"Woodcutter's Shed","text":"An unlocked shed stands deep among the trees.","choices":[{"label":"Search","result":"search","xp":4,"coins":[0,1,2]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-029","type":"Discovery","title":"Forgotten Tollhouse","text":"A ruined tollhouse leans beside an ancient road.","choices":[{"label":"Search","result":"search","xp":5,"coins":[1,4,9]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-030","type":"Discovery","title":"Moonlit Clearing","text":"A ring of pale stones surrounds a quiet clearing.","choices":[{"label":"Search","result":"search","xp":6,"coins":[2,7,16]},{"label":"Leave it","result":"leave"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-031","type":"Decision","title":"Fork in the Road","text":"The trail divides around a steep wooded ridge.","choices":[{"label":"Take the ridge path","result":"risk","xp":3,"coins":[0,0,0]},{"label":"Take the valley path","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-032","type":"Decision","title":"Distant Cry","text":"A human cry carries from somewhere beyond the trees.","choices":[{"label":"Investigate","result":"risk","xp":4,"coins":[1,2,5]},{"label":"Keep moving","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-033","type":"Decision","title":"Suspicious Tracks","text":"Fresh boot prints leave the road toward dense brush.","choices":[{"label":"Follow them","result":"risk","xp":5,"coins":[0,4,10]},{"label":"Ignore them","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-034","type":"Decision","title":"Blocked Bridge","text":"A fallen tree blocks the safest bridge crossing.","choices":[{"label":"Climb across","result":"risk","xp":6,"coins":[1,6,2]},{"label":"Find another route","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-035","type":"Decision","title":"Stray Horse","text":"A saddled horse wanders alone beside the road.","choices":[{"label":"Approach it","result":"risk","xp":7,"coins":[0,1,7]},{"label":"Leave it","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-036","type":"Decision","title":"Smoke Ahead","text":"A thin column of smoke rises beyond the next hill.","choices":[{"label":"Scout the smoke","result":"risk","xp":8,"coins":[1,3,12]},{"label":"Avoid it","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-037","type":"Decision","title":"Locked Chest","text":"A small iron-bound chest sits beneath a dead tree.","choices":[{"label":"Force it open","result":"risk","xp":3,"coins":[0,5,4]},{"label":"Leave it","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-038","type":"Decision","title":"Narrow Ledge","text":"The direct path crosses a narrow rocky ledge.","choices":[{"label":"Cross carefully","result":"risk","xp":4,"coins":[1,0,9]},{"label":"Take the long way","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-039","type":"Decision","title":"Merchant in Trouble","text":"A merchant struggles with a broken wagon wheel.","choices":[{"label":"Help","result":"risk","xp":5,"coins":[0,2,1]},{"label":"Continue","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-040","type":"Decision","title":"Old Tunnel","text":"A dark tunnel cuts through the hillside.","choices":[{"label":"Enter","result":"risk","xp":6,"coins":[1,4,6]},{"label":"Go around","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-041","type":"Decision","title":"Flooded Ford","text":"The usual ford is running high.","choices":[{"label":"Cross now","result":"risk","xp":7,"coins":[0,6,11]},{"label":"Search upstream","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-042","type":"Decision","title":"Howling in the Woods","text":"Several howls sound uncomfortably close.","choices":[{"label":"Stand your ground","result":"risk","xp":8,"coins":[1,1,3]},{"label":"Move quietly away","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-043","type":"Decision","title":"Dropped Purse","text":"A coin purse lies conspicuously in the road.","choices":[{"label":"Pick it up","result":"risk","xp":3,"coins":[0,3,8]},{"label":"Leave it","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-044","type":"Decision","title":"Wounded Traveller","text":"A wounded traveller sits against a tree.","choices":[{"label":"Offer aid","result":"risk","xp":4,"coins":[1,5,0]},{"label":"Keep distance","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-045","type":"Decision","title":"Rope Across Trail","text":"A thin rope has been stretched across the path.","choices":[{"label":"Inspect it","result":"risk","xp":5,"coins":[0,0,5]},{"label":"Detour","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-046","type":"Decision","title":"Unmarked Door","text":"A stone door is set into a low hillside.","choices":[{"label":"Open it","result":"risk","xp":6,"coins":[1,2,10]},{"label":"Pass by","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-047","type":"Decision","title":"Fresh Campfire","text":"A fire still burns in an apparently empty camp.","choices":[{"label":"Call out","result":"risk","xp":7,"coins":[0,4,2]},{"label":"Avoid the camp","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-048","type":"Decision","title":"Fallen Tree","text":"A huge tree blocks the road.","choices":[{"label":"Climb over","result":"risk","xp":8,"coins":[1,6,7]},{"label":"Go around","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-049","type":"Decision","title":"Shallow Cave","text":"Rain begins as a shallow cave offers shelter.","choices":[{"label":"Take shelter","result":"risk","xp":3,"coins":[0,1,12]},{"label":"Press on","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-050","type":"Decision","title":"Old Ferry","text":"An unattended ferry is tied to the near bank.","choices":[{"label":"Use it","result":"risk","xp":4,"coins":[1,3,4]},{"label":"Follow the river","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-051","type":"Decision","title":"Footprints in Mud","text":"Small footprints circle your own trail.","choices":[{"label":"Track them","result":"risk","xp":5,"coins":[0,5,9]},{"label":"Ignore them","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-052","type":"Decision","title":"Bell in Distance","text":"A lone bell rings somewhere off the road.","choices":[{"label":"Seek it","result":"risk","xp":6,"coins":[1,0,1]},{"label":"Stay on course","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-053","type":"Decision","title":"Cracked Statue","text":"A warrior statue holds a stone bowl.","choices":[{"label":"Inspect the bowl","result":"risk","xp":7,"coins":[0,2,6]},{"label":"Move on","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-054","type":"Decision","title":"Ravens Gathering","text":"Ravens cluster noisily over a nearby field.","choices":[{"label":"Investigate","result":"risk","xp":8,"coins":[1,4,11]},{"label":"Avoid","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-055","type":"Decision","title":"Narrow Ravine","text":"A shortcut descends through a narrow ravine.","choices":[{"label":"Take shortcut","result":"risk","xp":3,"coins":[0,6,3]},{"label":"Stay high","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-056","type":"Decision","title":"Lantern at Night","text":"A lantern moves between distant trees.","choices":[{"label":"Approach","result":"risk","xp":4,"coins":[1,1,8]},{"label":"Extinguish your light","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-057","type":"Decision","title":"Abandoned Boat","text":"A small boat is tied beside a quiet lake.","choices":[{"label":"Search it","result":"risk","xp":5,"coins":[0,3,0]},{"label":"Leave it","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-058","type":"Decision","title":"Old Barricade","text":"A decayed barricade spans the road.","choices":[{"label":"Pass through","result":"risk","xp":6,"coins":[1,5,5]},{"label":"Circle around","result":"safe","xp":1}],"xp":0,"coins":[0,0,0]},{"id":"FTR-059","type":"Decision","title":"Crumbling Tower","text":"A ruined tower offers a commanding view.","choices":[{"label":"Climb it","result":"risk","xp":7,"coins":[0,0,10]},{"label":"Continue","result":"safe","xp":2}],"xp":0,"coins":[0,0,0]},{"id":"FTR-060","type":"Decision","title":"Unusual Silence","text":"The forest suddenly becomes completely silent.","choices":[{"label":"Investigate cautiously","result":"risk","xp":8,"coins":[1,2,2]},{"label":"Withdraw","result":"safe","xp":3}],"xp":0,"coins":[0,0,0]},{"id":"FTR-061","type":"Encounter","title":"Roadside Ambush","text":"Movement erupts from the ditch ahead.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-062","type":"Encounter","title":"Bridge Toll","text":"Armed figures step onto a narrow bridge.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-063","type":"Encounter","title":"Camp Raiders","text":"Shapes move around an abandoned campsite.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-064","type":"Encounter","title":"Forest Stalkers","text":"You hear footsteps matching your pace.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-065","type":"Encounter","title":"Ruined Farm","text":"Something moves inside a ruined farmhouse.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-066","type":"Encounter","title":"Rocky Pass","text":"A hostile silhouette blocks the pass.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-067","type":"Encounter","title":"Riverbank Threat","text":"Figures emerge from reeds along the river.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-068","type":"Encounter","title":"Night Intruders","text":"Branches snap just beyond the firelight.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-069","type":"Encounter","title":"Old Quarry","text":"Voices echo from the quarry below.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-070","type":"Encounter","title":"Hilltop Watchers","text":"Several figures watch from the ridge.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-071","type":"Encounter","title":"Broken Gate","text":"Something waits beyond a broken gate.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-072","type":"Encounter","title":"Marsh Movement","text":"Ripples move against the current.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-073","type":"Encounter","title":"Cave Occupants","text":"A growl comes from the darkness ahead.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-074","type":"Encounter","title":"Abandoned Mill","text":"The mill door swings open from within.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-075","type":"Encounter","title":"Narrow Causeway","text":"Hostile shapes spread across the causeway.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-076","type":"Encounter","title":"Fogbound Road","text":"A figure appears suddenly in the fog.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-077","type":"Encounter","title":"Stone Circle","text":"You are not alone among the standing stones.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-078","type":"Encounter","title":"Forest Crossing","text":"Armed strangers emerge at the crossing.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-079","type":"Encounter","title":"Ravine Ambush","text":"Loose stones tumble from above.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-080","type":"Encounter","title":"Old Mine","text":"Scratching sounds come from the mine entrance.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-081","type":"Encounter","title":"Burned Village","text":"Movement flickers between ruined houses.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-082","type":"Encounter","title":"Watchtower Ruin","text":"A lookout spots you from the tower.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-083","type":"Encounter","title":"Mountain Trail","text":"A hostile group rounds the bend.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-084","type":"Encounter","title":"Swamp Path","text":"Something follows just beneath the reeds.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-085","type":"Encounter","title":"Moonlit Road","text":"Several shapes step into the road.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-086","type":"Encounter","title":"Forgotten Chapel","text":"A shadow moves behind the broken altar.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-087","type":"Encounter","title":"Border Stone","text":"Armed travellers refuse to yield the road.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-088","type":"Encounter","title":"Wooden Palisade","text":"A crude gate opens and armed figures emerge.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-089","type":"Encounter","title":"Dry Riverbed","text":"Movement appears among the boulders.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-090","type":"Encounter","title":"Deep Woods","text":"A sudden rustle becomes an immediate threat.","choices":[{"label":"Fight","result":"combat"},{"label":"Try to avoid","result":"avoid"}],"xp":0,"coins":[0,0,0]},{"id":"FTR-091","type":"Quiet","title":"Clear Road","text":"For a time the road is clear and easy.","choices":[],"xp":1,"coins":[0,0,0]},{"id":"FTR-092","type":"Quiet","title":"Cold Wind","text":"A cold wind follows you across open ground.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-093","type":"Quiet","title":"Passing Rain","text":"A brief shower darkens the road.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-094","type":"Quiet","title":"Birdsong","text":"Birdsong returns as the woods thin.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-095","type":"Quiet","title":"Long Climb","text":"The trail climbs steadily toward higher ground.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-096","type":"Quiet","title":"Distant Mountains","text":"Snowy peaks appear briefly through the clouds.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-097","type":"Quiet","title":"Old Road","text":"You follow worn paving stones from an older age.","choices":[],"xp":1,"coins":[0,0,0]},{"id":"FTR-098","type":"Quiet","title":"Quiet Forest","text":"Only leaves and your own footsteps break the silence.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-099","type":"Quiet","title":"Open Fields","text":"The route crosses broad empty fields.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-100","type":"Quiet","title":"River Road","text":"The road follows a slow river for several miles.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-101","type":"Quiet","title":"Morning Mist","text":"Mist hangs low over the ground.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-102","type":"Quiet","title":"Warm Sun","text":"Sunlight breaks through after a long grey stretch.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-103","type":"Quiet","title":"Evening Shadows","text":"Long shadows stretch across the trail.","choices":[],"xp":1,"coins":[0,0,0]},{"id":"FTR-104","type":"Quiet","title":"Distant Thunder","text":"Thunder rolls beyond the horizon.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-105","type":"Quiet","title":"Pine Ridge","text":"The scent of pine fills the cool air.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-106","type":"Quiet","title":"High Meadow","text":"Wildflowers cover a high meadow.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-107","type":"Quiet","title":"Stone Road","text":"Ancient stones make the walking easier.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-108","type":"Quiet","title":"Wind in Grass","text":"Tall grass bends in waves around the path.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-109","type":"Quiet","title":"Cloud Break","text":"A shaft of sunlight crosses the road.","choices":[],"xp":1,"coins":[0,0,0]},{"id":"FTR-110","type":"Quiet","title":"Quiet Stream","text":"A shallow stream runs beside the trail.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-111","type":"Quiet","title":"Frosted Ground","text":"A thin frost crunches beneath your boots.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-112","type":"Quiet","title":"Autumn Leaves","text":"Dry leaves gather in drifts along the road.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-113","type":"Quiet","title":"Distant Bells","text":"Faint bells carry from far away.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-114","type":"Quiet","title":"Old Oak","text":"A huge oak marks a peaceful bend in the road.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-115","type":"Quiet","title":"Night Sky","text":"The clouds clear enough to reveal the stars.","choices":[],"xp":1,"coins":[0,0,0]},{"id":"FTR-116","type":"Quiet","title":"Dawn Light","text":"The horizon brightens as another day begins.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-117","type":"Quiet","title":"Low Hills","text":"The road winds through gentle hills.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-118","type":"Quiet","title":"Cool Shade","text":"Dense trees give welcome shade.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-119","type":"Quiet","title":"Stone Bridge","text":"An old stone bridge crosses a narrow stream.","choices":[],"xp":0,"coins":[0,0,0]},{"id":"FTR-120","type":"Quiet","title":"Homeward Thoughts","text":"For a while your thoughts turn toward home.","choices":[],"xp":0,"coins":[0,0,0]}];
// Averathia Chapter 16 treasure data. Staged only; not wired into live loot until the remaining integration decisions are locked.
const AV_TREASURE_CARRIED={
 P:{coins:{cp:{chance:100,dice:"3d8"}}},
 Q:{coins:{sp:{chance:100,dice:"3d6"}}},
 R:{coins:{ep:{chance:100,dice:"2d6"}}},
 S:{coins:{gp:{chance:100,dice:"2d4"}},gems:{chance:5,dice:"1"}},
 T:{coins:{pp:{chance:100,dice:"1d6"}},gems:{chance:5,dice:"1"}},
 U:{coins:{cp:{chance:10,dice:"1d100"},sp:{chance:10,dice:"1d100"},gp:{chance:5,dice:"1d100"}},gems:{chance:5,dice:"1d2"},jewelry:{chance:5,dice:"1d4"},special:{chance:2,dice:"1"},magic:{chance:2,dice:"1"}},
 V:{coins:{sp:{chance:10,dice:"1d100"},ep:{chance:5,dice:"1d100"},gp:{chance:10,dice:"1d100"},pp:{chance:5,dice:"1d100"}},gems:{chance:10,dice:"1d2"},jewelry:{chance:10,dice:"1d4"},special:{chance:5,dice:"1"},magic:{chance:5,dice:"1"}}
};
const AV_TREASURE_LAIR={
 A:{coins:{cp:[25,"1d6"],sp:[30,"1d6"],ep:[20,"1d4"],gp:[35,"2d6"],pp:[25,"1d2"]},gems:[50,"6d6"],jewelry:[50,"6d6"],special:[10,"1d2"],magic:[30,{any:3}]},
 B:{coins:{cp:[50,"1d8"],sp:[25,"1d6"],ep:[25,"1d4"],gp:[35,"1d3"]},gems:[25,"1d6"],jewelry:[25,"1d6"],magic:[10,{oneOf:["sword","miscWeapon","armor"]}]},
 C:{coins:{cp:[20,"1d12"],sp:[30,"1d4"],ep:[10,"1d4"]},gems:[25,"1d4"],jewelry:[25,"1d4"],special:[5,"1d2"],magic:[10,{any:2}]},
 D:{coins:{cp:[10,"1d8"],sp:[15,"2d12"],gp:[60,"1d6"]},gems:[30,"1d8"],jewelry:[30,"1d8"],special:[10,"1d2"],magic:[15,{any:2,potion:1}]},
 E:{coins:{cp:[5,"1d10"],sp:[30,"2d12"],ep:[25,"1d4"],gp:[25,"1d8"]},gems:[10,"1d10"],jewelry:[10,"1d10"],special:[15,"1d2"],magic:[25,{any:3,scroll:1}]},
 F:{coins:{sp:[10,"2d10"],ep:[20,"1d8"],gp:[45,"1d12"],pp:[30,"1d3"]},gems:[20,"2d12"],jewelry:[10,"1d12"],special:[20,"1d3"],magic:[30,{potion:1,scroll:1,anyButWeapons:3}]},
 G:{coins:{gp:[50,"1d4x10"],pp:[50,"1d6"]},gems:[25,"3d6"],jewelry:[25,"1d10"],special:[30,"1d3"],magic:[35,{any:4,scroll:1}]},
 H:{coins:{cp:[25,"3d8"],sp:[50,"1d100"],ep:[50,"1d4x10"],gp:[50,"1d6x10"],pp:[25,"5d4"]},gems:[50,"1d100"],jewelry:[50,"1d4x10"],special:[10,"1d2"],magic:[15,{potion:1,scroll:1,any:4}]},
 I:{coins:{pp:[30,"1d8"]},gems:[50,"2d6"],jewelry:[50,"2d6"],special:[5,"1d2"],magic:[15,{any:1}]},
 J:{coins:{cp:[25,"1d4"],sp:[10,"1d3"]}},
 K:{coins:{sp:[30,"1d6"],ep:[10,"1d2"]}},
 L:{coins:{},gems:[50,"1d4"]},
 M:{coins:{gp:[40,"2d4"],pp:[50,"3d10"]},gems:[55,"5d4"],jewelry:[45,"2d6"]},
 N:{coins:{},special:[10,"1d2"],magic:[40,{potions:"2d4"}]},
 O:{coins:{},special:[10,"1d3"],magic:[50,{scrolls:"1d4"}]}
};
const AV_GEM_VALUE=[
 [3,10],[10,50],[25,100],[46,500],[71,1000],[90,5000],[97,10000],[100,"special"]
];
const AV_JEWELRY_VALUE=[
 [1,100],[3,500],[6,1000],[10,1500],[16,2000],[24,2500],[34,3000],[45,4000],[58,5000],
 [69,7500],[78,10000],[85,15000],[90,20000],[94,25000],[97,30000],[99,40000],[100,50000]
];
const AV_MAGIC_MAIN=[
 [25,"potion"],[37,"scroll"],[46,"wandStaffRod"],[52,"ring"],[62,"miscMagic"],
 [72,"armorShield"],[83,"missileWeaponOrMissile"],[92,"sword"],[100,"miscWeapon"]
];
const AV_COIN_TO_CP={cp:1,sp:10,ep:50,gp:100,pp:500};
const AV_POTION_TABLE=[
 [2,"Agility"],[3,"Animal Control"],[6,"Antidote"],[8,"Blending"],[10,"Bug Repellent"],
 [12,"Clairaudience"],[14,"Clairvoyance"],[16,"Climbing"],[18,"Defense"],[22,"Delusion"],
 [24,"Diminution"],[25,"Dragon Control"],[27,"Dreamspeech"],[28,"Elasticity"],[30,"Elemental Form"],
 [32,"ESP"],[33,"Ethereality"],[36,"Fire Resistance"],[39,"Flying"],[41,"Fortitude"],
 [42,"Freedom"],[45,"Gaseous Form"],[46,"Giant Control"],[49,"Giant Strength"],[51,"Growth"],
 [57,"Healing"],[60,"Heroism"],[61,"Human Control"],[64,"Invisibility"],[66,"Invulnerability"],
 [68,"Levitation"],[70,"Longevity"],[71,"Luck"],[72,"Merging"],[74,"Plant Control"],
 [77,"Poison"],[80,"Polymorph Self"],[82,"Sight"],[84,"Speech"],[88,"Speed"],
 [90,"Strength"],[93,"Super-Healing"],[96,"Swimming"],[97,"Treasure Finding"],[98,"Undead Control"],
 [100,"Water Breathing"]
];
const AV_SCROLL_TABLE=[
 [3,"Communication"],[5,"Creation"],[13,"Curse"],[14,"Delay"],[17,"Equipment"],[19,"Illumination"],
 [21,"Mages"],[25,"Map to normal treasure"],[28,"Map to magical treasure"],[30,"Map to combined treasure"],
 [31,"Map to special treasure"],[34,"Mapping"],[36,"Portals"],[42,"Protection from Elementals"],
 [50,"Protection from Lycanthropes"],[54,"Protection from Magic"],[61,"Protection from Undead"],
 [63,"Questioning"],[64,"Repetition"],[66,"Seeing"],[68,"Shelter"],[71,"Spell Catching"],
 [96,"Spell"],[98,"Trapping"],[100,"Truth"]
];
const AV_SCROLL_SPELL_COUNT=[[50,1],[83,2],[100,3]];
const AV_SCROLL_SPELL_LEVEL_CLERICAL=[[34,1],[58,2],[76,3],[88,4],[95,5],[99,6],[100,7]];
const AV_SCROLL_SPELL_LEVEL_MAGICAL=[[28,1],[49,2],[64,3],[75,4],[84,5],[91,6],[96,7],[99,8],[100,9]];
const AV_SCROLL_LOW_SPELLS={
 Magical:{
  1:["Analyze","Charm Person","Detect Magic","Floating Disc","Hold Portal","Light","Magic Missile","Protection from Evil","Read Languages","Read Magic","Shield","Sleep","Ventriloquism"],
  2:["Continual Light","Detect Evil","Detect Invisible","Entangle","ESP","Invisibility","Knock","Levitate","Locate Object","Mirror Image","Phantasmal Force","Web","Wizard Lock"],
  3:["Clairvoyance","Create Air","Dispel Magic","Fireball","Fly","Haste","Hold Person","Infravision","Invisibility 10' Radius","Lightning Bolt","Protection from Evil 10' Radius","Protection from Normal Missiles","Water Breathing"]
 },
 Clerical:{
  1:["Cure Light Wounds","Detect Evil","Detect Magic","Light","Protection from Evil","Purify Food and Water","Remove Fear","Resist Cold"],
  2:["Bless","Find Traps","Know Alignment","Hold Person","Resist Fire","Silence 15' Radius","Snake Charm","Speak with Animals"],
  3:["Continual Light","Cure Disease","Growth of Animals","Locate Object","Remove Curse","Striking"]
 }
};
function avScrollSpellType(){let r=d(100);return r<=70?"Magical":r<=95?"Clerical":"Druidic"}
function avScrollSpellLevel(type){
 let table=type==="Magical"?AV_SCROLL_SPELL_LEVEL_MAGICAL:AV_SCROLL_SPELL_LEVEL_CLERICAL;
 return avTablePick(table)
}
function avImplementedSpellLink(type,name,level){
 let list=type==="Magical"?(typeof ARCANE_NOW!=="undefined"?ARCANE_NOW:[]):type==="Clerical"?(typeof CLERIC_NOW!=="undefined"?CLERIC_NOW:[]):[];
 let hit=list.find(x=>x.sl===level&&(x.av===name||x.name===name));
 return hit?{id:hit.id,name:hit.name,av:hit.av,sl:hit.sl}:null
}
function avRollSpellScrollDetail(){
 let type=avScrollSpellType(),count=avTablePick(AV_SCROLL_SPELL_COUNT),spells=[];
 for(let i=0;i<count;i++){
  let level=avScrollSpellLevel(type),names=AV_SCROLL_LOW_SPELLS[type]?.[level]||null,name=names?names[d(names.length)-1]:null;
  let entry={type,level,name:name||null};
  if(name)entry.implemented=avImplementedSpellLink(type,name,level);
  spells.push(entry)
 }
 return{type,count,spells}
}

const AV_WAND_STAFF_ROD_TABLE=[
 [5,"Wand of Cold"],[10,"Wand of Enemy Detection"],[14,"Wand of Fear"],[19,"Wand of Fireballs"],
 [23,"Wand of Illusion"],[28,"Wand of Lightning Bolts"],[33,"Wand of Magic Detection"],
 [38,"Wand of Metal Detection"],[42,"Wand of Negation"],[47,"Wand of Paralyzation"],
 [52,"Wand of Polymorphing"],[56,"Wand of Secret Door Detection"],[60,"Wand of Trap Detection"],
 [61,"Staff of Commanding"],[63,"Staff of Dispelling"],[66,"Staff of the Druids"],
 [69,"Staff of an Element"],[71,"Staff of Harming"],[78,"Staff of Healing"],[79,"Staff of Power"],
 [82,"Snake Staff"],[85,"Staff of Striking"],[87,"Staff of Withering"],[88,"Staff of Wizardry"],
 [90,"Rod of Cancellation"],[91,"Rod of Dominion"],[92,"Rod of Health"],[94,"Rod of Inertia"],
 [95,"Rod of Parrying"],[96,"Rod of Victory"],[99,"Rod of Weaponry"],[100,"Rod of the Wyrm"]
];
const AV_RING_TABLE=[
 [2,"Animal Control"],[8,"Delusion"],[9,"Djinni Summoning"],[13,"Ear"],[17,"Elemental Adaptation"],
 [23,"Fire Resistance"],[26,"Holiness"],[27,"Human Control"],[32,"Invisibility"],[35,"Life Protection"],
 [38,"Memory"],[40,"Plant Control"],[45,"Protection +1"],[48,"Protection +2"],[50,"Protection +3"],
 [51,"Protection +4"],[55,"Quickness"],[56,"Regeneration"],[59,"Remedies"],[61,"Safety"],
 [64,"Seeing"],[67,"Spell Eating"],[69,"Spell Storing"],[71,"Spell Turning"],[75,"Survival"],
 [77,"Telekinesis"],[81,"Truth"],[84,"Truthfulness"],[86,"Truthlessness"],[91,"Water Walking"],
 [96,"Weakness"],[98,"Wishes"],[100,"X-ray Vision"]
];
const AV_MISC_MAGIC_TABLE=[
 [2,"Amulet of Protection from Crystal Balls and ESP"],[4,"Bag of Devouring"],[9,"Bag of Holding"],
 [12,"Boat, Undersea"],[14,"Boots of Levitation"],[17,"Boots of Speed"],[19,"Boots of Traveling/Leaping"],
 [20,"Bowl of Commanding Water Elementals"],[21,"Brazier of Commanding Fire Elementals"],[23,"Broom of Flying"],
 [24,"Censer of Controlling Air Elementals"],[27,"Chime of Time"],[29,"Crystal Ball"],[30,"Crystal Ball with Clairaudience"],
 [31,"Crystal Ball with ESP"],[33,"Displacer Cloak"],[34,"Drums of Panic"],[35,"Efreeti Bottle"],
 [38,"Egg of Wonder"],[40,"Elven Boots"],[42,"Elven Cloak"],[43,"Flying Carpet"],[45,"Gauntlets of Ogre Power"],
 [47,"Girdle of Giant Strength"],[49,"Helm of Alignment Changing"],[51,"Helm of Reading"],[52,"Helm of Telepathy"],
 [53,"Helm of Teleportation"],[54,"Horn of Blasting"],[56,"Lamp, Hurricane"],[59,"Lamp of Long Burning"],
 [61,"Medallion of ESP, 30' range"],[62,"Medallion of ESP, 90' range"],[63,"Mirror of Life Trapping"],
 [66,"Muzzle of Training"],[68,"Nail, Finger"],[71,"Nail of Pointing"],[76,"Ointment"],[79,"Pouch of Security"],
 [82,"Quill of Copying"],[86,"Rope of Climbing"],[88,"Scarab of Protection"],[91,"Slate of Identification"],
 [92,"Stone of Controlling Earth Elementals"],[94,"Talisman of Elemental Travel"],[97,"Wheel of Floating"],
 [98,"Wheel of Fortune"],[100,"Wheel, Square"]
];
const AV_ARMOR_SIZE=[[68,"Human"],[81,"Dwarf"],[91,"Elf"],[98,"Halfling"],[100,"Giant"]];
const AV_ARMOR_TYPE=[
 [10,"Leather Armor"],[17,"Scale Mail"],[30,"Chain Mail"],[39,"Banded Mail"],[50,"Plate Mail"],
 [55,"Suit Armor"],[75,"Shield"],[77,"Scale Mail & Shield"],[85,"Chain Mail & Shield"],
 [90,"Banded Mail & Shield"],[100,"Plate Mail & Shield"]
];
const AV_ARMOR_SPECIAL=[[7,"Absorption"],[17,"Charm"],[32,"Cure Wounds"],[42,"Electricity"],[47,"Energy Drain"],[50,"Ethereality"],[60,"Fly"],[66,"Gaseous Form"],[75,"Haste"],[85,"Invisibility"],[93,"Reflection"],[100,"Remove Curse"]];
const AV_SIMPLE_MAGIC_MISSILE=[
 [6,"Arrows +1 (2d10)"],[11,"Arrows +2 (2d6)"],[15,"Arrows +3 (2d4)"],[18,"Arrow +1, silver"],[20,"Arrow +2, silver"],[21,"Arrow +3, silver"],
 [25,"Blowgun +1"],[28,"Bola +1"],[33,"Short Bow +1"],[37,"Short Bow +2"],[40,"Short Bow +3"],
 [45,"Long Bow +1"],[49,"Long Bow +2"],[52,"Long Bow +3"],[57,"Light Crossbow +1"],[61,"Light Crossbow +2"],[64,"Light Crossbow +3"],
 [69,"Heavy Crossbow +1"],[73,"Heavy Crossbow +2"],[76,"Heavy Crossbow +3"],[82,"Quarrels +1 (2d10)"],[87,"Quarrels +2 (2d6)"],
 [91,"Quarrels +3 (2d4)"],[94,"Quarrel +1, silver"],[96,"Quarrel +2, silver"],[97,"Quarrel +3, silver"],[100,"Sling +1"]
];
const AV_SIMPLE_MAGIC_SWORD=[
 [10,"Short Sword +1"],[20,"Short Sword +2"],[30,"Short Sword +3"],[34,"Sword +1"],[35,"Sword +1, +3 vs dragonkind"],
 [36,"Sword +1, +3 vs giantkind"],[37,"Sword +1, +3 vs lycanthropes"],[38,"Sword +1, +3 vs regenerating monsters"],
 [39,"Sword +1, +3 vs spellcasters"],[40,"Sword +1, +3 vs undead"],[50,"Sword +2"],[60,"Sword +3"],[64,"Bastard Sword +1"],
 [65,"Bastard Sword +1, +3 vs dragonkind"],[66,"Bastard Sword +1, +3 vs giantkind"],[67,"Bastard Sword +1, +3 vs lycanthropes"],
 [68,"Bastard Sword +1, +3 vs regenerating monsters"],[69,"Bastard Sword +1, +3 vs spellcasters"],[70,"Bastard Sword +1, +3 vs undead"],
 [75,"Bastard Sword +2"],[80,"Bastard Sword +3"],[84,"Two-Handed Sword +1"],[85,"Two-Handed Sword +1, +3 vs dragonkind"],
 [86,"Two-Handed Sword +1, +3 vs giantkind"],[87,"Two-Handed Sword +1, +3 vs lycanthropes"],[88,"Two-Handed Sword +1, +3 vs regenerating monsters"],
 [89,"Two-Handed Sword +1, +3 vs spellcasters"],[90,"Two-Handed Sword +1, +3 vs undead"],[95,"Two-Handed Sword +2"],[100,"Two-Handed Sword +3"]
];
const AV_SIMPLE_MAGIC_MISC_WEAPON=[
 [5,"Battle Axe +1"],[8,"Battle Axe +2"],[10,"Battle Axe +3"],[15,"Hand Axe +1"],[18,"Hand Axe +2"],[20,"Hand Axe +3"],
 [25,"Dagger +1"],[28,"Dagger +2"],[30,"Dagger +3"],[35,"Throwing Hammer +1"],[38,"Throwing Hammer +2"],[40,"Throwing Hammer +3"],
 [45,"War Hammer +1"],[48,"War Hammer +2"],[50,"War Hammer +3"],[55,"Mace +1"],[58,"Mace +2"],[60,"Mace +3"],
 [65,"Polearm +1"],[68,"Polearm +2"],[70,"Polearm +3"],[72,"Horned Shield +1"],[75,"Knife Shield +1"],[78,"Sword Shield +1"],
 [80,"Tusked Shield +1"],[85,"Spear +1"],[88,"Spear +2"],[90,"Spear +3"],[95,"Staff +1"],[98,"Staff +2"],[100,"Staff +3"]
];

function avTablePick(table,roll=d(100)){for(const [max,value] of table)if(roll<=max)return value;return table.at(-1)?.[1]}
function avRollScaled(expr){
 let m=/^(\d+d\d+(?:[+-]\d+)?|\d+)(?:x(\d+))?$/i.exec(String(expr||"").replace(/\s+/g,""));
 if(!m)return 0;
 let base=/d/i.test(m[1])?rollExpr(m[1]):+m[1],mult=+(m[2]||1);
 return Math.max(0,base*mult);
}
function avCoinValueCP(kind,count){return Math.max(0,Math.floor(Number(count)||0))*(AV_COIN_TO_CP[kind]||0)}
function avCreditCoins(coins={}){
 let total=0,converted={ep:0,pp:0};
 for(const [kind,count] of Object.entries(coins)){total+=avCoinValueCP(kind,count);if(kind==="ep"||kind==="pp")converted[kind]+=count}
 let credited=creditWalletValueCP(total,!!h?.trip);
 return{cpValue:credited.cpValue,leftCP:credited.leftCP,converted};
}
function avMagicInventoryItem(category,name){
 if(category==="potion"&&name==="Healing")return{n:"Healing Potion",kind:"gear",can:false,eq:false,avMagic:true,avCategory:"potion",avItem:"Healing"};
 let supported=(category==="potion"&&["Super-Healing","Fire Resistance","Speed","Defense","Freedom","Antidote"].includes(name))||(category==="wandStaffRod"&&["Wand of Fireballs","Wand of Lightning Bolts","Staff of Healing","Rod of Health"].includes(name));
 return{n:`Averathia ${category}: ${name}`,kind:"gear",can:false,eq:false,avMagic:true,avCategory:category,avItem:name,unsupportedMagic:!supported};
}
function rollRcPotion(){let name=avTablePick(AV_POTION_TABLE);return avMagicInventoryItem("potion",name)}
function avChargesFor(name){
 if(name.startsWith("Wand "))return rollExpr("3d10");
 if(name.startsWith("Staff ")||name==="Snake Staff")return rollExpr("2d20");
 return null
}
function avArmorBonusFor(type){
 let r=d(100),group=/Shield/.test(type)&&!/Mail/.test(type)?"shield":/Plate|Suit/.test(type)?"plate":/Chain/.test(type)?"chain":"light";
 let cuts=group==="shield"?[[40,1],[67,2],[84,3],[94,4],[100,5]]:group==="plate"?[[50,1],[74,2],[88,3],[96,4],[100,5]]:group==="chain"?[[60,1],[81,2],[92,3],[98,4],[100,5]]:[[70,1],[88,2],[96,3],[99,4],[100,5]];
 return avTablePick(cuts,r)
}
const AV_SUPPORTED_MAGIC_WEAPON_BASES=new Set(["Short Sword","Sword","Two-Handed Sword","Battle Axe","Hand Axe","Dagger","Throwing Hammer","War Hammer","Mace","Polearm","Spear","Staff","Short Bow","Long Bow","Light Crossbow","Heavy Crossbow","Sling"]);
const AVERATHIA_MAGIC_TIER_NAMES={1:"Gilded",2:"Etched",3:"Runed",4:"Touched",5:"Blessed"};
const AVERATHIA_BANE_NAMES={
 "dragonkind":"Dragon Bane","giantkind":"Giant Bane","lycanthropes":"Lycanthrope Bane",
 "regenerating monsters":"Regeneration Bane","spellcasters":"Spellcaster Bane","undead":"Undead Bane"
};
function magicTierName(bonus){return AVERATHIA_MAGIC_TIER_NAMES[Math.max(1,Math.min(5,Math.trunc(Number(bonus)||1)))]||"Enchanted"}
function magicPropertyName(raw){let key=String(raw||"").trim().toLowerCase();return AVERATHIA_BANE_NAMES[key]||String(raw||"").trim()}
function magicCounterTarget(raw){let key=String(raw||"").trim().toLowerCase(),map={"dragonkind":"Dragonkind","giantkind":"Giantkind","lycanthropes":"Lycanthropes","regenerating monsters":"Regenerating Monsters","spellcasters":"Spellcasters","undead":"Undead"};return map[key]||String(raw||"").trim()}
function formatMagicBonusCounter(bonus,vsBonus=0,vs=null){let base=`+${bonus}`;return vsBonus&&vs?`(${base} / +${vsBonus} vs ${magicCounterTarget(vs)})`:`(${base})`}
function formatMagicWeaponName(base,bonus,vsBonus=0,vs=null){let prop=vs?`, ${magicPropertyName(vs)}`:"";return `${magicTierName(bonus)} ${base}${prop} ${formatMagicBonusCounter(bonus,vsBonus,vs)}`}
function formatMagicArmorName(size,type,bonus,power=null,cursed=false){
 let sizePart=size&&size!=="Human"?`${size} `:"",special=power?`${magicPropertyName(power)} `:"",curse=cursed?"Cursed ":"";
 return `${magicTierName(bonus)} ${curse}${special}${sizePart}${type} (+${bonus})`
}
function refreshRcMagicDisplayName(item){
 if(!item?.avMagic)return item;
 if(item.kind==="weapon"&&item.baseWeapon&&item.magicBonus){item.n=formatMagicWeaponName(item.baseWeapon,item.magicBonus,item.avVsBonus,item.avVs);return item}
 if(["armor","shield"].includes(item.kind)&&item.baseArmor&&item.magicBonus){item.n=formatMagicArmorName(item.avSize,item.baseArmor,item.magicBonus,item.avSpecialPower,item.cursed);return item}
 return item
}
function avParseMagicWeaponName(name){
 let m=/^(.*) \+(\d)(?:, \+(\d) vs (.+))?$/.exec(String(name||""));if(!m)return null;
 let base=m[1],bonus=+m[2],vsBonus=m[3]?+m[3]:0,vs=m[4]||null;
 if(!AV_SUPPORTED_MAGIC_WEAPON_BASES.has(base))return null;
 return{base,bonus,vsBonus,vs}
}
function avMagicWeaponItem(category,name){
 let p=avParseMagicWeaponName(name);if(!p)return{n:name,kind:"gear",can:false,eq:false,avMagic:true,avCategory:category,avItem:name,unsupportedMagic:true,avWeaponGeneration:"simple"};
 let item={n:formatMagicWeaponName(p.base,p.bonus,p.vsBonus,p.vs),kind:"weapon",can:true,eq:false,avMagic:true,magical:true,avCategory:category,avItem:name,baseWeapon:p.base,magicBonus:p.bonus,avVsBonus:p.vsBonus,avVs:p.vs,unsupportedMagic:!!p.vs,partialMagic:!!p.vs,avWeaponGeneration:"simple"};
 return item
}
function avArmorNormalSize(size){return ["Human","Dwarf","Elf"].includes(size)}
function avMagicArmorItem(size,type,bonus,power,cursed,name){
 let single=type==="Shield"||SHOP.Armor.some(x=>x[0]===type),normal=avArmorNormalSize(size),display=formatMagicArmorName(size,type,bonus,power,cursed);
 if(!single||!normal||cursed)return{n:display,kind:"gear",can:false,eq:false,avMagic:true,avCategory:"armorShield",avItem:type,avOriginalName:name,avSize:size,magicBonus:bonus,avSpecialPower:power,cursed,unsupportedMagic:true};
 let kind=type==="Shield"?"shield":"armor";return{n:display,kind,can:true,eq:false,avMagic:true,magical:true,avCategory:"armorShield",avItem:type,avOriginalName:name,baseArmor:type,avSize:size,magicBonus:bonus,avSpecialPower:power,cursed:false,unsupportedMagic:!!power,partialMagic:!!power}
}
function rollRcArmorShield(){
 let size=avTablePick(AV_ARMOR_SIZE),type=avTablePick(AV_ARMOR_TYPE),bonus=avArmorBonusFor(type),chance={1:10,2:15,3:20,4:25,5:30}[bonus],power=avChance(chance)?avTablePick(AV_ARMOR_SPECIAL):null,cursed=d(8)===1;
 let name=`${size} ${type} ${cursed?"cursed ":""}+${bonus}${power?" — "+power:""}`;
 return avMagicArmorItem(size,type,bonus,power,cursed,name)
}
function rollRcSimpleMagicWeapon(category){
 let table=category==="missileWeaponOrMissile"?AV_SIMPLE_MAGIC_MISSILE:category==="sword"?AV_SIMPLE_MAGIC_SWORD:AV_SIMPLE_MAGIC_MISC_WEAPON;
 let name=avTablePick(table);return avMagicWeaponItem(category,name)
}
function rollRcNamedMagic(category){
 if(category==="armorShield")return rollRcArmorShield();
 if(["missileWeaponOrMissile","sword","miscWeapon"].includes(category))return rollRcSimpleMagicWeapon(category);
 let table={scroll:AV_SCROLL_TABLE,wandStaffRod:AV_WAND_STAFF_ROD_TABLE,ring:AV_RING_TABLE,miscMagic:AV_MISC_MAGIC_TABLE}[category];
 if(!table)return avMagicInventoryItem(category,"Unresolved Averathia subtable item");
 let name=avTablePick(table),item=avMagicInventoryItem(category,name),charges=avChargesFor(name);
 if(charges!=null)item.charges=charges;
 if(category==="scroll"&&name==="Spell"){
   let detail=avRollSpellScrollDetail();item.avSpellScroll=true;item.avScrollType=detail.type;item.spellCount=detail.count;item.avScrollSpells=detail.spells;
   item.n=`Averathia Spell Scroll — ${detail.type} (${detail.count} spell${detail.count===1?"":"s"})`;
 }
 return item
}
function rollRcMagicAny(allowed=null){
 let candidates=AV_MAGIC_MAIN.filter(([,c])=>!allowed||allowed.includes(c)),roll=d(100),cat;
 if(!allowed)cat=avTablePick(AV_MAGIC_MAIN,roll);
 else{let guard=0;do{cat=avTablePick(AV_MAGIC_MAIN)}while(!allowed.includes(cat)&&++guard<100);if(!allowed.includes(cat))cat=allowed[d(allowed.length)-1]}
 if(cat==="potion")return rollRcPotion();
 return rollRcNamedMagic(cat)
}

const AV_JEWELRY_TYPES={
 common:["Anklet","Beads","Bracelet","Brooch","Buckle","Cameo","Chain","Clasp","Locket","Pin"],
 uncommon:["Armband","Belt","Collar","Earring","Four-Leaf Clover","Heart","Leaf","Necklace","Pendant","Rabbit's Foot"],
 rare:["Amulet","Crown","Diadem","Medallion","Orb","Ring (nonmagical)","Scarab","Scepter","Talisman","Tiara"]
};
const AV_SPECIAL_TREASURE_TABLE=[
 {max:10,n:"Rare Book",enc:"2d100",value:"1d100x10"},
 {max:12,n:"Common Fur Pelt",enc:"1d6x10",value:"1d4"},
 {max:17,n:"Common Fur Cape",enc:"1d8+4x10",value:"1d6x100"},
 {max:20,n:"Common Fur Coat",enc:"2d6+8x10",value:"3d4x100"},
 {max:22,n:"Rare Fur Pelt",enc:"1d6x10",value:"2d6"},
 {max:27,n:"Rare Fur Cape",enc:"1d8+4x10",value:"4d6x100"},
 {max:30,n:"Rare Fur Coat",enc:"2d6+8x10",value:"1d6x1000"},
 {max:35,n:"Rare Incense",enc:"1",value:"5d6",unit:"stick"},
 {max:40,n:"Rare Perfume",enc:"1",value:"1d10+5x10",unit:"vial"},
 {max:55,n:"Rug or Tapestry",enc:"1d6x100",value:"2d10",unit:"square yard",quantityUnspecified:true},
 {max:65,n:"Silk",enc:"1d6x10",value:"1d8",unit:"square yard",quantityUnspecified:true},
 {max:75,n:"Animal Skin",enc:"5d4x10",value:"1d10"},
 {max:85,n:"Monster Skin",enc:"1d10x50",value:"1d10x100"},
 {max:90,n:"Rare Spice",enc:"1d100",value:"4d4",valuePerEnc:true},
 {max:95,n:"Statuette",enc:"1d100",value:"1d10x100"},
 {max:100,n:"Rare Wine",encBottles:"1d6+3",value:"1d6",unit:"bottle"}
];
function avChance(p){return d(100)<=p}
function avBlankTreasure(source,type){return{source,type,coins:{cp:0,sp:0,ep:0,gp:0,pp:0},gems:[],jewelry:[],special:[],magic:[]}}
function avMergeTreasure(a,b,mult=1){
 for(const k of ["cp","sp","ep","gp","pp"])a.coins[k]+=(b.coins[k]||0)*mult;
 for(const k of ["gems","jewelry","special","magic"])for(const x of b[k]||[])for(let i=0;i<mult;i++)a[k].push({...x});
 return a
}
const AV_STARSTONE_BASES=[
 {name:"Star Carbuncle",value:1000},{name:"Star Opal",value:1000},{name:"Star Emerald",value:5000},
 {name:"Star Ruby",value:5000},{name:"Star Sapphire",value:5000},{name:"Star Jacinth",value:10000}
];
function avSpecialGemItem(){
 if(d(2)===1){let base=AV_STARSTONE_BASES[d(AV_STARSTONE_BASES.length)-1],value=base.value*2;return{n:`${base.name} — ${value.toLocaleString()} GP`,kind:"treasure",avTreasure:true,avGem:true,avSpecialGem:"starstone",gpValue:value,treasureValueCP:gpToCP(value),avCashFeePct:d(5),avEncumbrance:1}}
 let value=50000;return{n:`Tristal — ${value.toLocaleString()} GP`,kind:"treasure",avTreasure:true,avGem:true,avSpecialGem:"tristal",gpValue:value,treasureValueCP:gpToCP(value),avCashFeePct:d(5),avEncumbrance:1}
}
function avGemItem(level=h?.level||1){
 let roll=d(100);if(level<9)roll=Math.max(1,roll-10);
 let v=avTablePick(AV_GEM_VALUE,roll);
 if(v==="special")return avSpecialGemItem();
 return{n:`Gem — ${v.toLocaleString()} GP`,kind:"treasure",avTreasure:true,avGem:true,treasureValueCP:gpToCP(v),gpValue:v,avCashFeePct:d(5),avEncumbrance:1}
}
function avJewelryItem(level=h?.level||1){
 let roll=d(100);if(level<9)roll=Math.max(1,roll-10);
 let value=avTablePick(AV_JEWELRY_VALUE,roll),band=value<4000?"common":value<15000?"uncommon":"rare";
 let types=AV_JEWELRY_TYPES[band],name=types[d(types.length)-1];
 return{n:`${name} — ${value.toLocaleString()} GP`,kind:"treasure",avTreasure:true,avJewelry:true,treasureValueCP:gpToCP(value),gpValue:value,avCashFeePct:d(6)+d(6),avEncumbrance:avJewelryBulkPoints(value)}
}
function avSpecialTreasureItem(){
 let roll=d(100),row=AV_SPECIAL_TREASURE_TABLE.find(x=>roll<=x.max)||AV_SPECIAL_TREASURE_TABLE.at(-1),item={n:row.n,kind:"treasure",avTreasure:true,avSpecial:true};
 if(row.encBottles){
   let qty=avRollScaled(row.encBottles),per=avRollScaled(row.value);
   item.avQuantity=qty;item.avUnit=row.unit;item.avEncumbrance=qty*10;item.avValuePerGP=per;item.gpValue=qty*per;item.treasureValueCP=gpToCP(item.gpValue);return item
 }
 let enc=avRollScaled(row.enc),value=avRollScaled(row.value);
 if(row.quantityUnspecified){
   let qty=d(6);item.avQuantity=qty;item.avUnit=row.unit;item.avQuantityRule="Averathia 1d6 square yards";item.avEncumbrancePerUnit=enc;item.avValuePerGP=value;item.avEncumbrance=qty*enc;item.gpValue=qty*value;item.treasureValueCP=gpToCP(item.gpValue);item.n=`${row.n} — ${qty} sq yd`;return item
 }
 item.avEncumbrance=enc;
 if(row.valuePerEnc){
   item.avValuePerGP=value;item.avValuePer="cn encumbrance";item.gpValue=enc*value;item.treasureValueCP=gpToCP(item.gpValue);return item
 }
 item.gpValue=value;item.treasureValueCP=gpToCP(value);if(row.unit)item.avUnit=row.unit;return item
}
function avRollMagicSpec(spec){
 let out=[];
 if(!spec)return out;
 if(spec.oneOf){let map={sword:"sword",miscWeapon:"miscWeapon",armor:"armorShield"},cats=spec.oneOf.map(x=>map[x]||x);out.push(rollRcMagicAny(cats))}
 for(let i=0;i<(spec.any||0);i++)out.push(rollRcMagicAny());
 for(let i=0;i<(spec.potion||0);i++)out.push(rollRcPotion());
 for(let i=0;i<(spec.scroll||0);i++)out.push(rollRcNamedMagic("scroll"));
 for(let i=0;i<(spec.anyButWeapons||0);i++)out.push(rollRcMagicAny(["potion","scroll","wandStaffRod","ring","miscMagic","armorShield"]));
 let np=spec.potions?avRollScaled(spec.potions):0;for(let i=0;i<np;i++)out.push(rollRcPotion());
 let ns=spec.scrolls?avRollScaled(spec.scrolls):0;for(let i=0;i<ns;i++)out.push(rollRcNamedMagic("scroll"));
 return out
}
function avRollCarriedType(type,mult=1,level=h?.level||1){
 let row=AV_TREASURE_CARRIED[type],out=avBlankTreasure("carried",type);if(!row)return out;
 for(const [kind,spec] of Object.entries(row.coins||{}))if(spec.chance===100||avChance(spec.chance))out.coins[kind]+=avRollScaled(spec.dice)*mult;
 if(row.gems&&(row.gems.chance===100||avChance(row.gems.chance))){let n=avRollScaled(row.gems.dice)*mult;if(type==="U"||type==="V")n=Math.min(1,n);while(n--)out.gems.push(avGemItem(level))}
 if(row.jewelry&&(row.jewelry.chance===100||avChance(row.jewelry.chance))){let n=avRollScaled(row.jewelry.dice)*mult;if(type==="U"||type==="V")n=Math.min(1,n);while(n--)out.jewelry.push(avJewelryItem(level))}
 if(row.special&&(row.special.chance===100||avChance(row.special.chance))){let n=avRollScaled(row.special.dice)*mult;while(n--)out.special.push(avSpecialTreasureItem())}
 if(row.magic&&(row.magic.chance===100||avChance(row.magic.chance))){let n=avRollScaled(row.magic.dice)*mult;while(n--)out.magic.push(rollRcMagicAny())}
 return out
}
function avRollLairType(type,level=h?.level||1){
 let row=AV_TREASURE_LAIR[type],out=avBlankTreasure("lair",type);if(!row)return out;
 for(const [kind,spec] of Object.entries(row.coins||{}))if(avChance(spec[0]))out.coins[kind]+=avRollScaled(spec[1])*1000;
 if(row.gems&&avChance(row.gems[0])){let n=avRollScaled(row.gems[1]);while(n--)out.gems.push(avGemItem(level))}
 if(row.jewelry&&avChance(row.jewelry[0])){let n=avRollScaled(row.jewelry[1]);while(n--)out.jewelry.push(avJewelryItem(level))}
 if(row.special&&avChance(row.special[0])){let n=avRollScaled(row.special[1]);while(n--)out.special.push(avSpecialTreasureItem())}
 if(row.magic&&avChance(row.magic[0]))out.magic.push(...avRollMagicSpec(row.magic[1]));
 return out
}
function monsterKey(m){return m?.monsterId??m?.id}
function avMonsterTreasureProfile(m){
 let tt=String(m?.avTreasureType||"Nil").trim();if(!tt||tt==="Nil")return{carried:[],lair:[]};
 if(monsterKey(m)==="ogre")return{carried:[{type:"S",mult:10}],lair:[{type:"S",mult:100,carriedStyle:true},{type:"C",mult:1}]};
 let carried=[],lair=[],paren=tt.match(/^\(([P-V])\)\s*(.*)$/);
 if(paren){carried.push({type:paren[1],mult:1});tt=paren[2].trim()}
 for(const letter of tt.match(/[A-V]/g)||[]){if(/[P-V]/.test(letter))carried.push({type:letter,mult:1});else lair.push({type:letter,mult:1})}
 return{carried,lair}
}
function avRollMonsterCarried(m,level=h?.level||1){
 let p=avMonsterTreasureProfile(m),out=avBlankTreasure("monster",m?.n||m?.id||"monster");
 for(const x of p.carried)avMergeTreasure(out,avRollCarriedType(x.type,x.mult,level));
 return out
}
function journeySpoilsForMonster(m){
 let out=avBlankTreasure("journey-spoils",m?.n||m?.id||"monster");
 // Averathia fallback: humanoid enemies with no Averathia individual treasure still carry a useful personal purse.
 if(m?.humanoid){out.coins.gp+=d(6);out.coins.sp+=d(6);out.coins.cp+=d(6)}
 return out
}
function avRollMonsterLair(m,level=h?.level||1){
 let p=avMonsterTreasureProfile(m),out=avBlankTreasure("monster-lair",m?.n||m?.id||"monster");
 for(const x of p.lair){
  if(x.carriedStyle)avMergeTreasure(out,avRollCarriedType(x.type,x.mult,level));
  else avMergeTreasure(out,avRollLairType(x.type,level),x.mult||1)
 }
 return out
}
function avTreasureCoinCP(t){return Object.entries(t?.coins||{}).reduce((sum,[k,v])=>sum+avCoinValueCP(k,v),0)}
function avTreasureItemValueCP(t){return["gems","jewelry","special"].flatMap(k=>t?.[k]||[]).reduce((sum,x)=>sum+(Number.isFinite(x.treasureValueCP)?x.treasureValueCP:0),0)}
function settleTripTreasureXP(){
 let cp=Math.max(0,Math.trunc(Number(h?.trip?.avTreasureXpCP)||0)),baseXP=Math.floor(cp/100);if(!baseXP)return{baseXP:0,gained:0,cp};
 let gained=awardXP(baseXP);
 journal({id:"Averathia-TREASURE-XP",type:"Progression",title:"Treasure XP",text:`${baseXP} GP eligible treasure value recovered.`,result:"treasureXP",xp:gained,coins:[0,0,0]});
 addlog(`Treasure XP: ${baseXP} GP eligible value → +${gained} XP.`,"Progression");
 return{baseXP,gained,cp}
}

function avUnguardedBracket(level=h?.level||1){return AV_UNGUARDED_TREASURE.find(x=>level>=x.levels[0]&&level<=x.levels[1])||AV_UNGUARDED_TREASURE.at(-1)}
function avRollUnguardedTreasure(level=h?.level||1){
 let row=avUnguardedBracket(level),out=avBlankTreasure("unguarded",`Level ${level}`);
 if(row.sp)out.coins.sp+=avRollScaled(row.sp);
 if(row.gp){if(typeof row.gp==="string"||avChance(row.gp[0]))out.coins.gp+=avRollScaled(typeof row.gp==="string"?row.gp:row.gp[1])}
 if(row.gems&&avChance(row.gems[0])){let n=avRollScaled(row.gems[1]);while(n--)out.gems.push(avGemItem(level))}
 if(row.jewelry&&avChance(row.jewelry[0])){let n=avRollScaled(row.jewelry[1]);while(n--)out.jewelry.push(avJewelryItem(level))}
 if(row.magic&&avChance(row.magic[0]))out.magic.push(...avRollMagicSpec(row.magic[1]));
 return out
}
function avTreasureAllItems(t){return["gems","jewelry","special","magic"].flatMap(k=>t?.[k]||[])}
function avApplyTreasure(t){
 let items=avTreasureAllItems(t),accepted=[],left=[];
 h.inv=h.inv||[];
 for(const item of items){if(!h.trip||canCarryAdditionalBP(itemBulkPoints(item))){h.inv.push(item);accepted.push(item)}else left.push(item)}
 let credited=avCreditCoins(t?.coins||{});
 let gemJewelryCP=accepted.filter(x=>x?.avGem||x?.avJewelry).reduce((sum,x)=>sum+(Number.isFinite(x?.treasureValueCP)?x.treasureValueCP:0),0);
 let eligibleXPcp=credited.cpValue+gemJewelryCP;
 if(h.trip&&eligibleXPcp>0)h.trip.avTreasureXpCP=Math.max(0,Number(h.trip.avTreasureXpCP)||0)+eligibleXPcp;
 if(h.trip&&(left.length||credited.leftCP)){let bits=[];if(left.length)bits.push(`${left.length} item${left.length===1?"":"s"}`);if(credited.leftCP)bits.push(coinTextCP(credited.leftCP)+" in coins");addlog(`Carry limit: left behind ${bits.join(" and ")}.`,"Loot")}
 return{creditedCP:credited.cpValue,leftCoinCP:credited.leftCP||0,items:accepted.length,leftItems:left,converted:credited.converted,eligibleXPcp}
}
function avTreasureSummary(t){
 let c=t?.coins||{},parts=[];
 for(const [k,label] of [["gp","GP"],["sp","SP"],["cp","CP"],["ep","EP→converted"],["pp","PP→converted"]])if(c[k])parts.push(`${c[k]} ${label}`);
 let counts=[["gems","gems"],["jewelry","jewelry"],["special","special treasure"],["magic","magic items"]];
 for(const [k,label] of counts)if(t?.[k]?.length)parts.push(`${t[k].length} ${label}`);
 return parts.join(", ")||"no treasure"
}

function avRollCombatTreasure(enemies=[],isBoss=false,level=h?.level||1,includeLair=false){
 let out=avBlankTreasure(includeLair?"lair-combat":(isBoss?"boss-combat":"combat"),includeLair?"lair":(isBoss?"boss":"ordinary")),ogres=enemies.filter(e=>monsterKey(e)==="ogre");
 for(const e of enemies){
  if(monsterKey(e)==="ogre")continue; // Averathia Ogre prose overrides generic carried notation for the encountered group.
  let profile=avMonsterTreasureProfile(e),carried=avRollMonsterCarried(e,level);
  if(!profile.carried.length)carried=journeySpoilsForMonster(e);
  avMergeTreasure(out,carried)
 }
 if(ogres.length)out.coins.gp+=d(6)*100; // Averathia: an ogre group encountered outside its lair carries 1d6 x 100 gp.
 if(includeLair&&enemies.length){
  let hoardOwner=enemies.find(e=>e?.boss)||enemies[0];
  avMergeTreasure(out,avRollMonsterLair(hoardOwner,level))
 }
 return out
}
function avAwardTreasure(t,label="Treasure"){
 let applied=avApplyTreasure(t),summary=avTreasureSummary(t);
 addlog(`${label}: ${summary}.`,"Loot");
 return{...applied,summary}
}

const AV_UNGUARDED_TREASURE=[
 {levels:[1,1],sp:"1d6x100",gp:[50,"1d6x10"],gems:[5,"1d6"],jewelry:[2,"1d6"],magic:[2,{any:1}]},
 {levels:[2,3],sp:"1d12x100",gp:[50,"1d6x100"],gems:[10,"1d6"],jewelry:[5,"1d6"],magic:[8,{any:1}]},
 {levels:[4,5],sp:"1d6x1000",gp:"1d6x200",gems:[20,"1d8"],jewelry:[10,"1d8"],magic:[10,{any:1}]},
 {levels:[6,7],sp:"1d6x2000",gp:"1d6x500",gems:[30,"1d10"],jewelry:[15,"1d10"],magic:[15,{any:1}]},
 {levels:[8,Infinity],sp:"1d6x5000",gp:"1d6x1000",gems:[40,"1d12"],jewelry:[20,"1d12"],magic:[20,{any:1}]}
];
const MONSTERS=[{"id":"kobold","n":"Kobold","saveAs":"NM","intelligence":9,"ac":7,"hdDice":0.5,"hdAdj":0,"hpDie":4,"damage":["1d4-1"],"meleeDamage":"1d4-1","rangedDamage":"1d4-1","meleeWeapon":"Dagger","rangedWeapon":"Sling","xp":5,"source":"Averathia-adapted","humanoid":true,"avTreasureType":"(P) J"},{"id":"goblin","n":"Goblin","saveAs":"NM","intelligence":9,"ac":6,"hdDice":1,"hdAdj":-1,"damage":["1d6"],"meleeDamage":"1d6","rangedDamage":"1d6","meleeWeapon":"Short Sword","rangedWeapon":"Short Bow","daylightAttackPenalty":-1,"xp":5,"source":"Averathia-adapted","humanoid":true,"avTreasureType":"(R) C"},{"id":"orc","n":"Orc","saveAs":"F1","intelligence":7,"ac":6,"hdDice":1,"hdAdj":0,"damage":["1d6"],"meleeDamage":"1d6","rangedDamage":"1d6","meleeWeapon":"Spear","rangedWeapon":"Short Bow","daylightAttackPenalty":-1,"xp":10,"source":"Averathia-adapted","humanoid":true,"avTreasureType":"(P) D"},{"id":"hobgoblin","n":"Hobgoblin","saveAs":"F1","intelligence":10,"ac":6,"hdDice":1,"hdAdj":1,"damage":["1d8"],"meleeDamage":"1d8","rangedDamage":"1d6","meleeWeapon":"Sword","rangedWeapon":"Short Bow","xp":15,"source":"Averathia-adapted","humanoid":true,"avTreasureType":"(Q) D"},{"id":"gnoll","n":"Gnoll","saveAs":"F2","intelligence":7,"ac":5,"hdDice":2,"hdAdj":0,"damage":["1d8+1"],"meleeDamage":"1d8+1","rangedDamage":"1d6+1","meleeWeapon":"Battle Axe","rangedWeapon":"Long Bow","xp":20,"source":"Averathia-adapted","humanoid":true,"avTreasureType":"(P) D"},{"id":"skeleton","n":"Skeleton","saveAs":"F1","intelligence":1,"ac":7,"hdDice":1,"hdAdj":0,"damage":["1d6"],"xp":10,"undead":true,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"Nil"},{"id":"zombie","n":"Zombie","saveAs":"F1","intelligence":1,"ac":8,"hdDice":2,"hdAdj":0,"damage":["1d8"],"xp":20,"undead":true,"slow":true,"alwaysLoseInitiative":true,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"Nil"},{"id":"ghoul","n":"Ghoul","saveAs":"F2","intelligence":3,"ac":6,"hdDice":2,"hdAdj":0,"damage":["1d3"],"attacks":[{"name":"claw","damage":"1d3","special":"paralysis"},{"name":"claw","damage":"1d3","special":"paralysis"},{"name":"bite","damage":"1d3","special":"paralysis"}],"xp":25,"undead":true,"special":"paralysis","avPowerBonuses":1,"avAsterisks":1,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"B"},{"id":"giant_rat","n":"Giant Rat","saveAs":"NM","intelligence":2,"ac":7,"hdDice":0.5,"hdAdj":0,"hpDie":4,"damage":["1d3"],"xp":5,"special":"disease","avPowerBonuses":1,"avAsterisks":1,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"L"},{"id":"wolf","n":"Wolf","saveAs":"F1","intelligence":2,"ac":7,"hdDice":2,"hdAdj":2,"damage":["1d6"],"xp":25,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"Nil"},{"id":"dire_wolf","n":"Dire Wolf","saveAs":"F2","intelligence":4,"ac":6,"hdDice":4,"hdAdj":1,"damage":["2d4"],"xp":125,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"Nil"},{"id":"bear","n":"Black Bear","saveAs":"F2","intelligence":2,"ac":6,"hdDice":4,"hdAdj":0,"damage":["1d3"],"attacks":[{"name":"claw","damage":"1d3","claw":true},{"name":"claw","damage":"1d3","claw":true},{"name":"bite","damage":"1d6"}],"bearHug":"2d8","xp":75,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"U"},{"id":"crab_spider","n":"Crab Spider","saveAs":"F1","intelligence":0,"ac":7,"hdDice":2,"hdAdj":0,"damage":["1d8"],"xp":25,"special":"crabSpiderPoison","surpriseMax":4,"avTerrains":["cavern","ruins"],"avPowerBonuses":1,"avAsterisks":1,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"U"},{"id":"black_widow","n":"Black Widow","saveAs":"F2","intelligence":0,"ac":6,"hdDice":3,"hdAdj":0,"damage":["2d6"],"xp":50,"special":"blackWidowPoison","webLair":true,"avTerrains":["ruins","woods"],"webMoveFeet":120,"webBreakAs":"Web","webBurnable":true,"avPowerBonuses":1,"avAsterisks":1,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"U"},{"id":"tarantella","n":"Tarantella","saveAs":"F2","intelligence":0,"ac":5,"hdDice":4,"hdAdj":0,"damage":["1d8"],"xp":125,"special":"tarantellaPoison","avTerrains":["ruins","woods"],"avPowerBonuses":1,"avAsterisks":1,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"U"},{"id":"giant_centipede","n":"Giant Centipede","saveAs":"NM","intelligence":0,"ac":9,"hdDice":0.5,"hdAdj":0,"hpDie":4,"damage":["0"],"xp":6,"special":"centipedePoison","avPowerBonuses":1,"avAsterisks":1,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"Nil"},{"id":"giant_scorpion","n":"Giant Scorpion","saveAs":"F2","intelligence":0,"ac":2,"hdDice":4,"hdAdj":0,"damage":["1d10"],"attacks":[{"name":"claw","damage":"1d10","claw":true},{"name":"claw","damage":"1d10","claw":true},{"name":"sting","damage":"1d4","special":"poison","sting":true}],"xp":125,"special":"poison","avPowerBonuses":1,"avAsterisks":1,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"V"},{"id":"giant_racer","n":"Giant Racer","saveAs":"F1","intelligence":2,"ac":5,"hdDice":2,"hdAdj":0,"damage":["1d6"],"xp":20,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"Nil"},{"id":"pit_viper","n":"Pit Viper","saveAs":"F1","intelligence":2,"ac":6,"hdDice":2,"hdAdj":0,"damage":["1d4"],"xp":25,"special":"poison","alwaysWinInitiative":true,"avPowerBonuses":1,"avAsterisks":1,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"Nil"},{"id":"lizard_man","n":"Lizard Man","saveAs":"F2","intelligence":6,"ac":5,"hdDice":2,"hdAdj":1,"damage":["1d6+1"],"meleeDamage":"1d6+1","rangedDamage":"1d6+1","meleeWeapon":"Spear","rangedWeapon":"Spear","swimSpeedFeet":120,"xp":25,"source":"Averathia-adapted","humanoid":true,"avTreasureType":"D"},{"id":"bandit","n":"Bandit","saveAs":"T1","intelligence":11,"ac":6,"hdDice":1,"hdAdj":0,"damage":["1d6"],"meleeDamage":"1d6","rangedDamage":"1d6","meleeWeapon":"Short Sword","rangedWeapon":"Short Bow","xp":10,"source":"Averathia-adapted","humanoid":true,"avTreasureType":"(U) A"},{"id":"brigand","n":"Brigand","saveAs":"F1","intelligence":11,"ac":6,"hdDice":1,"hdAdj":0,"damage":["1d6"],"meleeDamage":"1d6","rangedDamage":"1d6","meleeWeapon":"Sword","rangedWeapon":"Light Crossbow","xp":10,"source":"Averathia-adapted","humanoid":true,"avTreasureType":"A"},{"id":"berserker","n":"Berserker","saveAs":"F1","intelligence":9,"ac":7,"hdDice":1,"hdAdj":1,"damage":["1d8"],"meleeDamage":"1d8","meleeWeapon":"Battle Axe","xp":19,"ferocityAttackBonus":2,"avPowerBonuses":1,"avAsterisks":1,"source":"Averathia-adapted","humanoid":true,"avTreasureType":"(P) B"},{"id":"ogre","n":"Ogre","saveAs":"F4","intelligence":6,"ac":5,"hdDice":4,"hdAdj":1,"damage":["1d4+2"],"meleeDamage":"1d4+2","meleeWeapon":"Club","xp":125,"source":"Averathia-adapted","humanoid":true,"avTreasureType":"(S x 10) S x 100 + C"},{"id":"troll","n":"Troll","saveAs":"F6","intelligence":6,"ac":4,"hdDice":6,"hdAdj":3,"damage":["1d6"],"attacks":[{"name":"claw","damage":"1d6"},{"name":"claw","damage":"1d6"},{"name":"bite","damage":"1d10"}],"xp":650,"special":"regeneration","avPowerBonuses":1,"avAsterisks":1,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"D"},{"id":"minotaur","n":"Minotaur","saveAs":"F6","intelligence":5,"ac":6,"hdDice":6,"hdAdj":0,"damage":["1d6"],"attacks":[{"name":"gore","damage":"1d6"},{"name":"bite","damage":"1d6"}],"xp":275,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"C"},{"id":"mummy","n":"Mummy","saveAs":"F5","intelligence":6,"ac":3,"hdDice":5,"hdAdj":1,"damage":["1d12"],"xp":575,"undead":true,"enchanted":true,"mummy":true,"special":"disease","avTerrains":["ruins"],"avPowerBonuses":2,"avAsterisks":2,"source":"Averathia-adapted","humanoid":false,"avTreasureType":"D"}];
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
 let target=avSaveTarget(h.className,h.level,SAVE_NAMES[i]),roll=d(20)+bonus;
 return{roll,target,success:roll>=target,category:SAVE_NAMES[i]};
}
function protectionFromEvilBuff(){let b=h?.spells?.buffs?.find(b=>b.av==="Protection from Evil")||null;if(b&&b.barrierBroken==null)b.barrierBroken=!!h?.combat?.protEvilBarrierBroken;return b}
function protectionFromEvilActive(){return !!protectionFromEvilBuff()}
function protectionFromEvilBarrierActive(){let b=protectionFromEvilBuff();return !!b&&!b.barrierBroken}
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
}
function monsterCombatActive(e){return !!e&&!e.destroyed&&(e.hp>0||e.special==="regeneration")}
function living(){return h?.combat?.enemies?.filter(monsterCombatActive)||[]}
function applyMonsterDamage(e,dmg,type="normal"){
 dmg=Math.max(0,Math.trunc(Number(dmg)||0));if(!e||!dmg||e.destroyed)return 0;
 let kind=type||"normal",oldHp=Math.max(0,Number(e.hp)||0),actual=Math.min(oldHp,dmg);
 if(e.special==="regeneration"){
  if(e.regenStartRound==null)e.regenStartRound=(h?.combat?.round||1)+3;
  if((kind==="fire"||kind==="acid")&&actual>0)e.regenBlockedDamage=Math.min(Math.max(0,Number(e.maxhp)||oldHp),(Number(e.regenBlockedDamage)||0)+actual)
 }
 e.lastDamageType=kind;e.hp=Math.max(0,oldHp-dmg);return dmg
}
function monsterDefeated(e){return !!e&&(e.destroyed||(e.special!=="regeneration"&&e.hp<=0))}
function resolveMonsterDefeat(e){
 if(!e||e.xpAwarded)return false;
 if(e.special==="regeneration"&&e.hp<=0&&!e.destroyed){
  if(h?.combat?.trollLesson&&!h.trollWeaknessKnown){
   if(!h.combat.trollLessonDowned){h.combat.trollLessonDowned=true;clog("The Troll crashes down — then torn flesh starts knitting itself together. It is not staying dead. RETREAT is strongly recommended.")}
   return false
  }
  if(h.trollWeaknessKnown){
   if(e.lastDamageType==="fire"||e.lastDamageType==="acid"){e.destroyed=true;clog(`The ${e.lastDamageType} damage finishes the fallen Troll before it can regenerate.`)}
   else{const burnLight=10;if(totalLightMinutes()>=burnLight){consumeLightMinutes(burnLight);e.destroyed=true;clog(`You spend ${burnLight} light-minutes scorching the fallen Troll's wounds, preventing its regeneration.`)}else{if(!e.downedNotice){e.downedNotice=true;clog(`The Troll is down, but you need ${burnLight} light-minutes from Torch or Lamp Oil to scorch its wounds before they close.`)}return false}}
  }else return false
 }
 if(monsterDefeated(e)){e.xpAwarded=true;let gained=awardXP(e.xp);clog(`${e.n} defeated. +${gained} XP.`);return true}
 return false
}
function tickMonsterRegeneration(){
 if(!h?.combat)return;
 for(const e of h.combat.enemies||[]){
  let regenCap=Math.max(0,(Number(e.maxhp)||0)-Math.max(0,Number(e.regenBlockedDamage)||0));
  if(e.special!=="regeneration"||e.destroyed||e.regenStartRound==null||h.combat.round<e.regenStartRound||e.hp>=regenCap)continue;
  let wasDown=e.hp<=0,heal=Math.min(3,regenCap-e.hp);if(heal>0){e.hp+=heal;e.downedNotice=false;clog(wasDown?`${e.n} rises again as regeneration restores ${heal} HP.`:`${e.n} regenerates ${heal} HP.`)}
 }
}
// Averathia Averathia, Balancing Encounters (pp.100-101): TPL -> IAHD -> challenge %.
function avTPL(){
 let level=Math.max(1,h.level||1),maxhp=Math.max(1,h.maxhp||combatStats().maxhp||1),hp=Math.max(0,h.hp??maxhp);
 let damage=Math.max(0,maxhp-hp);
 let lost=Math.floor(damage/level);
 let floor=Math.max(1,Math.floor(level/2));
 return Math.max(floor,level-lost);
}
function avAdjustedHD(m){
 let base=Math.max(.5,m.hdDice||1),adjusted=base,adj=m.hdAdj||0;
 if(adj>0)adjusted+=Math.ceil(adj/5);
 else if(adj<0)adjusted-=Math.ceil(Math.abs(adj)/2)*.5;
 adjusted=Math.max(.5,adjusted);
 let powers=Math.max(0,m.avPowerBonuses||0);
 return +(adjusted+(base*.5*powers)).toFixed(2);
}
function avChallengePct(totalIAHD,tpl=avTPL()){return +(totalIAHD/Math.max(.5,tpl)*100).toFixed(1)}
function avChallengeName(pct){
 if(pct>=110)return"Extremely dangerous";
 if(pct>=90)return"Risky";
 if(pct>=70)return"Major";
 if(pct>=50)return"Challenging";
 if(pct>=30)return"Good fight";
 if(pct>=20)return"Distraction";
 if(pct>=10)return"Minor";
 return"Too easy";
}
// Averathia adventure stance selects among Averathia challenge bands; the bands/math themselves are Averathia.
function avTargetBand(isBoss=false){
 if(isBoss)return[70,110]; // Major through Risky; never intentionally Extremely Dangerous.
 let risk=h.trip?.risk||"Normal";
 if(risk==="Cautious")return[10,50];   // Minor through Good fight.
 if(risk==="Bold")return[50,90];       // Challenging through Major.
 return[30,70];                        // Good fight through Challenging.
}
function monsterTerrainEligible(m,context=null){let req=m?.avTerrains;if(!Array.isArray(req)||!req.length||!context?.terrain)return true;return req.includes(context.terrain)}
function buildEncounter(isBoss=false,context=null){
 let tpl=avTPL(),[lo,hi]=avTargetBand(isBoss),min=tpl*lo/100,max=tpl*hi/100;
 let eligible=MONSTERS.filter(m=>monsterTerrainEligible(m,context)&&avAdjustedHD(m)<=max+.0001);
 if(!eligible.length){
   // At very low TPL the lightest legal creature may exceed the requested band.
   // Choose the lightest available creature, but never silently call it balanced.
   let terrainPool=MONSTERS.filter(m=>monsterTerrainEligible(m,context)),low=Math.min(...terrainPool.map(avAdjustedHD));
   eligible=terrainPool.filter(m=>avAdjustedHD(m)===low);
 }
 if(isBoss){
   let inBand=eligible.filter(m=>avAdjustedHD(m)>=min-.0001),q=inBand.length?inBand:eligible;
   return[q[d(q.length)-1]];
 }
 let best=null;
 for(let attempt=0;attempt<80;attempt++){
   let out=[],total=0,tries=0;
   while(out.length<6&&tries++<30){
     let choices=eligible.filter(m=>total+avAdjustedHD(m)<=max+.0001);
     if(!choices.length)break;
     let m=choices[d(choices.length)-1];out.push(m);total+=avAdjustedHD(m);
     if(total>=min&&Math.random()<.55)break;
   }
   if(out.length&&total>=min&&total<=max)return out;
   if(out.length&&(!best||Math.abs(total-(min+max)/2)<Math.abs(best.total-(min+max)/2)))best={out,total};
 }
 return best?.out||[eligible[d(eligible.length)-1]];
}
const ENCOUNTER_ENVIRONMENT={
 underground:new Set(["FTR-073","FTR-080","CLE-001","CLE-004","CLE-005","CLE-006","CLE-009","THI-006","ELF-009","DWA-001","DWA-002","DWA-003","DWA-004","DWA-005","DWA-006","DWA-007","DWA-008","DWA-009","DWA-010"]),
 indoor:new Set(["FTR-065","FTR-074","FTR-086","CLE-002","CLE-007","CLE-008","THI-001","THI-003","THI-004","THI-007","THI-010","ARC-001","ARC-002","ARC-003","ARC-004","ARC-005","ARC-006","ARC-007","ARC-008","ARC-009","ARC-010"]),
 outdoor:new Set(["FTR-061","FTR-062","FTR-063","FTR-064","FTR-066","FTR-067","FTR-068","FTR-069","FTR-070","FTR-072","FTR-075","FTR-076","FTR-077","FTR-078","FTR-079","FTR-081","FTR-083","FTR-084","FTR-085","FTR-087","FTR-088","FTR-089","FTR-090","CLE-003","CLE-010","THI-002","THI-005","THI-008","THI-009","ELF-001","ELF-002","ELF-003","ELF-004","ELF-005","ELF-006","ELF-007","ELF-008","ELF-010"])
};
const ENCOUNTER_TERRAIN={
 cavern:new Set(["FTR-073","DWA-002","DWA-006","ELF-009"]),
 ruins:new Set(["FTR-065","FTR-081","FTR-082","ELF-005"]),
 woods:new Set(["FTR-064","FTR-078","FTR-090","ELF-001","ELF-002","ELF-003","ELF-004","ELF-006","ELF-007","ELF-008","ELF-010"])
};
const EXPLICIT_NIGHT_ENCOUNTERS=new Set(["FTR-068","FTR-085"]);
function journeyProgressFraction(now=null){if(!h?.trip)return null;let start=Number(h.trip.start),end=Number(h.trip.end);if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)return null;let t=Number(now??h.trip.pauseStart??Date.now());return Math.max(0,Math.min(1,(t-start)/(end-start)))}
function journeyDaylightNow(now=null){let p=journeyProgressFraction(now);return p!=null&&(p<1/6||p>=5/6)}
function missionCombatContext(){let title=h?.trip?.mission?.title||null,environment="unknown";if(h?.className==="Dwarf")environment="underground";else if(h?.className==="Elf")environment="outdoor";else if(h?.className==="Arcanist")environment="indoor";else if(h?.className==="Fighter"&&title==="Break a threat on the road")environment="outdoor";return{eventId:null,eventTitle:title,environment,terrain:null,daylight:environment==="outdoor"?journeyDaylightNow():(environment==="indoor"||environment==="underground")?false:null}}
function encounterContextFromEvent(ev){
 let id=ev?.id||null,environment="unknown";
 for(const [kind,set] of Object.entries(ENCOUNTER_ENVIRONMENT))if(id&&set.has(id)){environment=kind;break}
 let terrain=null;for(const [kind,set] of Object.entries(ENCOUNTER_TERRAIN))if(id&&set.has(id)){terrain=kind;break}
 let daylight=EXPLICIT_NIGHT_ENCOUNTERS.has(id)?false:environment==="outdoor"?journeyDaylightNow():(environment==="indoor"||environment==="underground")?false:null;
 return{eventId:id,eventTitle:ev?.title||null,environment,terrain,daylight}
}
function monsterContextAttackModifier(e){
 let ctx=h?.combat?.context;if(ctx?.daylight===true&&Number.isFinite(Number(e?.daylightAttackPenalty)))return Number(e.daylightAttackPenalty);
 return 0
}
function startStreetMuggingCombat(){
 let b=MONSTERS.find(x=>x.id==="bandit");if(!b)return false;
 let hp=0;if(Number.isFinite(Number(b.hpDie)))hp=d(Number(b.hpDie));else for(let k=0;k<b.hdDice;k++)hp+=d(8);hp=Math.max(1,hp+(b.hdAdj||0));
 let e={...b,monsterId:b.id,id:0,lane:0,hp,maxhp:hp,damage:b.damage[0],ammo:b.rangedDamage?d(6):0,boss:false,iahd:avAdjustedHD(b)};
 let tpl=avTPL(),pct=avChallengePct(e.iahd,tpl);
 h.combat={round:1,enemies:[e],target:0,log:[],skipNext:false,isBoss:false,context:{streetSleep:true,eventId:"STREET-MUGGING",eventTitle:"Street Mugging",environment:"town",terrain:"street",daylight:false},range:"Close",distanceFeet:RANGE_BANDS[1].feet,avTPL:tpl,avIAHD:e.iahd,avChallengePct:pct,avChallenge:avChallengeName(pct)};
 clog("Street Mugging — Bandit. Combat begins.");
 save();renderCombat();return true
}
function makeCombat(isBoss=false,context=null){
 beginTripPause();
 let combatContext=context||(isBoss?missionCombatContext():{eventId:null,eventTitle:null,environment:"unknown",terrain:null,daylight:null});
 let picks=buildEncounter(isBoss,combatContext),trollLesson=!isBoss&&!h.trollWeaknessKnown&&picks.some(x=>x.id==="troll"),en=[];
 if(trollLesson)picks=[picks.find(x=>x.id==="troll")];
 for(let i=0;i<picks.length;i++){
   let b=picks[i],hp=0;if(Number.isFinite(Number(b.hpDie)))hp=d(Number(b.hpDie));else for(let k=0;k<b.hdDice;k++)hp+=d(8);hp=Math.max(1,hp+(b.hdAdj||0));
   en.push({...b,monsterId:b.id,id:i,lane:i%3,hp,maxhp:hp,damage:b.damage[0],ammo:b.rangedDamage?d(6):0,boss:isBoss,iahd:avAdjustedHD(b)})
 }
 let total=+en.reduce((a,e)=>a+e.iahd,0).toFixed(2),tpl=avTPL(),pct=avChallengePct(total,tpl);
 let startBand=d(3);h.combat={round:1,enemies:en,target:0,log:[],skipNext:false,isBoss,context:combatContext,range:RANGE_BANDS[startBand].name,distanceFeet:RANGE_BANDS[startBand].feet,avTPL:tpl,avIAHD:total,avChallengePct:pct,avChallenge:avChallengeName(pct),trollLesson,trollLessonDowned:false};
 let crabs=en.filter(e=>monsterKey(e)==="crab_spider");if(crabs.length&&d(6)<=4)h.combat.surpriseEnemyIds=crabs.map(e=>e.id);
 let names=en.map(x=>x.n).join(", ");
 clog((isBoss?`BOSS BATTLE — ${names}. `:`Encounter — ${names}. `)+`Averathia challenge: ${avChallengeName(pct)} (${pct}%).`);
 applyMummyFear();save();renderCombat()
}
const UNDEAD={
 skeleton:{id:"skeleton",n:"Skeleton",saveAs:"F1",intelligence:1,ac:7,hdDice:1,hdAdj:0,damage:"1d6",xp:10,undead:true,turnType:"Skeleton"},
 zombie:{id:"zombie",n:"Zombie",saveAs:"F1",intelligence:1,ac:8,hdDice:2,hdAdj:0,damage:"1d8",xp:20,undead:true,alwaysLoseInitiative:true,turnType:"Zombie"},
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
 for(let i=0;i<count;i++){let hp=0;for(let k=0;k<b.hdDice;k++)hp+=d(8);hp=Math.max(1,hp);en.push({...b,monsterId:b.id,id:i,lane:i%3,hp,maxhp:hp})}
 return en
}
function startUndeadCombat(en,opening,context=null){
 if(!en.length){addlog("No undead remain to fight.","Combat");save();page("depart");refresh();return}
 beginTripPause();en.forEach((e,i)=>e.id=i);
 h.combat={round:1,enemies:en,target:0,log:[],skipNext:false,isBoss:false,context:context||{eventId:null,eventTitle:null,environment:"unknown",terrain:null,daylight:null},range:"Close",distanceFeet:RANGE_BANDS[1].feet};
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
 let verb=destroy?"destroyed":"turned",xp=destroy?affected.reduce((sum,e)=>sum+awardXP(e.xp||0),0):0;
 let result=success?`SUCCESS — ${affected.length} ${type}${affected.length===1?"":"s"} ${verb}`:"FAILURE";
 journal({id:ev.id,type:ev.type,title:ev.title,text:ev.text,choice:"Turn Undead",result,xp,coins:[0,0,0],roll,target:val,affected:affected.length,remaining:remain.length});
 addlog(`${ev.title}: Turn Undead — ${result}. ${remain.length} remain.${xp?` +${xp} XP.`:""}`,"Check");
 h.pendingEvent=null;save();renderPendingEvent();
 if(remain.length)startUndeadCombat(remain,`${affected.length?affected.length+" "+type+(affected.length===1?" is":"s are")+" "+verb+". ":""}${remain.length} undead remain — combat begins.`,encounterContextFromEvent(ev));
 else{addlog("All undead are driven off. No combat remains.","Combat");endTripPause();save();page("depart");refresh();if(resumeAfter)tick()}
}
function startClericUndeadFight(ev){
 let en=makeUndeadGroup();h.pendingEvent=null;
 journal({id:ev.id,type:ev.type,title:ev.title,text:ev.text,choice:"Fight",result:"combat",xp:0,coins:[0,0,0],remaining:en.length});
 save();renderPendingEvent();startUndeadCombat(en,`${en.length} undead attack.`,encounterContextFromEvent(ev))
}
function autoPotionThreshold(){return{Cautious:.65,Normal:.45,Bold:.25}[h.trip?.risk||"Normal"]}
function autoSpellScore(s){
 if(s.kind==="cleanse"){let active=(h.conditions||[]).includes(s.condition)||(s.av==="Cure Disease"&&hasCurableDisease());return active?110:0}
 if(s.kind==="heal")return magicalHealingBlockedByDisease()?0:(h.hp/h.maxhp<.55?100:0);
 if(s.av==="Striking"&&h.mummyWeaknessKnown&&living().some(e=>e.mummy)){let w=combatStats().weapon,dup=h.spells?.buffs?.some(b=>b.av==="Striking"&&b.boundWeapon===w);return dup?0:95}
 if(s.kind==="buff"){let dup=h.spells?.buffs?.some(b=>b.av===s.av);return dup?0:(living().length>1?55:30)}
 return 40+s.sl*8;
}
function autonomousCanHarm(target=living()[0]){
 if(!target)return true;
 let cs=combatStats(),item=cs.weaponItem,at=ammoTypeFor(item||cs.weapon),weaponUsable=attackModeFor(item||cs.weapon)!=="out-of-range"&&(!at||ammoCount(at)>0);
 if(!target.mummy)return weaponUsable||availableCombatSpells().some(s=>["damage","area","line"].includes(s.kind));
 if(!h.mummyWeaknessKnown)return weaponUsable||availableCombatSpells().some(s=>["damage","area","line"].includes(s.kind));
 let spellQualifies=availableCombatSpells().some(s=>["damage","area","line"].includes(s.kind)||(s.av==="Striking"));
 return mummyWeaponCanHarm(target)||spellQualifies
}
function runAutonomousCombat(){
 let guard=0,previous=autonomousCombatRunning;autonomousCombatRunning=true;
 try{
  while(h.combat&&living().length&&h.hp>0&&guard++<100){
   if(h.combat.trollLesson&&h.combat.trollLessonDowned){clog("Autonomous: the Troll will not stay down; retreating to survive.");retreatCombat();continue}
   let downedTroll=downedKnownTroll();if(downedTroll){
    h.combat.target=downedTroll.id;
    let fireSpell=autoSafeFireSpellFor(downedTroll);if(fireSpell){clog("Autonomous: known Troll weakness — using fire to stop regeneration.");castCombatSpell(fireSpell.id);continue}
    let fireItem=autoSafeFireMagicIndex();if(fireItem>=0){clog("Autonomous: known Troll weakness — using fire to stop regeneration.");useRcMagicItemCombat(fireItem);continue}
    clog("Autonomous: the Troll is down but regeneration cannot be stopped with available resources; attempting retreat.");retreatCombat();continue
   }
   if(h.combat.paralyzed){
     clog(`Autonomous: ${h.name} is paralyzed and loses the round.`);
     if(enemyStrike()===false)break;
     if(h.combat)advanceCombatRound(h.combat,false)
     continue
   }
   let ratio=h.hp/h.maxhp,mi=autoRcHealingIndex();if(mi>=0){useRcMagicItemCombat(mi);continue}
   let pi=h.inv.findIndex(x=>x.n==="Healing Potion");if(ratio<=autoPotionThreshold()&&pi>=0){usePotionCombat();continue}
   let knownMummy=living().find(e=>e.mummy&&h.mummyWeaknessKnown);
   if(knownMummy&&h.inv.some(x=>x.n==="Holy Water")&&combatDistance()>50){changeRange("closer");continue}
   let holyTarget=living().find(e=>e.undead&&((e.mummy&&h.mummyWeaknessKnown&&!mummyWeaponCanHarm(e))||(!e.mummy&&!autonomousCanHarm(e)))&&combatDistance()<=50);if(holyTarget&&h.inv.some(x=>x.n==="Holy Water")){h.combat.target=holyTarget.id;useHolyWaterCombat();continue}
   let spells=availableCombatSpells()
     .filter(s=>!s.enemyTarget||!Number.isFinite(s.rangeFeet)||combatDistance()<=s.rangeFeet)
     .sort((a,b)=>autoSpellScore(b)-autoSpellScore(a));
   if(spells.length&&autoSpellScore(spells[0])>=45){castCombatSpell(spells[0].id);continue}
   let cs=combatStats(),at=ammoTypeFor(cs.weaponItem||cs.weapon);
   let burnTarget=living().find(e=>e.mummy&&h.mummyWeaknessKnown&&!mummyWeaponCanHarm(e));if(burnTarget&&totalLightMinutes()>=5){h.combat.target=burnTarget.id;if(combatDistance()>5){changeRange("closer");continue}useMummyBurnCombat();continue}
   if(attackModeFor(cs.weaponItem||cs.weapon)==="out-of-range"){changeRange("closer");continue}
   if((at&&ammoCount(at)<=0&&!equippedWeapons().melee)||!autonomousCanHarm()){let wi=autoRcOffensiveIndex();if(wi>=0){useRcMagicItemCombat(wi);continue}clog("Autonomous: the current fight cannot be won with available attacks; attempting retreat.");retreatCombat();continue}
   resolveAttack()
  }
  if(h.combat&&h.hp>0&&!living().length)finishCombat();
  if(h.combat&&h.hp>0&&living().length&&guard>=100){clog("Autonomous: combat safety limit reached; attempting retreat.");retreatCombat()}
  return h.hp>0
 }finally{autonomousCombatRunning=previous}
}
function autonomousCombat(isBoss=false,context=null){makeCombat(isBoss,context);return runAutonomousCombat()}
function applyMummyFear(){if(!h?.combat||h.combat.mummyFearChecked)return;let m=living().find(e=>e.mummy);if(!m)return;h.combat.mummyFearChecked=true;let s=savingThrow("Paralysis/Stone");clog(`Mummy fear save ${s.roll} vs ${s.target}: ${s.success?"success":"FAIL"}.`);if(!s.success){h.combat.paralyzed=true;h.combat.fearParalyzed=true;h.combat.paralyzedRounds=null;clog(`${h.name} is paralyzed with fear while the Mummy remains in sight.`)}}
function playerStrike(){
 if(h.combat?.paralyzed){clog(`${h.name} is paralyzed and cannot act.`);return}
 let attacks=avWeaponAttacksPerAction();
 for(let i=0;i<attacks&&h.combat&&living().length;i++){if(i>0)clog(`${avSpeedLevel()===2?"Double-speed":"Speed"} grants weapon attack ${i+1} of ${attacks}.`);playerStrikeSingle()}
}
function avMagicWeaponOpponentBonus(item,target){
 if(!item?.avVsBonus||!item.avVs||!target)return 0;let key=String(item.avVs).toLowerCase();
 if(key==="undead"&&target.undead)return item.avVsBonus;
 if(key==="regenerating monsters"&&target.special==="regeneration")return item.avVsBonus;
 return 0
}
function learnMummyWeakness(t){
 if(h.mummyWeaknessKnown)return false;
 h.mummyWeaknessKnown=true;
 clog(`WIS check — automatic success. The blow barely affects ${t?.n||"the Mummy"}; the dry wrappings suggest fire, while holy water or magic may bypass its unnatural resistance.`);
 save();return true
}
function mummyWeaponCanHarm(target=living()[0]){
 if(!target?.mummy)return true;
 let cs=combatStats(),item=cs.weaponItem,at=ammoTypeFor(item||cs.weapon),usable=attackModeFor(item||cs.weapon)!=="out-of-range"&&(!at||ammoCount(at)>0);
 return !!(usable&&(item?.magical||Number(item?.magicBonus)>0||item?.damageType==="fire"||h.spells?.buffs?.some(b=>b.damageBonus&&(!b.boundWeapon||b.boundWeapon===cs.weapon))))
}
function downedKnownTroll(){return h.trollWeaknessKnown?living().find(e=>e.special==="regeneration"&&e.hp<=0&&!e.destroyed)||null:null}
function autoSafeFireSpellFor(target){
 if(!target)return null;
 return availableCombatSpells().find(s=>["damage","area","line"].includes(s.kind)&&s.damageType==="fire"&&(!s.enemyTarget||!Number.isFinite(s.rangeFeet)||combatDistance()<=s.rangeFeet)&&(!s.areaFeet||combatDistance()>s.areaFeet/2))||null
}
function autoSafeFireMagicIndex(){
 if(combatDistance()<=20)return-1;
 return supportedRcMagicItems().find(x=>avMagicUseKind(x.item)==="wandFireball"&&avMagicCombatUsable(x.item))?.index??-1
}
function playerStrikeSingle(){
 let c=h.combat,t=c.enemies[c.target];if(!monsterCombatActive(t)){t=living()[0];if(!t)return;c.target=t.id}
 let cs=combatStats(),w=cs.weapon,item=cs.weaponItem,mode=attackModeFor(item||w);
 if(c.skipNext){clog("Critical fumble: you lose this initiative.");c.skipNext=false;return}
 let pfe=protectionFromEvilBuff();if(t.enchanted&&pfe&&!pfe.barrierBroken){pfe.barrierBroken=true;clog("You attack an enchanted creature; Protection from Evil no longer bars its touch, though its attack/save modifiers remain.")}
 if(t.sleeping&&c.range==="Hand-to-Hand"&&EDGED_WEAPONS.has(weaponBaseName(item||w))){let dmg=t.hp;t.hp=0;t.sleeping=false;t.disabledRounds=0;clog(`Sleeping ${t.n} is slain with a single edged-weapon blow (${dmg} HP).`);let gained=awardXP(t.xp);clog(`${t.n} defeated. +${gained} XP.`);return}
 if(mode==="out-of-range"){clog(`${w} cannot reach a target at ${c.range} range. Close to Hand-to-Hand or use a ranged/thrown weapon.`);return}
 if(mode==="missile"&&c.range==="Hand-to-Hand"&&(t.disabledRounds||0)<=0){clog(`${w} cannot be used effectively at Hand-to-Hand against a mobile target.`);return}
 if(weaponBaseName(item||w)==="Heavy Crossbow"&&h.stats.STR<18&&c.heavyCrossbowNextRound&&c.round<c.heavyCrossbowNextRound){clog(`Heavy Crossbow is still reloading; it can fire again on round ${c.heavyCrossbowNextRound}.`);return}
 let at=ammoTypeFor(item||w);if(at&&!spendAmmoFor(item||w)){clog(`No ${at.toLowerCase()} left for ${w}.`);return}
 if(mode==="thrown")throwWeaponItem(item);
 if(weaponBaseName(item||w)==="Heavy Crossbow"&&h.stats.STR<18)c.heavyCrossbowNextRound=c.round+2;
 let r=d(20),isMissile=mode==="missile",isThrown=mode==="thrown",magicAtk=(Number(item?.magicBonus)||0)+avMagicWeaponOpponentBonus(item,t),atkMod=((isMissile||isThrown)?mod(h.stats.DEX):mod(h.stats.STR))+magicAtk+playerTimedAttackModifier(),dmgMod=(isMissile?0:mod(h.stats.STR))+magicAtk;
 if(r===1){clog("Natural 1 — critical fumble. Next initiative is lost.");c.skipNext=true}
 else if(r===20||r+atkMod+spellAttackBonus()+((isMissile||isThrown)?rangeAttackMod(w):0)>=characterNeed(t.ac+(t.blindRounds>0?4:0))){
  let extra=h.spells?.buffs?.filter(b=>b.damageBonus&&(!b.boundWeapon||b.boundWeapon===w)).reduce((n,b)=>n+rollExpr(b.damageBonus),0)||0,flat=h.spells?.buffs?.reduce((n,b)=>n+(b.flatDamageBonus||0),0)||0;
  let base=Math.max(1,rollExpr(cs.damage)+dmgMod+flat),dmg=base+extra;if(r===20){base*=2;extra*=2;dmg=base+extra}if(t.mummy){let magical=!!item?.magical||Number(item?.magicBonus)>0,fire=item?.damageType==="fire";dmg=magical||fire?Math.floor(dmg/2):Math.floor(extra/2);if(dmg<=0){clog(`${w} cannot harm ${t.n}.`);learnMummyWeakness(t);return}clog(`${t.n} resists the attack; only half qualifying damage gets through.`)}applyMonsterDamage(t,dmg,item?.damageType||"normal");
  clog(`${r===20?"Critical hit! ":""}You ${isThrown?"throw "+w+" and ":""}hit ${t.n} for ${dmg}.`);
  if(t.sleeping&&t.hp>0){t.sleeping=false;t.disabledRounds=0;clog(`${t.n} awakens from the blow.`)}
  if(t.hp<=0)resolveMonsterDefeat(t)
 }else clog(`You ${isThrown?"throw "+w+" and ":""}miss ${t.n}.`)
}
function blindMovementDelayed(e){
 if((e.blindRounds||0)<=0)return false;
 e.blindMoveTicks=(e.blindMoveTicks||0)+1;
 if(e.blindMoveTicks<3){clog(`${e.n} is blinded and can only move at one-third speed.`);return true}
 e.blindMoveTicks=0;return false
}
function monsterRangeStep(e){
 if(e.disabledRounds>0){clog(`${e.n} cannot change range while immobilized.`);return false}
 let i=combatBandIndex(),dist=combatDistance(),rangedMax=e.rangedWeapon&&WEAPON_RANGES[e.rangedWeapon]?.[2]||Infinity;
 if(e.rangedDamage&&e.meleeDamage){
  if(((e.ammo||0)<=0||dist>rangedMax)&&i>0){if(blindMovementDelayed(e))return true;setCombatBand(i-1);clog(`${e.n} closes the distance to ${h.combat.range} (${combatDistance()}').`);return true}
  return false
 }
 if(!e.rangedDamage&&i>0){if(blindMovementDelayed(e))return true;setCombatBand(i-1);clog(`${e.n} closes the distance to ${h.combat.range} (${combatDistance()}').`);return true}
 if(e.rangedDamage&&!e.meleeDamage&&i<3){if(blindMovementDelayed(e))return true;setCombatBand(i+1);clog(`${e.n} opens the distance to ${h.combat.range} (${combatDistance()}').`);return true}
 return false
}
function combatDeath(reason=""){
 if(reason)clog(reason);
 clog(`You are DEAD. Resurrection in ${h.level*5} minutes.`);
 if(h.trip){adventureLog("The Journey ends in death.","Summary");adventureLog(`Recall will occur in ${h.level*5} minutes.`,"Home")}
 recordLastAdventureFromTrip(h.trip,{ending:"death"});
 recoverThrownWeapons();h.trip=null;h.pendingEvent=null;h.combat=null;h.deadUntil=Date.now()+h.level*5*60000;h.hp=0;
 localStorage.setItem("averathia-v041",JSON.stringify(h));renderDeathPage();return false
}
function paralysisImmune(){return !!h?.spells?.buffs?.some(b=>b.immuneParalysis)}
function poisonProtection(){
 let buffs=h?.spells?.buffs||[],bonus=buffs.reduce((n,b)=>n+(b.poisonSaveBonus||0),0),limit=0;
 for(const b of buffs)if(b.poisonHdImmunity===Infinity)limit=Infinity;else if(Number.isFinite(Number(b.poisonHdImmunity)))limit=Math.max(limit,Number(b.poisonHdImmunity));
 return{bonus,limit}
}
function poisonImmuneFor(e){let p=poisonProtection();return p.limit===Infinity||(p.limit>0&&(Number(e?.hdDice)||0)<=p.limit)}
function spiderPoisonSave(e,bonus=0){
 if(poisonImmuneFor(e)){clog(`Potion of Antidote neutralizes ${e.n} poison.`);return{success:true,immune:true}}
 let sv=savingThrow("Death/Poison",poisonProtection().bonus+bonus);clog(`${e.n} poison save ${sv.roll} vs ${sv.target}${bonus?` (+${bonus} species modifier)`:""}: ${sv.success?"success":"FAIL"}.`);return sv
}
function contractCrabSpiderPoison(e){
 let sv=spiderPoisonSave(e,2);if(sv.success)return false;let turns=d(4);addTimedCondition({type:"lethalSpiderPoison",name:"Crab Spider Venom",source:e.n,rounds:turns*AV_ROUNDS_PER_TURN,lethalOnExpire:true});clog(`Crab Spider Venom will become lethal in ${turns} turn${turns===1?"":"s"} unless removed.`);return true
}
function contractBlackWidowPoison(e){
 let sv=spiderPoisonSave(e,0);if(sv.success)return false;addTimedCondition({type:"lethalSpiderPoison",name:"Black Widow Venom",source:e.n,rounds:AV_ROUNDS_PER_TURN,lethalOnExpire:true});clog("Black Widow Venom will become lethal in 1 turn unless removed.");return true
}
function contractTarantellaPoison(e){
 let sv=spiderPoisonSave(e,0);if(sv.success)return false;let existing=ensureTimedConditions().find(x=>x.type==="tarantellaDance"&&x.rounds>0),turns=d(6)+d(6),rounds=turns*AV_ROUNDS_PER_TURN;
 if(existing){existing.rounds=Math.max(existing.rounds,rounds);existing.elapsedRounds=0;existing.helpless=false}else addTimedCondition({type:"tarantellaDance",name:"Tarantella Dance",source:e.n,rounds,elapsedRounds:0,blocksJourney:true});
 clog(`Tarantella venom forces a frantic dance for ${turns} turns: -4 to your attack rolls and +4 to attacks against you.`);return true
}
function playerIsHumanlike(){return ["Fighter","Cleric","Arcanist","Thief","Elf","Dwarf"].includes(h?.className)}
function preemptiveEnemiesAct(){
 if(!h?.combat)return false;
 if(Array.isArray(h.combat.surpriseEnemyIds)&&h.combat.surpriseEnemyIds.length&&!h.combat.surpriseResolved){
  let ids=new Set(h.combat.surpriseEnemyIds);h.combat.surpriseResolved=true;clog("Crab Spider camouflage catches you by surprise.");
  let ok=enemyStrike(e=>ids.has(e.id),false);if(ok===false||!h.combat||h.hp<=0)return false
 }
 let fast=living().filter(e=>e.alwaysWinInitiative&&(e.disabledRounds||0)<=0);
 if(!fast.length)return true;
 clog(`${fast.map(e=>e.n).join(", ")} ${fast.length===1?"takes":"take"} initiative automatically.`);
 let ok=enemyStrike(e=>e.alwaysWinInitiative,false);
 return ok!==false&&!!h.combat&&h.hp>0
}
function enemyStrike(filter=null,tickRegen=true){
 for(const e of living().filter(x=>!filter||filter(x))){
  if(e.hp<=0)continue;
  if(e.disabledRounds>0)continue;
  if(e.slowRounds>0&&h.combat.round%2===0){clog(`${e.n} is slowed and cannot act this round.`);continue}
  if(e.skipNext){clog(`${e.n} loses this initiative after its fumble.`);e.skipNext=false;continue}
  if(monsterRangeStep(e))continue;
  if((h.combat?.range||"Close")==="Hand-to-Hand"&&e.enchanted&&protectionFromEvilBarrierActive()){clog(`${e.n} cannot touch you through Protection from Evil.`);continue}
  let mr=h.combat?.range||"Close",dist=combatDistance(),maxR=e.rangedWeapon&&WEAPON_RANGES[e.rangedWeapon]?.[2]||Infinity;
  let useRanged=!!(e.rangedDamage&&mr!=="Hand-to-Hand"&&(e.ammo||0)>0&&dist<=maxR);
  let attacks=useRanged?[{name:e.rangedWeapon||"ranged attack",damage:e.rangedDamage,ranged:true}]:(Array.isArray(e.attacks)&&e.attacks.length?e.attacks:[{name:e.meleeWeapon||"its attack",damage:e.meleeDamage||e.damage||"1"}]);
  if(useRanged)e.ammo--;
  let clawHits=0;
  for(const a of attacks){
   let r=d(20),blindPenalty=e.blindRounds>0?-6:0,stingBonus=(a.sting&&clawHits>0)?2:0,ferocityBonus=e.ferocityAttackBonus&&playerIsHumanlike()?Number(e.ferocityAttackBonus):0,conditionBonus=enemyTimedAttackBonus(),contextBonus=monsterContextAttackModifier(e),attackBonus=stingBonus+ferocityBonus+conditionBonus+contextBonus,need=Math.max(2,(20-monsterHitModifier(e))-effectiveAC(!!a.ranged));
   if(r===1){clog(`${e.n} rolls a natural 1 with ${a.name} — critical fumble. Next initiative is lost.`);e.skipNext=true;continue}
   if(r!==20&&r+blindPenalty+attackBonus<need){clog(`${e.n} misses with ${a.name}.`);continue}
   if(a.ranged&&h.spells?.buffs?.some(b=>b.missileWard)){clog(`${e.n} missile is stopped by your ward.`);continue}
   let mirror=h.spells?.buffs?.find(b=>b.kind==="images"&&b.images>0);if(mirror){mirror.images--;clog(`${e.n} ${a.name} destroys a mirror image instead of hitting ${h.name}.`);continue}
   let dmg=rollExpr(a.damage);if(r===20)dmg*=2;if(a.damageType)dmg=applyElementalResistance(dmg,a.damage,a.damageType,a.damageNature!=="normal");h.hp=Math.max(0,h.hp-dmg);
   clog(`${e.n} hits with ${a.name} for ${dmg}${r===20?" — critical":""}${stingBonus?` (+${stingBonus} sting attack)`:""}${ferocityBonus?` (+${ferocityBonus} ferocity)`:""}${conditionBonus?` (+${conditionBonus} vs dancing target)`:""}${contextBonus?` (${contextBonus} daylight)`:""}.`);
   if(a.claw)clawHits++;
   let special=a.special||(!e.attacks?e.special:null);
   if(special==="crabSpiderPoison")contractCrabSpiderPoison(e);
   if(special==="blackWidowPoison")contractBlackWidowPoison(e);
   if(special==="tarantellaPoison")contractTarantellaPoison(e);
   if(special==="centipedePoison")contractCentipedeSickness(e);
   if(special==="poison"){
    if(poisonImmuneFor(e))clog(`Potion of Antidote neutralizes ${e.n} poison.`);
    else{let sv=savingThrow("Death/Poison",poisonProtection().bonus);clog(`Poison save ${sv.roll} vs ${sv.target}: ${sv.success?"success":"FAIL"}.`);if(!sv.success){h.hp=0;clog("The poison is lethal.")}}
   }
   if(special==="paralysis"){
    if(paralysisImmune())clog(`Potion of Freedom prevents ${e.n} paralysis.`);
    else if(monsterKey(e)==="ghoul"&&h.className==="Elf")clog(`${h.name} elven nature resists the ghoul paralyzing touch.`);
    else{let sv=savingThrow("Paralysis/Stone");clog(`Paralysis save ${sv.roll} vs ${sv.target}: ${sv.success?"success":"FAIL"}.`);if(!sv.success){h.combat.paralyzed=true;h.combat.paralyzedRounds=(d(4)+d(4))*AV_ROUNDS_PER_TURN;clog(`${h.name} is paralyzed for ${Math.ceil(h.combat.paralyzedRounds/AV_ROUNDS_PER_TURN)} turn(s) and cannot act.`)}}
   }
   if(special==="disease"){if(e.mummy)contractTombRot(e);else if(monsterKey(e)==="giant_rat")contractPlague(e);else contractWastingFever(e.n)}
   if(h.hp<=0)return combatDeath()
  }
  if(e.bearHug&&clawHits>=2&&h.hp>0){let dmg=rollExpr(e.bearHug);h.hp=Math.max(0,h.hp-dmg);clog(`${e.n} catches ${h.name} in a crushing bear hug for ${dmg}.`);if(h.hp<=0)return combatDeath()}
 }
 if(tickRegen)tickMonsterRegeneration();
 return true
}

// v1.0.7: usable Averathia spell registry. Mechanics are adapted from the audited Averathia low-level spell set.
function spellProgressFromColumns(columns,maxLevel){
 let out={};
 for(let level=1;level<=maxLevel;level++){
  let row=columns.map(col=>col[level-1]||0);
  while(row.length&&row[row.length-1]===0)row.pop();
  out[level]=row
 }
 return out
}
// Averathia spell-slot progression for the currently implemented spell levels 1-3 only.
// Higher-level spell slots remain hidden until those spell levels are actually implemented.
const ARCANE_ACTIVE_SLOT_COLUMNS=[
 [1,2,2,2,2,2,3,3,3,3,4,4,4,4,5,5,6,6,6,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,9],
 [0,0,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,5,5,6,6,7,7,7,7,8,8,8,8,8,9,9,9,9],
 [0,0,0,0,1,2,2,2,3,3,3,4,4,4,4,5,5,5,5,5,5,5,6,6,6,7,7,7,7,8,8,8,9,9,9,9]
];
const CLERIC_ACTIVE_SLOT_COLUMNS=[
 [0,1,2,2,2,2,3,3,3,4,4,4,5,5,6,6,6,6,7,7,7,7,7,8,8,8,8,8,8,8,8,9,9,9,9,9],
 [0,0,0,1,2,2,2,3,3,4,4,4,5,5,5,5,6,6,6,6,6,6,7,7,7,7,8,8,8,8,8,8,9,9,9,9],
 [0,0,0,0,0,1,2,2,3,3,3,4,4,5,5,5,5,5,5,5,5,5,6,6,6,7,7,7,7,8,8,8,8,9,9,9]
];
const SPELL_PROGRESS={
 Arcanist:spellProgressFromColumns(ARCANE_ACTIVE_SLOT_COLUMNS,36),
 Elf:spellProgressFromColumns(ARCANE_ACTIVE_SLOT_COLUMNS,10),
 Cleric:spellProgressFromColumns(CLERIC_ACTIVE_SLOT_COLUMNS,36)
};
const ARCANE_NOW=[
 {id:"magic_missile",name:"Arcane Dart",av:"Magic Missile",sl:1,kind:"damage",damage:"1d6+1",autoHit:true,missilesByLevel:true,enemyTarget:true,rangeFeet:150},
 {id:"shield",name:"Shield",av:"Shield",sl:1,kind:"buff",fixedAC:4,fixedMissileAC:2,magicMissileSave:true,durationTurns:2},
 {id:"sleep",name:"Sleep",av:"Sleep",sl:1,kind:"sleep",save:null,durationTurnsDice:"4d4",enemyTarget:true,rangeFeet:240,areaFeet:40},
 {id:"light",name:"Light",av:"Light",sl:1,kind:"blind",save:"Spells",enemyTarget:true,rangeFeet:120,durationTurnsBase:6,durationTurnsPerLevel:1},
 {id:"mirror_image",name:"Mirror Image",av:"Mirror Image",sl:2,kind:"images",images:"1d4",durationTurns:6},
 {id:"web",name:"Web",av:"Web",sl:2,kind:"web",durationTurns:48,enemyTarget:true,rangeFeet:10,areaFeet:10},
 {id:"fireball",name:"Fireball",av:"Fireball",sl:3,kind:"area",perLevel:true,save:"Spells",half:true,damageType:"fire",enemyTarget:true,rangeFeet:240,areaFeet:40},
 {id:"lightning_bolt",name:"Lightning Bolt",av:"Lightning Bolt",sl:3,kind:"line",perLevel:true,save:"Spells",half:true,enemyTarget:true,rangeFeet:180,lineLengthFeet:60,lineWidthFeet:5},
 {id:"haste",name:"Haste",av:"Haste",sl:3,kind:"buff",extraAttack:true,speedSource:"haste",durationTurns:3},
 {id:"slow",name:"Slow",av:"Slow",sl:3,kind:"debuff",save:"Spells",durationTurns:3,enemyTarget:true,rangeFeet:240,areaFeet:60,maxTargets:24},
 {id:"hold_person",name:"Hold Person",av:"Hold Person",sl:3,kind:"hold",save:"Spells",durationTurnsPerLevel:1,maxTargets:4,humanoidOnly:true,enemyTarget:true,rangeFeet:120},
 {id:"prot_missiles",name:"Protection from Normal Missiles",av:"Protection from Normal Missiles",sl:3,kind:"buff",missileWard:true,durationTurns:12}
];
const CLERIC_NOW=[
 {id:"cure_light",name:"Cure Light Wounds",av:"Cure Light Wounds",sl:1,kind:"heal",heal:"1d6+1"},
 {id:"prot_evil",name:"Protection from Evil",av:"Protection from Evil",sl:1,kind:"buff",ac:-1,saveBonus:1,durationTurns:12},
 {id:"remove_fear",name:"Remove Fear",av:"Remove Fear",sl:1,kind:"cleanse",condition:"Afraid"},
 {id:"resist_cold",name:"Resist Cold",av:"Resist Cold",sl:1,kind:"buff",resist:"cold",saveBonusVs:"cold",damagePerDieReduction:1,durationTurns:6},
 {id:"bless",name:"Bless",av:"Bless",sl:2,kind:"buff",attack:1,flatDamageBonus:1,morale:1,durationTurns:6},
 {id:"hold_person_c",name:"Hold Person",av:"Hold Person",sl:2,kind:"hold",save:"Spells",durationTurns:9,maxTargets:4,humanoidOnly:true,enemyTarget:true,rangeFeet:180},
 {id:"resist_fire",name:"Resist Fire",av:"Resist Fire",sl:2,kind:"buff",resist:"fire",saveBonusVs:"fire",damagePerDieReduction:1,durationTurns:2},
 {id:"cure_disease",name:"Cure Disease",av:"Cure Disease",sl:3,kind:"cleanse",condition:"Diseased"},
 {id:"striking",name:"Striking",av:"Striking",sl:3,kind:"buff",damageBonus:"1d6",durationTurns:1}
];
const SPELLS={Arcanist:ARCANE_NOW,Elf:ARCANE_NOW.map(x=>({...x,id:"elf_"+x.id})),Cleric:CLERIC_NOW};
const PREPARED_CASTERS=new Set(["Arcanist","Elf","Cleric"]);

function spellSlotsFor(cls=h.className,level=h.level){
 let t=SPELL_PROGRESS[cls];if(!t)return[];
 let key=Math.max(...Object.keys(t).map(Number).filter(x=>x<=level),0);return key?t[key].slice():[]
}
function ensureSpellState(){
 if(!h.spells)h.spells={used:{},buffs:[],memorized:{},spentMem:[]};
 if(!h.spells.used)h.spells.used={};if(!h.spells.buffs)h.spells.buffs=[];if(!h.spells.memorized)h.spells.memorized={};if(!h.spells.spentMem)h.spells.spentMem=[];
 if(PREPARED_CASTERS.has(h.className)){
  let slots=spellSlotsFor(h.className,h.level),list=SPELLS[h.className]||[],spent=new Set(h.spells.spentMem||[]);
  for(let sl=1;sl<=slots.length;sl++){
   let cap=slots[sl-1]||0,known=list.filter(s=>s.sl===sl),valid=new Set(known.map(s=>s.id)),mem=Array.isArray(h.spells.memorized[sl])?h.spells.memorized[sl].filter(id=>valid.has(id)).slice(0,cap):[];
   // Preserve existing choices. Newly gained slots start empty so the player chooses what to prepare.
   h.spells.memorized[sl]=mem;
   let used=Math.min(Number(h.spells.used[sl])||0,mem.length);for(let i=0;i<used;i++)spent.add(`${sl}:${i}`);
  }
  // Drop stale spent markers that point beyond currently valid slot indexes.
  h.spells.spentMem=[...spent].filter(k=>{let m=/^(\d+):(\d+)$/.exec(k);if(!m)return false;let sl=+m[1],i=+m[2],cap=slots[sl-1]||0;return i<cap});
  h.spells.used={};h.spells.preparedSlotsV2=true;
 }
}
function availableCombatSpells(){
 ensureSpellState();let slots=spellSlotsFor(),list=SPELLS[h.className]||[];
 return list.filter(s=>{
   if(s.sl>slots.length)return false;
   if(PREPARED_CASTERS.has(h.className)){
     let mem=h.spells.memorized[s.sl]||[],spent=h.spells.spentMem||[];
     return mem.some((id,i)=>id===s.id&&!spent.includes(`${s.sl}:${i}`));
   }
   return (h.spells.used[s.sl]||0)<(slots[s.sl-1]||0);
 });
}
function consumeSpell(s){
 ensureSpellState();
 if(PREPARED_CASTERS.has(h.className)){
   let mem=h.spells.memorized[s.sl]||[],spent=h.spells.spentMem||[];
   let i=mem.findIndex((id,i)=>id===s.id&&!spent.includes(`${s.sl}:${i}`));
   if(i<0)return false;spent.push(`${s.sl}:${i}`);h.spells.spentMem=spent;return true;
 }
 h.spells.used[s.sl]=(h.spells.used[s.sl]||0)+1;return true;
}
function rollSpellDamage(s){if(s.perLevel){let n=Math.max(1,Math.min(h.level,20)),v=0;while(n--)v+=d(6);return v}return Math.max(1,rollExpr(s.damage))}
const AV_ROUNDS_PER_TURN=60;
function spellDuration(s){
 if(s.durationTurnsDice)return Math.max(1,rollExpr(s.durationTurnsDice)*AV_ROUNDS_PER_TURN);
 if(s.durationTurnsBase||s.durationTurnsPerLevel)return Math.max(1,((s.durationTurnsBase||0)+h.level*(s.durationTurnsPerLevel||0))*AV_ROUNDS_PER_TURN);
 if(s.durationTurns)return Math.max(1,s.durationTurns*AV_ROUNDS_PER_TURN);
 if(s.durationPerLevel)return Math.max(1,h.level*s.durationPerLevel);
 return s.duration||3
}
function magicMissileCount(){return 1+2*Math.floor(Math.max(0,h.level-1)/5)}
function autonomousMissileTargetIds(n){
 let pool=[...living()].sort((a,b)=>a.hp-b.hp||a.id-b.id),out=[],left=n;
 for(const q of pool){
  if(left<=0)break;
  let avg=q.mummy?2.25:4.5,needed=Math.max(1,Math.ceil(q.hp/avg)),take=Math.min(left,needed);
  for(let i=0;i<take;i++)out.push(q.id);
  left-=take;
 }
 while(left>0&&pool.length){out.push(pool[pool.length-1].id);left--}
 return out
}
const AV_SAVE_ROWS={
 Fighter:[{min:0,max:0,v:[14,15,16,17,17]},{min:1,max:3,v:[12,13,14,15,16]},{min:4,max:6,v:[10,11,12,13,14]},{min:7,max:9,v:[8,9,10,11,12]},{min:10,max:12,v:[6,7,8,9,10]},{min:13,max:15,v:[6,6,7,8,9]},{min:16,max:18,v:[5,6,6,7,8]},{min:19,max:21,v:[5,5,6,6,7]},{min:22,max:24,v:[4,5,5,5,6]},{min:25,max:27,v:[4,5,5,4,5]},{min:28,max:30,v:[3,4,5,3,4]},{min:31,max:33,v:[3,4,4,2,3]},{min:34,max:36,v:[2,3,3,2,2]}],
 Cleric:[{min:1,max:4,v:[11,12,14,16,15]},{min:5,max:8,v:[9,10,12,14,13]},{min:9,max:12,v:[7,8,10,12,11]},{min:13,max:16,v:[6,7,8,10,9]},{min:17,max:20,v:[5,6,6,8,7]},{min:21,max:24,v:[4,5,5,6,5]},{min:25,max:28,v:[3,4,4,4,4]},{min:29,max:32,v:[2,3,3,3,3]},{min:33,max:36,v:[2,2,2,2,2]}],
 Arcanist:[{min:1,max:5,v:[13,14,13,16,15]},{min:6,max:10,v:[11,12,11,14,12]},{min:11,max:15,v:[9,10,9,12,9]},{min:16,max:20,v:[7,8,7,10,6]},{min:21,max:24,v:[5,6,5,8,4]},{min:25,max:28,v:[4,4,4,6,3]},{min:29,max:32,v:[3,3,3,4,2]},{min:33,max:36,v:[2,2,2,2,2]}],
 Thief:[{min:1,max:4,v:[13,14,13,16,15]},{min:5,max:8,v:[11,12,11,14,13]},{min:9,max:12,v:[9,10,9,12,11]},{min:13,max:16,v:[7,8,7,10,9]},{min:17,max:20,v:[5,6,5,8,7]},{min:21,max:24,v:[4,5,4,6,5]},{min:25,max:28,v:[3,4,3,4,4]},{min:29,max:32,v:[2,3,2,3,3]},{min:33,max:36,v:[2,2,2,2,2]}],
 Dwarf:[{min:1,max:3,v:[8,9,10,13,12]},{min:4,max:6,v:[6,7,8,10,9]},{min:7,max:9,v:[4,5,6,7,6]},{min:10,max:12,v:[2,3,4,4,3]}],
 Elf:[{min:1,max:3,v:[12,13,13,15,15]},{min:4,max:6,v:[8,10,10,11,11]},{min:7,max:9,v:[4,7,7,7,7]},{min:10,max:10,v:[2,4,4,3,3]}],
 Halfling:[{min:1,max:3,v:[8,9,10,13,12]},{min:4,max:6,v:[5,6,7,9,8]},{min:7,max:8,v:[2,3,4,5,4]}]
};
function avSaveTarget(cls,level,category="Spells"){
 let key=cls==="Magic-User"?"Arcanist":cls,i=SAVE_NAMES.indexOf(category);if(i<0)i=4;
 let rows=AV_SAVE_ROWS[key]||AV_SAVE_ROWS.Fighter,row=rows.find(r=>level>=r.min&&level<=r.max)||rows[rows.length-1];
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
 let p=parseSaveAs(m),roll=d(20)+(m?.blindRounds>0?-4:0),target=avSaveTarget(p.cls,p.level,category);
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
function validHoldTargets(s){
 return living().filter(q=>(!s.humanoidOnly||q.humanoid===true)&&!q.mummy)
}
function sleepEligible(q){
 let hd=Number(q?.hdDice)||1,adj=Number(q?.hdAdj)||0;
 return !q?.undead&&(hd<4||(hd===4&&adj<=1))
}
function resolveSpellEffect(s,t=null,autonomous=false,holdMode=null,missileTargetIds=null,holdTargetIds=null){
 ensureSpellState();let targets=[];
 if(s.kind==="damage"||s.kind==="area"||s.kind==="line"){
  targets=s.kind==="area"?gridlessAreaTargets(t,s.areaFeet||40):s.kind==="line"?gridlessLineTargets(t):[t||living()[0]];
  if(s.missilesByLevel){
   let fallback=t||living()[0],n=magicMissileCount();if(!fallback)return;
   let ids=Array.isArray(missileTargetIds)?missileTargetIds.slice(0,n):[];
   while(ids.length<n)ids.push(fallback.id);
   let groups=new Map();
   for(const id of ids){let q=h.combat?.enemies?.find(e=>e.id===id&&e.hp>0)||fallback;if(!q||q.hp<=0)continue;let g=groups.get(q.id)||{q,count:0};g.count++;groups.set(q.id,g)}
   for(const {q,count} of groups.values()){let dmg=0;for(let i=0;i<count;i++)dmg+=rollExpr(s.damage);if(q.mummy)dmg=Math.floor(dmg/2);applyMonsterDamage(q,dmg,s.damageType||"magic");clog(`${s.name} launches ${count} dart${count===1?"":"s"} at ${q.n} for ${dmg} damage.`);if(q.hp<=0)resolveMonsterDefeat(q)}
   return
  }
  let sharedDamage=(s.kind==="area"||s.kind==="line")?rollSpellDamage(s):null;for(const q of targets.filter(Boolean)){let dmg=sharedDamage??rollSpellDamage(s);if(s.save){let sv=monsterSpellSave(q,s.save||"Spells");clog(`${q.n} save ${sv.roll} vs ${sv.target}${sv.saveAs?` [${sv.saveAs}]`:""}: ${sv.success?"success":"FAIL"}.`);if(sv.success&&s.half)dmg=Math.floor(dmg/2)}if(q.mummy)dmg=Math.floor(dmg/2);applyMonsterDamage(q,dmg,s.damageType||"magic");clog(`${autonomous?"Autonomous: ":""}${s.name} strikes ${q.n} for ${dmg} damage.`);if(s.damageType==="fire"&&q.webbed&&q.hp>0){let burn=d(6);if(q.mummy)burn=Math.floor(burn/2);applyMonsterDamage(q,burn,"fire");q.disabledRounds=Math.min(Math.max(1,q.disabledRounds||2),2);q.webbed=true;clog(`The web catches fire around ${q.n}; ${q.n} takes ${burn} fire damage and the web will burn away in 2 rounds.`)}if(q.hp<=0)resolveMonsterDefeat(q)}if(s.kind==="area"&&s.damageType==="fire"&&combatDistance()<=((s.areaFeet||40)/2)&&h.combat){let mirror=h.spells?.buffs?.find(b=>b.kind==="images"&&b.images>0);if(mirror){mirror.images=0;clog("The area attack destroys all Mirror Images.")}let base=sharedDamage??rollSpellDamage(s),sv=savingThrow("Spells",0,"fire"),dmg=sv.success?Math.floor(base/2):base;dmg=applyElementalResistance(dmg,Math.max(1,Math.min(h.level,20))+"d6","fire",true);h.hp=Math.max(0,h.hp-dmg);clog(`You are caught in the blast: save ${sv.roll} vs ${sv.target} — ${sv.success?"success":"FAIL"}; ${dmg} fire damage.`);if(h.hp<=0)return combatDeath("Your own fireball engulfs you.")}
 }else if(s.kind==="heal"){if(magicalHealingBlockedByDisease()){clog(`${s.name} cannot heal through Tomb Rot.`)}else{let heal=rollExpr(s.heal),before=h.hp;h.hp=Math.min(h.maxhp,h.hp+heal);clog(`${autonomous?"Autonomous: ":""}${s.name} restores ${h.hp-before} HP.`)}}
 else if(s.kind==="buff"){
  if(s.av==="Bless"&&h.combat?.range==="Hand-to-Hand"){clog(`${s.name} cannot affect you once you are already in melee.`)}
  else{
   let boundWeapon=s.av==="Striking"?combatStats().weapon:null;
   let duplicate=h.spells.buffs.some(b=>b.av===s.av&&(s.av!=="Striking"||b.boundWeapon===boundWeapon));
   if(duplicate)clog(`${s.name} is already active; a second casting does not combine with the first.`);
   else{let buff={...s,rounds:spellDuration(s)};if(s.av==="Striking")buff.boundWeapon=boundWeapon;if(s.av==="Protection from Evil")buff.barrierBroken=false;h.spells.buffs.push(buff);clog(s.av==="Striking"?`${s.name} empowers ${buff.boundWeapon}.`:`${s.name} takes effect.`)}
  }
 }
 else if(s.kind==="cleanse"){if(s.av==="Cure Disease"){let cured=cureOneDisease();clog(cured?`${s.name} cures ${cured.name}.`:`${s.name} finds no disease to cure.`)}else{h.conditions=h.conditions||[];let before=h.conditions.length;h.conditions=h.conditions.filter(x=>x!==s.condition);clog(before!==h.conditions.length?`${s.name} removes ${s.condition}.`:`${s.name} finds nothing to remove.`)}}
 else if(s.kind==="images"){let n=rollExpr(s.images);h.spells.buffs.push({...s,images:n,rounds:spellDuration(s)});clog(`${s.name} creates ${n} illusory images.`)}
 else if(s.kind==="sleep"){let eligible=gridlessAreaTargets(t,s.areaFeet||40).filter(sleepEligible).sort((a,b)=>(Number(a.hdDice)||1)-(Number(b.hdDice)||1)||(Number(a.hdAdj)||0)-(Number(b.hdAdj)||0)),hdBudget=d(8)+d(8),rounds=spellDuration(s),affected=0;for(const q of eligible){let hd=Math.max(1,Number(q.hdDice)||1);if(hd>hdBudget)continue;hdBudget-=hd;q.disabledRounds=Math.max(q.disabledRounds||0,rounds);q.sleeping=true;affected++;clog(`${q.n} falls asleep for ${Math.ceil(rounds/AV_ROUNDS_PER_TURN)} turn(s).`)}if(!affected)clog(`${s.name} finds no eligible living creature of 4+1 HD or less.`)}
 else if(s.kind==="web"){for(const q of gridlessAreaTargets(t,s.areaFeet||10)){let strong=q.webStrength==="great",rounds=strong?2:(d(4)+d(4))*AV_ROUNDS_PER_TURN;q.disabledRounds=Math.min(rounds,spellDuration(s));q.webbed=true;clog(`${q.n} is caught in the web${strong?" and can tear free in 2 rounds":` for ${Math.ceil(rounds/AV_ROUNDS_PER_TURN)} turn(s)`}.`)}}
 else if(s.kind==="hold"){let valid=validHoldTargets(s),single=holdMode==="single",count=single?1:(s.maxTargets||4),chosenIds=Array.isArray(holdTargetIds)?[...new Set(holdTargetIds)].slice(0,count):null,qs=single?(t&&valid.includes(t)?[t]:[]):chosenIds?chosenIds.map(id=>valid.find(q=>q.id===id)).filter(Boolean):valid.slice(0,count),penalty=single?2:0;for(const q of qs){let sv=monsterSpellSave(q,s.save||"Spells");if(penalty)sv.roll-=penalty;sv.success=sv.roll>=sv.target;clog(`${q.n} save ${sv.roll} vs ${sv.target}${sv.saveAs?` [${sv.saveAs}]`:""}${penalty?" (-2 single-target penalty)":""}: ${sv.success?"success":"FAIL"}.`);if(!sv.success){q.disabledRounds=Math.max(q.disabledRounds||0,spellDuration(s));q.held=true;clog(`${q.n} is held.`)}else clog(`${q.n} resists ${s.name}.`)}if(!qs.length)clog(`${s.name} has no valid humanoid target.`)}
 else if(s.kind==="debuff"){let qs=s.av==="Slow"?gridlessAreaTargets(t,s.areaFeet||60).slice(0,s.maxTargets||24):[t||living()[0]];for(const q of qs.filter(Boolean)){let sv=monsterSpellSave(q,s.save||"Spells");clog(`${q.n} save ${sv.roll} vs ${sv.target}${sv.saveAs?` [${sv.saveAs}]`:""}: ${sv.success?"success":"FAIL"}.`);if(!sv.success){q.slowRounds=spellDuration(s);clog(`${q.n} is slowed.`)}else clog(`${q.n} resists ${s.name}.`)}}
 else if(s.kind==="blind"){let q=t||living()[0];if(q){let sv=monsterSpellSave(q,s.save||"Spells");clog(`${q.n} save ${sv.roll} vs ${sv.target}${sv.saveAs?` [${sv.saveAs}]`:""}: ${sv.success?"success":"FAIL"}.`);if(!sv.success){q.blindRounds=spellDuration(s);clog(`${q.n} is blinded by ${s.name}.`)}else clog(`${s.name} fails to blind ${q.n}.`)}}
 else if(s.kind==="utility"){clog(`${s.name} is active; no current combat target effect.`)}
}
function castCombatSpell(id,holdMode=null,missileTargetIds=null,holdTargetIds=null){
 let s=(SPELLS[h.className]||[]).find(x=>x.id===id),c=h.combat;if(!s||!c||!availableCombatSpells().some(x=>x.id===id))return;if(s.kind==="hold"&&!holdMode)holdMode=validHoldTargets(s).length===1?"single":"group";if(c.paralyzed){clog(`${h.name} is paralyzed and cannot cast.`);return renderCombat()}if(s.enemyTarget&&Number.isFinite(s.rangeFeet)&&combatDistance()>s.rangeFeet){clog(`${s.name} is out of range: target is ${combatDistance()} ft away; spell range is ${s.rangeFeet} ft.`);return renderCombat()}
 // Averathia: the spell is committed for the round before initiative resolves. Pit Vipers act first automatically; Zombies act after the caster.
 let pr=d(6),er=d(6);while(pr===er){pr=d(6);er=d(6)}
 let delayedZombies=living().some(e=>e.alwaysLoseInitiative),normalEnemies=living().some(e=>!e.alwaysLoseInitiative&&!e.alwaysWinInitiative);
 if(!consumeSpell(s))return;
 let hpBefore=h.hp,conditionsBefore=(h.conditions||[]).length;
 if(!preemptiveEnemiesAct())return;
 if(h.hp<hpBefore||(h.conditions||[]).length>conditionsBefore){
   clog(`${s.name} is disrupted and lost.`);
   if(h.combat&&h.hp>0)enemyStrike(e=>!e.alwaysWinInitiative,true);
   if(h.combat)advanceCombatRound(c,true);return
 }
 if(!normalEnemies&&delayedZombies)clog("Spell initiative: Zombies always lose initiative; you cast before them.");
 else if(normalEnemies)clog(`Spell initiative: you ${pr}, enemies ${er}.`);
 if(normalEnemies&&er>pr){
   hpBefore=h.hp;conditionsBefore=(h.conditions||[]).length;
   enemyStrike(e=>!e.alwaysLoseInitiative&&!e.alwaysWinInitiative,!delayedZombies);if(!h.combat)return;
   if(h.hp<hpBefore||(h.conditions||[]).length>conditionsBefore){
     clog(`${s.name} is disrupted and lost.`);
     if(h.combat&&h.hp>0&&living().some(e=>e.alwaysLoseInitiative))enemyStrike(e=>e.alwaysLoseInitiative,true);
     else if(h.combat&&delayedZombies)tickMonsterRegeneration();
     if(h.combat)advanceCombatRound(c,true);return
   }
 }
 let t=c.enemies[c.target];if(!t||t.hp<=0)t=living()[0];if(s.missilesByLevel&&!missileTargetIds&&autonomousCombatRunning)missileTargetIds=autonomousMissileTargetIds(magicMissileCount());resolveSpellEffect(s,t,autonomousCombatRunning,holdMode,missileTargetIds,holdTargetIds);
 if(!h.combat)return;if(!living().length)return finishCombat();
 if(!normalEnemies||pr>er)enemyStrike(e=>!e.alwaysWinInitiative);
 else if(h.combat&&living().some(e=>e.alwaysLoseInitiative))enemyStrike(e=>e.alwaysLoseInitiative,true);
 else if(h.combat&&delayedZombies)tickMonsterRegeneration();
 if(h.combat)advanceCombatRound(h.combat,true)
}
function tickEnemySpellEffects(){if(!h.combat)return;for(const e of living()){if(e.disabledRounds>0)e.disabledRounds--;if(e.disabledRounds<=0&&e.webbed){e.webbed=false;clog(`${e.n} breaks free of the web.`)}if(e.disabledRounds<=0&&e.sleeping){e.sleeping=false;clog(`${e.n} awakens.`)}if(e.disabledRounds<=0&&e.held){e.held=false;clog(`${e.n} is no longer held.`)}if(e.slowRounds>0)e.slowRounds--;if(e.blindRounds>0){e.blindRounds--;if(e.blindRounds<=0){e.blindMoveTicks=0;clog(`${e.n} can see again.`)}}}}
function tickPlayerConditions(){
 if(!h?.combat)return false;
 if(ageTimedConditionsByRounds(1,true)===false||!h.combat)return false;
 if(h.combat.tarantellaHelpless&&!timedConditionHelpless()){h.combat.tarantellaHelpless=false;h.combat.paralyzed=false;h.combat.paralyzedRounds=0}
 if(h.combat.fearParalyzed&&!living().some(e=>e.mummy)){h.combat.fearParalyzed=false;h.combat.paralyzed=false;h.combat.paralyzedRounds=0;clog(`${h.name} can move again now that the Mummy is out of sight.`)}
 if(h.combat.paralyzed&&!h.combat.fearParalyzed&&!h.combat.tarantellaHelpless){
  if(!Number.isFinite(h.combat.paralyzedRounds))h.combat.paralyzedRounds=1;h.combat.paralyzedRounds--;
  if(h.combat.paralyzedRounds<=0){let sick=!!h.combat.potionSick;h.combat.paralyzed=false;h.combat.paralyzedRounds=0;h.combat.potionSick=false;clog(sick?`${h.name} recovers from potion sickness.`:`${h.name} can move again.`)}
 }
 return true
}
function advanceCombatRound(c=h?.combat,render=true){
 if(!h?.combat)return false;tickSpellBuffs();tickEnemySpellEffects();if(tickPlayerConditions()===false||!h.combat)return false;c=c||h.combat;c.round++;save();if(render&&h.combat)renderCombat();return true
}
function avSpeedLevel(){
 ensureSpellState();let sources=new Set();
 for(const b of h.spells.buffs){if(b.speedSource)sources.add(b.speedSource);else if(b.extraAttack)sources.add("haste")}
 return Math.min(2,sources.size)
}
function avWeaponAttacksPerAction(){return 2**avSpeedLevel()}
function avSpeedHitBonus(){return avSpeedLevel()*2}
function spellAttackBonus(){ensureSpellState();return h.spells.buffs.reduce((a,b)=>a+(b.attack||0),0)+avSpeedHitBonus()}
function spellACBonus(){ensureSpellState();return h.spells.buffs.reduce((a,b)=>a+(b.ac||0),0)}
function effectiveAC(isMissile=false){let ac=combatStats().ac;for(const b of h.spells.buffs){let fixed=isMissile?b.fixedMissileAC:b.fixedAC;if(fixed!=null)ac=Math.min(ac,fixed)}return ac+spellACBonus()}
function tickSpellBuffs(){ensureSpellState();h.spells.buffs.forEach(b=>b.rounds--);h.spells.buffs=h.spells.buffs.filter(b=>b.rounds>0);h.buffAgeAt=Date.now()}
function resetDailySpells(){ensureSpellState();h.spells.used={};h.spells.spentMem=[];h.spells.buffs=[];h.buffAgeAt=Date.now()}
function beginHoldGroupSelection(s,menu){
 let valid=validHoldTargets(s),chosen=[];
 if(valid.length<2){menu.classList.add("hide");return renderCombat()}
 const draw=()=>{
  let picked=new Set(chosen);
  menu.innerHTML=`<div class="small"><b>${s.name}</b> — choose 2–4 humanoid targets. Selected: ${chosen.length}/4.</div>`+
   valid.map(e=>`<button class="spellChoice ${picked.has(e.id)?"on":""}" data-hold-target="${e.id}">${picked.has(e.id)?"✓ ":""}${e.n}</button>`).join("")+
   `<button data-hold-confirm ${chosen.length<2?"disabled":""}>Cast on selected</button><button data-hold-cancel>Cancel</button>`;
  $$("[data-hold-target]").forEach(b=>b.onclick=()=>{let id=+b.dataset.holdTarget,i=chosen.indexOf(id);if(i>=0)chosen.splice(i,1);else if(chosen.length<4)chosen.push(id);draw()});
  let confirm=$("[data-hold-confirm]");if(confirm)confirm.onclick=()=>{if(chosen.length<2)return;menu.classList.add("hide");castCombatSpell(s.id,"group",null,chosen)};
  let cancel=$("[data-hold-cancel]");if(cancel)cancel.onclick=()=>{menu.classList.add("hide");renderCombat()}
 };
 draw()
}
function beginMissileAllocation(s,menu){
 let total=magicMissileCount(),picks=[];
 if(total<=1||living().length<=1){menu.classList.add("hide");castCombatSpell(s.id);return}
 const draw=()=>{
  let left=total-picks.length,counts={};for(const id of picks)counts[id]=(counts[id]||0)+1;
  menu.innerHTML=`<div class="small"><b>${s.name}</b> — assign ${total} darts before casting. ${left} remaining.</div>`+
   living().map(e=>`<div class="item"><span><b>${e.n}</b><div class="small">Assigned: ${counts[e.id]||0}</div></span><button data-missile-one="${e.id}">+1</button><button data-missile-rest="${e.id}">All remaining</button></div>`).join("")+
   '<button data-missile-cancel>Cancel</button>';
  $$("[data-missile-one]").forEach(b=>b.onclick=()=>{if(left<=0)return;picks.push(+b.dataset.missileOne);if(picks.length>=total){menu.classList.add("hide");castCombatSpell(s.id,null,picks)}else draw()});
  $$("[data-missile-rest]").forEach(b=>b.onclick=()=>{while(picks.length<total)picks.push(+b.dataset.missileRest);menu.classList.add("hide");castCombatSpell(s.id,null,picks)});
  let cancel=$("[data-missile-cancel]");if(cancel)cancel.onclick=()=>{menu.classList.add("hide");renderCombat()}
 };
 draw()
}
function renderSpellButton(){
 let b=$("#spellBtn");if(!b||!h?.combat)return;let spells=availableCombatSpells();
 b.classList.toggle("hide",!spells.length);b.textContent=spells.length?`✨ Spell (${spells.length})`:"✨ Spell";
 b.onclick=()=>{
  let menu=$("#spellMenu");if(!menu)return;$("#rangeMenu")?.classList.add("hide");
  menu.innerHTML=spells.flatMap(s=>{
   let oor=s.enemyTarget&&Number.isFinite(s.rangeFeet)&&combatDistance()>s.rangeFeet,rt=Number.isFinite(s.rangeFeet)?` · ${s.rangeFeet} ft`:"";
   if(s.kind==="hold"){
    let valid=validHoldTargets(s),validCount=valid.length,current=c.enemies[c.target],singleValid=!!current&&valid.includes(current),groupDisabled=oor||validCount<2;
    return [
     `<button class="spellChoice" data-cast-spell="${s.id}" data-hold-mode="single" ${oor||!singleValid?"disabled":""}><b>${s.name}</b> <span class="small">Single · -2 save${rt}${!singleValid?" · SELECT HUMANOID TARGET":""}${oor?" · OUT OF RANGE":""}</span></button>`,
     `<button class="spellChoice" data-cast-spell="${s.id}" data-hold-mode="group" ${groupDisabled?"disabled":""}><b>${s.name}</b> <span class="small">Group · choose up to 4${rt}${validCount<2?" · NEEDS 2+ TARGETS":""}${oor?" · OUT OF RANGE":""}</span></button>`
    ]
   }
   let activeBuff=false;
   if(s.kind==="buff"){
    let boundWeapon=s.av==="Striking"?combatStats().weapon:null;
    activeBuff=h.spells?.buffs?.some(b=>b.av===s.av&&(s.av!=="Striking"||b.boundWeapon===boundWeapon))||false;
   }
   return [`<button class="spellChoice" data-cast-spell="${s.id}" ${oor||activeBuff?"disabled":""}><b>${s.name}</b> <span class="small">L${s.sl}${rt}${activeBuff?" · ACTIVE":""}${oor?" · OUT OF RANGE":""}</span></button>`]
  }).join("");
  menu.classList.toggle("hide");
  $$("[data-cast-spell]").forEach(x=>x.onclick=()=>{
   let chosen=spells.find(s=>s.id===x.dataset.castSpell),holdMode=x.dataset.holdMode||null;
   if(chosen?.kind==="hold"&&holdMode==="group")return beginHoldGroupSelection(chosen,menu);
   if(chosen?.missilesByLevel&&magicMissileCount()>1&&living().length>1)return beginMissileAllocation(chosen,menu);
   menu.classList.add("hide");castCombatSpell(x.dataset.castSpell,holdMode)
  })
 }
}
function rangeAttackMod(weapon=combatStats().weaponKey){
 let ranges=WEAPON_RANGES[weaponBaseName(weapon)],dist=combatDistance();if(!ranges)return 0;
 if(dist<=ranges[0])return 1;if(dist<=ranges[1])return 0;if(dist<=ranges[2])return -1;return -99
}
function renderRangeButton(){
 let b=$("#rangeBtn"),menu=$("#rangeMenu");if(!b||!menu||!h?.combat)return;
 syncCombatRange();let i=combatBandIndex(),speed=avSpeedLevel();
 b.textContent=speed?`📏 Change Range ⚡×${2**speed}`:"📏 Change Range";
 b.onclick=()=>{i=combatBandIndex();$("#spellMenu")?.classList.add("hide");$("#magicItemMenu")?.classList.add("hide");let choices=[];if(i>0)choices.push('<button data-range-dir="closer">⬅ Closer</button>');if(i<RANGE_BANDS.length-1)choices.push('<button data-range-dir="farther">Farther ➡</button>');if(speed)choices.push(`<span class="small">Speed: up to ${Math.min(3,2**speed)} range bands</span>`);menu.innerHTML=choices.join("");menu.classList.toggle("hide");$$("[data-range-dir]").forEach(x=>x.onclick=()=>changeRange(x.dataset.rangeDir))}
}
function changeRange(direction){
 if(!h?.combat)return;if(h.combat.paralyzed){clog("You cannot change range while incapacitated.");return renderCombat()}
 let i=combatBandIndex(),speed=avSpeedLevel(),steps=Math.min(3,2**speed),ni=direction==="farther"?Math.min(RANGE_BANDS.length-1,i+steps):Math.max(0,i-steps);
 if(ni===i){clog(`You are already at ${RANGE_BANDS[i].name} range.`);return renderCombat()}
 if(!preemptiveEnemiesAct())return;
 setCombatBand(ni);$("#rangeMenu")?.classList.add("hide");clog(`You move ${direction==="farther"?"farther away":"closer"}${speed?` at ×${2**speed} speed`:""}: ${h.combat.range} (${combatDistance()}').`);enemyStrike(e=>!e.alwaysWinInitiative);
 if(h.combat)advanceCombatRound(h.combat,true)
}
function resolveAttack(){
 let c=h.combat;if(!preemptiveEnemiesAct())return;
 let pr=d(6),er=d(6);while(pr===er){pr=d(6);er=d(6)}
 let delayedZombies=living().some(e=>e.alwaysLoseInitiative),normalEnemies=living().some(e=>!e.alwaysLoseInitiative&&!e.alwaysWinInitiative);
 if(!normalEnemies){
  if(delayedZombies)clog("Initiative: Zombies always lose initiative; you act before them.");
  playerStrike();
  if(h.combat&&h.hp>0&&living().some(e=>e.alwaysLoseInitiative))enemyStrike(e=>e.alwaysLoseInitiative,true)
 }else{
  clog(`Initiative: you ${pr}, enemies ${er}.`);
  if(pr>er){playerStrike();if(h.combat&&living().length)enemyStrike(e=>!e.alwaysWinInitiative)}
  else{
   enemyStrike(e=>!e.alwaysLoseInitiative&&!e.alwaysWinInitiative,!delayedZombies);
   if(h.combat&&h.hp>0&&living().length)playerStrike();
   if(h.combat&&h.hp>0&&living().some(e=>e.alwaysLoseInitiative))enemyStrike(e=>e.alwaysLoseInitiative,true);
   else if(h.combat&&delayedZombies)tickMonsterRegeneration()
  }
 }
 if(!h.combat)return;if(!living().length)return finishCombat();advanceCombatRound(c,true)
}
function useHolyWaterCombat(){
 if(!h?.combat)return;
 if(h.combat.paralyzed){clog(`${h.name} is paralyzed and cannot throw Holy Water.`);return renderCombat()}
 let i=h.inv.findIndex(x=>x.n==="Holy Water"),t=h.combat.enemies.find(e=>e.id===h.combat.target&&e.hp>0)||living()[0];
 if(i<0){clog("No Holy Water.");return renderCombat()}
 if(!t?.undead){clog("Holy Water only harms undead; choose an undead target.");return renderCombat()}
 let dist=combatDistance(),ranges=WEAPON_RANGES["Holy Water"];if(dist>ranges[2]){clog("Holy Water is out of range.");return renderCombat()}
 if(!preemptiveEnemiesAct())return;
 h.inv.splice(i,1);
 let r=d(20),atkMod=mod(h.stats.DEX)+rangeAttackMod("Holy Water")+playerTimedAttackModifier(),hit=r===20||(r!==1&&r+atkMod>=characterNeed(t.ac));
 if(hit){let dmg=d(8);if(r===20)dmg*=2;t.hp=Math.max(0,t.hp-dmg);clog(`${r===20?"Critical hit! ":""}Holy Water splashes ${t.n} for ${dmg} damage.`);if(t.hp<=0){let gained=awardXP(t.xp);clog(`${t.n} defeated. +${gained} XP.`)}}
 else clog(`Holy Water misses ${t.n}; the vial shatters harmlessly.`);
 if(!living().length)return finishCombat();
 enemyStrike(e=>!e.alwaysWinInitiative);if(h.combat)advanceCombatRound(h.combat,true)
}
function useMummyBurnCombat(){
 if(!h?.combat)return;
 if(h.combat.paralyzed){clog(`${h.name} is paralyzed and cannot use fire.`);return renderCombat()}
 let t=h.combat.enemies.find(e=>e.id===h.combat.target&&e.hp>0)||living().find(e=>e.mummy&&e.hp>0);
 if(!t?.mummy){clog("Burn Mummy requires a Mummy target.");return renderCombat()}
 if(!h.mummyWeaknessKnown){clog("The character has not learned the Mummy's weakness yet.");return renderCombat()}
 if(combatDistance()>5){clog("You must be at Hand-to-Hand range to scorch the Mummy safely.");return renderCombat()}
 const cost=5;if(totalLightMinutes()<cost){clog(`Burn Mummy needs ${cost} light-minutes from Torch or Lamp Oil.`);return renderCombat()}
 if(!preemptiveEnemiesAct())return;
 consumeLightMinutes(cost);
 let r=d(20),atkMod=mod(h.stats.STR)+playerTimedAttackModifier(),hit=r===20||(r!==1&&r+atkMod>=characterNeed(t.ac));
 if(r===1){h.combat.skipNext=true;clog(`Natural 1 — the flame misses and ${cost} light-minutes are spent. Next initiative is lost.`)}
 else if(hit){let dmg=d(3);if(r===20)dmg*=2;applyMonsterDamage(t,dmg,"fire");clog(`${r===20?"Critical hit! ":""}You spend ${cost} light-minutes scorching ${t.n} for ${dmg} fire damage.`);if(t.hp<=0)resolveMonsterDefeat(t)}
 else clog(`The flame fails to catch; ${cost} light-minutes are spent.`);
 if(!living().length)return finishCombat();
 enemyStrike(e=>!e.alwaysWinInitiative);if(h.combat)advanceCombatRound(h.combat,true)
}
function finishCombat(){
 let streetSleep=!!h.combat?.context?.streetSleep,boss=!!h.combat?.isBoss,enemies=[...(h.combat?.enemies||[])],treasure=avRollCombatTreasure(enemies,boss,h.level,false);
 let defeated=enemies.filter(e=>e.destroyed||e.hp<=0).length,total=enemies.length;
 if(!streetSleep)addlog((boss?"Boss defeated":"Combat won")+" — "+defeated+" of "+total+" enem"+(total===1?"y":"ies")+" defeated.","Combat");
 avAwardTreasure(treasure,streetSleep?"Mugger's carried treasure":"Averathia carried treasure");
 if(streetSleep){
  ensureInnState();h.inn.lastStreetEvent={day:innCurrentDay(),type:"Mugging",combat:true,text:"You defeated the mugger who attacked while you slept on the street."};
  recoverThrownWeapons();h.combat=null;save();page("home");return
 }
 if(boss)resolveMissionBoss();
 recoverThrownWeapons();h.combat=null;endTripPause();save();
 if(h.trip&&diseaseJourneyBlocked()){returnEarly(`${journeyBlockingCondition()?.name||"Current condition"} prevents further adventuring. You turn back toward town.`);return}
 if(h.trip&&timedConditionJourneyBlocked()){returnEarly(`${timedConditionBlockingName()} prevents further adventuring. You turn back toward town.`);return}
 page("depart");refresh();if(!autonomousCombatRunning)tick()
}
function usePotionCombat(){if(h?.combat?.paralyzed){clog(`${h.name} is paralyzed and cannot use a potion.`);return renderCombat()}let i=h.inv.findIndex(x=>x.n==="Healing Potion");if(i<0){clog("No Healing Potion.");return renderCombat()}if(!preemptiveEnemiesAct())return;h.inv.splice(i,1);if(magicalHealingBlockedByDisease()){clog("Healing Potion is consumed, but Tomb Rot prevents it from restoring HP.")}else{let heal=d(6)+1;h.hp=Math.min(h.maxhp,h.hp+heal);clog(`Potion restores ${heal} HP.`)}enemyStrike(e=>!e.alwaysWinInitiative);if(h.combat)advanceCombatRound(h.combat,true)}
function retreatCombat(){
 if(h?.combat?.paralyzed){clog(`${h.name} is paralyzed and cannot retreat.`);return renderCombat()}
 if(!preemptiveEnemiesAct())return;
 let lessonEscape=!!(h?.combat?.trollLesson&&h.combat.trollLessonDowned);
 if(d(6)>=3){
   if(h.combat?.context?.streetSleep){
    ensureInnState();h.inn.lastStreetEvent={day:innCurrentDay(),type:"Mugging",combat:true,text:"A mugger attacked while you slept on the street, but you escaped."};
    recoverThrownWeapons();h.combat=null;save();page("home");return
   }
   addlog("You escape the encounter.","Combat");recoverThrownWeapons();h.combat=null;endTripPause();
   if(lessonEscape&&h.trip){h.trip.trollLessonReturn=true;save();returnEarly("You retreat toward town. Behind you, the Troll is already beginning to move again.");return}
   save();if(h.trip&&diseaseJourneyBlocked()){returnEarly(`${journeyBlockingCondition()?.name||"Current condition"} prevents further adventuring. You turn back toward town.`);return}
   if(h.trip&&timedConditionJourneyBlocked()){returnEarly(`${timedConditionBlockingName()} prevents further adventuring. You turn back toward town.`);return}
   page("depart");refresh();if(!autonomousCombatRunning)tick()
 }else{clog("Retreat fails.");enemyStrike(e=>!e.alwaysWinInitiative);if(h.combat)advanceCombatRound(h.combat,true)}
}
function renderCombat(){if(!h?.combat)return;page("combat");let c=h.combat,cs=combatStats(),ac=effectiveAC(false),mac=effectiveAC(true),acText=ac===mac?`AC ${ac}`:`AC ${ac} · Missile AC ${mac}`,at=ammoTypeFor(cs.weaponItem||cs.weapon),ammo=at?` · 🎯 ${at}: ${ammoCount(at)}`:"",wr=cs.rangeText!=="—"?` · S/M/L ${cs.rangeText}`:"",reload=cs.weaponKey==="Heavy Crossbow"&&h.stats.STR<18&&c.heavyCrossbowNextRound&&c.round<c.heavyCrossbowNextRound?` · ⏳ reload → R${c.heavyCrossbowNextRound}`:"";$("#combatRound").textContent=`Round ${c.round}`;$("#combatStatus").innerHTML=`❤️ HP ${h.hp}/${h.maxhp} · 🛡 ${acText} · ⚔ ${cs.weapon} (${cs.damage})${wr}${ammo}${reload} · 📏 ${c.range||"Close"} @ ${combatDistance()}\'`;$("#combatEnemies").innerHTML=c.enemies.map(e=>`<button class="enemyCard ${c.target===e.id?"target":""}" data-target="${e.id}" ${e.hp<=0?"disabled":""}><b>${e.boss?"👑 BOSS — ":""}${e.n}</b> · HP ${e.hp}/${e.maxhp} · AC ${e.ac} · Line ${(e.lane??e.id%3)+1}</button>`).join("");$("#combatLog").innerHTML=c.log.map(x=>`<div>${x}</div>`).join("");$("#combatLog").scrollTop=$("#combatLog").scrollHeight;$$("[data-target]").forEach(b=>b.onclick=()=>{c.target=+b.dataset.target;save();renderCombat()});renderSpellButton();renderRangeButton();renderMagicItemButton();let locked=!!c.paralyzed,holy=$("#holyWaterBtn"),burn=$("#mummyBurnBtn"),target=c.enemies.find(e=>e.id===c.target&&e.hp>0),hasHoly=h.inv.some(x=>x.n==="Holy Water");if(holy){holy.classList.toggle("hide",!hasHoly);holy.disabled=locked||!target?.undead||combatDistance()>50}if(burn){let show=!!(target?.mummy&&h.mummyWeaknessKnown);burn.classList.toggle("hide",!show);burn.disabled=locked||!show||combatDistance()>5||totalLightMinutes()<5}$("#attackBtn").textContent=locked?"⏳ End Round (Paralyzed)":"⚔ Attack";for(const id of ["#spellBtn","#rangeBtn","#potionBtn","#magicItemBtn","#retreatBtn","#mummyBurnBtn"])if($(id)&&locked)$(id).disabled=true}
function journal(entry){h.trip.journal=h.trip.journal||[];h.trip.journal.push({time:Date.now(),...entry})}
const CLERIC_EVENTS=[{"id":"CLE-001","type":"Encounter","title":"Restless Crypt","text":"The crypt door yawns open and dead hands scrape against stone.","choices":[{"label":"Turn Undead","result":"clericTurn"},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-002","type":"Encounter","title":"Bone Chapel","text":"Skeletons rise among the shattered pews of a burial chapel.","choices":[{"label":"Turn Undead","result":"clericTurn"},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-003","type":"Encounter","title":"Grave Watch","text":"Restless dead move between leaning grave markers.","choices":[{"label":"Turn Undead","result":"clericTurn"},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-004","type":"Encounter","title":"Catacomb Procession","text":"A procession of the dead blocks the narrow catacomb passage.","choices":[{"label":"Turn Undead","result":"clericTurn"},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-005","type":"Encounter","title":"Desecrated Tomb","text":"The corpse within a broken tomb lurches upright.","choices":[{"label":"Turn Undead","result":"clericTurn"},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-006","type":"Encounter","title":"Ashen Ossuary","text":"Dry bones knit themselves together around the ossuary.","choices":[{"label":"Turn Undead","result":"clericTurn"},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-007","type":"Encounter","title":"Sunken Mausoleum","text":"Dead guardians climb from black water around a sunken mausoleum.","choices":[{"label":"Turn Undead","result":"clericTurn"},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-008","type":"Encounter","title":"Bell-Tower Dead","text":"A dead bell-keeper descends the ruined tower stairs.","choices":[{"label":"Turn Undead","result":"clericTurn"},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-009","type":"Encounter","title":"Sepulchral Guard","text":"Ancient corpses stand between you and the inner sepulchre.","choices":[{"label":"Turn Undead","result":"clericTurn"},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-010","type":"Encounter","title":"Necropolis Gate","text":"The dead gather beneath the cracked arch of the necropolis.","choices":[{"label":"Turn Undead","result":"clericTurn"},{"label":"Fight","result":"combat"},{"label":"Withdraw","result":"avoided"}]},{"id":"CLE-011","type":"Decision","title":"Sealed Ossuary","text":"Sacred markings cover a sealed ossuary. Something about them feels wrong.","choices":[{"label":"Read the sacred signs","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-012","type":"Decision","title":"Broken Shrine","text":"A neglected shrine has been deliberately defaced.","choices":[{"label":"Reconsecrate the shrine","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-013","type":"Decision","title":"Funeral Bell","text":"A bell rings somewhere beneath the earth although no living hand pulls its rope.","choices":[{"label":"Follow the omen","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-014","type":"Decision","title":"Forbidden Reliquary","text":"A reliquary has been forced open and its wards disturbed.","choices":[{"label":"Examine the wards","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-015","type":"Decision","title":"Pilgrim's Warning","text":"A frightened pilgrim insists the burial road is cursed.","choices":[{"label":"Judge the warning","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-016","type":"Decision","title":"Black Candles","text":"Black candles burn before an empty tomb without melting.","choices":[{"label":"Test the profane rite","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-017","type":"Decision","title":"Unquiet Grave","text":"Fresh soil moves on a grave that has stood for generations.","choices":[{"label":"Perform a calming rite","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-018","type":"Decision","title":"Chapel Threshold","text":"A cold pressure hangs across the chapel threshold.","choices":[{"label":"Bless the threshold","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-019","type":"Decision","title":"Nameless Sarcophagus","text":"Every name has been chiselled from an ancient sarcophagus.","choices":[{"label":"Study the desecration","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-020","type":"Decision","title":"Whispering Vault","text":"Whispers answer every prayer spoken near a sealed vault.","choices":[{"label":"Discern the voices","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"passed"}]},{"id":"CLE-021","type":"Discovery","title":"Saint's Niche","text":"A hidden niche contains an old devotional token.","choices":[{"label":"Examine the niche","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-022","type":"Discovery","title":"Catacomb Map","text":"Faded devotional marks form a map of forgotten passages.","choices":[{"label":"Interpret the markings","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-023","type":"Discovery","title":"Consecrated Spring","text":"Clear water gathers beneath a weathered sacred carving.","choices":[{"label":"Recognize the blessing","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-024","type":"Discovery","title":"Burial Ledger","text":"A stone ledger records generations of forgotten burials.","choices":[{"label":"Study the names","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-025","type":"Discovery","title":"Ancient Epitaph","text":"An inscription records why this crypt was sealed.","choices":[{"label":"Interpret the epitaph","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-026","type":"Discovery","title":"Reliquary Fragment","text":"A fragment of a small reliquary lies beneath fallen masonry.","choices":[{"label":"Identify the fragment","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-027","type":"Discovery","title":"Votive Chamber","text":"Hundreds of tiny offerings cover a chamber wall.","choices":[{"label":"Read their pattern","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-028","type":"Discovery","title":"Saint Ordel's Mark","text":"An unfamiliar carved symbol resembles accounts of Saint Ordel.","choices":[{"label":"Recall the tradition","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-029","type":"Discovery","title":"Processional Mosaic","text":"A damaged mosaic depicts an old funerary procession.","choices":[{"label":"Study the mosaic","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-030","type":"Discovery","title":"Hidden Vestry","text":"A concealed vestry holds mouldering vestments and records.","choices":[{"label":"Search the records","result":"clericWis","difficulty":"Normal","xp":3},{"label":"Leave it","result":"left"}]},{"id":"CLE-031","type":"Quiet","title":"Silent Nave","text":"Only dust moves through the ruined chapel.","choices":[]},{"id":"CLE-032","type":"Quiet","title":"Candle Alcove","text":"An abandoned candle alcove offers a sheltered pause.","choices":[]},{"id":"CLE-033","type":"Quiet","title":"Old Cemetery","text":"The cemetery lies quiet beneath the grey sky.","choices":[]},{"id":"CLE-034","type":"Quiet","title":"Crypt Landing","text":"Nothing stirs on the broad stone landing.","choices":[]},{"id":"CLE-035","type":"Quiet","title":"Monastery Ruin","text":"Wind passes through the empty cloister.","choices":[]},{"id":"CLE-036","type":"Quiet","title":"Wayside Shrine","text":"A small roadside shrine remains undisturbed.","choices":[]},{"id":"CLE-037","type":"Quiet","title":"Stone Cloister","text":"Rain taps softly against the old cloister roof.","choices":[]},{"id":"CLE-038","type":"Quiet","title":"Pilgrim Steps","text":"Worn steps offer a place to rest before the climb.","choices":[]},{"id":"CLE-039","type":"Quiet","title":"Memorial Garden","text":"Dead leaves gather around weathered memorial stones.","choices":[]},{"id":"CLE-040","type":"Quiet","title":"Dawn Chapel","text":"Pale morning light enters through a roofless chapel.","choices":[]}];
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
  ["Ghoul Touch Immunity","Ghoul paralysis cannot lock an Elf's body, though paralysis from other causes can still affect them."],
  ["Infravision","In darkness, an Elf can read nearby heat differences when the surroundings allow infravision to work."],
  ["Secret Doors","Elf has a 1-in-3 chance to find a secret or concealed door."]
 ],
 Dwarf:[
  ["Infravision","In darkness, a Dwarf can read nearby heat differences when the surroundings allow infravision to work."],
  ["Stonecraft","A Dwarf who studies worked stone has a 1-in-3 chance to notice that something is wrong with the masonry — for example a disguised hazard, a section that can shift, an unnatural incline, or stonework from a different period."]
 ]
};
const SKILL_LABELS={openLocks:"Open Locks",findTraps:"Find Traps",removeTraps:"Remove Traps",climbWalls:"Climb Walls",moveSilently:"Move Silently",hideInShadows:"Hide in Shadows",pickPockets:"Pick Pockets",hearNoise:"Hear Noise"};
const SPELL_BRIEFS={
 "Arcane Dart":"Automatic direct magical damage.","Shield":"Protective magical ward.","Sleep":"Attempts to put foes to sleep.","Light":"Creates magical light.",
 "Mirror Image":"Creates illusory duplicates that can absorb attacks.","Web":"Creates restraining webs.","Fireball":"Fire damage in an area; successful save halves damage.","Lightning Bolt":"Heavy lightning damage in a line; successful save halves damage.",
 "Haste":"Combat speed and extra-attack support.","Slow":"Attempts to slow foes.","Hold Person":"Attempts to hold humanoid targets.","Protection from Normal Missiles":"Protection from ordinary missiles.",
 "Cure Light Wounds":"Restores HP.","Protection from Evil":"Protective divine ward.","Remove Fear":"Removes fear.","Resist Cold":"Protection against cold.","Bless":"+1 morale, attack and damage.","Resist Fire":"Protection against fire.","Cure Disease":"Removes disease.","Striking":"Adds magical damage to the affected weapon.",

 "Arcane Bolt":"Direct arcane damage.","Ember Lance":"Focused fire damage.","Storm Shard":"Lightning damage.","Flame Sphere":"Area-style fire damage.",
 "Frost Spear":"Cold damage.","Thunder Chain":"Electrical damage.","Violet Ray":"Arcane damage.","Starfall":"Heavy arcane damage.",
 "Star Arrow":"Ranged magical damage.","Thorn Spark":"Nature-infused damage.","Moonfire":"Lunar magical damage.","Wildfire Burst":"Fire damage.",
 "Silver Briar":"Nature damage.","Sun Shaft":"Radiant damage.","Green Comet":"Heavy nature damage.","Wrath of the Grove":"Heavy nature damage.",
 "Mending Light":"Restores HP.","Battle Blessing":"Combat support buff.","Guardian Prayer":"Defensive support buff.","Greater Mending":"Restores more HP.",
 "Warding Light":"Defensive support.","War Prayer":"Combat support.","Restoring Grace":"Healing support.","Saint's Aegis":"Strong defensive support."
};
function classHasSkills(){return ["Thief","Elf","Dwarf","Arcanist","Cleric"].includes(h?.className)}
function renderSkills(){
 let nav=$("#skillsNav");if(nav)nav.classList.toggle("hide",!classHasSkills());
 let box=$("#skillsContent");if(!box||!h)return;
 let out=[];
 if(h.className==="Thief"){let a=thiefAbilities();for(const k of Object.keys(SKILL_LABELS))out.push(`<div class=skillCard><span class=skillPct>${a[k]}%</span><b>${SKILL_LABELS[k]}</b><span class=small>Improves automatically with level; no points to allocate.</span></div>`);out.push(`<div class=skillCard><b>Backstab</b><span class=small>+4 attack; ×2 damage when the backstab conditions are met.</span></div>`);if(h.level>=4)out.push(`<div class=skillCard><b>Read Languages</b><span class=small>80% chance.</span></div>`);if(h.level>=10)out.push(`<div class=skillCard><b>Magic-user Scrolls</b><span class=small>Can attempt scroll use; 10% backfire chance.</span></div>`)}
 for(const [name,desc] of (CLASS_SPECIALS[h.className]||[]))out.push(`<div class=skillCard><b>${name}</b><span class=small>${desc}</span></div>`);if(h.className!=="Elf")out.push(`<div class=skillCard><b>Secret Doors</b><span class=small>${h.className} has a 1-in-6 chance to find a secret or concealed door.</span></div>`);
 if(PREPARED_CASTERS.has(h.className)){
  ensureSpellState();let slots=spellSlotsFor(),list=SPELLS[h.className]||[],prepLocked=!!h.trip||!!h.combat||!!h.restUntil||(h.spells.spentMem||[]).length>0;
  out.push(`<div class=skillCard><b>Memorized Spells</b><span class=small>Choose the spells prepared for the current daily slots. Rest restores expended memorized spells.${prepLocked?" Loadout is locked until you are back in town with no expended prepared slots.":""}</span></div>`);
  for(let sl=1;sl<=slots.length;sl++){let cap=slots[sl-1]||0;if(!cap)continue;let known=list.filter(s=>s.sl===sl),mem=(h.spells.memorized?.[sl]||[]);out.push(`<div class=skillCard><b>Spell Level ${sl} — ${mem.length}/${cap} memorized</b>`+known.map(s=>{let copies=mem.filter(id=>id===s.id).length;return `<div class=spellPick><span>${s.name}<br><span class=small>${SPELL_BRIEFS[s.name]||"Spell effect."} · Prepared: ${copies}</span></span><span><button data-mem-add="${s.id}" data-sl="${sl}" ${mem.length>=cap||prepLocked?"disabled":""}>+</button> <button data-mem-remove="${s.id}" data-sl="${sl}" ${!copies||prepLocked?"disabled":""}>−</button></span></div>`}).join("")+`</div>`)}
 }
 if(h.className==="Cleric"&&hasCurableDisease()){let ready=availableCombatSpells().some(x=>x.id==="cure_disease");out.push(`<div class=skillCard><b>Cure Disease</b><span class=small>${diseaseStatusText()}</span><button id=townCureDisease ${ready&&!h.trip&&!h.combat&&!h.restUntil?"":"disabled"}>Cast on self</button></div>`)}
 box.innerHTML=out.join("")||`<div class=small>No class skills or special abilities to manage.</div>`;
 $$("[data-mem-add]").forEach(b=>b.onclick=()=>changeMemorized(b.dataset.memAdd,+b.dataset.sl,1));$$("[data-mem-remove]").forEach(b=>b.onclick=()=>changeMemorized(b.dataset.memRemove,+b.dataset.sl,-1));if($("#townCureDisease"))$("#townCureDisease").onclick=castTownCureDisease
}
function castTownCureDisease(){
 if(h.trip||h.combat||h.restUntil||!hasCurableDisease())return false;let spell=(SPELLS.Cleric||[]).find(x=>x.id==="cure_disease");if(!spell||!availableCombatSpells().some(x=>x.id===spell.id)||!consumeSpell(spell))return false;
 let cured=cureOneDisease();if(cured){save();renderSkills();return true}return false
}
function changeMemorized(id,sl,delta){
 ensureSpellState();if(h.trip||h.combat||h.restUntil||(h.spells.spentMem||[]).length>0)return renderSkills();
 h.spells.memorized=h.spells.memorized||{};let a=h.spells.memorized[sl]||[],cap=spellSlotsFor()[sl-1]||0;
 if(delta>0&&a.length<cap)a.push(id);
 if(delta<0){let i=a.lastIndexOf(id);if(i>=0)a.splice(i,1)}
 h.spells.memorized[sl]=a;
 save();renderSkills();
}
const EVENT_KEY_ITEMS=new Set(["Garlic","Holy Water","Steel Mirror","Belt Pouch","3 Stakes + Mallet","Wolfsbane","Hammer","Iron Spike","12 Iron Spikes","10-foot Pole","Small Sack","Large Sack","Quiver","Wine — 1 quart","50-foot Rope","Grappling Hook","Tinder Box","Lantern"]);
function hasInventoryItem(name){return !!h?.inv?.some(x=>x.n===name)}
function takeInventoryItem(name){let i=h?.inv?.findIndex(x=>x.n===name)??-1;if(i<0)return false;h.inv.splice(i,1);return true}
function oreFilledSackBP(ch){return ch?.oreSack==="Large Sack"?605:201}
function oreEmptySackBP(ch){return ch?.oreSack==="Large Sack"?5:1}
const SECRET_DOOR_SEARCH_EVENT_IDS=new Set([
 "FTR-003","FTR-019","FTR-027","FTR-029",
 "CLE-011","CLE-014","CLE-019","CLE-020","CLE-021","CLE-030",
 "THI-011","THI-017","THI-019","THI-028",
 "ARC-017","ARC-020","ARC-023",
 "DWA-015","DWA-025","DWA-028","DWA-030",
 "ELF-011","ELF-014","ELF-024","ELF-025"
]);
function secretDoorSearchChoice(ev,ch){
 if(!ev||!ch||!SECRET_DOOR_SEARCH_EVENT_IDS.has(ev.id))return false;
 let label=String(ch.label||"").toLowerCase();
 return !/leave|move on|withdraw|avoid|go around|step over/.test(label)
}
function resolveSecretDoorSearch(ev,ch){
 if(!secretDoorSearchChoice(ev,ch))return null;
 let roll=d(6),target=h.className==="Elf"?2:1;
 if(roll>target)return{searched:true,found:false,roll,target};
 let outcome=d(6),detail="A concealed seam gives way, revealing a forgotten passage.",treasure=null,applied=null;
 if(outcome>=4&&outcome<=5){
  treasure=avBlankTreasure("secret-door","small hidden cache");treasure.coins.sp=d(6)*10;applied=avApplyTreasure(treasure);
  detail=`Behind the secret door is a small hidden cache: ${avTreasureSummary(treasure)}.`;
 }else if(outcome===6){
  treasure=avRollUnguardedTreasure(h.level);applied=avApplyTreasure(treasure);
  detail=`The secret door opens into a forgotten chamber containing ${avTreasureSummary(treasure)}.`;
 }
 addlog(`Secret door discovered — ${detail}`,"Discovery");
 journal({id:ev.id+"-SECRET",type:"Secret Door",title:"Secret Door",text:detail,choice:ch.label,result:"secretDoor",xp:0,coins:[0,0,0],secretDoorRoll:roll,secretDoorTarget:target,avTreasure:treasure||null});
 return{searched:true,found:true,roll,target,outcome,treasure,applied}
}
function eventChoiceAvailable(ch){
 if(ch?.requiresItem&&!hasInventoryItem(ch.requiresItem))return false;
 if(Array.isArray(ch?.requiresAnyItem)&&!ch.requiresAnyItem.some(hasInventoryItem))return false;
 if(ch?.result==="collectOre"&&!canCarryAdditionalBP(oreFilledSackBP(ch)-oreEmptySackBP(ch)))return false;
 return true
}
function eventChoiceUnavailableReason(ch){
 if(ch?.requiresItem&&!hasInventoryItem(ch.requiresItem))return "Requires "+ch.requiresItem;
 if(Array.isArray(ch?.requiresAnyItem)&&!ch.requiresAnyItem.some(hasInventoryItem))return "Requires "+ch.requiresAnyItem.join(" / ");
 if(ch?.result==="collectOre"&&!canCarryAdditionalBP(oreFilledSackBP(ch)-oreEmptySackBP(ch)))return "Needs "+formatBP(oreFilledSackBP(ch)-oreEmptySackBP(ch))+" free BP";
 return "Unavailable"
}
function eventRequirementItem(ch){
 if(ch?.requiresItem)return ch.requiresItem;
 if(Array.isArray(ch?.requiresAnyItem))return ch.requiresAnyItem.find(hasInventoryItem)||null;
 return null
}
function eventUnlockedByInventory(ev){let keyed=(ev?.choices||[]).filter(c=>c.requiresItem||c.requiresAnyItem);return !keyed.length||keyed.some(eventChoiceAvailable)}
const SHORT_REST_EVENT={id:"REST-001",type:"Rest",title:"A Quiet Place to Rest",text:"The road offers a safe place to stop for a while.",choices:[{label:"Take a Short Rest",result:"shortRest"},{label:"Continue the Journey",result:"passed"}]};
const GEAR_KEY_EVENTS=[
 {id:"GEAR-001",type:"Decision",title:"A Nervous Young Suitor",text:"A young suitor is about to ask for a hand in marriage, but wants one last look at himself before he goes in.",choices:[{label:"Lend him your Steel Mirror",result:"gearKey",requiresItem:"Steel Mirror",xp:3,coins:[0,5,0]},{label:"Wish him courage",result:"passed"}]},
 {id:"GEAR-002",type:"Decision",title:"The Vampire Hunter",text:"Another adventurer is hurrying toward a vampire's lair and suddenly realizes the garlic was left back in town.",choices:[{label:"Give your Garlic",result:"gearKey",requiresItem:"Garlic",consumeItem:true,xp:4,coins:[0,0,0]},{label:"Wish them luck",result:"passed"}]},
 {id:"GEAR-003",type:"Decision",title:"Forgotten Stakes",text:"A worried adventurer is heading after a vampire and has somehow forgotten the stakes and mallet.",choices:[{label:"Give 3 Stakes + Mallet",result:"gearKey",requiresItem:"3 Stakes + Mallet",consumeItem:true,xp:4,coins:[0,0,0]},{label:"Wish them luck",result:"passed"}]},
 {id:"GEAR-004",type:"Decision",title:"Light Fingers",text:"A cutpurse brushes past you in a crowded roadside market.",choices:[{label:"Check your belongings",result:"theft"},{label:"Keep moving",result:"theft"}]},
 {id:"GEAR-005",type:"Decision",title:"The Wheelwright's Problem",text:"A wheelwright beside a stranded cart has everything needed except a hammer.",choices:[{label:"Lend your Hammer",result:"gearKey",requiresItem:"Hammer",xp:3,coins:[0,4,0]},{label:"Keep moving",result:"passed"}]},
 {id:"GEAR-006",type:"Decision",title:"A Loose Wagon Wheel",text:"A merchant cannot keep a wheel pin seated and needs something sturdy to wedge it.",choices:[{label:"Give an Iron Spike",result:"gearKey",requiresItem:"Iron Spike",consumeItem:true,xp:2,coins:[0,3,0]},{label:"Leave the merchant to it",result:"passed"}]},
 {id:"GEAR-007",type:"Decision",title:"The Unsafe Mine Door",text:"Miners are trying to brace a dangerous old access door before anyone passes through.",choices:[{label:"Give your 12 Iron Spikes",result:"gearKey",requiresItem:"12 Iron Spikes",consumeItem:true,xp:5,coins:[1,0,0]},{label:"Take another route",result:"passed"}]},
 {id:"GEAR-008",type:"Discovery",title:"Flooded Ford",text:"Travelers are arguing about whether the water ahead hides a sudden drop.",choices:[{label:"Lend your 10-foot Pole to sound the depth",result:"gearKey",requiresItem:"10-foot Pole",xp:3,coins:[0,3,0]},{label:"Leave them to judge it",result:"passed"}]},
 {id:"GEAR-009",type:"Decision",title:"The Herbalist's Harvest",text:"A herbalist has gathered more useful plants than can be carried home.",choices:[{label:"Give your Small Sack",result:"gearKey",requiresItem:"Small Sack",consumeItem:true,xp:2,coins:[0,4,0]},{label:"Move on",result:"passed"}]},
 {id:"GEAR-010",type:"Decision",title:"Spilled Grain",text:"A miller stares at a torn grain sack while good grain spills onto the road.",choices:[{label:"Give your Large Sack",result:"gearKey",requiresItem:"Large Sack",consumeItem:true,xp:3,coins:[0,6,0]},{label:"Move on",result:"passed"}]},
 {id:"GEAR-011",type:"Decision",title:"The Archer's Broken Quiver",text:"A road warden has arrows but a split quiver and must continue the patrol.",choices:[{label:"Give your Quiver",result:"gearKey",requiresItem:"Quiver",consumeItem:true,xp:3,coins:[0,5,0]},{label:"Wish the warden luck",result:"passed"}]},
 {id:"GEAR-012",type:"Decision",title:"A Shaken Courier",text:"A bruised courier has made it out of an ambush and asks for a moment to steady the nerves.",choices:[{label:"Give your Wine",result:"gearKey",requiresItem:"Wine — 1 quart",consumeItem:true,xp:2,coins:[0,0,0]},{label:"Offer only directions",result:"passed"}]},
 {id:"GEAR-013",type:"Decision",title:"Tracks Under a Full Moon",text:"A hunter following unnatural tracks realizes the wolfsbane pouch is empty.",choices:[{label:"Give your Wolfsbane",result:"gearKey",requiresItem:"Wolfsbane",consumeItem:true,xp:4,coins:[0,5,0]},{label:"Advise the hunter to turn back",result:"passed"}]},
 {id:"GEAR-014",type:"Discovery",title:"The Ravine Rescue",text:"A traveler is stranded below a steep roadside bank after a fall.",choices:[{label:"Use your 50-foot Rope to help",result:"gearKey",requiresItem:"50-foot Rope",xp:4,coins:[0,5,0]},{label:"Find help elsewhere",result:"passed"}]},
 {id:"GEAR-015",type:"Discovery",title:"Pack on the Ledge",text:"A merchant's pack lies on a narrow ledge beyond safe reach.",choices:[{label:"Use your Grappling Hook",result:"gearKey",requiresItem:"Grappling Hook",xp:3,coins:[0,5,0]},{label:"Leave it",result:"passed"}]},
 {id:"GEAR-016",type:"Decision",title:"Cold Camp",text:"A group of exhausted travelers has dry wood but nothing that will catch a spark.",choices:[{label:"Lend your Tinder Box",result:"gearKey",requiresItem:"Tinder Box",xp:2,coins:[0,2,0]},{label:"Continue onward",result:"passed"}]},
 {id:"GEAR-017",type:"Decision",title:"The Dark Culvert",text:"A frightened traveler must pass through a long dark culvert before night closes in.",choices:[{label:"Lend your Lantern",result:"gearKey",requiresItem:"Lantern",xp:3,coins:[0,4,0]},{label:"Point out another road",result:"passed"}]},
 {id:"GEAR-018",type:"Decision",title:"Broken Farmer\'s Cart",text:"A farmer\'s wagon has broken down and potatoes are scattered across the road. He has nothing left to gather them into.",choices:[{label:"Sell your Small Sack — 2 GP",result:"gearKey",requiresItem:"Small Sack",consumeItem:true,coins:[2,0,0]},{label:"Sell your Large Sack — 4 GP",result:"gearKey",requiresItem:"Large Sack",consumeItem:true,coins:[4,0,0]},{label:"Move on",result:"passed"}]},
 {id:"GEAR-019",type:"Discovery",title:"Loose Ore",text:"Chunks of loose ore lie exposed beside the trail. With a sack, you could carry some back to town.",choices:[{label:"Fill your Small Sack",result:"collectOre",requiresItem:"Small Sack",oreSack:"Small Sack",oreValueCP:500},{label:"Fill your Large Sack",result:"collectOre",requiresItem:"Large Sack",oreSack:"Large Sack",oreValueCP:1000},{label:"Leave the ore",result:"passed"}]},
];
const CLOTHING_KEY_EVENTS=[
 {id:"CLO-001",type:"Decision",title:"The Guild Supper",text:"A local guild is admitting respectable travelers to its evening supper, but the doorkeeper is turning away anyone dressed for the road.",choices:[{label:"Attend in respectable clothes",result:"gearKey",requiresAnyItem:["Middle-Class Clothes","Fine Clothes","Extravagant Clothes"],xp:3,coins:[0,5,0]},{label:"Skip the supper",result:"passed"}]},
 {id:"CLO-002",type:"Decision",title:"A Merchant's Introduction",text:"A prosperous merchant is willing to make introductions, provided you look suitable for the company being kept.",choices:[{label:"Make the introduction properly dressed",result:"gearKey",requiresAnyItem:["Middle-Class Clothes","Fine Clothes","Extravagant Clothes"],xp:3,coins:[0,4,0]},{label:"Decline",result:"passed"}]},
 {id:"CLO-003",type:"Decision",title:"The Noble Reception",text:"A minor noble is receiving petitioners tonight. Road clothes will not get past the steward.",choices:[{label:"Enter in Fine Clothes",result:"gearKey",requiresAnyItem:["Fine Clothes","Extravagant Clothes"],xp:4,coins:[1,0,0]},{label:"Leave the matter for another day",result:"passed"}]},
 {id:"CLO-004",type:"Decision",title:"The Grand Banquet",text:"An invitation has appeared for a lavish banquet where appearance matters almost as much as a name.",choices:[{label:"Attend in Extravagant Clothes",result:"gearKey",requiresItem:"Extravagant Clothes",xp:6,coins:[2,0,0]},{label:"Ignore the invitation",result:"passed"}]}
];
function eventCanStartCombat(ev){return ev?.type==="Encounter"&&(ev.choices||[]).some(c=>c?.result==="combat"||c?.result==="clericTurn")}
function pickEvent(){
 let pools={Fighter:FIGHTER_EVENTS,Cleric:CLERIC_EVENTS,Arcanist:ARCANIST_EVENTS,Thief:THIEF_EVENTS,Elf:ELF_EVENTS,Dwarf:DWARF_EVENTS};
 let unlockedGlobal=[...GEAR_KEY_EVENTS,...CLOTHING_KEY_EVENTS].filter(eventUnlockedByInventory),restEvents=(h.trip?.durationMinutes||0)>=30?[SHORT_REST_EVENT]:[],source=[...(pools[h.className]||FIGHTER_EVENTS),...unlockedGlobal,...restEvents],used=new Set((h.trip.journal||[]).map(x=>x.id));
 let available=source.filter(e=>!used.has(e.id));if(!available.length)available=source;
 if(journeyDaylightNow()){let noNight=available.filter(e=>!EXPLICIT_NIGHT_ENCOUNTERS.has(e.id));if(noNight.length)available=noNight}
 let roll=d(100),wanted=roll<=40?"Encounter":roll<=60?"Decision":roll<=80?"Discovery":"Quiet";
 let typed=available.filter(e=>e.type===wanted||(wanted==="Quiet"&&e.type==="Rest")),pool=typed.length?typed:available,picked=pool[d(pool.length)-1];
 if(h.trip?.mountedTravel&&eventCanStartCombat(picked)&&d(100)<=50){
  let nonCombat=available.filter(e=>!eventCanStartCombat(e));
  if(nonCombat.length)picked=nonCombat[d(nonCombat.length)-1]
 }
 return picked
}
function clericWisCheck(difficulty="Normal"){
 let adj=difficulty==="Easy"?4:difficulty==="Hard"?-4:0,target=Math.max(1,Math.min(19,h.stats.WIS+adj)),roll=d(20);
 return{roll,target,success:roll<=target}
}
function applyEventChoice(ev,ch){
 let resumeAfter=h.pendingEvent===ev;
 if(!eventChoiceAvailable(ch)){addlog(`${ev.title}: ${eventChoiceUnavailableReason(ch)}.`,ev.type||"Event");return}
 resolveSecretDoorSearch(ev,ch);
 if(ch?.result==="shortRest"){
   let before=h.hp;h.hp=Math.min(h.maxhp,h.hp+2);let healed=h.hp-before;
   journal({id:ev.id,type:"Rest",title:ev.title,text:ev.text,choice:ch.label,result:"shortRest",xp:0,coins:[0,0,0],hpHealed:healed,durationMinutes:30});
   addlog(`${ev.title}: Short Rest — ${healed?"+ "+healed+" HP restored":"already at full HP"}. 30 minutes of Journey time.`,"Rest");
   h.pendingEvent=null;endTripPause();advanceJourneyMinutes(30);save();renderPendingEvent();if(resumeAfter)tick();return
 }
 if(ch?.result==="gearKey"){
   let usedItem=eventRequirementItem(ch);if(ch.consumeItem&&usedItem)takeInventoryItem(usedItem);
   let xp=ch.xp?awardXP(ch.xp):0,coin=ch.coins||[0,0,0],credit=coin?addCoins(coin[0]||0,coin[1]||0,coin[2]||0):{cpValue:0,leftCP:0},keptCoins=coinArrayFromCP(credit.cpValue);
   journal({id:ev.id,type:ev.type,title:ev.title,text:ev.text,choice:ch.label,result:"gearKey",xp,coins:keptCoins,item:usedItem,consumed:!!ch.consumeItem,leftCoinCP:credit.leftCP||0});
   let reward=`${xp?`+${xp} XP. `:""}${credit.cpValue?`${coinTextCP(credit.cpValue)} kept. `:""}${credit.leftCP?`${coinTextCP(credit.leftCP)} left behind at the carry limit.`:""}`.trim();
   addlog(`${ev.title}: ${ch.label}.${reward?` ${reward}`:""}`,credit.cpValue||credit.leftCP?"Loot":(ev.type||"Event"));
   h.pendingEvent=null;endTripPause();save();renderPendingEvent();if(resumeAfter)tick();return
 }
 if(ch?.result==="collectOre"){
   let usedItem=eventRequirementItem(ch),i=h.inv.findIndex(x=>x.n===usedItem);
   if(i<0){addlog(ev.title+": the required sack is not available.",ev.type||"Event");return}
   let large=ch.oreSack==="Large Sack";
   h.inv[i]={n:large?"Large Sack of Ore":"Small Sack of Ore",kind:"gear",can:false,eq:false,eventKey:false,oreSack:true,emptySackName:large?"Large Sack":"Small Sack",oreValueCP:large?1000:500,bp:large?605:201};
   journal({id:ev.id,type:ev.type,title:ev.title,text:ev.text,choice:ch.label,result:"collectOre",xp:0,coins:[0,0,0],item:h.inv[i].n});
   addlog(ev.title+": "+ch.label+". The sack is now full and can be sold in town.","Loot");
   h.pendingEvent=null;endTripPause();save();renderPendingEvent();if(resumeAfter)tick();return
 }
 if(ch?.result==="theft"){
   let protectedByPouch=hasInventoryItem("Belt Pouch"),lost=0;
   if(!protectedByPouch){lost=Math.min(walletCP(),d(6)*10);setWalletCP(walletCP()-lost)}
   let xp=protectedByPouch?awardXP(1):0;
   journal({id:ev.id,type:ev.type,title:ev.title,text:ev.text,choice:ch.label,result:protectedByPouch?"blockedByBeltPouch":"stolen",xp,coins:[0,0,0],lostCP:lost});
   addlog(protectedByPouch?`${ev.title}: The Belt Pouch keeps your valuables secure. +${xp} XP.`:`${ev.title}: The cutpurse gets away with ${coinTextCP(lost)}.`,"Encounter");
   h.pendingEvent=null;endTripPause();save();renderPendingEvent();if(resumeAfter)tick();return
 }
 if(ch?.result==="clericTurn"){resolveTurnUndead(ev);return}
 if(ch?.result==="combat"&&ev?.id?.startsWith("CLE-")&&ev.type==="Encounter"){startClericUndeadFight(ev);return}
 if(ch?.result==="clericWis"){
   let test=clericWisCheck(ch.difficulty||"Normal"),baseXP=test.success?(ch.xp||0):0,xp=baseXP?awardXP(baseXP):0;
   let outcome=test.success?"SUCCESS":"FAILURE";
   journal({id:ev.id,type:ev.type,title:ev.title,text:ev.text,choice:ch.label,result:outcome,xp,coins:[0,0,0],ability:"WIS",roll:test.roll,target:test.target});
   addlog(`${ev.title}: ${ch.label} — ${outcome} (WIS ${test.roll} / ${test.target}).${xp?` +${xp} XP.`:""}`,"Check");
   h.pendingEvent=null;endTripPause();save();renderPendingEvent();if(resumeAfter)tick();return
 }
 if(ch?.result==="classAbility"){
   let adj=ch.difficulty==="Easy"?4:ch.difficulty==="Hard"?-4:0,ability=ch.ability||"WIS";
   let target=Math.max(1,Math.min(19,(h.stats[ability]||9)+adj)),roll=d(20),success=roll<=target,baseXP=success?(ch.xp||0):0,xp=baseXP?awardXP(baseXP):0;
   let outcome=success?"SUCCESS":"FAILURE";
   journal({id:ev.id,type:ev.type,title:ev.title,text:ev.text,choice:ch.label,result:outcome,xp,coins:[0,0,0],ability,roll,target});
   addlog(`${ev.title}: ${ch.label} — ${outcome} (${ability} ${roll} / ${target}).${xp?` +${xp} XP.`:""}`,"Check");
   h.pendingEvent=null;endTripPause();save();renderPendingEvent();if(resumeAfter)tick();return
 }
 if(ch?.result==="thiefSkill"){
   let test=thiefSkillCheck(ch.skill),baseXP=test.success?(ch.xp||0):0,xp=baseXP?awardXP(baseXP):0;
   let outcome=test.success?"SUCCESS":"FAILURE";
   journal({id:ev.id,type:ev.type,title:ev.title,text:ev.text,choice:ch.label,result:outcome,xp,coins:[0,0,0],skill:ch.skill,roll:test.roll,chance:test.chance});
   addlog(`${ev.title}: ${ch.label} — ${outcome} (${test.roll} / ${test.chance}%).${xp?` +${xp} XP.`:""}`,"Check");
   h.pendingEvent=null;endTripPause();save();renderPendingEvent();if(resumeAfter)tick();return
 }
 let baseXP=ch?.xp??ev.xp??0,xp=baseXP?awardXP(baseXP):0,coin=ch?.coins??ev.coins??[0,0,0],coinCredit=null;
 let result=ch?.result||"observed",avDiscoveryTreasure=null;
 if(ev?.type==="Discovery"&&result==="search"){
   avDiscoveryTreasure=avRollUnguardedTreasure(h.level);avApplyTreasure(avDiscoveryTreasure);coin=[0,0,0]
 }else if(coin)coinCredit=addCoins(coin[0]||0,coin[1]||0,coin[2]||0);
 let keptCoins=coinCredit?coinArrayFromCP(coinCredit.cpValue):coin;
 journal({id:ev.id,type:ev.type,title:ev.title,text:ev.text,choice:ch?.label||null,result,xp,coins:keptCoins,leftCoinCP:coinCredit?.leftCP||0,avTreasure:avDiscoveryTreasure?avTreasureSummary(avDiscoveryTreasure):null});
 let coinReward=coinCredit?(coinCredit.cpValue?`${coinTextCP(coinCredit.cpValue)} kept.`:"")+(coinCredit.leftCP?` ${coinTextCP(coinCredit.leftCP)} left behind at the carry limit.`:""):"";
 let rewardText=`${xp?`+${xp} XP. `:""}${avDiscoveryTreasure?`Treasure: ${avTreasureSummary(avDiscoveryTreasure)}.`:coinReward}`.trim(),summary=ch?.label?`${ch.label}.${rewardText?` ${rewardText}`:""}`:(rewardText||ev.text||"Observed."),logType=avDiscoveryTreasure||coinCredit?.cpValue||coinCredit?.leftCP?"Loot":(result==="combat"?"Encounter":(ev.type||"Event"));addlog(`${ev.title}: ${summary}`,logType);
 if(result==="combat"){let combatContext=encounterContextFromEvent(ev);h.pendingEvent=null;renderPendingEvent();save();if(h.trip?.mode==="auto")autonomousCombat(false,combatContext);else makeCombat(false,combatContext);return}
 h.pendingEvent=null;endTripPause();save();renderPendingEvent();if(resumeAfter)tick()
}
function autonomousChoice(ev){
 let choices=(ev?.choices||[]).filter(eventChoiceAvailable);if(!choices.length)return null;
 let target=Math.max(1,Math.min(19,h.stats?.WIS||9)),roll=d(20),success=roll<=target,choice;
 if(!success)choice=choices[d(choices.length)-1];
 else if(choices.some(x=>x.result==="clericTurn"))choice=choices.find(x=>x.result==="clericTurn");
 else if((h.trip?.risk||"Normal")==="Cautious"){
   let safe=/avoid|withdraw|leave|move on|keep moving|detour|wait|back away|go around|stay high|ignore|extinguish/i;
   choice=choices.find(x=>["avoid","avoided","safe","left"].includes(x.result)||safe.test(x.label||""));
   if(!choice&&h.className==="Thief")choice=choices.find(x=>x.result==="thiefSkill");
   choice=choice||choices[choices.length-1]
 }else choice=choices[0];
 addlog(`Autonomous judgment: WIS ${roll}/${target} — ${success?"SUCCESS":"FAILURE"}; chooses ${choice.label}.`,"Check");
 return choice
}
function event(){
 if(!h||!h.trip||h.combat||h.pendingEvent)return;
 let ev=pickEvent();
 if(ev.choices.length&&h.trip.mode==="present"){beginTripPause();adventureLog(`${ev.title}: ${ev.text}`,ev.type||"Event");h.pendingEvent=ev;renderPendingEvent();save();return}
 if(ev.choices.length){applyEventChoice(ev,autonomousChoice(ev));return}
 applyEventChoice(ev,null)
}
function renderPendingEvent(){
 let box=$("#eventChoice");if(!box)return;
 let ev=h?.pendingEvent;if(!ev){box.classList.add("hide");box.innerHTML="";return}
 box.classList.remove("hide");
 box.innerHTML=`<div class=eventCard><div class=eyebrow>${ev.type}</div><h3>${ev.title}</h3><p>${ev.text}</p><div class=eventButtons>${ev.choices.map((c,i)=>{let ok=eventChoiceAvailable(c);return `<button data-choice="${i}" ${ok?"":"disabled"}>${c.label}${ok?"":` · ${eventChoiceUnavailableReason(c)}`}</button>`}).join("")}</div></div>`;
 $$("[data-choice]").forEach(b=>b.onclick=()=>applyEventChoice(ev,ev.choices[+b.dataset.choice]))
}

const MISSION_STORY_DESTINATION={
 "Answer a challenge of arms":"the place named in the challenge",
 "Break a threat on the road":"the threatened road",
 "Win a deed worth remembering":"the place where the deed awaits",
 "Recover a saint's relic":"the forgotten holy site",
 "Cleanse a desecrated resting place":"the desecrated resting place",
 "Seek a lost reliquary":"the site named in the old accounts",
 "Recover a lost arcane volume":"the sealed archive",
 "Seek a vanished scholar's manuscript":"the place indicated by the surviving fragments",
 "Investigate an abandoned magical library":"the abandoned magical library",
 "Steal a guarded cache":"the district where the cache is hidden",
 "Find a legendary jewel":"the quarter named by the fence",
 "Raid a forgotten strongroom":"the forgotten strongroom",
 "Recover an ancestral rune":"the old workings named in the clan records",
 "Trace a lost family inscription":"the mine named in the old records",
 "Search a forgotten deep hall":"the forgotten deep hall",
 "Protect the woodland":"the threatened woodland",
 "Seek a rare seed":"the part of the wild where the rare tree is said to grow",
 "Preserve a vanishing grove":"the fragile grove"
};
function taleLowerFirst(s){s=String(s||"").trim();return s?s[0].toLowerCase()+s.slice(1):""}
function taleSentence(s){s=String(s||"").trim();if(!s)return"";return /[.!?]$/.test(s)?s:s+"."}
function taleTreasureText(e){
 if(e&&e.avTreasure)return e.avTreasure;
 let coin=e&&e.coins||[0,0,0],parts=[];
 if(coin[0])parts.push(coin[0]+" GP");if(coin[1])parts.push(coin[1]+" SP");if(coin[2])parts.push(coin[2]+" CP");
 return parts.join(", ")
}
function taleEventScene(e,name){
 if(!e||e.type==="Progression"||e.result==="combat")return"";
 if(e.type==="Quiet")return taleSentence(e.text);
 if(e.result==="secretDoor"){
  let detail=String(e.text||"").replace(/^Behind the secret door is /,"Behind it is ").replace(/^The secret door opens into /,"It opens into ");
  return taleSentence("A secret door is discovered. "+detail)
 }
 let base=taleSentence(String(e.text||"").replace(/^You\b/,name));
 if(e.choice==="Turn Undead"){
  let good=/^SUCCESS/.test(String(e.result||""));
  return base+" "+name+(good?" successfully turns the undead.":" fails to turn the undead.")
 }
 if(e.result==="SUCCESS")return base+" The attempt to "+taleLowerFirst(e.choice)+" succeeds.";
 if(e.result==="FAILURE")return base+" The attempt to "+taleLowerFirst(e.choice)+" fails.";
 if(e.result==="search"){let found=taleTreasureText(e);return base+" "+name+" searches the site"+(found?" and recovers "+found:"")+"."}
 if(["left","leave","passed","avoided","avoid"].includes(e.result))return base+" "+name+" chooses to move on.";
 if(e.result==="gearKey")return base+" "+name+" uses "+(e.item||"carried gear")+" to deal with the situation.";
 if(e.result==="collectOre")return base+" "+name+" fills "+(e.item?"a "+String(e.item).toLowerCase():"a sack with the ore")+".";
 if(e.result==="blockedByBeltPouch")return base+" A would-be thief fails to reach the valuables.";
 if(e.result==="stolen")return base+" A cutpurse gets away with "+(e.lostCP?coinTextCP(e.lostCP):"some coin")+".";
 if(e.choice)return base+" "+name+" chooses to "+taleLowerFirst(e.choice)+".";
 return base
}
function taleCombatScene(trip,name){
 let logs=trip&&trip.adventureLog||[],starts=[];
 for(const x of logs){
  if(x.type!=="Combat")continue;
  let m=/^(?:Encounter|BOSS BATTLE) — (.+?)\. Averathia challenge:/.exec(x.text||"");
  if(m&&!starts.includes(m[1]))starts.push(m[1])
 }
 if(!starts.length)return"";
 let shown=starts.slice(0,3),more=starts.length-shown.length;
 let sentence=name+" faces "+shown.join(", ")+(more>0?" and "+more+" further hostile encounter"+(more===1?"":"s")+".":".");
 let wins=logs.filter(x=>x.text==="Combat won.").length,boss=!!(trip&&trip.mission&&trip.mission.bossWon),escaped=logs.some(x=>/escape the encounter/i.test(x.text||""));
 if(wins)sentence+=" "+(wins===1?"One battle is won.":wins+" battles are won.");
 if(escaped)sentence+=" At least one fight is escaped rather than finished.";
 if(boss)sentence+=" At the journey's decisive encounter, the opposition is overcome and the objective is secured.";
 return sentence
}
function taleJourneyFacts(trip,name){
 let parts=[],journal=trip?.journal||[],logs=trip?.adventureLog||[];
 let rests=logs.filter(x=>x.type==="Rest").length,secrets=journal.filter(x=>x.result==="secretDoor").length;
 let discoveries=journal.filter(x=>x.type==="Discovery"&&x.result!=="secretDoor").length,decisions=journal.filter(x=>x.type==="Decision").length;
 if(discoveries||decisions||secrets){
  let bits=[];if(discoveries)bits.push(discoveries+" discover"+(discoveries===1?"y":"ies"));if(decisions)bits.push(decisions+" decision"+(decisions===1?"":"s"));if(secrets)bits.push(secrets+" secret door"+(secrets===1?"":"s"));
  parts.push("Along the way, the journey records "+bits.join(", ")+".")
 }
 if(rests)parts.push(name+" takes "+rests+" recorded rest"+(rests===1?"":"s")+" before pressing on.");
 return parts.join(" ")
}
function taleJourneyRewards(trip,name){
 let parts=[],logs=trip?.adventureLog||[],summary=logs.filter(x=>x.type==="Summary").map(x=>x.text).filter(Boolean);
 let trophy=logs.find(x=>/TROPHY DISCOVERED:/i.test(x.text||""));
 if(trophy){let m=/TROPHY DISCOVERED:\s*([^\.]+)/i.exec(trophy.text||"");if(m)parts.push(name+" returns with a rare trophy: "+m[1]+".")}
 if(summary.length)parts.push("Journey record: "+summary[summary.length-1]);
 return parts.join(" ")
}
function buildAdventureTale(trip=h&&h.trip,opts={}){
 if(!trip)return opts&&opts.ending==="death"?(h&&h.name||"The adventurer")+" does not return from the journey.":"Nothing noteworthy happened on this journey.";
 let name=h&&h.name||"The adventurer",mission=trip.mission||{},title=mission.title||"Journey",destination=MISSION_STORY_DESTINATION[title]||"the destination",light=trip.lightSource==="lamp"?"lantern":"torch";
 let opening=name+" sets out to "+taleLowerFirst(title)+". "+(mission.brief||"The road beyond town offers no certainty.")+" The trail leads toward "+destination+". ";
 if(trip.mountsUsed===1)opening+="Travelling on horseback, "+name+" secures the horse before continuing on foot, with a "+light+" ready for the darker stretches.";
 else if(trip.mountsUsed>1)opening+="Travelling with horses, "+name+" secures them before continuing on foot, with a "+light+" ready for the darker stretches.";
 else opening+="On foot, "+name+" carries a "+light+" for the darker stretches of the road.";
 let journal=(trip.journal||[]).filter(e=>e.type!=="Progression"&&e.result!=="combat"),important=journal.filter(e=>e.type!=="Quiet");
 let chosen=(important.length?important:journal).slice(0,6);
 let middle=chosen.map(e=>taleEventScene(e,name)).filter(Boolean).join(" ");
 if((important.length?important:journal).length>chosen.length)middle+=" Other incidents follow before the return journey begins.";
 let combat=taleCombatScene(trip,name),facts=taleJourneyFacts(trip,name),rewards=taleJourneyRewards(trip,name),ending="";
 if(opts.ending==="death")ending="The journey ends in disaster. "+name+" falls before reaching town, and the journey is brought to an abrupt end. After the death recall, "+name+" is returned home.";
 else if(trip.trollLessonReturn)ending="With no reason to press the danger further, "+name+" turns back and makes for town.";
 else if(mission.bossWon)ending="With the objective secured, "+name+" begins the road home and eventually passes back through the town gates.";
 else if(trip.returnedEarly)ending="The journey is cut short. "+name+" turns back before the objective is completed and returns safely to town.";
 else ending="When there is nothing more to be gained by remaining on the road, "+name+" turns homeward and returns to town.";
 return [opening,middle,combat,facts,rewards,ending].filter(Boolean).join("\n\n")
}

function buildAdventureReport(){
 let j=h?.trip?.journal||[];if(!j.length)return "Nothing noteworthy happened on this journey.";
 return j.map((e,i)=>`${i+1}. ${e.title} — ${e.choice?e.choice+": ":""}${e.xp?`+${e.xp} XP; `:""}${e.coins&&(e.coins[0]||e.coins[1]||e.coins[2])?`${e.coins[0]} GP, ${e.coins[1]} SP, ${e.coins[2]} CP. `:""}${e.text}`).join("\n")
}
function returnEarly(msg="You decide to return early."){
 if(!h.trip)return;let rb=$("#recall");if(rb){rb.disabled=true;rb.textContent="Returning…"}
 addlog(msg,"Travel");h.trip.returnedEarly=true;h.trip.returnReason=msg;endTripPause();let now=Date.now(),away=Math.max(0,now-h.trip.start);
 h.trip.midBossDone=true;
 if(h.trip.mission)h.trip.mission.resolved=true;
 h.pendingEvent=null;
 h.trip.half=now;h.trip.end=now+Math.max(5000,away);
 save();page("depart");refresh();tick()
}
$("#start").onclick=begin;$("#recall").onclick=()=>returnEarly();
function openResetCharacterConfirm(){let box=$("#resetCharacterConfirm");if(box)box.classList.remove("hide")}
function closeResetCharacterConfirm(){let box=$("#resetCharacterConfirm");if(box)box.classList.add("hide")}
function permanentlyResetCharacter(){
 clearTimeout(timer);
 localStorage.removeItem("averathia-v041");
 location.reload();
}
$("#resetCharacter").onclick=openResetCharacterConfirm;
$("#cancelResetCharacter").onclick=closeResetCharacterConfirm;
$("#confirmResetCharacter").onclick=permanentlyResetCharacter;
renderClasses();renderAv();rerollAll();
$("#attackBtn").onclick=resolveAttack;$("#potionBtn").onclick=usePotionCombat;if($("#holyWaterBtn"))$("#holyWaterBtn").onclick=useHolyWaterCombat;if($("#mummyBurnBtn"))$("#mummyBurnBtn").onclick=useMummyBurnCombat;$("#retreatBtn").onclick=retreatCombat;

function numOr(v,f=0){v=Number(v);return Number.isFinite(v)?v:f}
function migratePersistentCharacter(saved){
 if(!saved||typeof saved!=="object")return null;
 let s=saved;
 if(s.className==="Magic-User")s.className="Arcanist";
 if(!s.className&&s.mechanicsClass)s.className=s.mechanicsClass;
 if(!s.mechanicsClass)s.mechanicsClass=s.className||"Fighter";
 s.level=Math.max(1,Math.trunc(numOr(s.level,1)));
 s.xp=Math.max(0,Math.trunc(numOr(s.xp,0)));
 s.maxhp=Math.max(1,Math.trunc(numOr(s.maxhp,numOr(s.hp,1))));
 s.hp=Math.max(0,Math.min(s.maxhp,Math.trunc(numOr(s.hp,s.maxhp))));
 s.stats=(s.stats&&typeof s.stats==="object")?s.stats:{};
 for(const k of ["STR","DEX","CON","INT","WIS","CHA"])s.stats[k]=Math.max(1,Math.trunc(numOr(s.stats[k],9)));
 s.gp=Math.max(0,numOr(s.gp,numOr(s.gold,0)));s.gold=s.gp;
 s.sp=Math.max(0,Math.trunc(numOr(s.sp,0)));s.cp=Math.max(0,Math.trunc(numOr(s.cp,0)));
 s.inv=Array.isArray(s.inv)?s.inv.map(x=>typeof x==="string"?{n:x,kind:"gear",can:false,eq:false}:x).filter(Boolean):[];
 if(!s.clothingStarterV1){for(const x of starterClothingItems())if(!s.inv.some(i=>i.n===x.n))s.inv.push(x);s.clothingStarterV1=true}
 for(const x of s.inv){if(x?.coinSack||/ Sack of GP$/.test(x?.n||""))syncGpSack(x);if(EVENT_KEY_ITEMS.has(x.n))x.eventKey=true}
 for(const x of s.inv)refreshRcMagicDisplayName(x);
 {let used={melee:false,ranged:false};for(const x of s.inv){if(x.kind!=="weapon")continue;if(!x.eq){delete x.eqSlot;continue}let opts=weaponSlotOptions(x),slot=(x.eqSlot&&opts.includes(x.eqSlot))?x.eqSlot:(opts.includes("melee")?"melee":"ranged");if(used[slot]){x.eq=false;delete x.eqSlot}else{x.eq=true;x.eqSlot=slot;used[slot]=true}}}
 {let equip=[],other=[];for(const x of s.inv)(isInventoryEquipable(x)?equip:other).push(x);s.inv=[...equip,...other]}
 s.ammo=(s.ammo&&typeof s.ammo==="object"&&!Array.isArray(s.ammo))?s.ammo:{};
 for(const k of ["Arrows","Quarrels","Sling Stones"])s.ammo[k]=Math.max(0,Math.trunc(numOr(s.ammo[k],0)));
 s.rations=Math.max(0,numOr(s.rations,0));
 ensureHomeState(s);
 s.waterCapacity=Math.max(0,numOr(s.waterCapacity,0));
 s.water=Math.max(0,Math.min(s.waterCapacity,numOr(s.water,0)));
 ensureLightStock(s);
 s.inv=s.inv.filter(x=>!isResourceSku(x?.n));
 s.trophies=Array.isArray(s.trophies)?s.trophies:[];if(homeTier(s)<1){s.lastAdventure=null;s.lastAdventureTitle=null}else if(s.lastAdventure&&!s.lastAdventureTitle)s.lastAdventureTitle="Adventure Tale";
 s.conditions=Array.isArray(s.conditions)?s.conditions:[];
 s.diseases=Array.isArray(s.diseases)?s.diseases:[];
 s.trollWeaknessKnown=!!s.trollWeaknessKnown;
 s.mummyWeaknessKnown=!!s.mummyWeaknessKnown;
 s.timedConditions=Array.isArray(s.timedConditions)?s.timedConditions:[];
 s.timedConditionAgeAt=Number.isFinite(Number(s.timedConditionAgeAt))?Number(s.timedConditionAgeAt):Date.now();
 ensureDiseases(s);
 s.sex=s.sex==="Female"?"Female":"Male";
 s.avatar=Number.isInteger(s.avatar)&&s.avatar>=0&&s.avatar<=2?s.avatar:0;
 s.spells=(s.spells&&typeof s.spells==="object")?s.spells:{};
 s.spells.used=(s.spells.used&&typeof s.spells.used==="object"&&!Array.isArray(s.spells.used))?s.spells.used:{};
 s.spells.buffs=Array.isArray(s.spells.buffs)?s.spells.buffs:[];
 s.spells.memorized=(s.spells.memorized&&typeof s.spells.memorized==="object"&&!Array.isArray(s.spells.memorized))?s.spells.memorized:{};
 s.spells.spentMem=Array.isArray(s.spells.spentMem)?s.spells.spentMem:[];
 s.buffAgeAt=Number.isFinite(Number(s.buffAgeAt))?Number(s.buffAgeAt):Date.now();
 if(s.combat||s.pendingEvent||s.trip?.pauseStart)s.buffAgeAt=Date.now();
 if(s.trip&&typeof s.trip==="object"){
  let t=s.trip;
  if(t.resourceModel==="at-elapsed-v2"){t.resourceModel="at-elapsed-v3-water-refill";t.waterRefillMode="normal";t.waterStart=Math.max(0,Number(s.water)||0)}
  if(!Number.isFinite(Number(t.start))||!Number.isFinite(Number(t.end))||Number(t.end)<=Number(t.start))s.trip=null;
  else{
   t.start=Number(t.start);t.end=Number(t.end);
   let total=t.end-t.start;
   t.durationMinutes=Math.max(1,Number.isFinite(Number(t.durationMinutes))?Number(t.durationMinutes):total/60000);
   t.eventTarget=Math.max(1,Math.trunc(Number(t.eventTarget)||adventureEventTarget(t.durationMinutes)));
   t.eventIntervalMs=Math.max(5000,Number(t.eventIntervalMs)||total/t.eventTarget);
   if(!Number.isFinite(Number(t.half)))t.half=t.start+total/2;else t.half=Number(t.half);
   if(typeof t.midBossDone!=="boolean")t.midBossDone=!!t.mission?.bossWon||!!t.mission?.resolved;
   t.journal=Array.isArray(t.journal)?t.journal:[];
   t.adventureLog=Array.isArray(t.adventureLog)?t.adventureLog:[];if(!Number.isFinite(Number(t.startHP)))t.startHP=s.hp;if(!Number.isFinite(Number(t.startXP)))t.startXP=s.xp;if(!Number.isFinite(Number(t.startWalletCP)))t.startWalletCP=Math.round((s.gp||0)*100)+(s.sp||0)*10+(s.cp||0);if(!Number.isFinite(Number(t.timeConsumedByEventsMinutes)))t.timeConsumedByEventsMinutes=0;if(!Number.isFinite(Number(t.completedSleeps)))t.completedSleeps=0;if(!Number.isFinite(Number(t.plannedActiveATHours))||!Number.isFinite(Number(t.plannedSleepATHours))){let b=journeyActivityBudgetForRTMinutes(t.durationMinutes||0);t.plannedActiveATHours=b.activeHours;t.plannedSleepATHours=b.sleepHours;}
   if(!Number.isFinite(Number(t.nextEvent))){
    let firstDelay=Math.min(15000,Math.max(5000,total/(t.eventTarget+1)));
    t.nextEvent=t.start+firstDelay+t.journal.length*t.eventIntervalMs;
   }else t.nextEvent=Number(t.nextEvent);
   if(Number.isFinite(Number(t.pauseStart))&&!s.combat&&!s.pendingEvent)t.pauseStart=null;
   if(!t.mode)t.mode="present";if(!t.risk)t.risk="Normal";t.retainer=!!t.retainer;t.mountsUsed=Math.max(0,Math.trunc(numOr(t.mountsUsed,0)));t.mountedTravel=!!t.mountedTravel;
  }
 }
 if(s.worldClock&&typeof s.worldClock==="object"){
  s.worldClock.realAnchor=numOr(s.worldClock.realAnchor,Date.now());
  s.worldClock.atAnchor=numOr(s.worldClock.atAnchor,Date.now());
 }else s.worldClock=null;
 return s
}

// Persistent save bootstrap
(function loadPersistentCharacter(){
 try{
  const raw=localStorage.getItem("averathia-v041");
  if(!raw)return;
  const saved=JSON.parse(raw);
  if(!saved||!saved.name||(!saved.className&&!saved.mechanicsClass))return;
  h=migratePersistentCharacter(saved);
  if(!h)return;
  setWalletCP(walletCP());
  localStorage.setItem("averathia-v041",JSON.stringify(h));
  chosenClass=h.className||h.mechanicsClass||"Fighter";
  sex=h.sex||"Male"; avatar=Number.isInteger(h.avatar)?h.avatar:0;
  $("#create").classList.add("hide");
  $("#game").classList.remove("hide");
  ensureWorldClock();
  if(h.deadUntil&&Date.now()<h.deadUntil){renderDeathPage();return}
  if(h.combat){page("combat");renderCombat();return}
  if(h.trip){
   ensureTripSchedule();
   $("#departSetup").classList.add("hide");$("#travel").classList.remove("hide");
   $("#departedAt").textContent=clock(h.trip.start);$("#returnAt").textContent=clock(h.trip.end);
   $("#runner").innerHTML=spriteHTML(h.sex,h.avatar,h.className);renderAdventureLog();renderPendingEvent();
   page("depart");tick();return
  }
  page("town");refresh();
 }catch(err){console.error("Could not restore Averathia save",err)}
})();

// v1.0.8 PWA bootstrap
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(err=>console.warn("Service worker registration failed",err)))}
