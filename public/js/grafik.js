let counter = 1;
let myChart; let minRev;
let ctx = document.getElementById('chart1').getContext('2d');
let forward = document.getElementById('forward')
let back = document.getElementById('back')
let obj = { a: "satu" };

let init = {
    method: 'post',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(obj)
};

fetch('/getDataGrafikSatu', init).then(onSuccess1).then(showResult1);

function onSuccess1(response){
    return response.json();
};

function showResult1(result){
    const namaKategori = result.map(item => item.nama_kategori);
    const jumlahR = result.map(item => item['count(review_id)']);

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: namaKategori,
          datasets: [{
            label: 'Banyak Review Tas per Kategori',
            data: jumlahR,
            backgroundColor: 'rgba(213, 184, 255, 1)',
            borderColor: 'rgba(191, 85, 236, 1)',
            borderWidth: 1,
            barThickness: 20
          }]
        },
        options: {
          scales: {
            y: {
            beginAtZero: true,
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            }
          }
        }
      });
    
};

function showResult2(result){
    const namaSubKategori = result.map(item => item.nama_sub_kategori);
    const jumlahR = result.map(item => item['COUNT(review_id)']);

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: namaSubKategori,
          datasets: [{
            label: 'Banyak Review Tas per Sub Kategori',
            data: jumlahR,
            backgroundColor: 'rgba(213, 184, 255, 1)',
            borderColor: 'rgba(191, 85, 236, 1)',
            borderWidth: 1,
            barThickness: 20
          }]
        },
        options: {
          scales: {
            y: {
            beginAtZero: true,
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            }
          }
        }
      });
    
};

function showResult3(result){
    const namaKategori = result.map(item => item.nama_kategori);
    const jumlahR = result.map(item => item['CAST(AVG(angka_review) as INT)']);

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: namaKategori,
          datasets: [{
            label: 'Rata-rata Nilai Tas per Kategori',
            data: jumlahR,
            backgroundColor: 'rgba(213, 184, 255, 1)',
            borderColor: 'rgba(191, 85, 236, 1)',
            borderWidth: 1,
            barThickness: 20
          }]
        },
        options: {
          scales: {
            y: {
            beginAtZero: true,
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            }
          }
        }
      }); 
};

function showResult4(result){
    const namaSubKategori = result.map(item => item.nama_sub_kategori);
    const jumlahR = result.map(item => item['CAST(AVG(angka_review) as INT)']);

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: namaSubKategori,
          datasets: [{
            label: 'Rata-rata Nilai Tas per Sub Kategori',
            data: jumlahR,
            backgroundColor: 'rgba(213, 184, 255, 1)',
            borderColor: 'rgba(191, 85, 236, 1)',
            borderWidth: 1,
            barThickness: 20
          }]
        },
        options: {
          scales: {
            y: {
            beginAtZero: true,
            responsive: true,
            maintainAspectRatio: false,
            width: 400
            }
          }
        }
      });
    
};

forward.addEventListener("click", function(){
    counter = counter + 1;
    if(counter > 4){
        counter = 1;
    }
    myChart.destroy();
    console.log("maju")
    if(counter === 2){
        fetch('/getDataGrafikDua', init).then(onSuccess1).then(showResult2);
    } else if (counter === 3){
        fetch('/getDataGrafikTiga', init).then(onSuccess1).then(showResult3);
    } else if (counter === 4){
        fetch('/getDataGrafikEmpat', init).then(onSuccess1).then(showResult4);
    } else {
        fetch('/getDataGrafikSatu', init).then(onSuccess1).then(showResult1);
    }
});

back.addEventListener("click", function(){
    counter = counter - 1;
    if(counter < 0){
        counter = 4;
    }
    console.log("mundur")
    myChart.destroy();
    if(counter === 2){
        fetch('/getDataGrafikDua', init).then(onSuccess1).then(showResult2);
    } else if (counter === 3){
        fetch('/getDataGrafikTiga', init).then(onSuccess1).then(showResult3);
    } else if (counter === 4){
        fetch('/getDataGrafikEmpat', init).then(onSuccess1).then(showResult4);
    } else {
        fetch('/getDataGrafikSatu', init).then(onSuccess1).then(showResult1);
    }
});


