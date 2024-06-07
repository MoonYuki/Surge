// 内容1和内容2
let content1 = `
<response>
    <category>passport</category>
    <action>me</action>
    <code>0</code>
    <message>SUCCESS</message>
    <datas>
        <data type="field" name="userid">22314481</data>
        <data type="field" name="nick">17317794183</data>
        <data type="field" name="sysserviceid">0</data>
        <data type="field" name="servicename">免费级</data>
        <data type="field" name="amount">-1</data>
        <data type="field" name="price">-1</data>
        <data type="field" name="remotecount">1</data>
        <data type="field" name="recentcount">1</data>
        <data type="field" name="slapi">slapi.oray.net</data>
        <data type="field" name="skin">default</data>
        <data type="field" name="isgameservice">0</data>
        <data type="field" name="sysexpiredate"></data>
        <data type="field" name="ismonitor">0</data>
        <data type="field" name="used">1</data>
        <data type="field" name="pubsvr">pubsub02.oray.net</data>
        <data type="field" name="tracksrv">https://sl-tk.oray.com</data>
        <data type="field" name="account">17317794183</data>
        <data type="field" name="isabroaduser">0</data>
        <data type="field" name="mobile">17317794183</data>
        <data type="field" name="email"></data>
        <data type="field" name="clientapi">api-std.sunlogin.oray.com</data>
        <data type="field" name="isnewclient">0</data>
        <data type="field" name="slcollection_srv">https://sl-tk.oray.com</data>
        <data type="field" name="track_process_srv">https://sl-tk.oray.com/slprocess</data>
        <data type="field" name="gradename">free</data>
        <data type="field" name="auto_bind">1</data>
        <data type="field" name="sllog_addr">https://slct-tk.oray.com/slct</data>
        <data type="field" name="ent_guide">0</data>
        <data type="field" name="issubscribe">0</data>
        <data type="field" name="feature_seat">0</data>
        <data type="field" name="need_mob_grant"></data>
        <data type="field" name="is_personal_service">1</data>
        <data type="field" name="limit_control_count">0</data>
        <data type="field" name="seat_keepalive_ms">90000</data>
        <data type="field" name="cloudfiles_login_url">https://drive.sunlogin.oray.com/cloud-files/webdav</data>
    </datas>
</response>`;

const content2 = `
<response>
    <category>passport</category>
    <action>me</action>
    <code>0</code>
    <message>SUCCESS</message>
    <datas>
        <data type="field" name="userid">91899255</data>
        <data type="field" name="nick">超级会员</data>
        <data type="field" name="sysserviceid">316002</data>
        <data type="field" name="servicename">超级会员</data>
        <data type="field" name="amount">100</data>
        <data type="field" name="price">0</data>
        <data type="field" name="remotecount">53</data>
        <data type="field" name="recentcount">19</data>
        <data type="field" name="slapi">slapi-prm.oray.net</data>
        <data type="field" name="skin">game</data>
        <data type="field" name="isgameservice">1</data>
        <data type="field" name="sysexpiredate">2024-06-25</data>
        <data type="field" name="ismonitor">0</data>
        <data type="field" name="used">53</data>
        <data type="field" name="pubsvr">pubsub-adv01.oray.net</data>
        <data type="field" name="tracksrv">https://sl-tk.oray.com</data>
        <data type="field" name="account">sn8801</data>
        <data type="field" name="isabroaduser">0</data>
        <data type="field" name="mobile"></data>
        <data type="field" name="email">xiaoai18881@163.com</data>
        <data type="field" name="clientapi">api-adv.sunlogin.oray.com</data>
        <data type="field" name="isnewclient">0</data>
        <data type="field" name="slcollection_srv">https://sl-tk.oray.com</data>
        <data type="field" name="track_process_srv">https://sl-tk.oray.com/slprocess</data>
        <data type="field" name="gradename">game</data>
        <data type="field" name="auto_bind">1</data>
        <data type="field" name="sllog_addr">https://slct-tk.oray.com/slct</data>
        <data type="field" name="ent_guide">0</data>
        <data type="field" name="issubscribe">1</data>
        <data type="field" name="feature_seat">0</data>
        <data type="field" name="need_mob_grant">1</data>
        <data type="field" name="is_personal_service">1</data>
        <data type="field" name="limit_control_count">0</data>
        <data type="field" name="seat_keepalive_ms">90000</data>
        <data type="field" name="cloudfiles_login_url">https://drive.sunlogin.oray.com/cloud-files/webdav</data>
    </datas>
</response>`;

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
    content1 = content1.replace(regex, `<data type="field" name="${key}">${value}</data>`);
}

console.log(content1);
$done();
