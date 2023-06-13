const kat = document.querySelector("select[name='kategori']");
const subkat = document.querySelector("select[name='subkat']");
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