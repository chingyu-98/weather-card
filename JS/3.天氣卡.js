const regionAll = [
  ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'], 
  ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣'], // 北部
  ['臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣'], // 中部
  ['臺南市', '高雄市', '屏東縣'], // 南部
  ['宜蘭縣', '花蓮縣', '臺東縣'], // 東部
  ['澎湖縣', '金門縣', '連江縣'] // 離島
];

const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-978B0845-38F8-4239-9F70-3FF00B31AD9A';

const btnAll = document.querySelectorAll('.btn');
const cardRegion = document.querySelector('.card-region');
const timeRange = document.querySelector('.time-range');

let originalData;
let orgData = {};
let region = regionAll[0]; // 預設為全部
let content = '';

fetchData();

// 綁定按鈕事件
btnAll.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    region = regionAll[index];
    arrangeCities();
  });
});

function fetchData() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      originalData = data;
      organizeData();
      arrangeCities();
    });
}

function organizeData() {
  const locationAll = originalData.records.location;
  locationAll.forEach(location => {
    const locationName = location.locationName;
    const wEl0T0 = location.weatherElement[0].time[0];

    let wxImgCode = wEl0T0.parameter.parameterValue;
    if (Number(wxImgCode) < 10) wxImgCode = `0${wxImgCode}`;

    orgData[locationName] = {
      startTime: wEl0T0.startTime,
      endTime: wEl0T0.endTime,
      Wx: wEl0T0.parameter.parameterName,
      WxCode: wxImgCode,
      maxT: location.weatherElement[4].time[0].parameter.parameterName,
      minT: location.weatherElement[2].time[0].parameter.parameterName,
    };
  });
}

function arrangeCities() {
  content = '';
  let timeDisplayed = false;

  region.forEach(city => {
    const cityData = orgData[city];
    if (cityData) {
      if (!timeDisplayed) {
        timeRange.innerHTML = `
          <p>資料時間：${cityData.startTime.replaceAll('-', '/')} ~ ${cityData.endTime.replaceAll('-', '/')}</p>
        `;
        timeDisplayed = true;
      }
      plusCard(city, cityData);
    }
  });

  cardRegion.innerHTML = content;
}

function plusCard(city, cityData) {
  content += `
  <div class="card">
      <h3>${city}</h3>
      <p>天氣：${cityData.Wx}</p>
      <p>溫度：${cityData.minT}°C ~ ${cityData.maxT}°C</p>
      <div class="icon">
        <img src="https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/${cityData.WxCode}.svg" alt="${cityData.Wx}" title="${cityData.Wx}">
      </div>
    </div>
  `;
}