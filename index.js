let greeting = document.querySelector(".greeting");
let name = document.querySelector(".name");
let period = document.querySelector(".period");
let mainContent = document.querySelector(".main-content");
let settingsIcon = document.querySelector(".sett_icon");
let tab = document.querySelector(".settings-tab");
let reload_img = document.querySelector(".reload_img");
let twit = document.querySelector(".twit");
let search = document.getElementById("google_search");
let settings_btn = document.querySelector(".settings_btns");
let todo_list = document.querySelector(".todo_list");
let todo_input = document.querySelector(".todo_input");
let links = document.getElementsByClassName("switch");
let todo_btn = document.querySelector(".todo_btn");
let todo_tab = document.querySelector(".todo-tab");
let weather_small = document.querySelector(".weather_small");
let weather_tab = document.querySelector(".weather_tab");
let geo = document.querySelectorAll(".geolocation");
let temp = document.querySelectorAll(".temperature");
let condition = document.querySelector(".condition");
let days = document.querySelectorAll(".day");
let add_geo = document.querySelector(".add_geo");
let choose_category = document.getElementById('choose_category');
let category = document.querySelector('.right_category');

let periodTime = new Date();
let periodHours = periodTime.getHours();

setCurrentTime();
getQuote();
getWeather();
setInterval(setCurrentTime, 10000);
setInterval(getWeather, 1200000);

let username = getCookie("username");

if (username) {

  name.innerHTML = username;
  period.innerHTML = getPeriod(periodHours);
  category.innerHTML = getCookie('img_category') || 'Wallpaper';

  if (getCookie("img_url")) {
    setPhoto();
  } else {
    getPhoto();
  }
  setSettingsBtn();
  show();
} else {
  mainContent.style.display = "none";
  newUser();
}


// Todo

todo_btn.addEventListener("click", function () {
  todo_tab.classList.toggle("show2");
});

todo_list.addEventListener("click", function (e) {
  if (e.target && e.target.matches("li")) {
    e.target.classList.toggle("done");
  }
  if (e.target && e.target.matches("span")) {
    let todos = get_todos();
    todos.splice(e.target.parentNode.id, 1);
    localStorage.setItem("todo", JSON.stringify(todos));
    fadeOut(e.target.parentNode);
  }
});

function show() {
  var todos = get_todos();

  for (var i = 0; i < todos.length; i++) {
    var li = document.createElement("li");
    li.innerHTML = "<li id=" + i + "><span>x</span>" + todos[i] + "</li>";
    todo_list.appendChild(li);
  }
}

function get_todos() {
  let todos = new Array();
  let todos_str = localStorage.getItem("todo");
  if (todos_str !== null) {
    todos = JSON.parse(todos_str);
  }
  return todos;
}

todo_input.addEventListener("keypress", function (e) {
  let key = "which" in e ? e.which : e.keyCode;
  let nameValue = this.value;

  if (key === 13) {
    var li = document.createElement("li");
    li.innerHTML =
      "<li data-todo=" +
      nameValue +
      "><span>&times;</span>" +
      nameValue +
      "</li>";
    todo_list.appendChild(li);
    let todos = get_todos();
    todos.push(nameValue);
    localStorage.setItem("todo", JSON.stringify(todos));

    todo_input.value = "";
  }
});

//settings

settingsIcon.addEventListener("click", function () {
  tab.classList.toggle("show");
});

settings_btn.addEventListener("click", function (e) {
  if (e.target && e.target.matches("li>input")) {
    setCookie(e.target.dataset.id, e.target.checked, 365);

    if (!e.target.checked) {
      document.querySelector("." + e.target.dataset.id + "").style.display =
        "none";
    } else {
      document.querySelector("." + e.target.dataset.id + "").style.display =
        "block";
    }
  }
});

