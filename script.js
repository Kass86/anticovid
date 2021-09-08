'use strict';
// data
const tongca = {
    ngay: [7,9,2021],
    soca: '6000000'
}
const data = [['VN',12000,400],['My',100000,5000],['Uc',20000,1500],['Y',15000,600]];
const data2 = [['VN',[12000,13000],[400,500]],['My',[100000,110000],[5000,6000]],['Uc',[20000,19000],[1500,1600]],['Y',[15000,16000],[600,500]]];
//
const tongsoca = document.querySelector('.totalcase__value');
const ngay = document.querySelector('.date');
const nuoc = document.querySelector('.nuoc1');
const soca = document.querySelector('.soca');
const tuvong = document.querySelector('.nguoichet');
const dashboard = document.querySelector('.table');

// Function
tongsoca.textContent = tongca.soca;
ngay.textContent = `${tongca.ngay[0]}/${tongca.ngay[1]}/${tongca.ngay[2]}`;
const bangdulieu = function(dulieu) {
    dashboard.innerHTML ='';
dulieu.forEach(function(test,i){
    const html = `<div class="table__rows${i}">
    <div class="nuoc">${i+1}. ${test[0]} </div>
    <div class="soca">${test[1][0]}</div>
    <div class="nguoichet">${test[2][0]}</div>
</div>`
dashboard.insertAdjacentHTML('beforebegin', html);

// CSS cho bảng dữ liệu 1234....
document.querySelector(`.table__rows${i}`).classList.add('table__rowscore');  




})
}
bangdulieu(data2);
//du lieu an
const bangdulieuan = function(dulieuan) {
    dulieuan.forEach(function(test,t){
        const html1 =
    `<div class="modal${t} hidden">
        <button class="close-modal${t}">&times;</button>
        <div class="text1"> Tình hình dịch bệnh ở ${test[0]}</div>
          <div class="table__baserows">
            <div class="nuoc1">Ngày </div> 
              <div class="soca1"> Số ca nhiễm</div>
              <div class="nguoichet1">Số người chết</div>
          </div>
      </div>
    `
      document.querySelector('body').insertAdjacentHTML('beforebegin', html1);
      
      
      //add CSS for button và modal 1234...
      document.querySelector(`.close-modal${t}`).classList.add('close-modalcore');
      document.querySelector(`.modal${t}`).classList.add('modalcore');  


     // bang du lieu cua du lieu an
      for (let k = 0; k < test[2].length; k++) {
      const html2 = `
      <div class="table__rows">
            <div class="nuoc"> ${tongca.ngay[0]-k}/${tongca.ngay[1]}/${tongca.ngay[2]} </div>
            <div class="soca">${test[1][k]}</div>
            <div class="nguoichet">${test[2][k]}</div>
        </div>`
        document.querySelector(`.modal${t}`).insertAdjacentHTML('beforeend',html2);  
    }
       
    })}
    bangdulieuan(data2);



for (let u=0; u< data2.length; u++ )
document.querySelector(`.table__rows${u}`).addEventListener('click', function(){    
    document.querySelector(`.modal${u}`).classList.remove('hidden');
      
}
);
// const closemodal = function(){
//     console.log('o');
//     for (let u=0; u< data2.length; u++ )
//     document.querySelector(`.modal${u}`).classList.add('hidden');
// }
for (let u=0; u < data2.length; u++ )
document.querySelector(`.close-modal${u}`).addEventListener('click',function(){
       document.querySelector(`.modal${u}`).classList.add('hidden');
})
for (let u=0; u < data2.length; u++ )
document.addEventListener('keydown',function(e){
    if (e.key==='Escape') {
       document.querySelector(`.modal${u}`).classList.add('hidden');}
})

