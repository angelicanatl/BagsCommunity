const add = document.querySelector("button[type='submit']");
const subkategori = document.querySelector("input[id='addSubCat']");
const alert0 = document.getElementById('alert');
const alert1 = document.getElementById('alert1');

subkategori.addEventListener('click', (event) =>{
    alert0.style.display = 'none';
    alert1.style.display = 'none';
});
add.addEventListener('click', (event)=>{
    event.preventDefault()
    const data = {
        namaSubKategori: subkategori.value
    }
    let init = {
        method: 'post',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    
    fetch('/tambahsubkategori', init).then(onSuccess).then(showResult);
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
            subkategori.value = '';
            div.appendChild(bar);
        }
    };
});
