const $ = new Env('恒越广场签到');
$.KEY_login = 'moonyuki_login_mallcoo';
$.isRequest = typeof $request !== 'undefined';

!(async () => {
  if ($.isRequest) {
    getSession();
  } else {
    await checkIn();
  }
  showMsg();
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done());

function getSession() {
  $.log('开始获取会话');
  const session = {
    headers: $request.headers,
    body: typeof $request.body === 'string' ? JSON.parse($request.body) : $request.body
  };
    $.log(JSON.stringify(session));
  if ($.setjson(session, $.KEY_login)) {
    $.log('获取会话成功');
    $.desc = '🎉成功获取会话';
  } else {
    $.log('获取会话失败');
    $.desc = '❌获取会话失败，请稍后再试';
  }
}

async function checkIn() {
  $.log('开始签到');
  const checkinOpts = $.getjson($.KEY_login);
  if (!checkinOpts) {
    $.log('没有获取会话');
    $.desc = '⚠️请打开恒越广场小程序获取会话';
  } else {
    checkinOpts.url = 'https://m.mallcoo.cn/api/user/User/CheckinV2';
    try {
      const resp = await $.http.post(checkinOpts);
      const responseBody = typeof resp.body === 'string' ? JSON.parse(resp.body) : resp.body;
      $.log(JSON.stringify(responseBody));
      $.desc = `${responseBody.d.Msg}`;
    } catch (err) {
      $.log(err);
      $.log('签到失败');
      $.desc = `❌签到失败，详情:${err}`;
    }
  }
}

function showMsg() {
  if (!$.desc) {
    return;
  }
  $.msg($.name, $.subt, $.desc);
}

// Boxjs.Env
function Env(e,t){class s{constructor(e){this.env=e}send(e,t="GET"){e="string"==typeof e?{url:e}:e;let s=this.get;"POST"===t&&(s=this.post);const i=new Promise(((t,i)=>{s.call(this,e,((e,s,o)=>{e?i(e):t(s)}))}));return e.timeout?((e,t=1e3)=>Promise.race([e,new Promise(((e,s)=>{setTimeout((()=>{s(new Error("请求超时"))}),t)}))]))(i,e.timeout):i}get(e){return this.send.call(this.env,e)}post(e){return this.send.call(this.env,e,"POST")}}return new class{constructor(e,t){this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:"[DEBUG] ",info:"[INFO] ",warn:"[WARN] ",error:"[ERROR] "},this.logLevel="info",this.name=e,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,t),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return typeof $environment!="undefined"&&$environment["egern-version"]?"Egern":typeof $environment!="undefined"&&$environment["surge-version"]?"Surge":typeof $environment!="undefined"&&$environment["stash-version"]?"Stash":typeof module!="undefined"&&module.exports?"Node.js":typeof $task!="undefined"?"Quantumult X":typeof $loon!="undefined"?"Loon":typeof $rocket!="undefined"?"Shadowrocket":void 0}isEgern(){return"Egern"===this.getEnv()}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(e,t=null){try{return JSON.parse(e)}catch{return t}}toStr(e,t=null,...s){try{return JSON.stringify(e,...s)}catch{return t}}getjson(e,t){let s=t;if(this.getdata(e))try{s=JSON.parse(this.getdata(e))}catch{}return s}setjson(e,t){try{return this.setdata(JSON.stringify(e),t)}catch{return!1}}getScript(e){return new Promise((t=>{this.get({url:e},((e,s,i)=>t(i)))}))}runScript(e,t){return new Promise((s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=t&&t.timeout?t.timeout:o;const[r,a]=i.split("@"),n={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:e,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"},policy:"DIRECT",timeout:o};this.post(n,((e,t,i)=>s(i)))})).catch((e=>this.logErr(e)))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const e=this.path.resolve(this.dataFile),t=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(e),i=!s&&this.fs.existsSync(t);if(!s&&!i)return{};{const i=s?e:t;try{return JSON.parse(this.fs.readFileSync(i))}catch(e){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const e=this.path.resolve(this.dataFile),t=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(e),i=!s&&this.fs.existsSync(t),o=JSON.stringify(this.data);s?this.fs.writeFileSync(e,o):i?this.fs.writeFileSync(t,o):this.fs.writeFileSync(e,o)}}lodash_get(e,t,s){const i=t.replace(/\[(\d+)\]/g,".$1").split(".");let o=e;for(const e of i)if(o=Object(o)[e],void 0===o)return s;return o}lodash_set(e,t,s){return Object(e)!==e||(Array.isArray(t)||(t=t.toString().match(/[^.[\]]+/g)||[]),t.slice(0,-1).reduce(((e,s,i)=>Object(e[s])===e[s]?e[s]:e[s]=Math.abs(t[i+1])>>0==+t[i+1]?[]:{}),e)[t[t.length-1]]=s),e}getdata(e){let t=this.getval(e);if(/^@/.test(e)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(e),o=s?this.getval(s):"";if(o)try{const e=JSON.parse(o);t=e?this.lodash_get(e,i,""):t}catch(e){t=""}}return t}setdata(e,t){let s=!1;if(/^@/.test(t)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(t),r=this.getval(i),a=i?"null"===r?null:r||"{}":"{}";try{const t=JSON.parse(a);this.lodash_set(t,o,e),s=this.setval(JSON.stringify(t),i)}catch(t){const r={};this.lodash_set(r,o,e),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(e,t);return s}getval(e){switch(this.getEnv()){case"Egern":return $prefs.valueForKey(e);case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(e);case"Quantumult X":return $prefs.valueForKey(e);case"Node.js":return this.data=this.loaddata(),this.data[e];default:return this.data&&this.data[e]||null}}setval(e,t){switch(this.getEnv()){case"Egern":return $prefs.setValueForKey(e,t);case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(e,t);case"Quantumult X":return $prefs.setValueForKey(e,t);case"Node.js":return this.data=this.loaddata(),this.data[t]=e,this.writedata(),!0;default:return this.data&&this.data[t]||null}}get(e,t=(()=>{})){switch(this.getEnv()){case"Egern":$task.fetch(e).then(r=>t(null,{status:r.statusCode,statusCode:r.statusCode,headers:r.headers,body:r.body},r.body),e=>t(e));break;default:$httpClient.get(e,((e,s,i)=>{!e&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),t(e,s,i)}));break}}post(e,t=(()=>{})){switch(this.getEnv()){case"Egern":e.method="POST",$task.fetch(e).then(r=>t(null,{status:r.statusCode,statusCode:r.statusCode,headers:r.headers,body:r.body},r.body),e=>t(e));break;default:$httpClient.post(e,((e,s,i)=>{!e&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),t(e,s,i)}));break}}msg(t=e,s="",i="",o={}){if(!this.isMute)switch(this.getEnv()){case"Egern":case"Quantumult X":$notify(t,s,i);break;default:$notification.post(t,s,i);break}console.log(t,s,i)}log(...e){console.log(e.join("\n"))}logErr(e){console.log("❗️错误:",e)}wait(e){return new Promise((t=>setTimeout(t,e)))}done(e={}){$done(e)}}(e,t)}
