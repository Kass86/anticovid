'use strict';

// prettier-ignore

let dataChart = [];
let dataChart2;
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const data1 = [
  ['VN', 12000, 400],
  ['My', 100000, 5000],
  ['Uc', 20000, 1500],
  ['Y', 15000, 600],
];
const data2 = [
  ['Vietnam', [12000, 13000], [400, 500]],
  ['United States of America', [100000, 110000], [5000, 6000]],
  ['Australia', [20000, 19000], [1500, 1600]],
  ['Italy', [15000, 16000], [600, 500]],
];
const data3 = [
  [
    'Vietnam',
    [12000, 11000, 14000, 15000],
    [400, 350, 600, 700],
    ['4/1', '3/1', '2/1', '1/1'],
  ],
  [
    'United States of America',
    [100000, 110000, 70000, 80000],
    [5000, 6000, 5000, 7000],
    ['4/1', '3/1', '2/1', '1/1'],
  ],
  [
    'Australia',
    [20000, 19000, 15000, 16000],
    [1500, 1600, 2000, 3000],
    ['4/1', '3/1', '2/1', '1/1'],
  ],
  [
    'Italy',
    [15000, 16000, 10000, 7000],
    [600, 500, 700, 450],
    ['4/1', '3/1', '2/1', '1/1'],
  ],
  [
    'Vietnam',
    [12000, 11000, 14000, 15000],
    [400, 350, 600, 700],
    ['4/1', '3/1', '2/1', '1/1'],
  ],
  [
    'United States of America',
    [100000, 110000, 70000, 80000],
    [5000, 6000, 5000, 7000],
    ['4/1', '3/1', '2/1', '1/1'],
  ],
  [
    'Australia',
    [20000, 19000, 15000, 16000],
    [1500, 1600, 2000, 3000],
    ['4/1', '3/1', '2/1', '1/1'],
  ],
  [
    'Italy',
    [15000, 16000, 10000, 7000],
    [600, 500, 700, 450],
    ['4/1', '3/1', '2/1', '1/1'],
  ],
  [
    'Vietnam',
    [12000, 11000, 14000, 15000],
    [400, 350, 600, 700],
    ['4/1', '3/1', '2/1', '1/1'],
  ],
  [
    'United States of America',
    [100000, 110000, 70000, 80000],
    [5000, 6000, 5000, 7000],
    ['4/1', '3/1', '2/1', '1/1'],
  ],
  [
    'Australia',
    [20000, 19000, 15000, 16000],
    [1500, 1600, 2000, 3000],
    ['4/1', '3/1', '2/1', '1/1'],
  ],
  [
    'Italy',
    [15000, 16000, 10000, 7000],
    [600, 500, 700, 450],
    ['4/1', '3/1', '2/1', '1/1'],
  ],
];

const convertDataForChart = function (data) {
  const a = data.slice(1);
  const b = a.pop();
  a.unshift(b);
  dataChart = [];
  for (let u = 0; u < a[0].length; u++) {
    dataChart.push(a.map(i => i[u]));
  }
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
        title: 'Case',
      },
    };

    var chart = new google.visualization.LineChart(
      document.getElementById('chart_div')
    );
    chart.draw(data, options);
  }
};

const restCountries = function (countryName) {
  fetch(`https://restcountries.com/v2/name/${countryName}`)
    .then(response => {
      form.innerHTML = '';
      document.querySelector('.toptable').classList.add('hidden');
      document.querySelector('.btn').classList.remove('hidden');

      return response.json();
    })
    .then(data => {
      console.log(data);
      //fix the special data
      let i = 0;
      if (data[1]) {
        i = 1;
      }
      if (data[0].name === 'China') {
        i = 0;
      }

      const base = data3.find(index => index[0] === data[i].name);
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
        html += `<div class="workout__title">New cases: ${base[1][0]} (${
          base[1][0] - base[1][1] > 0 ? '+' : ''
        }${Number(((base[1][0] - base[1][1]) * 100) / base[1][1]).toFixed(
          2
        )}%)</div>
    <div class="workout__title">New deaths: ${base[2][0]} (${Number(
          ((base[2][0] - base[2][1]) * 100) / base[2][1]
        ).toFixed(2)}%)</div>`;
      } else document.getElementById('chart_div').style.display = 'none';
      form.insertAdjacentHTML('beforeEnd', html);
      form.classList.remove('hidden');

      //convert data3 for chart

      convertDataForChart(base);

      document.getElementById('chart_div').style.display = 'grid';
      document.querySelector('.country__img2').classList.add('hidden');
      // console.log(dataChart);
      chart(dataChart.reverse());
    });
};
const detailCountry = function (data) {
  form.innerHTML = '';
  if (!data.countryName) {
    const html = `<div class="workout__title">Country not found! Please choose another location</div>`;
    form.insertAdjacentHTML('beforeEnd', html);
    document.querySelector('.toptable').classList.add('hidden');
    form.classList.remove('hidden');
    document.getElementById('chart_div').style.display = 'none';
    document.querySelector('.btn').classList.remove('hidden');
  } else {
    //restcountries
    restCountries(data.countryName);
  }
};

