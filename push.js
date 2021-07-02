const webPush = require('web-push');

const vapidKeys = {
    publicKey: "BJWpyorYJ9UnywNsj6OCCLLhsC4hZfAX1I6VzrP9qh534zrrsBt3bMKthYqgVgi0sx-lgRhgsXPdQt8s9eUl8N8",
    privateKey: "fhMcapqm5CcgCAN7UN5_OjSiCHVF0NhFX_lktPHYLSk"
};

webPush.setVapidDetails(
    'mailto:suwantosanjaya@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const pushSubscription = {
    endpoint: "https://fcm.googleapis.com/fcm/send/deORL4uC4zw:APA91bE27CLhnI_YV1MhcxYlvwfuq2mtpeaMrHX2oKSlpow5MglpAUYIXykF-CgmjFVFsQeHRZObLCogTaSvGqSse0bhjK2Z1jPa2Qiyy3mHbAp16kxplg5m2dbM8mFP7ZNriEvN_kVv",
    keys: {
        p256dh: "BMIlAwISVLUMxcztuxR7W0Zvpwr/BH/pGgwZ+Lf8hDF9I598x9GwzD3okyQ+HpLLBE2ZKepqR8YAjOPGcoyx97U=",
        auth: "JPKYADKtz4W8+ScFN4WO2g=="
    }
};

const payload = 'Anda menerima push notifikasi!';

const options = {
    gcmAPIKey: '902206291033',
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);