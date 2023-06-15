const follow = document.getElementById('FollowingFollowers');
const review = document.getElementById('Reviews');

// kiri

const reviewsButton = document.getElementById('Review');
const followersButton = document.getElementById('Followers');
const followingButton = document.getElementById('Following');

reviewsButton.addEventListener('click', ()=>{
    review.style.display = 'block';
    follow.style.display = 'none';
});

fetch('/ngefollow')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        const folowing = document.getElementById('followingUser');
        const folowed = document.getElementById('followedUser');
        if (data.follow == 0){
            folowing.style.display = 'flex';
            folowed.style.display = 'none';
            
            folowing.addEventListener('click', ()=>{
                folowing.style.display = 'none';
                folowed.style.display = 'flex';
                folowed.style.backgroundColor = '#B29DF8';
                console.log("masuk db")
                let init = {
                    method: 'post',
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                };
                
                fetch('/ngefollow', init).then(onSuccess).then(showResult);
                function onSuccess(response){
                    return response.json();
                };
                function showResult(response){
                    const div = document.querySelector('#Followers'); 
                    const p1 = div.querySelector(':first-child');
                    let angka = response.angkaFollower[0].jumlahFollower;
                    p1.value = angka;
                    p1.textContent = angka;

                    const container = document.querySelector('#Follows>section');
                    const originalDiv = document.querySelector('.foll');
                    const clonedDiv = originalDiv.cloneNode(true);
                    const a = clonedDiv.querySelector(':last-child');
                    let usernamesaya = response.usernamesaya;
                    a.value = usernamesaya;
                    a.textContent = usernamesaya;
                    a.href = `/anotherUser/${usernamesaya}`;
                    a.name = usernamesaya;
                };
            });
            folowing.addEventListener('mouseover', ()=>{
                folowing.style.backgroundColor = '#B29DF8';
            });
            folowing.addEventListener('mouseout', ()=>{
                folowing.style.backgroundColor = '#E6E8FA';
            });
        } else {
            folowing.style.display = 'none';
            folowed.style.display = 'flex';
            folowed.style.backgroundColor = '#B29DF8';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    

// kanan

const kananFollower = document.getElementById("kananFollower");
const kananFollowing = document.getElementById("kananFollowing");
const barFollower = document.getElementById("Follows");
const barFollowing = document.getElementById("Follings");

followersButton.addEventListener('click', ()=>{
    review.style.display = 'none';
    follow.style.display = 'block';
    kananFollower.style.backgroundColor = '#B29DF8';
    kananFollowing.style.backgroundColor = '#F2F2FF';
    barFollower.style.display = 'block';
    barFollowing.style.display = 'none';
});

kananFollower.addEventListener('click', ()=>{
    review.style.display = 'none';
    follow.style.display = 'block';
    kananFollower.style.backgroundColor = '#B29DF8';
    kananFollowing.style.backgroundColor = '#F2F2FF';
    barFollower.style.display = 'block';
    barFollowing.style.display = 'none';
});

followingButton.addEventListener('click', ()=>{
    review.style.display = 'none';
    follow.style.display = 'block';
    kananFollower.style.backgroundColor = '#F2F2FF';
    kananFollowing.style.backgroundColor = '#B29DF8';
    barFollower.style.display = 'none';
    barFollowing.style.display = 'block';
});

kananFollowing.addEventListener('click', ()=>{
    review.style.display = 'none';
    follow.style.display = 'block';
    kananFollower.style.backgroundColor = '#F2F2FF';
    kananFollowing.style.backgroundColor = '#B29DF8';
    barFollower.style.display = 'none';
    barFollowing.style.display = 'block';
});
