'use strict';

// prettier-ignore

async function main() {
  let data = await fetchdata();
  console.log(data);
  let realData = [];
  let smallData = [];
  let days = Object.keys(data.iso_code).length/50;
  for (let i = 0; i < Object.keys(data.iso_code).length; i++) {
    smallData.push([
      data.iso_code[i],
      data.location[i],
      data.date[i],
      data.new_cases[i],
      data.new_deaths[i],
      data.total_cases[i],
      data.total_deaths[i],
    ]);

    if (i !== 0 && (i + 1) % days === 0) {
      realData.push(smallData); 
      smallData = [];
    }
  }

  console.log(realData);
  
  

let map;
let dataChart = [];
let dataChart2,dataChart3;
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');


// const convertDataForChart = function (data) {
//   for (let u = 0; u < database.length; u++) {
//     data.push(a.map(i => i[u]));
//   }
// };


      const convertDataForChart = function(data){
        data.forEach(function(cur){
          // const smallcur = [...cur]
          // smallcur.shift()
          // smallcur.shift()
          // smallcur.pop()
          // smallcur.pop()
          dataChart.push(cur.slice(2,5));
        })
      }
      const convertDataForChart2 = function(data){
        data.forEach(function(cur){
          dataChart2.push(cur.slice(2,4));
        })
      }
      const convertDataForChart3 = function(data){
        data.forEach(function(cur){
          const smallcur = [...cur.slice(2,3),...cur.slice(4,5)]
          dataChart3.push(smallcur);
        })
      }

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

const chartnewcase = function (dataChart,dulieubieudo) {
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
        title:  `${dulieubieudo} Cases`,
            },
    };

    var chart = new google.visualization.LineChart(
      document.getElementById('chart_div')
    );
    chart.draw(data, options);
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
      map = L.map('map').setView(coords, 5);

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
          console.log(lat,lng);
          const data = fetch(
            `http://api.geonames.org/countryCodeJSON?lat=${lat}&lng=${lng}&username=nguyenvuanhtuan`
          )
            .then(response => {
              return response.json();
            })
            .then(data => {
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

const restCountries = function (countryName) {
  console.log(countryName)
  fetch(`https://restcountries.com/v2/name/${countryName}`)
    .then(response => {
      form.innerHTML = '';
      document.querySelector('.toptable').classList.add('hidden');
      document.querySelector('.btn').classList.remove('hidden');

      return response.json();
    })
    .then(data => {
      console.log(data);
      // fix the special data
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
      // console.log(base) 
      // console.log(database);
      // console.log(realData)
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
    <div class="workout__title">New deaths: ${database[0][6]} deaths `;
      } else document.getElementById('chart_div').style.display = 'none';
      form.insertAdjacentHTML('beforeEnd', html);
      form.classList.remove('hidden');
      document.querySelector('.country__img2')?.classList.add('hidden');
      //convert data3 for chart

      // convertDataForChart(base);
      
      dataChart = [];
      convertDataForChart(database)
      console.log(dataChart)

      document.getElementById('chart_div').style.display = 'grid';
      
      // console.log(dataChart);
      chart(dataChart.slice().reverse());
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
    if (data.countryName === 'Czechia') {restCountries('Czech')}   //get rid of Czechia data
    else restCountries(data.countryName);
  }
};



const dashboard = document.querySelector('.table');

const bangdulieu = function (dulieu) {
  dashboard.innerHTML = '';
  dulieu.forEach(function (test, i) {
    test = test.slice().reverse();
    // const test = tes.slice().reverse();
    const html = `<div class="table__rows country0${i}">
    <div class="nuoc">${i + 1}. ${test[0][1]} </div>
    <div class="soca">${test[0][5]}</div>
    <div class="nguoichet">${test[0][6]}</div>
</div>`;
    dashboard.insertAdjacentHTML('beforebegin', html);

    // CSS cho bảng dữ liệu 1234....
    // document.querySelector('.toptable').classList.add("hidden");
  });
};
bangdulieu(realData);

// click xuat hien bang du lieu an
let thutu,thututruoc, el, preEl;
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

const bangdulieuan = function () {
  document.querySelector('.toptable').addEventListener('click', function (e) {
    ///// tao bang
    if (e.target.closest('.table__rows')) {
      el = e.target.closest('.table__rows').classList.value.replace(' ', '.');
      thutu = +el.slice(-2);
      console.log(thutu)

      // nice remove element by classname
      document.querySelectorAll('.table__rows2').forEach(function (a) {
        a.remove();
      });

      let html2 = ``;
      


      const dataForTable = realData[thutu].slice().reverse();
      
      html2 += `<div class="table__rows2 ${(dataForTable[3][3] >= dataForTable[0][3])? 'predictup': 'predictdown'}">
      <div class="ngay"> Next day (Predict) </div>
      <div class="soca"> ${dataForTable[3][3]}</div>
      <div class="nguoichet">${dataForTable[3][4]}</div>
      </div>`;

      for(let o = 0; o<7 ; o++)    {
        html2 += `<div class="table__rows2">
        <div class="ngay"> ${dataForTable[o][2]} </div>
        <div class="soca"> ${dataForTable[o][3]}</div>
        <div class="nguoichet">${dataForTable[o][4]}</div>
        </div>`;
      };
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
        console.log(thutu,realData[thutudata][0][1])
        fetch(`https://restcountries.com/v2/name/${realData[thutudata][0][1]}`)
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
            if (data[0].name === 'Georgia') {
              i = 0;
            }      
            if (data[0].name === 'Iran (Islamic Republic of)') {
              i = 0;
            }
           
            document.querySelector('.country__img2')?.remove();
            html3 = `<img class="country__img2" src="${data[i].flag}" />`;
            document
              .querySelector(`.flag`)
              .insertAdjacentHTML('beforeend', html3);
            /// di chuyen toi nuoc do tren ban do
            const [lat2,lng2] = data[i].latlng;
            const coords2 = [lat2,lng2];
          
            map.setView(coords2, 4);
            document.querySelectorAll('.leaflet-marker-shadow.leaflet-zoom-animated').forEach(function (a) {
              a.remove();
            });

            document.querySelectorAll('.leaflet-marker-icon.leaflet-zoom-animated.leaflet-interactive').forEach(function (a) {
              a.remove();
            });

            
            L.marker([lat2, lng2])
          .addTo(map)


          
            
          });
      };
      flagCountries(thutu);

      // chart 
      dataChart2 = [];
      convertDataForChart2(realData[thutu]);
      
      chartnewcase(dataChart2,'New');
    }
  });
};
bangdulieuan();

document.querySelector('.btn').addEventListener('click', function () {
  document.querySelector('.toptable').classList.remove('hidden');
  document.querySelector('.country__img2')?.classList.remove('hidden');
  form.classList.add('hidden');
  
  if (!dataChart2) document.getElementById('chart_div').style.display = 'none';
  else {
    chartnewcase(dataChart2,'New');
    document.getElementById('chart_div').style.display = 'grid';
  }
  document.querySelector('.btn').classList.add('hidden');
});

let d = 0;
document.querySelector('.flag').addEventListener('click',function(e){
  if (e.target.closest('.country__img2')) {
    if (d === 0) {
    dataChart3 = [];
    convertDataForChart3(realData[thutu]);
    console.log(thutu)
    chartnewcase(dataChart3,'Death');
    d = 1;  
    
  } else {
    
    chartnewcase(dataChart2,'New');
    d = 0; 
  }
}})


///////////////////////////////////////

async function fetchdata() {
  const res = await fetch('./covid19_data_cleaned.json');
  const data = await res.json();
  return data;
}


}
main();
