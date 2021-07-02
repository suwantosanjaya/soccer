// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(() => console.log("Pendaftaran ServiceWorker berhasil"))
            .catch(() => console.log("Pendaftaran ServiceWorker gagal"));
    });
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}


// Meminta ijin menggunakan Notification API
const requestPermission = () => {
    Notification.requestPermission().then(result => {
        if (result === "denied") {
            console.log("Fitur notifikasi tidak diijinkan.");
            return;
        } else if (result === "default") {
            console.error("Pengguna menutup kotak dialog permintaan ijin.");
            return;
        }

        /*
        navigator.serviceWorker.getRegistration().then(reg => {
            reg.showNotification('Notifikasi diijinkan!');
        });

         */

        const publicKey = "BJWpyorYJ9UnywNsj6OCCLLhsC4hZfAX1I6VzrP9qh534zrrsBt3bMKthYqgVgi0sx-lgRhgsXPdQt8s9eUl8N8";

        navigator.serviceWorker.ready.then(() => {
            if (('PushManager' in window)) {
                navigator.serviceWorker.getRegistration().then(registration => {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(publicKey)
                    }).then(subscribe => {
                        console.log(`Berhasil melakukan subscribe dengan endpoint: ${subscribe.endpoint}`);
                        console.log(`Berhasil melakukan subscribe dengan p256dh key: ${btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('p256dh'))))}`);
                        console.log(`Berhasil melakukan subscribe dengan auth key: ${btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('auth'))))}`);
                    }).catch(e => {
                        console.error(`Tidak dapat melakukan subscribe ${e.message}`);
                    });
                });
            }
        });

    });
};

// Periksa fitur Notification API
if ("Notification" in window) {
    requestPermission();
} else {
    console.error("Browser tidak mendukung notifikasi.");
}


const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

