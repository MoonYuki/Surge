const data = $response.body;
console.log('正则开始');
  $done();
data = data.replace(
    /if\s*\(\s*typeof\s+__ad\s*===\s*"undefined"\s*\)[^;]*;\s*/g,
    ''
);
$done({ body: data });
