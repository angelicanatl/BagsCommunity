const input_csv = document.querySelector(".input_csv");
const input_manual = document.querySelector(".input_manual");
const box_csv = document.querySelector(".file_csv");
const box_manual = document.querySelector(".manual");
const cancel_button = document.querySelectorAll('button[name="cancel"]');
const upload_button = document.querySelectorAll('button[name="upload"]');

//show upload csv
input_csv.addEventListener('click', ()=>{
    box_csv.style.display="block";
})

//show upload manual
input_manual.addEventListener('click', ()=>{
    box_manual.style.display="block";
})

//cancel to input item
cancel_button.forEach(e => {
    e.addEventListener('click', ()=>{
        box_csv.style.display = "none";
        box_manual.style.display = "none";
    })
});

window.onclick = function(event) {
    if (event.target == box_csv) {
        box_csv.style.display = "none";
    }
    if (event.target == box_manual) {
        box_manual.style.display = "none";
    }
}

//item uploaded successfully
upload_button.forEach(e => {
  e.addEventListener('click', ()=>{
    console.log("berhasilll");
  })
});

//upload manual
const kat = document.querySelector("select[name='kategori']");
const subkat = document.querySelector("select[name='subkat']");
const cancel = document.querySelector("button[name='cancel']");

kat.addEventListener('input', function(){
  const get_kat = kat.value;
  const data = {
    kategori: get_kat,
  };
  const params = new URLSearchParams(data);
  const q = params.toString();
  const url = "/getSubkat?" + q;
  
  fetch(url).then(onSuccess).then(showResult);
  function onSuccess(response){
    return response.json();
  };
  function showResult(sub){
    subkat.innerHTML='';
    for(let i of sub){
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      subkat.appendChild(option);
    }
    subkat.removeAttribute('disabled');
  };
});
