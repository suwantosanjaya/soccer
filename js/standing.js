document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("preloader").style.display = "none";
    // Ambil nilai query parameter (?id=)
    const urlParams = new URLSearchParams(window.location.search);
    const idLiga = urlParams.get("id");
    showStandingCompetition(idLiga);

    document.getElementById("btn-back").addEventListener("click", () => {
        window.location = `./index.html#home`;
    })
});