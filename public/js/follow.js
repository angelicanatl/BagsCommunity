console.log("hello")

const follow = document.getElementById('FollowingFollowers');
const review = document.getElementById('Reviews');

const reviewsButton = document.getElementById('Review');
const followersButton = document.getElementById('Followers');
const followingButton = document.getElementById('Following');

reviewsButton.addEventListener('click', ()=>{
    review.style.display = 'block';
    follow.style.display = 'none';
});

followersButton.addEventListener('click', ()=>{
    review.style.display = 'none';
    follow.style.display = 'block';
});

followingButton.addEventListener('click', ()=>{
    review.style.display = 'none';
    follow.style.display = 'block';
});