choose_category.addEventListener("keypress", function (e) {
  let key = "which" in e ? e.which : e.keyCode;
  let nameValue = this.value;
  nameValue = capitalizeFirstLetter(nameValue);

  if (key === 13) {
    setCookie("img_category", nameValue, 365);
    category.innerHTML = nameValue;
    getPhoto();
  }
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function setSettingsBtn() {
  for (let i = 0; i < links.length; i++) {
    link = links[i];
    if (getCookie(link.dataset.id)) {
      document.querySelector(
        `[data-id=${link.dataset.id}]`
      ).checked = JSON.parse(getCookie(link.dataset.id));
      if (!JSON.parse(getCookie(link.dataset.id))) {
        document.querySelector("." + link.dataset.id + "").style.display =
          "none";
      }
    }
  }
}

//set period
function getPeriod(hours) {
  let periodNow = "";
  if (hours >= 5 && hours < 12) {
    periodNow = "morning";
  } else if (hours >= 12 && hours < 17) {
    periodNow = "afternoon";
  } else if (hours >= 17 && hours < 24) {
    periodNow = "evening";
  } else {
    periodNow = "night";
  }
  return periodNow;
}

//set time

function setCurrentTime() {
  let time = new Date();
  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  document.querySelector(".time").innerHTML = time.getHours() + ":" + minutes;
}

//on window click btns (close tabs if click to window)

window.onclick = function (event) {
  if (
    !(
      document.querySelector(".sett_icon").contains(event.target) ||
      tab.contains(event.target)
    )
  ) {
    if (tab.classList.contains("show")) {
      tab.classList.remove("show");
    }
  }
  if (
    !(
      weather_small.contains(event.target) || weather_tab.contains(event.target)
    )
  ) {
    if (weather_tab.classList.contains("show2")) {
      weather_tab.classList.remove("show2");
    }
  }
};

//quote

function getQuote() {
  let textQoute = document.querySelector(".text");
  let authorQuote = document.querySelector(".author");
  fetch("http://quotes.rest/qod.json")
    .then(response => response.json())
    .then(data => {
      let quote = data.contents.quotes[0].quote;
      let author = data.contents.quotes[0].author;
      let tweet =
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(quote + " " + author + " #nevenApp");

      textQoute.innerHTML = `“${quote}”`;
      authorQuote.innerHTML = author;
      twit.href = tweet;
    })
    .catch((err) => console.log(err));
}

//photo

reload_img.addEventListener("click", getPhoto);

function setPhoto() {
  let url = getCookie("img_url");
  let author = getCookie("img_author");
  let location = getCookie("img_location");
  let link = getCookie("img_link");

  document.body.style.backgroundImage = `url(${url})`;
  document.querySelector(
    ".author_from_api"
  ).innerHTML = `Photo by ${author} / Unsplash`;
  document.querySelector(".author_from_api").href = link;
  document.querySelector(".location").innerHTML = location;
}

function getPhoto() {
  let location = document.querySelector(".location");
  let author = document.querySelector(".author_from_api");
  let api_key =
    "9e7b09df6e5e6f108de5dd6dda12e83bcd8ffb17d48edc7dbf054cad06a1679d";
  let category = getCookie("img_category") || 'wallpaper';
  fetch(
      `https://api.unsplash.com/photos/random/?query=${category}&per_page=1&orientation=landscape&client_id=${api_key}`
    )
    .then(resp => resp.json())
    .then(data => {
      let image_url = data.urls.full;
      if (!('location' in data)) {
        image_location = "Unknown location";
      } else {
        image_location = data.location.title;
      }
      let image_author = data.user.name;
      let link_to_img = data.links.html;

      document.body.style.backgroundImage = `url(${image_url})`;
      location.innerHTML = image_location;
      author.innerHTML = `Photo by ${image_author} / Unsplash`;
      author.href = link_to_img;

      setCookie("img_author", image_author, 0.125);
      setCookie("img_location", image_location, 0.125);
      setCookie("img_url", image_url, 0.125);
      setCookie("img_link", link_to_img, 0.125);
    })
    .catch((err) => console.log(err));
}

//weather

weather_small.addEventListener("click", function () {
  weather_tab.classList.toggle("show2");
});

function getWeather() {
  let city = getCookie("geo") || "Saint-petersburg";
  let searchtext = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${city}") and u='c'`;

  fetch(`https://query.yahooapis.com/v1/public/yql?q=${searchtext}&format=json`)
    .then(data => data.json())
    .then(data => {
      let city = data.query.results.channel.location.city;
      let degr = `<i class='wi wi-yahoo-${
        data.query.results.channel.item.condition.code
        }'></i> ${data.query.results.channel.item.condition.temp}&deg;`;
      let cond = data.query.results.channel.item.condition.text;

      geo[0].innerHTML = city;
      geo[1].innerHTML = city;
      temp[0].innerHTML = degr;
      temp[0].setAttribute("title", cond);
      temp[1].innerHTML = degr;
      temp[1].setAttribute("title", cond);
      condition.innerHTML = cond;

      for (let i = 0; i < days.length; i++) {
        let day = days[i];
        day.setAttribute(
          "title",
          data.query.results.channel.item.forecast[i].text
        );
        day.querySelector(".day_of_week").innerHTML =
          data.query.results.channel.item.forecast[i].day;
        day.querySelector(".day_temp").innerHTML = `<i class='wi wi-yahoo-${
          data.query.results.channel.item.forecast[i].code
          }'></i> ${data.query.results.channel.item.forecast[i].high}&deg;`;
        day.querySelector(".night_temp").innerHTML =
          data.query.results.channel.item.forecast[i].low + "&deg;";
      }
    });
}

add_geo.addEventListener("click", function () {
  document.querySelector(".add>.geolocation").innerHTML =
    '<input type="text" class="enter_geo">';
  document
    .querySelector(".enter_geo")
    .addEventListener("keypress", function (e) {
      let key = "which" in e ? e.which : e.keyCode;
      let nameValue = this.value;

      if (key === 13) {
        setCookie("geo", nameValue, 365);
        getWeather();
      }
    });
});

activateDay = function () {
  [].map.call(days, function (elem) {
    elem.classList.remove("active");
  });

  this.classList.add("active");
  let temp = document.querySelector(".weather_tab>.temperature");
  let weekDay = document.querySelector(".weekDay");

  condition.innerHTML = this.title;
  temp.innerHTML = `${
    this.querySelector(".day_temp").innerHTML
    }<span class='low_temp'>${
    this.querySelector(".night_temp").innerHTML
    }</span>`;
  temp.setAttribute("title", this.title);
  weekDay.innerHTML = this.querySelector(".day_of_week").innerHTML;
  weekDay.style.display = "block";
};

[].map.call(days, function (elem) {
  elem.addEventListener("click", activateDay, false);
});

//new user

function newUser() {
  let h1 = document.createElement("h1");
  let parentDiv = document.createElement("div");
  let input = document.createElement("input");
  let parent = document.querySelector(".overlay");

  parentDiv.appendChild(h1);
  parentDiv.appendChild(input);

  document.body.style.backgroundImage = 'url(./img/iceland.jpg)';
  parentDiv.className = "whatName";
  parentDiv.style.position = "absolute";
  h1.innerHTML = "What is your name?";
  input.type = "text";
  input.className = "enter_user-name";

  parent.insertBefore(parentDiv, document.querySelector(".main-content"));

  input.addEventListener("keypress", getUserName);
}

function getUserName(e) {
  let key = "which" in e ? e.which : e.keyCode;
  let nameValue = this.value;

  if (key === 13 && nameValue.length < 25 && nameValue.length > 0) {
    setCookie("username", nameValue, 365);
    name.innerHTML = nameValue;
    fadeIn(mainContent, "flex");
    period.innerHTML = getPeriod(periodHours);
    fadeOut(document.querySelector(".whatName"));
    window.location.reload(true);
  }
}

//search

search.addEventListener("keypress", function (e) {
  let key = "which" in e ? e.which : e.keyCode;
  let searchValue = this.value;

  if (key === 13) {
    console.log(this.value);
    let val_of_search =
      "https://www.google.com/search?q=" + encodeURIComponent(searchValue);
    window.location = val_of_search;
  }
});

//change name

name.addEventListener("dblclick", function () {
  if (!document.querySelector(".change_name")) {
    let input = document.createElement("input");
    input.type = "text";
    input.className = "change_name";
    greeting.parentNode.insertBefore(input, greeting.nextSibling);

    input.addEventListener("keypress", function (e) {
      ifFunc(e);
      setCookie("username", nameValue, 365);
      name.innerHTML = nameValue;
      fadeOut(input);

    });
  }
});

// cookie

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//animation (fade)

function fadeOut(el) {
  el.style.opacity = 1;

  (function fade() {
    let timer = setInterval(function () {
      if ((el.style.opacity -= 0.1) < 0) {
        el.style.display = "none";
        clearInterval(timer);
      } else {
        requestAnimationFrame(fade);
      }
    }, 70);
  })();
}

function fadeIn(el, display) {
  el.style.opacity = 0;
  el.style.display = display || "block";

  (function fade() {
    let timer = setInterval(function () {
      var val = parseFloat(el.style.opacity);
      if (!((val += 0.1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    }, 70);
    if (el.style.opacity === 1) {
      clearInterval(timer);
    }
  })();
}