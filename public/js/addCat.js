const add = document.querySelector("button[type='submit']");
const kategori = document.querySelector("input[id='addCat']");
const alert0 = document.getElementById('alert');
const alert1 = document.getElementById('alert1');

kategori.addEventListener('click', (event) =>{
    alert0.style.display = 'none';
    alert1.style.display = 'none';
});
add.addEventListener('click', (event)=>{
    event.preventDefault()
    const data = {
        namaKategori: kategori.value
    }
    let init = {
        method: 'post',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    
    fetch('/tambahkategori', init).then(onSuccess).then(showResult);
    function onSuccess(response){
        return response.json();
    };
    function showResult(response){
        const div = document.querySelector(".category");
        if (response == true){
            alert1.style.display = 'block';
        } else if (response == false) {
            alert0.style.display = 'block';
        } else {
            const bar = document.createElement('a');
            bar.value = response;
            bar.textContent = response;
            kategori.value = '';
            div.appendChild(bar);
        }
    };
});
