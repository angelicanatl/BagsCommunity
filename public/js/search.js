const search = document.getElementById("search");
const input = document.querySelector("input[name='search']");
search.addEventListener('click', ()=>{
    // input.addEventListener('input', ()=>{
    //     console.log("init",input.value);
    // }) ini mah klo mau buat bar drop kebawah

    const data = {
        kataKunci: input.value
    }
    
    let init = {
        method: 'post',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    
    fetch('/cari', init).then(onSuccess).then(showResult);
    function onSuccess(response){
        return response.json();
    };
    function showResult(response){
        // tidak tahu
    }
});