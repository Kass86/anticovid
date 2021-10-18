'use strict';

async function main() {
  // fetch data from sever (local)
  async function fetchdata() {
    const res = await fetch('./covid19_data_cleaned.json');
    const data = await res.json();
    return data;
  }

  let data = await fetchdata();
  console.log(data);
  //convert data
  let realData = [];
  let smallData = [];
  let days = Object.keys(data.date).length / 50;
  for (let i = 0; i < Object.keys(data.date).length; i++) {
    smallData.push([
      data.iso_code[i],
      data.location[i],
      data.date[i],
      data.new_cases[i],
      data.new_deaths[i],
      data.total_cases[i],
      data.total_deaths[i],
      data.new_cases_smoothed[i],
      data.new_deaths_smoothed[i],
      data.next_day_predict[i],
    ]);

    if (i !== 0 && (i + 1) % days === 0) {
      realData.push(smallData);
      smallData = [];
    }
  }

  console.log(realData);

  let map;
  let dataChart = [];
  let dataChart2, dataChart3;
  const form = document.querySelector('.form');

  //data for chart using both new case and new death (data,x,y)
  const convertDataForChart = function (data) {
    data.forEach(function (cur) {
      const smallcur = [...cur.slice(2, 3), ...cur.slice(7, 9)];
      dataChart.push(smallcur);
    });
  };

  //data for chart using new case (data,x)
  const convertDataForChart2 = function (data) {
    data.forEach(function (cur) {
      const smallcur2 = [...cur.slice(2, 3), ...cur.slice(7, 8)];
      dataChart2.push(smallcur2);
    });
  };

  //data for chart using new death case (data,y)
  const convertDataForChart3 = function (data) {
    data.forEach(function (cur) {
      const smallcur3 = [...cur.slice(2, 3), ...cur.slice(8, 9)];
      dataChart3.push(smallcur3);
    });
  };

  const chart = function (dataChart) {
    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(drawCurveTypes);

    function drawCurveTypes() {
      var data = new google.visualization.DataTable();

      data.addColumn('string', 'days');
      data.addColumn('number', 'New');
      data.addColumn('number', 'Death');

      data.addRows(dataChart);

      var options = {
        hAxis: {
          title: 'Time',
        },
        vAxis: {
          title: 'Cases',
        },
      };

      var chart = new google.visualization.LineChart(
        document.getElementById('chart_div')
      );
      chart.draw(data, options);
    }
  };

  // chart using for only new case or death case
  const chartnewcase = function (dataChart, dulieubieudo) {
    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(drawCurveTypes);

    function drawCurveTypes() {
      var data = new google.visualization.DataTable();

      data.addColumn('string', 'days');
      data.addColumn('number', `${dulieubieudo}`);

      data.addRows(dataChart);

      var options = {
        hAxis: {
          title: 'Time',
        },
        vAxis: {
          title: `${dulieubieudo} Cases`,
        },
      };

      var chart = new google.visualization.LineChart(
        document.getElementById('chart_div')
      );
      chart.draw(data, options);
    }
  };

  /////////////////////// Form

  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        const { latitude } = pos.coords;
        const { longitude } = pos.coords;
        const coords = [latitude, longitude];
        // leaflet map
        map = L.map('map').setView(coords, 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        //find coords form click event on map
        map.on('click', function (mapEvent) {
          const { lat, lng } = mapEvent.latlng;

          const whereAmI = function (lat, lng) {
            const data = fetch(
              `http://api.geonames.org/countryCodeJSON?lat=${lat}&lng=${lng}&username=nguyenvuanhtuan`
            )
              .then(response => {
                return response.json();
              })
              .then(data => {
                // call detail countries and chart of that country
                detailCountry(data);
              });
          };

          whereAmI(lat, lng);
        });
      },
      function () {
        alert('Could not get your position');
      }
    );

  const restCountries = function (countryName) {
    console.log(countryName);
    fetch(`https://restcountries.com/v2/name/${countryName}`)
      .then(response => {
        form.innerHTML = '';
        document.querySelector('.toptable').classList.add('hidden');
        document.querySelector('.btn').classList.remove('hidden');

        return response.json();
      })
      .then(data => {
        console.log(data);
        // fix some special data
        let i = 0;
        if (data[1]) {
          i = 1;
        }
        if (data[0].name === 'Iran (Islamic Republic of)') {
          i = 0;
        }
        if (data[0].name === 'Georgia') {
          i = 0;
        }

        if (data[0].name === 'China') {
          i = 0;
        }

        const base = realData.find(index => index[0][0] === data[i].alpha3Code);

        const database = base?.slice().reverse();
        console.log(database);
        let html = `
      <div class="workout__title">${data[i].name}</div>
      <img class="country__img" src="${data[i].flag}" />
      <div class="workout__title">Capital: ${data[i].capital}</div>
      <div class="workout__title">Region: ${data[i].region}</div>
      <div class="workout__title">Population: ${
        data[i].population / 1000000
      }M</div>
      
    </div>`;
        if (base) {
          html += `<div class="workout__title">Total cases: ${database[0][5]} cases</div>
    <div class="workout__title">Total deaths: ${database[0][6]} deaths `;
        } else document.getElementById('chart_div').style.display = 'none';
        form.insertAdjacentHTML('beforeEnd', html);
        form.classList.remove('hidden');
        document.querySelector('.country__img2')?.classList.add('hidden');

        dataChart = [];
        if (database) {
          convertDataForChart(database);
          chart(dataChart.slice().reverse());
          document.getElementById('chart_div').style.display = 'grid';
        }
      });
  };
  const detailCountry = function (data) {
    form.innerHTML = '';
    if (!data.countryName) {
      const html = `<div class="workout__title">Country not found! Please choose another location</div>`;
      form.insertAdjacentHTML('beforeEnd', html);
      document.querySelector('.toptable').classList.add('hidden');
      form.classList.remove('hidden');
      document.querySelector('.country__img2')?.classList.add('hidden');
      document.getElementById('chart_div').style.display = 'none';
      document.querySelector('.btn').classList.remove('hidden');
    } else {
      //restcountries
      if (data.countryName === 'Czechia') {
        restCountries('Czech');
      } //get rid of Czechia data
      else restCountries(data.countryName);
    }
  };

  ////////////////////////// Table
  // create country rows
  const dashboard = document.querySelector('.table');

  const tableData = function (data) {
    dashboard.innerHTML = '';
    data.forEach(function (test, i) {
      test = test.slice().reverse();
      const html = `<div class="table__rows country0${i}">
    <div class="country">${i + 1}. ${test[0][1]} </div>
    <div class="cases">${test[0][5]}</div>
    <div class="deaths">${test[0][6]}</div>
</div>`;
      dashboard.insertAdjacentHTML('beforebegin', html);
    });
  };
  tableData(realData);

  // create detail for country row when user click on it
  let position, previousPositon, el, preEl;
  const hidedata = function (element) {
    document.querySelector(`.${element} div.cases`).classList.remove('hidden');
    document.querySelector(`.${element} div.deaths`).classList.remove('hidden');
  };
  const andulieu = function (element) {
    document.querySelector(`.${element} div.cases`).classList.add('hidden');
    document.querySelector(`.${element} div.deaths`).classList.add('hidden');
  };

  const detailTableData = function () {
    document.querySelector('.toptable').addEventListener('click', function (e) {
      if (e.target.closest('.table__rows')) {
        el = e.target.closest('.table__rows').classList.value.replace(' ', '.');
        position = +el.slice(-2);

        // nice remove element by classname
        document.querySelectorAll('.table__rows2').forEach(function (a) {
          a.remove();
        });

        let html2 = ``;
        //reverse data for day
        const dataForTable = realData[position].slice().reverse();
        console.log(dataForTable);
        html2 += `
        <div class="table__rows2">
      <div class="country1"> Time </div>
      <div class="cases1"> New Cases</div>
      <div class="deaths1"> New Deaths </div>
      </div>
        <div class="table__rows2 ${
          dataForTable[0][9] >= dataForTable[0][3] ? 'predictup' : 'predictdown'
        }">
      <div class="day"> Next day (Predict) </div>
      <div class="cases"> ${dataForTable[0][9]}</div>
      <div class="deaths">0</div>
      </div>`;

        for (let o = 0; o < 7; o++) {
          html2 += `<div class="table__rows2">
        <div class="day"> ${dataForTable[o][2]} </div>
        <div class="cases"> ${dataForTable[o][3]}</div>
        <div class="deaths">${dataForTable[o][4]}</div>
        </div>`;
        }
        document.querySelector(`.${el}`).insertAdjacentHTML('afterend', html2);

        // hide 2 information of country row user chose then display it when user click on it or another country row (just to make effect) but a little complicate
        andulieu(el);
        if (preEl) {
          hidedata(preEl);
          if (preEl === el) el = null;
        }
        preEl = el;

        // remove detail of country row user chose when user click on it or another country row
        if (previousPositon == position) {
          document.querySelectorAll('.table__rows2').forEach(function (a) {
            a.remove();
            previousPositon = -1;
          });
        } else {
          previousPositon = position;
        }
        document.getElementById('chart_div').style.display = 'grid';

        let html3;
        const chartAndFlag = function (positionOfData) {
          fetch(
            `https://restcountries.com/v2/name/${realData[positionOfData][0][1]}`
          )
            .then(response => {
              return response.json();
            })
            .then(data => {
              //fix the special data
              let i = 0;
              if (data[1]) {
                i = 1;
              }
              if (data[0].name === 'China') {
                i = 0;
              }
              if (data[0].name === 'Georgia') {
                i = 0;
              }
              if (data[0].name === 'Iran (Islamic Republic of)') {
                i = 0;
              }

              document.querySelector('.country__img2')?.remove();
              //create mini flag
              html3 = `<img class="country__img2" src="${data[i].flag}" />`;
              document
                .querySelector(`.flag`)
                .insertAdjacentHTML('beforeend', html3);
              /// moving to that country location
              const [lat2, lng2] = data[i].latlng;
              const coords2 = [lat2, lng2];

              map.setView(coords2, 4);
              // delete the mark when user click another countryrow
              document
                .querySelectorAll(
                  '.leaflet-marker-shadow.leaflet-zoom-animated'
                )
                .forEach(function (a) {
                  a.remove();
                });

              document
                .querySelectorAll(
                  '.leaflet-marker-icon.leaflet-zoom-animated.leaflet-interactive'
                )
                .forEach(function (a) {
                  a.remove();
                });

              // create mark when user click on the countryrow
              L.marker([lat2, lng2]).addTo(map);
            });
        };
        chartAndFlag(position);

        // chart new case
        dataChart2 = [];
        convertDataForChart2(realData[position]);

        chartnewcase(dataChart2, 'New');
      }
    });
  };
  detailTableData();

  // DOM: click on reverse button to display Table
  document.querySelector('.btn').addEventListener('click', function () {
    document.querySelector('.toptable').classList.remove('hidden');
    document.querySelector('.country__img2')?.classList.remove('hidden');
    form.classList.add('hidden');

    if (!dataChart2)
      document.getElementById('chart_div').style.display = 'none';
    else {
      chartnewcase(dataChart2, 'New');
      document.getElementById('chart_div').style.display = 'grid';
    }
    document.querySelector('.btn').classList.add('hidden');
  });

  // DOM: click on mini flag to swap New case Chart and New death case Chart
  let d = 0;
  document.querySelector('.flag').addEventListener('click', function (e) {
    if (e.target.closest('.country__img2')) {
      if (d === 0) {
        dataChart3 = [];
        convertDataForChart3(realData[position]);
        console.log(position);
        chartnewcase(dataChart3, 'Death');
        d = 1;
      } else {
        chartnewcase(dataChart2, 'New');
        d = 0;
      }
    }
  });

  ///////////////////////////////////////
}
main();
