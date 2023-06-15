console.log("y");
const tglAwal = document.querySelector("input#dateAwal");
const tglAkhir = document.querySelector("input#dateAkhir");
const by = document.querySelectorAll("button");

let _from, _to, obj;
tglAwal.addEventListener("input", function(){
    tglAkhir.value='';
    _from = tglAwal.value;
    console.log(_from);
    tglAkhir.addEventListener("input", function(){
        _to = tglAkhir.value;
        console.log(_to);
        obj = {
            from: _from,
            to: _to
        };
        let init = {
            method: 'post',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(obj)
        };
        fetch('/getTabel',init).then(onSuccess).then(showResult);
        function onSuccess(response){
            return response.json();
        };
        function showResult(result){
            console.log(result);
        };
    })
})
const _title = document.querySelector("#tab");
const _tableHead = document.querySelector("th#tab");
const _section = document.querySelector("#graph");
// const _table = document.createElement("table");
const tab = document.querySelector("#graph table");

let _by;
by.forEach(e => {
    e.removeAttribute('disabled');
    e.addEventListener("click", (event)=>{
        event.target.style.backgroundColor = '#E6E8FA';
        _by = event.target.name;
        _title.textContent=_by;
        _tableHead.textContent=_by;
        obj = {
            by: _by
        };
        let init = {
            method: 'post',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(obj)
        };
        
        fetch('/showTabel',init).then(onSuccess).then(showResult);
        function onSuccess(response){
            return response.json();
        };
        function showResult(result){
            while(tab.childElementCount>1){
                tab.removeChild(tab.lastChild);
            }
            for(let prop of result){
                const newLine = document.createElement("tr");
                for(let count = 0; count<5; count++){
                    const newCol = document.createElement("td");
                    newCol.textContent = prop[count];
                    newLine.appendChild(newCol);
                }
                tab.appendChild(newLine);
            }
        };
    });
})