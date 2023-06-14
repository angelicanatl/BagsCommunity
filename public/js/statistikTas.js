console.log("y");
const tglAwal = document.querySelector("input#dateAwal");
const tglAkhir = document.querySelector("input#dateAkhir");
const by = document.querySelectorAll("button");
let _from, _to, _by;
tglAwal.addEventListener("input", function(){
    _from = tglAwal.value;
    console.log(_from);
    tglAkhir.addEventListener("input", function(){
        _to = tglAkhir.value;
        console.log(_to);
        if(_from && _to){
            by.forEach(e => {
                e.removeAttribute('disabled');
                e.addEventListener("click", (event)=>{
                    _by = event.target.name;
                    console.log(_by);
                })
            });
        }
    })
})
const obj = {
    from: _from,
    to: _to,
    by: _by
};

let init = {
    method: 'get',
    headers:{
        "Content-Type":"application/json"
    },
    body: JSON.stringify(obj)
};
const tab = document.querySelector("table");
const newLine = document.createElement("tr");
const newCol = document.createElement("td");

fetch('/showLaporan',init).then(onSuccess).then(showResult);
function onSuccess(response){
    console.log(response.json());
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