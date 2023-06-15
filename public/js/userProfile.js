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

const edit = document.getElementById('EditProfile');
edit.addEventListener('mouseover', ()=>{
    edit.style.backgroundColor = '#B29DF8';
});
edit.addEventListener('mouseout', ()=>{
    edit.style.backgroundColor = '#E6E8FA';
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