///////////////////////
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      const { latitude } = pos.coords;
      const { longitude } = pos.coords;
      // console.log(latitude, longitude);
      const coords = [latitude, longitude];
      // leaflet
      const map = L.map('map').setView(coords, 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      //find coords form click event
      // console.log(map);
      map.on('click', function (mapEvent) {
        // console.log(mapEvent);
        const { lat, lng } = mapEvent.latlng;

        const whereAmI = function (lat, lng) {
          const data = fetch(
            `http://api.geonames.org/countryCodeJSON?lat=${lat}&lng=${lng}&username=nguyenvuanhtuan`
          )
            .then(response => {
              return response.json();
            })
            .then(data => {
              // console.log(data);
              // call detail countries for map
              detailCountry(data);
            });
        };

        whereAmI(lat, lng);

        // detail div

        // L.marker([lat, lng])
        //   .addTo(map)
        //   .bindPopup(
        //     L.popup({
        //       maxWidth: 250,
        //       minWidth: 100,
        //       autoClose: false,
        //       closeOnClick: false,
        //       className: 'running-popup',
        //     })
        //   )
        //   .setPopupContent('AAAAAAAAAAAAAA')
        //   .openPopup();
      });
    },
    function () {
      alert('Could not get your position');
    }
  );
///////////////////////////////////////
const dashboard = document.querySelector('.table');

const bangdulieu = function (dulieu) {
  dashboard.innerHTML = '';
  dulieu.forEach(function (test, i) {
    const html = `<div class="table__rows country${i}">
    <div class="nuoc">${i + 1}. ${test[0]} </div>
    <div class="soca">${test[1][0]}</div>
    <div class="nguoichet">${test[2][0]}</div>
</div>`;
    dashboard.insertAdjacentHTML('beforebegin', html);

    // CSS cho bảng dữ liệu 1234....
    // document.querySelector('.toptable').classList.add("hidden");
  });
};
bangdulieu(data3);

// click xuat hien bang du lieu an
let thututruoc, el, preEl;
const boandulieu = function (element) {
  document.querySelector(`.${element} div.soca`).classList.remove('hidden');
  document
    .querySelector(`.${element} div.nguoichet`)
    .classList.remove('hidden');
};
const andulieu = function (element) {
  document.querySelector(`.${element} div.soca`).classList.add('hidden');
  document.querySelector(`.${element} div.nguoichet`).classList.add('hidden');
};

const bangdulieuan = function (data) {
  document.querySelector('.toptable').addEventListener('click', function (e) {
    if (e.target.closest('.table__rows')) {
      el = e.target.closest('.table__rows').classList.value.replace(' ', '.');

      const thutu = el.slice(-1);

      // nice remove element by classname
      document.querySelectorAll('.table__rows2').forEach(function (a) {
        a.remove();
      });

      let html2 = ``;
      convertDataForChart(data[thutu]);
      dataChart2 = dataChart;
      dataChart2.forEach(function (cur, i) {
        html2 += `<div class="table__rows2">
  <div class="ngay"> ${cur[0]} </div>
  <div class="soca"> ${cur[1]}</div>
  <div class="nguoichet">${cur[2]}</div>
</div>`;
      });
      document.querySelector(`.${el}`).insertAdjacentHTML('afterend', html2);

      // an hien so ca moi va so ca tu vong khi click vao tung nuoc
      andulieu(el);
      if (preEl) {
        boandulieu(preEl);
        if (preEl === el) el = null;
      }
      preEl = el;

      if (thututruoc == thutu) {
        document.querySelectorAll('.table__rows2').forEach(function (a) {
          a.remove();
          thututruoc = -1;
        });
      } else {
        thututruoc = thutu;
      }
      document.getElementById('chart_div').style.display = 'grid';

      // console.log(dataChart);

      let html3;
      const flagCountries = function (thutudata) {
        fetch(`https://restcountries.com/v2/name/${data3[thutudata][0]}`)
          .then(response => {
            return response.json();
          })
          .then(data => {
            console.log(data);
            //fix the special data
            let i = 0;
            if (data[1]) {
              i = 1;
            }
            if (data[0].name === 'China') {
              i = 0;
            }
            console.log(data[i].flag);
            // html3 = `<div class="countryflag" src="${data[i].flag}"></div>`;
            document.querySelector('.country__img2')?.remove();
            html3 = `<img class="country__img2" src="${data[i].flag}" />`;
            document
              .querySelector(`.flag`)
              .insertAdjacentHTML('beforeend', html3);
          });
      };

      flagCountries(thutu);
      chart(dataChart2.reverse());
    }
  });
};
bangdulieuan(data3);

document.querySelector('.btn').addEventListener('click', function () {
  document.querySelector('.toptable').classList.remove('hidden');
  document.querySelector('.country__img2').classList.remove('hidden');
  form.classList.add('hidden');
  console.log(dataChart, dataChart2);
  if (!dataChart2) document.getElementById('chart_div').style.display = 'none';
  else {
    chart(dataChart2);
    document.getElementById('chart_div').style.display = 'grid';
  }
  document.querySelector('.btn').classList.add('hidden');
});
