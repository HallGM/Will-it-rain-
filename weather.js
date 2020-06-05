class Weather {
  constructor(city) {
    this.apiKey = "b960b8855735efec164683ab6d8b305d";
    this.city = city;
  }

  async getWeather() {
    try {
      // fetch the longitude and latitude from city
      const response1 = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&APPID=${this.apiKey}`
      );
      const data1 = await response1.json();
      let longitude = data1.coord.lon;
      let latitude = data1.coord.lat;

      // fetch weather information using longitude and latitude
      const response2 = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${this.apiKey}
    `);
      const data2 = await response2.json();

      //persist to local storage
      storage.store(this.city);

      //tell app there is no error
      isThereAnError = false;

      //return the created rainfall object
      return data2;
    } catch (err) {
      //put error message in the UI
      ui.error();

      //tell app.js there is an error
      isThereAnError = true;
      return "error";
    }
  }
}
