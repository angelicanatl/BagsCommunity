const num = document.querySelectorAll('a#page');
num.forEach(e => {
    let curr;
    e.addEventListener("click", (event)=>{
        curr = event.target;
        if(curr){
            curr.style.color = '#F2F2FF';
        } else {

        }
        curr.style.background = 'black';
    });
})