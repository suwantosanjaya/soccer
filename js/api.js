const BASE_URL = "https://api.football-data.org/v2/";
const TOKEN = "ff56ec86cf0744c5996b7d875dbf3609";

// Blok kode yang akan di panggil jika fetch berhasil
const status = response => {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
};

const jsonToObj = response => response.json(); // untuk memparsing json menjadi array JavaScript
const error = response => console.log("Error : " + response); // untuk meng-handle kesalahan di blok catch

const fetchAPI = (url) => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': TOKEN
        }
    })
        .then(response => status(response))
        .then(response => jsonToObj(response))
        .catch(response => error(response))
};

const showStandingCompetition = league_id => {
    const ENDPOINT = `${BASE_URL}competitions/${league_id}/standings?standingType=TOTAL`;
    if ('caches' in window) {
        caches.match(ENDPOINT)
            .then(response => {
                if (response)
                    response.json().then(jsonData => {
                        //console.log("Offline");
                        renderStanding(jsonData, league_id);
                    })
            })
    }

    fetchAPI(ENDPOINT)
        .then(response => {
            //console.log("Online");
            renderStanding(response, league_id);
        })
        .catch(response => console.log(response))
};

const renderStanding = (jsonData, league_id) => {
    const element = document.getElementById("standing");
    element.innerHTML = "";

    document.getElementById("content-title").innerHTML = `${jsonData.competition.name}`;

    jsonData.standings.forEach(stdItem => {
        let list = "";
        if(stdItem.type === "TOTAL"){
            stdItem.table.forEach(item => {
                list += `
                        <tr>
                            <td><img src="${item.team.crestUrl}" width="20px" alt="${item.team.name}"/></td>
                            <td><a href="./schedule.html?id=${item.team.id}&lg=${league_id}">${item.team.name}</a></td>
                            <td>${item.playedGames}</td>
                            <td>${item.won}</td>
                            <td>${item.draw}</td>
                            <td>${item.lost}</td>
                            <td>${item.goalDifference}</td>
                            <td>${item.points}</td>
                        </tr>
                `;
            });

            if(stdItem.group !== null){
                element.innerHTML += `
                                ${stdItem.group.replace("_", " ")}
                                <div class="card">
                                    <table class="striped">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Team Name</th>
                                                <th>P</th>
                                                <th>W</th>
                                                <th>D</th>
                                                <th>L</th>
                                                <th>GD</th>
                                                <th>Pts</th>
                                            </tr>
                                         </thead>
                                        <tbody id="team">
                                            ${list}
                                        </tbody>
                                    </table>                                
                                </div>
                                `;
            }else {
                element.innerHTML = `
                                <div class="card">
                                    <table class="striped">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Team Name</th>
                                                <th>P</th>
                                                <th>W</th>
                                                <th>D</th>
                                                <th>L</th>
                                                <th>GD</th>
                                                <th>Pts</th>
                                            </tr>
                                         </thead>
                                        <tbody id="team">
                                            ${list}
                                        </tbody>
                                    </table>                                
                                </div>
                                `;
            }

        }
    });
};

const getScheduleById = scheduleId => {
    return new Promise(function (resolve, reject) {
        const ENDPOINT = `${BASE_URL}matches/${scheduleId}`;
        if ('caches' in window) {
            caches.match(ENDPOINT)
                .then(response => {
                    if (response)
                        response.json().then(jsonData => {
                            //renderScheduleTeam(jsonData);
                            resolve(jsonData);
                        })
                })
        }

        fetchAPI(ENDPOINT)
            .then(response => {
                //renderScheduleTeam(response)
                resolve(response);
            })
            .catch(response => console.log(response));
    })
};

