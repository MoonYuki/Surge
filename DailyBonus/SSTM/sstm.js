const $ = new Env('sstm签到');
$.KEY_login = 'moonyuki_login_sstm';
$.isRequest = typeof $request !== 'undefined';

// 用于存储前一次访问的 URL
let previousUrl = null;

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
    headers: $request.headers
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

  // 获取当天日期，格式为 YYYYMD
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // 月份从0开始，需要+1
    const day = today.getDate();
    return `${year}${month}${day}`;
  }

  // 获取签到区页面内容
  const forumUrl = "https://sstm.moe/forum/72-%E5%90%8C%E7%9B%9F%E7%AD%BE%E5%88%B0%E5%8C%BA/";
  const forumResponse = await $.http.get({
    url: forumUrl,
    headers: {
      "Referer": previousUrl || forumUrl // 使用前一次访问的 URL 作为 Referer
    }
  });
  previousUrl = forumUrl; // 更新前一次访问的 URL
  const forumHtml = forumResponse.body;

  // 提取当天日期的帖子 URL 和帖子 ID
  const todayDate = getTodayDate();
  const postMatch = forumHtml.match(new RegExp(`<a\\s+[^>]*href="(https://sstm\\.moe/topic/(\\d+)-[^"]*?${todayDate}[^"]*?)"`));
  if (!postMatch || !postMatch[1] || !postMatch[2]) {
    $.log('未找到当天签到帖子');
    $.desc = '❌未找到当天签到帖子';
    return;
  }
  const topicUrl = postMatch[1];
  const postId = postMatch[2];
  $.log(`提取的帖子URL: ${topicUrl}`);
  $.log(`提取的帖子ID: ${postId}`);

  // 获取帖子页面内容
  const topicResponse = await $.http.get({
    url: topicUrl,
    headers: {
      "Referer": previousUrl // 使用前一次访问的 URL 作为 Referer
    }
  });
  previousUrl = topicUrl; // 更新前一次访问的 URL
  const topicHtml = topicResponse.body;

  // 提取 csrfKey 和 plupload
  const csrfKeyMatch = topicHtml.match(/name="csrfKey" value="([^"]+)"/);
  const pluploadMatch = topicHtml.match(/name="plupload" value="([^"]+)"/);
  if (!csrfKeyMatch || !pluploadMatch) {
    $.log('未找到 csrfKey 或 plupload');
    $.desc = '❌未找到 csrfKey 或 plupload';
    return;
  }
  const csrfKey = csrfKeyMatch[1];
  const plupload = pluploadMatch[1];
  $.log(`提取的 csrfKey: ${csrfKey}`);
  $.log(`提取的 plupload: ${plupload}`);
  
  // 提取 lastSeenID
  const lastSeenIdMatch = topicHtml.match(/<a href="https:\/\/sstm\.moe\/topic\/(\d+).*?\?do=findComment&amp;comment=(\d+)"[^>]*>发布于<time[^>]*datetime='(\d{4}-\d{2}-\d{2})[^>]*>/);
  if (!lastSeenIdMatch || !lastSeenIdMatch[2]) {
    $.log('未找到 lastSeenID');
    $.desc = '❌未找到 lastSeenID';
    return;
  }
  const lastSeenID = lastSeenIdMatch[2];
  $.log(`提取的 lastSeenID: ${lastSeenID}`);
  
  // 获取 topic_comment_${postId}_upload
  const uploaderUrl = `${topicUrl}?csrfKey=${csrfKey}&getUploader=topic_comment_${postId}`;
  const uploaderResponse = await $.http.get({
    url: uploaderUrl,
    headers: {
      "Referer": previousUrl // 使用前一次访问的 URL 作为 Referer
    }
  });
  previousUrl = uploaderUrl; // 更新前一次访问的 URL
  const uploaderHtml = uploaderResponse.body;
  const uploaderMatch = uploaderHtml.match(new RegExp(`name="topic_comment_${postId}_upload" value="([^"]+)"`));
  if (!uploaderMatch || !uploaderMatch[1]) {
    $.log('未找到 topic_comment_${postId}_upload');
    $.desc = '❌未找到 topic_comment_${postId}_upload';
    return;
  }
  const topicCommentUpload = uploaderMatch[1];
  $.log(`提取的 topic_comment_${postId}_upload: ${topicCommentUpload}`);

  // 构造 POST 请求体
  const postBody = {
    [`commentform_${postId}_submitted`]: "1",
    csrfKey: csrfKey,
    _contentReply: "1",
    MAX_FILE_SIZE: "2097152",
    plupload: plupload,
    [`topic_comment_${postId}`]: "<p>每日签到</p>",
    [`topic_comment_${postId}_upload`]: topicCommentUpload,
    topic_auto_follow: "0",
    currentPage: "1",
    _lastSeenID: lastSeenID
  };

  // 发送签到请求
  const checkinOpts = {
    url: topicUrl,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Referer": previousUrl // 使用前一次访问的 URL 作为 Referer
    },
    body: Object.keys(postBody).map(key => `${key}=${encodeURIComponent(postBody[key])}`).join("&")
  };

  try {
    const resp = await $.http.post(checkinOpts);
    const responseBody = JSON.parse(resp.body);
    $.log(JSON.stringify(responseBody));

    // 判断签到是否成功
    if (responseBody.type === "redirect" && responseBody.url) {
      $.log('签到成功');
      $.desc = `✅签到成功`;
    } else {
      $.log('签到异常');
      $.desc = `❌签到异常，${responseBody.content || '未知错误'}`;
    }
  } catch (err) {
    $.log(err);
    $.log('签到失败');
    $.desc = `❌签到失败，详情:${err}`;
  }
}

function showMsg() {
  if (!$.desc) {
    return;
  }
  $.msg($.name, $.subt, $.desc);
}

// Boxjs.Env
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}isShadowrocket(){return"undefined"!=typeof $rocket}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:i,...r}=t;this.got[s](i,r).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
