const todayList = document.getElementById("w-rain-today");
const tomorrowList = document.getElementById("w-rain-tomorrow");
const thirdDayList = document.getElementById("w-rain-day-after");
const thirdDayTitle = document.getElementById("w-day-after");
const cityElement = document.getElementById("city");
const dateElement = document.getElementById("date");

// loading
const loadingElement = document.getElementById("loading");
const hideOnLoadingElement = document.getElementById("hide-on-loading");

class UI {
  paint(rainData, date, city) {
    //display third Day
    thirdDayTitle.textContent = date.dayAfter;

    //display city
    cityElement.innerHTML = `<strong>City:</strong> ${city}`;

    //display today's date
    dateElement.textContent = date.fullDate;

    //wipe current lists
    todayList.innerHTML = "";
    tomorrowList.innerHTML = "";
    thirdDayList.innerHTML = "";

    //create list elements for every hour
    rainData.forEach((object) => {
      let element = document.createElement("div");
      element.className = "list-object";
      element.style.backgroundColor = object.colour;

      element.innerHTML = `<div><b>${object.time}</b>:</div> <div>${object.rainState}</div> <div>(${object.rainfall}mm)</div>`;
      if (object.day === "Today") {
        todayList.appendChild(element);
      } else if (object.day === "Tomorrow") {
        tomorrowList.appendChild(element);
      } else {
        thirdDayList.appendChild(element);
      }
    });

    //remove th error message if there is one
    this.removeError();
  }
  error() {
    //only run if there is not already an error message
    if (!document.querySelector(".error")) {
      //create error message
      let errorMessage = document.createElement("div");
      errorMessage.innerText = "Sorry, that didn't work";
      errorMessage.className = "error";

      const form = document.getElementById("change-city-form");
      form.after(errorMessage);
    }
  }

  removeError() {
    //remove error message if you find one
    const errorMessage = document.querySelector(".error");
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  loading() {
    loadingElement.style.display = "";
    hideOnLoadingElement.style.display = "none";
  }

  stopLoading() {
    loadingElement.style.display = "none";
    hideOnLoadingElement.style.display = "";
  }

  cityFullName() {}
}
