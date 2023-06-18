const tglAwal = document.querySelector("input#dateAwal");
const tglAkhir = document.querySelector("input#dateAkhir");
const by = document.querySelectorAll("button.label");

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
const _title = document.querySelectorAll("#tab");
const _tableHead = document.querySelectorAll("th#tab");
const tab = document.querySelectorAll("table");

let _by;
by.forEach(e => {
    e.removeAttribute('disabled');
    let curr;
    e.addEventListener("click", (event)=>{
        curr = event.target;
        by.forEach(e => {
            e.style.backgroundColor = 'white';
        })
        curr.style.backgroundColor = '#E6E8FA';
        _by = event.target.name;
        _title.forEach(e=>{
            e.textContent=_by;
        })
        _tableHead.forEach(e => {
            textContent=_by;
        })
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
            tab.forEach(e => {
                console.log("1");
            while(e.childElementCount>1){
                e.removeChild(e.lastChild);
            }
            for(let prop of result){
                const newLine = document.createElement("tr");
                for(let count = 0; count<5; count++){
                    const newCol = document.createElement("td");
                    newCol.textContent = prop[count];
                    newLine.appendChild(newCol);
                }
                e.appendChild(newLine);
            }
        })
        };
    });
})

const preview = document.querySelector(".printPreview");
const content = document.querySelector(".contentPreview");
const previewPdf = document.querySelector("button#preview");
const downloadPdf = document.querySelector("button#download");
const x = document.querySelector("span");
previewPdf.addEventListener("click", function() {
    preview.style.display = "block";
})

x.addEventListener("click", function() {
    preview.style.display = "none";
})

downloadPdf.addEventListener("click", function() {
    window.print();
});