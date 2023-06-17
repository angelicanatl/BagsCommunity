//sign up
const nama = document.querySelector('input[name="nama"]');
const email = document.querySelector('input[name="email"]');
const username = document.querySelector('input[name="username"]');
const password = document.querySelector('input[name="password"]');
const f = document.querySelector('form#signup');
const warn1 = document.querySelector('p#warnUname');
const submit = document.querySelector('button#signup');
const warn2 = document.querySelector('p#warnPass');
let valid1=false;
let valid2=false;
let valid3=false;
let valid4=false;
nama.addEventListener('input', function() {
    const value = nama.value.length;
    if (value < 5 || value > 50) {
        nama.style.backgroundColor = '#ff8991';
        valid1=false;
    } else {
        nama.style.backgroundColor = '#89ff89';
        valid1=true;
    }
    checkValidity();
})
email.addEventListener('input', function() {
    const value = email.value.length;
    if (value < 5 || value > 50) {
        email.style.backgroundColor = '#ff8991';
        valid2=false;
    } else {
        if(email.value.includes('@') && email.value.includes('.')){
            email.style.backgroundColor = '#89ff89';
            valid2=true;
        }else{
            email.style.backgroundColor = '#ff8991';
            valid2=false;
        }
    }
    checkValidity();
})
username.addEventListener('input', function() {
    const value = username.value.length;
    if (value < 4 || value > 15) {
        username.style.backgroundColor = '#ff8991';
        valid3=false;
    } else {
        username.style.backgroundColor = '#89ff89';
        warn1.style.display = 'none';
        valid3=true;
        const new_username = username.value;
        const obj = {
            new: new_username
        };
        let init = {
            method: 'post',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(obj)
        };
        fetch('/cekUsername',init).then(onSuccess).then(showResult);
        function onSuccess(response){
            return response.json();
        };
        function showResult(result){
            console.log(result);
            if(result){
                username.style.backgroundColor = '#ff8991';
                warn1.style.display = 'block';
                valid3=false;
            }else{
                username.style.backgroundColor = '#89ff89';
                warn1.style.display = 'none';
                valid3=true;
            }
        };
    }
    checkValidity();
})
password.addEventListener('input', function() {
    password.style.backgroundColor = '#89ff89';
    warn2.style.display = 'none';
    valid4=true;
    const value = password.value.length;
    if (value < 5 || value > 20) {
        password.style.backgroundColor = '#ff8991';
        warn2.style.display = 'block';
        valid4=false;
    }
    checkValidity();
})

function checkValidity() {
    if (valid1 && valid2 && valid3 && valid4) {
        submit.removeAttribute('disabled');
    } else {
        submit.setAttribute('disabled', true);
    }
}
