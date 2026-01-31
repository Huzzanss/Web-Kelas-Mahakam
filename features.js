/* STUDENTS */
const students = [
"Adelia Felicia","Afiqah Humayra","Alexandra Shavira","Alisya Zella",
"Alita Admiral","Aqillah Khayyirah","Azima Zafeera","Azka Aisy",
"Farrel Azka","Fattah Altaf","Giovanny","Hilmi","Khalika",
"Muhammad Dzaki","Hafidz","Syifa Zahra"
];

/* RANDOM STUDENT HARIAN (GLOBAL) */
const todayRef = db.ref("todayStudent");
todayRef.once("value",snap=>{
  if(!snap.exists()){
    const pick = students[Math.floor(Math.random()*students.length)];
    todayRef.set({name:pick,date:new Date().toDateString()});
  }
});
todayRef.on("value",snap=>{
  document.getElementById("todayStudent").innerText = snap.val().name;
});

/* COUNTDOWN WITA */
const gradDate = new Date("2026-05-11T10:00:00+08:00").getTime();
setInterval(()=>{
  const gap = gradDate - Date.now();
  if(gap<=0)return;
  days.innerText = Math.floor(gap/86400000);
  hours.innerText = Math.floor((gap/3600000)%24);
  minutes.innerText = Math.floor((gap/60000)%60);
  seconds.innerText = Math.floor((gap/1000)%60);
},1000);

/* FINAL MESSAGE H-3 */
if((gradDate-Date.now())/(86400000)<=3){
  document.getElementById("finalMessage").style.display="block";
}

/* LIVE MOOD */
document.querySelectorAll(".mood-grid button").forEach(btn=>{
  btn.onclick=()=>{
    db.ref("mood/"+btn.dataset.mood).transaction(v=>(v||0)+1);
  };
});
db.ref("mood").on("value",snap=>{
  let top="",max=0;
  snap.forEach(s=>{
    if(s.val()>max){max=s.val();top=s.key;}
  });
  document.getElementById("topMood").innerText="Mood terbanyak: "+top;
});

/* GENERATOR */
function generateMahakam(){
const list=[
"keluarga","rumah kedua","cerita tak terlupakan",
"tempat tumbuh","awal mimpi"
];
mahakamResult.innerText =
"Mahakam adalah "+list[Math.floor(Math.random()*list.length)];
}
