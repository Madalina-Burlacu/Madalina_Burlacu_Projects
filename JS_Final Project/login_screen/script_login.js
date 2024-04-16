"use strict";

const usernameLogin = document.querySelector("#username_login");
const passLogin = document.querySelector("#password_login");
const paraStatus = document.querySelector("#status");

const loginB = document.querySelector("#login_button");
const registerB = document.querySelector('#register_button');

paraStatus.style.color = "white";

const forgotPassButton = document.querySelector('#forgotPass')
let users = JSON.parse(localStorage.getItem("users"));
console.log(users)

function login() {
    let local = users.filter((el) => {
        return el.username === usernameLogin.value;
    });

    if(usernameLogin.value === '' || usernameLogin.value === ' '){
        paraStatus.textContent = `Invalid data`;
        paraStatus.style.background = 'red';
    }
    else if(local.length === 0){
        paraStatus.textContent = `User ${usernameLogin.value} doesn't exist.`;
        paraStatus.style.background = 'red';
    }
    else if(passLogin.value === '' || passLogin.value === ' '){
        paraStatus.textContent = `Invalid data`;
        paraStatus.style.background = 'red';
        return;
    }

    for(let user of local){
        if (usernameLogin.value === user.username &&
            passLogin.value === user.pass)
            {
            paraStatus.textContent = "Login Successfully";
            paraStatus.style.background = "Green";

            localStorage.setItem("current user", JSON.stringify(user));
            window.location.href = '../home_page/index_home.html';
        } 
        else {
            paraStatus.textContent = "Username or Password wrong";
            paraStatus.style.background = "red";
        }
    }
}

loginB.addEventListener('click', (e) => {
    login();
    e.preventDefault();
});

//redirect register page
registerB.addEventListener('click', (e)=>{
    window.location.href = '../register_screen/index_register.html';
    e.preventDefault();
})

//forgot password
function forgotPassword() {
    if (usernameLogin.value.trim() === '') {
        paraStatus.textContent = `Please insert your username.`;
        paraStatus.style.background = 'red';
        return;
    }

    // Find the index of the user with the provided username in the users array
    const index = users.findIndex((user) => user.username === usernameLogin.value.trim());

    if (index === -1) {
        // If the username doesn't exist, show an error message
        paraStatus.textContent = `User ${usernameLogin.value.trim()} doesn't exist.`;
        paraStatus.style.background = 'red';
    } else {
        // Remove the user from the users array
        users.splice(index, 1);
        // Update the users array in local storage without the removed user
        localStorage.setItem("users", JSON.stringify(users));
        // Remove the current user from local storage (optional, in case the user is currently logged in)
        localStorage.removeItem("current user");
        // Show a success message
        paraStatus.textContent = `User ${usernameLogin.value.trim()} has been removed.`;
        paraStatus.style.background = 'green';
        // Clear the input field
        usernameLogin.value = '';
    }
}

forgotPassButton.addEventListener('click', (e)=>{
    forgotPassword();
    e.preventDefault();
})

//localStorage.clear();
