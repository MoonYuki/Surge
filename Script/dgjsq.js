const anni = {};
const anni1 = JSON.parse(typeof $response != "undefined" && $response.body || null);

if (typeof $response == "undefined") {
  delete $request.headers["x-revenuecat-etag"];
  delete $request.headers["X-RevenueCat-ETag"];
  anni.headers = $request.headers;
} else if (anni1 && anni1.subscriber) {
  anni1.subscriber.subscriptions = anni1.subscriber.subscriptions || {};
  anni1.subscriber.entitlements = anni1.subscriber.entitlements || {};
  anni1.subscriber.non_subscriptions = {
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
  anni1.subscriber.original_application_version = "112";
  anni1.subscriber.other_purchases = {
    "electricalcalculations.pro.lifetime": {
      "purchase_date": "2023-12-31T16:00:00Z"
    }
  };
  anni1.subscriber.management_url = "https://apps.apple.com/account/subscriptions";
  anni1.subscriber.entitlements["pro"] = {
    "grace_period_expires_date": null,
    "purchase_date": "2023-12-31T16:00:00Z",
    "product_identifier": "electricalcalculations.pro.lifetime",
    "expires_date": null
  };
  anni1.subscriber.original_purchase_date = "2023-12-31T16:00:00Z";

  anni.body = JSON.stringify(anni1);
}

$done(anni);
