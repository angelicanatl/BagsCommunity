console.log("y");
const kat = document.querySelector("select[name='kategori']");
const subkat = document.querySelector("#subkat");

kat.addEventListener('input', ()=>{
    console.log(kat.value);

    let init = {
        method: 'post',
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(kat.value)
    };
})