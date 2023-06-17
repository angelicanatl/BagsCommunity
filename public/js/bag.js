// modalnya
var modal = document.getElementById("addReview");

// tombol buka
var btn = document.getElementById("add");

// tombol tutup
var span = document.querySelector("button[name='cancel']");

// klo diklik, modal ada
btn.addEventListener('click', ()=>{
  modal.style.display = "block";
})

// klo diklik, modal ditutup
span.addEventListener('click', ()=>{
  modal.style.display = "none";
})

// klo di klik di luar modal, konten ditutup
window.addEventListener('click', (event)=>{
  if (event.target == modal) {
    modal.style.display = "none";
  }
})