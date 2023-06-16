const num = document.querySelectorAll('a#page');
console.log(num);
num.forEach(e => {
    let curr;
    e.addEventListener("click", (event)=>{
        if(curr){
            curr.style.color = '#F2F2FF';
        }
        curr = event.ta;
        curr.style.color = 'black';
    });
})