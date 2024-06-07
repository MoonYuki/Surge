const url = $request.url;

if (!$response){
  console.log('未获取正确response');
  $done();
} else {
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
  } else if(url.includes("/service/used")){
    let jsondata = JSON.parse($response.body);
    // 定义一个键值对字典，表示需要从文本2替换到文本1的字段
    const replacements = {
      "datas.deadline": "2099-07-30",
      "datas.gradename": "supervip",
      "datas.hdGradeName": "supervip",
      "datas.servicename_lang": "{\"zh_CN\":\"\\u8d85\\u7ea7\\u4f1a\\u5458\",\"en\":\"Vip.\",\"zh_TW\":\"\\u8d85\\u7d1a\\u6703\\u54e1\"}",
      "datas.servicename": "超级会员",
      "datas.sysserviceid": 316002,
      "datas.isexpired": false,
      "datas.windowlimit": -1,
      "datas.isgameservice": 1,
      "datas.image": "https:\/\/cdn.orayimg.com\/sunlogin\/slapi\/img\/service\/sunloginx\/310218.png",
      "datas.batch": true,
      "datas.expirenotify": true,
      "datas.renewurl": "https:\/\/store.oray.com\/buy\/?productid=316002&action=upgrade",
      "datas.features": "{\"handle\":true,\"digitalboard\":true,\"doublescreen\":true,\"addfc\":false,\"camera\":true,\"forcetrans\":true,\"hd\":true,\"ultrahd\":true,\"fullhd\":true,\"frame60\":true,\"frame144\":true,\"gamemouse\":true,\"blackscreen\":true,\"usbip\":true,\"p2p_intelligent\":false,\"cloudrecording\":false,\"work_reporting\":false,\"is_sample_worked\":false,\"is_buy_work\":false,\"remaining_work_frequency\":0,\"hardware_detection\":false,\"process_detection\":false,\"multi_protocol\":false}",
      "datas.expiredays": 999,
      "datas.skin": "game",
      "datas.serviceexpiredate": "2099-06-25"
    };

    // 遍历字典并替换obj1中的对应字段
    for (const [key, value] of Object.entries(replacements)) {
      const keys = key.split('.');
      let temp = jsondata;
      for (let i = 0; i < keys.length - 1; i++) {
        temp = temp[keys[i]];
      }
      temp[keys[keys.length - 1]] = value;
    }
    $done({ body: JSON.stringify(jsondata) });
  } else {
    let jsondata = JSON.parse($response.body);
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
    $done({ body: JSON.stringify(jsondata) });
  }
}
$done();
