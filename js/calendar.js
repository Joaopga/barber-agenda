const  header = document.querySelector('.header')
const mainTable = document.querySelector(".main-c-content");
const table = document.querySelector(".calendar-table");
const ths = document.querySelectorAll("th");
const dayAgenda = document.querySelector(".day-agenda")
let modalStat;

function openDayAgenda(date) {
    dayAgenda.classList.remove('hidden')

    setTimeout(()=> {
      dayAgenda.style.transform = "translateX(0%)"
    }, 1)
    console.log(date)
}

function closeDayAgenda() {
  dayAgenda.style.transform = "translateX(100%)"
  setTimeout(() => {
    dayAgenda.classList.add('hidden')
}, 300)
    
}

// OPEN & CLOSE SIDE MENU WITH DAY AGENDA
table.addEventListener("click", (e) => {
  mainTable.style.transform = "translateX(-25%)";
  modalStat = 1;
  const th = e.target.closest('th')
  openDayAgenda(th.querySelector("span").innerHTML);
});

// CLOSE
document.addEventListener("click", (e) => {
  if (!mainTable.contains(event.target) &&
        !header.contains(event.target) &&
          modalStat === 1) {
    mainTable.style.transform = "translateX(0%)";
    modalStat = 0;

    closeDayAgenda()
  }
});
