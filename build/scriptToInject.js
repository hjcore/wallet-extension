!function(){"use strict";window.gotabit={sendTransaction:(a,t,n,e)=>new Promise(((s,o)=>{window.postMessage({target:"Gotabit extension",event:"sendTransaction",data:{password:a,address:t,transactionData:n,granter:e}},window.location.origin);const i=new BroadcastChannel("gotabit"),d=async a=>{"transactionSuccess"===a.data.event&&s(a.data.data),"transactionFail"===a.data.event&&o(a.data.data),i.removeEventListener("message",d)};i.addEventListener("message",d)}))}}();