const jsondata = JSON.parse(typeof $response != "undefined" && $response.body || null);
console.log('start');

if (typeof $response == "undefined") {
  console.log('response undefined');
  delete $request.headers["x-revenuecat-etag"];
  delete $request.headers["X-RevenueCat-ETag"];
  jsondata.headers = $request.headers;
} else if (jsondata && jsondata.subscriber) {
  console.log('rewrite start');
  jsondata.subscriber.subscriptions = jsondata.subscriber.subscriptions || {};
  jsondata.subscriber.entitlements = jsondata.subscriber.entitlements || {};
  jsondata.subscriber.non_subscriptions = {
    "electricalcalculations.pro.lifetime": [
      {
        "id": "0123456789",
        "is_sandbox": false,
        "purchase_date": "2023-12-31T16:00:00Z",
        "original_purchase_date": "2023-12-31T16:00:00Z",
        "store": "app_store",
        "store_transaction_id": "350001992123456"
      }
    ]
  };
  jsondata.subscriber.original_application_version = "112";
  jsondata.subscriber.other_purchases = {
    "electricalcalculations.pro.lifetime": {
      "purchase_date": "2023-12-31T16:00:00Z"
    }
  };
  jsondata.subscriber.management_url = "https://apps.apple.com/account/subscriptions";
  jsondata.subscriber.entitlements["pro"] = {
    "grace_period_expires_date": null,
    "purchase_date": "2023-12-31T16:00:00Z",
    "product_identifier": "electricalcalculations.pro.lifetime",
    "expires_date": null
  };
  jsondata.subscriber.original_purchase_date = "2023-12-31T16:00:00Z";

  jsondata.body = JSON.stringify(jsondata);
}

console.log('script end');
$done(jsondata);
