var body = $response.body.replace(/canBuyCount":\d/g,'canBuyCount":4')
$done({ body });
