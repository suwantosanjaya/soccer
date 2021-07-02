document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("preloader").style.display = "none";
    // Ambil nilai query parameter (?id=)
    const urlParams = new URLSearchParams(window.location.search);
    const idTeam = urlParams.get("id");
    const idLiga = urlParams.get("lg");
    showScheduleTeam(idTeam, idLiga);

    document.getElementById("btn-back").addEventListener("click", () => {
        window.location = `./standing.html?id=${idLiga}`;
    })
});