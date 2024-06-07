const url = $request.url;

if (!$response){
  console.log('未获取正确response');
  $done();
} else {
  let jsondata = JSON.parse($response.body);
  if(url.includes("/passport/me")){
    let data = $response.body;
    // 定义一个键值对字典，用于批量替换
    const replacements = {
      "nick": "超级会员",
      "sysserviceid": "316002",
      "servicename": "超级会员",
      "amount": "100",
      "price": "0",
      "slapi": "slapi-prm.oray.net",
      "skin": "game",
      "isgameservice": "1",
      "sysexpiredate": "2099-06-25",
      "pubsvr": "pubsub-adv01.oray.net",
      "clientapi": "api-adv.sunlogin.oray.com",
      "gradename": "game",
      "issubscribe": "1",
      "need_mob_grant": "1",
      "cloudfiles_login_url": "https://drive.sunlogin.oray.com/cloud-files/webdav"
    };

    // 执行替换操作
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(`<data type="field" name="${key}">.*?</data>`, 'g');
      data = data.replace(regex, `<data type="field" name="${key}">${value}</data>`);
    }
    $done({ body: data });
  } else {
    // 替换字段值的键值对字典
    const replacements = {
      "grade": "1",
      "nick": "超级会员",
    };

    // 使用字典进行替换
    for (const [key, value] of Object.entries(replacements)) {
      if (key in jsondata) {
        jsondata[key] = value;
      }
    }
  }
  $done({ body: JSON.stringify(jsondata) });
}