const showScheduleTeam = (team_id, league_id) => {
    return new Promise(function (resolve, reject) {
        const ENDPOINT = `${BASE_URL}teams/${team_id}/matches?status=SCHEDULED`;
        if ('caches' in window) {
            caches.match(ENDPOINT)
                .then(response => {
                    if (response)
                        response.json().then(jsonData => {
                            const matches = jsonData.matches;
                            renderScheduleTeam(matches, league_id);
                            resolve(matches);
                        })
                })
        }

        fetchAPI(ENDPOINT)
            .then(response => {
                const matches = response.matches;
                renderScheduleTeam(matches, league_id);
                resolve(matches);
            })
            .catch(response => console.log(response));
    })
};

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const renderScheduleTeam = (jsonData, league_id) => {
    const element = document.getElementById("schedule_list");
    let matches = "";

    jsonData.forEach(item => {
        const scoreHomeTeam = (item.score.fullTime.homeTeam != null) ? item.score.fullTime.homeTeam : "";
        const scoreAwayTeam = (item.score.fullTime.awayTeam != null) ? item.score.fullTime.awayTeam : "";
        const dateMatch = new Date(Date.parse(item.utcDate));

        if(league_id == item.competition.id){
            matches += `
                        <div class="row">
                            <div class="col s12 m6">
                                <div class="card blue-grey darken-1">
                                    <div class="card-content white-text center">
                                        <span class="card-title">${monthNames[dateMatch.getMonth()]} ${dateMatch.getDate()}, ${dateMatch.getFullYear()} 
                                                                ${dateMatch.getHours()}:${dateMatch.getMinutes()}</span>
                                        <h6>${item.group} ${item.competition.name}</h6>
                                        <div>${item.homeTeam.name}</div> 
                                        <div>${scoreHomeTeam} </div>
                                        <div class="chip">vs</div> 
                                        <div>${scoreAwayTeam}</div> 
                                        <div>${item.awayTeam.name}</div>                                         
                                    </div>
                                    <div class="card-action">
                                        <a href="#" class="btn-floating btn-large green saveButton">
                                            <i class="large material-icons" id="${item.id}">save</i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>  
            `;
        }


    });

    element.innerHTML = `${matches}`;

    const btnSave = document.querySelectorAll(".saveButton");
    for (const btn of btnSave) {
        btn.addEventListener("click", event => {
            const scheduleId = event.target.id;
            document.getElementById("preloader").style.display = "block";
            getScheduleById(scheduleId).then(response => {
                dbSaveSchedule(response.match);
                document.getElementById("preloader").style.display = "none";
            }).catch(err => {
                error(err);
            });
        })
    }
};


const getFavouriteSchedules = () => {
    dbGetSchedule().then(schedules => {
        const element = document.getElementById("favourite_schedule");
        element.innerHTML = "";

        if (schedules.length > 0) {
            schedules.forEach(item => {
                const scoreHomeTeam = (item.score.fullTime.homeTeam != null) ? item.score.fullTime.homeTeam : "";
                const scoreAwayTeam = (item.score.fullTime.awayTeam != null) ? item.score.fullTime.awayTeam : "";

                const dateMatch = new Date(Date.parse(item.utcDate));

                element.innerHTML += `
                    <div class="row">
                        <div class="col s12 m6">
                            <div class="card blue-grey darken-1">
                                <div class="card-content white-text center">
                                    <span class="card-title">${monthNames[dateMatch.getMonth()]} ${dateMatch.getDate()}, ${dateMatch.getFullYear()} 
                                                                ${dateMatch.getHours()}:${dateMatch.getMinutes()}</span>
                                    <h6>${item.group} ${item.competition.name}</h6>
                                    <div>${item.homeTeam.name}</div> 
                                    <div>${scoreHomeTeam} </div>
                                    <div class="chip">vs</div> 
                                    <div>${scoreAwayTeam}</div> 
                                    <div>${item.awayTeam.name}</div>                                  
                                </div>
                                <div class="card-action">
                                    <a href="#" class="btn-floating btn-large red removeButton">
                                        <i class="large material-icons" id="${item.id}">delete_forever</i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            const btnRemove = document.querySelectorAll(".removeButton");
            for (const btn of btnRemove) {
                btn.addEventListener("click", event => {
                    const scheduleId = event.target.id;
                    console.log(`DELETE ${scheduleId}`);
                    const msg = confirm("Are you sure delete this item from favourite?");
                    if (!msg) {
                        console.log("No");
                        return false;
                    } else {
                        dbDeleteSchedule(scheduleId).then(() => {
                            getFavouriteSchedules();
                            console.log("Yes");
                        });
                    }
                })
            }
        } else {
            element.innerHTML = `<div class="row teal lighten-4">
                                    <div class="col s12 center">
                                        Favourites is empty!!!
                                    </div>
                                 </div>`;
        }
    })
}