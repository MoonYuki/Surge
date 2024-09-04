const url = $request.url;

if (!$response){
  console.log('未获取正确response');
  $done();
} else {
  let jsondata = JSON.parse($response.body);
  let arg = getArgs();
  if(url.includes("/v2/req")){
    // 彩云广告
    jsondata = {
      status : "failed"
    };
  } else if (url.includes("/v1/vip_info")) {
    // 我的页面
    if (jsondata.vip) {
      jsondata.vip.expires_time = arg.EXPIRES_TIME;
      jsondata.vip.is_auto_renewal = true;
    }
    if (jsondata.svip) {
      jsondata.svip.expires_time = arg.EXPIRES_TIME;
      jsondata.svip.is_auto_renewal = true;
    }
  }else if (url.includes("/v1/user_detail")) {
    // 我的页面（7.20.0）
    if (jsondata.vip_info) {
      jsondata.vip_info.vip.expires_time = arg.EXPIRES_TIME;
      jsondata.vip_info.vip.is_auto_renewal = true;
      jsondata.vip_info.svip.expires_time = arg.EXPIRES_TIME;
      jsondata.vip_info.svip.is_auto_renewal = true;
    }
  } else if (url.includes("/v2/user")) {
    // 我的页面
    if (jsondata.result) {
      jsondata.result.is_phone_verified = true;
      jsondata.result.is_xy_vip = true;
      jsondata.result.vip_expired_at = arg.EXPIRES_TIME;
      jsondata.result.is_vip = true;
      jsondata.result.xy_svip_expire = arg.EXPIRES_TIME;
      if (jsondata.result.wt) {
        if (jsondata.result.wt.vip) {
          jsondata.result.wt.vip.enabled = true;
          jsondata.result.wt.vip.expired_at = arg.EXPIRES_TIME;
          jsondata.result.wt.vip.svip_expired_at = arg.EXPIRES_TIME;
        }
      }
      jsondata.result.is_primary = true;
      jsondata.result.xy_vip_expire = arg.EXPIRES_TIME;
      jsondata.result.svip_expired_at = arg.EXPIRES_TIME;
      jsondata.result.vip_type = "s";
    }
  }
  $done({ body: JSON.stringify(jsondata) });
}

function getArgs() {
  return Object.fromEntries(
    $argument
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}
