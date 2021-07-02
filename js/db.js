const dbPromised = idb.open("soccer", 2, upgradeDb => {
    switch (upgradeDb.oldVersion) {
        case 0:
            upgradeDb.createObjectStore("schedules", {keyPath: "id"});
        case 1:
            const scheduleObjectStore = upgradeDb.transaction.objectStore("schedules");
            scheduleObjectStore.createIndex("homeTeam", "homeTeam.name", { unique: false });
    }
});


const dbSaveSchedule = scheduleData => {
    return new Promise((resolve, reject) => {
        dbPromised.then(db => {
            const transaction = db.transaction("schedules", `readwrite`);
            transaction.objectStore("schedules").add(scheduleData);
            return transaction.complete;
        }).then(() => {
            resolve(true);
            M.toast({html: "Schedule has been added to favorites", displayLength: 2000});
        }).catch(() => {
            M.toast({html:"Schedule is already in favorites", displayLength: 2000});
        })
    })
};

const dbGetSchedule = () => {
    return new Promise((resolve, reject) => {
        dbPromised.then(db => {
            const transaction = db.transaction("schedules", `readonly`);
            const result = transaction.objectStore("schedules").getAll();
            return result;
        }).then(data => {
            resolve(data);
        })
    })
};


const dbDeleteSchedule = scheduleId => {
    return new Promise((resolve, reject) => {
        dbPromised.then(db => {
            const transaction = db.transaction("schedules", `readwrite`);
            transaction.objectStore("schedules").delete(parseInt(scheduleId));
            return transaction.complete;
        }).then(() => {
            resolve(true);
            M.toast({html: "Schedule has been deleted from favorites", displayLength: 2000});
        }).catch(() => {
            M.toast({html:"Schedule can't deleted", displayLength: 2000});
        })
    })
};



const dbGetScheduleById = (id) => {
    return new Promise((resolve, reject) => {
        dbPromised.then(db => {
            const transaction = db.transaction("schedules", `readonly`);
            const result = transaction.objectStore("schedules").get(parseInt(id));
            return result;
        }).then(data => {
            //console.log(data);
            resolve(data);
        })
    })
};

