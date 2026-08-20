//      

const header = document.querySelector(".header");
const mainTable = document.querySelector(".main-c-content");
const table = document.querySelector(".calendar-table");
const dayAgenda = document.querySelector(".day-agenda");
let dayAgendaHeader = document.querySelector(".day-agenda-header");
let modalStat;

function openDayAgenda(date) {
  dayAgenda.classList.remove("hidden");

  setTimeout(() => {
    dayAgenda.style.transform = "translateX(0%)";
  }, 1);
  if (date < 10) date = "0" + date;
  dayAgendaHeader.innerHTML = `Horários dia ${date}/01`;

  setDatas(date);
}

function closeDayAgenda() {
  dayAgenda.style.transform = "translateX(100%)";
  setTimeout(() => {
    dayAgenda.classList.add("hidden");
  }, 300);
}

function setDatas(date) {
  let Dayths = dayAgenda.querySelectorAll("tr th:first-child");
  let DaythsStatus = dayAgenda.querySelectorAll("tr th:nth-child(2)");
  for (let i = 0; i < Dayths.length; i++) {
    if (date === "02") {
      if (
        Dayths[i].textContent === "09:00" ||
        Dayths[i].textContent === "10:00" ||
        Dayths[i].textContent === "16:00"
      ) {
        DaythsStatus[i].className = "day-available";
        DaythsStatus[i].textContent = "Disponível";
      } else {
        DaythsStatus[i].className = "day-non-available";
        DaythsStatus[i].innerHTML = "Indisponível";
      }
    } else if (date === "04") {
      if (
        Dayths[i].textContent === "08:00" ||
        Dayths[i].textContent === "09:00" ||
        Dayths[i].textContent === "09:30" ||
        Dayths[i].textContent === "10:00" ||
        Dayths[i].textContent === "11:00" ||
        Dayths[i].textContent === "11:30"
      ) {
        DaythsStatus[i].className = "day-available";
        DaythsStatus[i].textContent = "Disponível";
      } else {
        DaythsStatus[i].className = "day-non-available";
        DaythsStatus[i].innerHTML = "Indisponível";
      }
    } else if (date === "01") {
      DaythsStatus[i].className = "day-holiday";
      DaythsStatus[i].textContent = "Feriado";
    } else {
      DaythsStatus[i].className = "day-non-available";
      DaythsStatus[i].innerHTML = "Indisponível";
    }
  }
}

// OPEN & CLOSE SIDE MENU WITH DAY AGENDA
table.addEventListener("click", (e) => {
  mainTable.style.transform = "translateX(-27%)";
  modalStat = 1;
  const th = e.target.closest("th");
  openDayAgenda(th.querySelector("span").innerHTML);
});

// CLOSE
document.addEventListener("click", (e) => {
  if (
    !mainTable.contains(event.target) &&
    !header.contains(event.target) &&
    modalStat === 1
  ) {
    mainTable.style.transform = "translateX(0%)";
    modalStat = 0;

    closeDayAgenda();
  }
});
