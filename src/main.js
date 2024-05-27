// DATA
const BASE_URL = "https://islomapi.uz/api/present/day?region=Samarqand";
const MONTH_URL = "https://islomapi.uz/api/monthly?region=Toshkent&month=4";

// GET HTML ELEMENTS
const elProvinceSelect = document.querySelector(".js-province-select");
const elProvince = document.querySelector(".js-province");
const elNomozVaqtiTimes = document.querySelector(".js-namozvaqti-times");
const elDayRegion = document.querySelector(".js-day-region");
const elRenderList = document.querySelector(".js-nomozvaqti-day");
const elDayTemplate = document.querySelector(".js-day-template").content;
const elSearchForm = document.querySelector(".js-regions-search");
const elSearchTimeSelect = document.querySelector(".js-namozvaqti-select");
const elSearchInp = document.querySelector(".js-regions-search-inp");
const elDayTimeRenderList = document.querySelector(".js-week-render-list");
const elWeekTemplate = document.querySelector(".js-week-template").content;
const elNamozvaqtiAll = document.querySelector(".js-namozvaqti-all");
const elOneDayNamozvaqti = document.querySelector(".js-one-day-namazvoqti");

let regionData = {
  regions: [
    "Оltiariq",
    "Bishkek",
    "O'smat",
    "To'rtko'l",
    "Uzunquduq",
    "Jizzax",
    "Оltinko'l",
    "Chimkent",
    "Rishtоn",
    "Xo'jaоbоd",
    "Do'stlik",
    "Buxoro",
    "Termiz",
    "Dushanbye",
    "Turkmanоbоd",
    "Qоrоvulbоzоr",
    "Оlmaоta",
    "Xоnqa",
    "Tallimarjоn",
    "Uchqo'rg'оn",
    "Uchtepa",
    "Xоnоbоd",
    "Toshkent",
    "G'uzоr",
    "Bekоbоd",
    "Navoiy",
    "Qo'rg'оntepa",
    "Mubоrak",
    "Ashxabоd",
    "Оlоt",
    "Jalоlоbоd",
    "Nurоta",
    "Andijon",
    "Turkistоn",
    "Shumanay",
    "Namangan",
    "Chimbоy",
    "Jоmbоy",
    "Sherоbоd",
    "Mo'ynоq",
    "Bulоqbоshi",
    "Uchquduq",
    "Samarqand",
    "Qiziltepa",
    "Zоmin",
    "Xo'jand",
    "Tоmdi",
    "Yangibоzоr",
    "Jambul",
    "Nukus",
    "Chоrtоq",
    "Taxtako'pir",
    "Tоshhоvuz",
    "Xiva",
    "Kоsоnsоy",
    "Kоnimex",
    "Mingbulоq",
    "Paxtaоbоd",
    "Denоv",
    "O'g'iz",
    "Qo'ng'irоt",
    "Chust",
    "Kattaqo'rg'оn",
    "Farg'оna",
    "Qоrako'l",
    "Arnasоy",
    "Osh",
    "Sayram",
    "Angren",
    "Pоp",
    "G'allaоrоl",
    "Urgut",
    "Shahrixоn",
    "Guliston",
    "Qumqo'rg'оn",
    "Bоysun",
    "Urganch",
    "Qo'qon",
    "Gazli",
    "Xazоrasp",
    "Marg'ilon",
    "Shоvоt",
    "Kоnibоdоm",
    "Quva",
    "Burchmulla",
    "Dehqоnоbоd",
    "Zarafshоn",
    "Qarshi",
    "Kоsоn",
  ],
};

const namozvaqti = {
  tong_saharlik: "Bomdod",
  quyosh: "Quyosh",
  peshin: "Peshin",
  asr: "Asr",
  shom_iftor: "Shom",
  hufton: "Xufton",
};

