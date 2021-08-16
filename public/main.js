const resend = document.getElementById('resend');
const recipient = document.getElementById('recipient');
const message = document.getElementById('message');

function startUpdate(e){
    let parent = e.target.parentElement;
    console.dir(parent)
    windows.location('/');
}
resend.addEventListener('click', startUpdate)


