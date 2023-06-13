console.log("y");
const kat = document.querySelector("select[name='kategori']");
const subkat = document.querySelector("#subkat");
kat.addEventListener('input', async () => {
    const get_kat = kat.value;
    console.log(get_kat)
    const data = {
        kategori: get_kat
    }
    console.log(data)
    const obj = URL.createObjectURL(data);
    console.log(obj)
    const subkat = await (await fetch('/getSubkat?' + obj)).text();
    console.log(subkat)

    // const request = subkat.then(function(response){
    //     console.log(response.status);
    //     return response.text();
    // });
    // request.then(function(text){
    //     console.log(text);
    // });
})