// Clicked
document.addEventListener("DOMContentLoaded", () => {
  populateRegions(regionData);
  getData(BASE_URL);
  elSearchForm.addEventListener("submit", handleSearch);
  elProvinceSelect.addEventListener("change", handleProvinceChange);
});

// Functions
function populateRegions(data) {
  const regionFragment = document.createDocumentFragment();
  data.regions.forEach((region) => {
    const option = document.createElement("option");
    option.value = option.textContent = region;
    regionFragment.appendChild(option);
  });
  elProvinceSelect.appendChild(regionFragment);
}

function handleSearch(evt) {
  evt.preventDefault();
  const searchValue = elSearchInp.value.trim();
  const selectValue = elSearchTimeSelect.value.trim();
  if (selectValue == "week") {
    const searchURL = `https://islomapi.uz/api/present/${selectValue}?region=${searchValue}`;
    console.log(searchURL);
    elNamozvaqtiAll.style.display = "block";
    elOneDayNamozvaqti.style.display = "none";
    getWeekData(searchURL);
  } else if (selectValue == "month") {
    const searchURL = `https://islomapi.uz/api/monthly?region=${searchValue}&month=4`;
    getWeekData(searchURL);
  } else if (selectValue == "day") {
    const searchURL = `https://islomapi.uz/api/present/day?region=${searchValue}`;
    elNamozvaqtiAll.style.display = "none";
    elOneDayNamozvaqti.style.display = "block";
    getData(searchURL);
  }
  elDayRegion.textContent = `${searchValue} viloyati`;
  elProvince.textContent = `${searchValue} viloyati`;
}

function handleProvinceChange(evt) {
  evt.preventDefault();
  const provinceValue = elProvinceSelect.value.trim();
  const formattedProvince = provinceValue;
  elDayRegion.textContent = `${provinceValue} viloyati`;
  elProvince.textContent = `${formattedProvince} viloyati`;
  const resURL = `https://islomapi.uz/api/present/day?region=${provinceValue}`;
  getData(resURL);
}

async function getData(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      renderData(data, elRenderList);
    } else {
      console.error("Error fetching data");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getWeekData(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      renderWeekData(data, elDayTimeRenderList);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function renderData(data, node) {
  node.innerHTML = "";
  const fragment = document.createDocumentFragment();
  for (const [key, value] of Object.entries(data.times)) {
    const templateClone = elDayTemplate.cloneNode(true);
    templateClone.querySelector(".js-data-time-name").textContent =
      namozvaqti[key] || key;
    templateClone.querySelector(".js-data-time").textContent = value;
    fragment.appendChild(templateClone);
  }
  node.appendChild(fragment);
}

function renderWeekData(data, node) {
  node.innerHTML = "";
  const fragment = document.createDocumentFragment();
  data.forEach((item) => {
    let dataItem = item.times;
    const templateClone = elWeekTemplate.cloneNode(true);
    templateClone.querySelector(".js-week-day").textContent = item.weekday;
    templateClone.querySelector(".js-week-time").textContent = parseInt(
      item.date
    );
    templateClone.querySelector(".js-week-bomdod-time").textContent =
      dataItem.tong_saharlik;
    templateClone.querySelector(".js-week-id").textContent = item.day;
    templateClone.querySelector(".js-week-quyosh-time").textContent =
      dataItem.quyosh;
    templateClone.querySelector(".js-week-peshin-time").textContent =
      dataItem.peshin;
    templateClone.querySelector(".js-week-asr-time").textContent = dataItem.asr;
    templateClone.querySelector(".js-week-shom-time").textContent =
      dataItem.shom_iftor;
    templateClone.querySelector(".js-week-xufton-time").textContent =
      dataItem.hufton;

    if (item.weekday === "Juma") {
      templateClone.querySelectorAll("td").forEach((td) => {
        td.style.backgroundColor = "#2F3D50 ";
      });
    }

    fragment.appendChild(templateClone);
  });
  node.appendChild(fragment);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
