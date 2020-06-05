class Storage {
  constructor() {
    //Get Local Storage
    let getCity = localStorage.getItem("city");
    if (getCity) {
      this.city = getCity;
    } else {
      this.city = "Edinburgh";
    }
  }

  store(city) {
    localStorage.setItem("city", city);
  }
}

storage = new Storage();
