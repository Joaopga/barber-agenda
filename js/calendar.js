const mainTable = document.querySelector(".main-c-content");
const table = document.querySelector(".calendar-table");
const ths = document.querySelectorAll("th");
const dayAgenda = document.querySelector(".day-agenda")
let modalStat;

function openDayAgenda(date) {
    dayAgenda.classList.remove('hidden')
}

function closeDayAgenda() {
    dayAgenda.classList.add('hidden')
}

// OPEN & CLOSE SIDE MENU WITH DAY AGENDA
table.addEventListener("click", (e) => {
  mainTable.style.transform = "translateX(-17%)";
  modalStat = 1;
  openDayAgenda(e.target.querySelector("span").innerHTML);
});

// CLOSE
document.addEventListener("click", (e) => {
  if (!table.contains(event.target) && modalStat === 1) {
    mainTable.style.transform = "translateX(0%)";
    modalStat = 0;

    closeDayAgenda()
  }
});
