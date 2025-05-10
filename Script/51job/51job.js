const url = $request.url;
let body = JSON.parse($response.body);

if(url.includes("/api/market/get_launch")) {
  delete body.resultbody.person;
}

if(url.includes("/open/noauth/recommend/job-tab-dynamic")) {
  delete body.resultbody.adsTabFeeds;
}

$done({body: JSON.stringify(body)});
