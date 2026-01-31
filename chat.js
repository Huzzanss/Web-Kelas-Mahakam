const chatRef = db.ref("chat");
const typingRef = db.ref("typing");

sendBtn.onclick=()=>{
  if(!chatInput.value) return;
  chatRef.push({
    msg:chatInput.value,
    time:Date.now()
  });
  chatInput.value="";
};

chatInput.oninput=()=>{
  typingRef.set(true);
  clearTimeout(window.t);
  window.t=setTimeout(()=>typingRef.set(false),1500);
};

typingRef.on("value",s=>{
  typing.innerText = s.val()?"Seseorang sedang mengetik...":"";
});

chatRef.limitToLast(50).on("child_added",s=>{
  const d=s.val();
  const div=document.createElement("div");
  div.className="message";
  div.innerHTML=`${d.msg}<span>${new Date(d.time).toLocaleTimeString()}</span>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop=9999;
});

chatToggle.onclick=()=>chatBox.classList.toggle("show");
