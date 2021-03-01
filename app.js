//get city
const city = storage.city;

let isThereAnError = false;
let isLoading = true;

//Create new Weather Object
let weather = new Weather(city);
const ui = new UI();

//get weather on Page Load
getWeather();

// get the date/time
const dateToday = (function () {
  const today = new Date();

  const date = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = days[today.getDay()];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = months[month];

  const tomorrow = days[(today.getDay() + 1) % 7];
  const dayAfter = days[(today.getDay() + 2) % 7];

  let ordinalIndicator;
  if (date % 10 === 1) {
    ordinalIndicator = "st";
  } else if (date % 10 === 2) {
    ordinalIndicator = "nd";
  } else if (date % 10 === 3) {
    ordinalIndicator = "rd";
  } else {
    ordinalIndicator = "th";
  }
  const fullDate = `${dayName} ${date}${ordinalIndicator} of ${monthName}, ${year}`;

  return { date, month, year, dayName, tomorrow, dayAfter, fullDate };
})();

// fetch weather information from weather API
function getWeather() {
  ui.loading();

  weather
    .getWeather()
    .then((rainData) => {
      ui.stopLoading();
      document.getElementById("city-display").style.display = "block";

      //extract the useful information from the rain data
      const usefulData = consolidateRainData(rainData);

      //loop through each object in array
      usefulData.forEach((dataObject) => {
        // assign the day for each object in array
        if (dataObject.dayName === dateToday.dayName) {
          dataObject.day = "Today";
        } else if (dataObject.dayName === dateToday.tomorrow) {
          dataObject.day = "Tomorrow";
        } else {
          dataObject.day = dataObject.dayName;
        }
        delete dataObject.dayName;

        // assign the rainfall amount for each object in array
        if (dataObject.rainfall === 0) {
          dataObject.rainState = "No Rain";
          dataObject.colour = "#f9f9f9";
        } else if (dataObject.rainfall < 0.5) {
          dataObject.rainState = "Drizzle";
          dataObject.colour = "#90E0EF";
        } else if (dataObject.rainfall < 4) {
          dataObject.rainState = "Moderate Rain";
          dataObject.colour = "#00B4D8";
        } else {
          dataObject.rainState = "Heavy Rain";
          dataObject.colour = "#0077B6";
        }
      });

      isLoading = false;
      //paint to the UI
      ui.paint(usefulData, dateToday, weather.displayCity);

      changeCityForm.style.display = "none";
      changeButton.innerText = "Change";
    })
    .catch((err) => console.log(err));
}

//listen for change button
const changeButton = document.getElementById("change-city-button");
changeButton.addEventListener("click", () => {
  if (changeCityForm.style.display === "none") {
    changeCityForm.style.display = "block";
    changeButton.innerText = "Back";
    ui.removeError();
  } else {
    changeCityForm.style.display = "none";
    changeButton.innerText = "Change";

    //if there is an error message, remove it
    ui.removeError();
  }
});

// listen out for submit form
const changeCityForm = document.getElementById("change-city-form");
changeCityForm.style.display = "none";
changeCityForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const changeCityInput = document.getElementById("city-input");
  // if input has something in it
  if (changeCityInput.value !== "") {
    //immediate UI changes
    changeCityForm.style.display = "none";
    changeButton.innerText = "Change";
    document.getElementById(
      "city"
    ).innerHTML = `<strong>City:</strong> ${changeCityInput.value}`;

    //if there is an error message, remove it
    ui.removeError();

    //new weather object with new city
    weather = new Weather(changeCityInput.value);

    //run get weather again with new city
    getWeather();
  }
});

//FUNCTION: extracts the useful information from rain data
function consolidateRainData(rainData) {
  //extract hourly data
  const hourlyData = rainData.hourly;

  //create the array that is to be returned
  let myHourlyData = [];

  // for every element in hourlydata array
  for (let i = 0; i < hourlyData.length; i++) {
    let myNewObject = { rainfall: 0 };

    //set the rainfall property if it exists
    if (hourlyData[i].rain) {
      myNewObject.rainfall = hourlyData[i].rain["1h"];
    }

    // call function to get hours and day from timestamp
    let hoursAndDay = getHoursAndDay(hourlyData[i].dt);

    //assign the hours and day to myNewObject
    Object.assign(myNewObject, hoursAndDay);
    myHourlyData.push(myNewObject);
  }
  return myHourlyData;
}

// FUNCTION to get the hours and day
function getHoursAndDay(timestamp) {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  let date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  let hours = date.getHours();

  //convert to 12-hour clock
  let time;
  if (hours === 0) {
    time = "12:00am";
  } else if (hours === 12) {
    time = "12:00pm";
  } else if (hours > 12) {
    hours -= 12;
    time = `${hours}:00pm`;
  } else {
    time = `${hours}:00am`;
  }

  //get days of the week
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = days[date.getDay()];

  return { time, dayName };
}
