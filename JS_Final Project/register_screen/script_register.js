"use strict";

const email = document.querySelector("#email_register");
const paraEmail = document.querySelector("#p_email_register");

const username = document.querySelector("#username_register");
const paraUsername = document.querySelector("#p_username_register");

const pass = document.querySelector("#pass_register");
const parapass = document.querySelector("#p_pass_register");

const confirmPass = document.querySelector("#confirm_pass_register");
const paraConfirmpass = document.querySelector("#p_confirm_pass_register");

const firstname = document.querySelector("#fName_register");
const paraFirstname = document.querySelector("#p_fName_register");

const lastname = document.querySelector("#lName_register");
const paraLastname = document.querySelector("#p_lName_register");

const age = document.querySelector("#age_register");
const paraAge = document.querySelector("#p_age_register");

const registerButton = document.querySelector("#registerButton");
const loginButton = document.querySelector("#loginButton");

const validCharacters = "abcdefghijklmnopqrstuvwxyz.0123456789_-".split("");
const format = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/~_+\-=|\\]).{6,32}$/;

let users;
let userDetails;
if (localStorage.users != null) {
    users = JSON.parse(localStorage.getItem("users"));
} else {
    users = [];
}

paraEmail.style.color = "white";
paraUsername.style.color = "white";
parapass.style.color = "white";
paraConfirmpass.style.color = "white";
paraFirstname.style.color = 'white';
paraLastname.style.color = 'white';
paraAge.style.color = "white";

function validateEmail() {
    const emailArray = email.value.split("");
    const at = emailArray.indexOf("@");
    const dot = email.value.lastIndexOf(".");
    const emailName = email.value.slice(0, at);
    const emailDomain = email.value.slice(at + 1, email.value.length);
    let atCount = 0;

    for (let elem of emailArray) {
        if (elem === "@") {
            atCount++;
        }
    }

    for(let para of users){
        if(para.email === email.value){
            paraEmail.textContent = "Email already exist.";
            paraEmail.style.background = "red";
            return;
        }
    }

    if (email.value === "" || email.value.includes(" ")) {
        paraEmail.textContent = "Please provide an email address.";
        paraEmail.style.background = "red";
        return;
    }

    if (atCount != 1) {
        paraEmail.textContent =
            'The email address must have only one "@" character.';
        paraEmail.style.background = "red";
        return;
    }

    if (email.value.length - at < 4 || at === 0) {
        paraEmail.textContent =
            'Character "@" must be at least one character before and 3 characters after.';
        paraEmail.style.background = "red";
        return;
    }

    for (const letter of emailName) {
        if (!validCharacters.includes(letter)) {
            paraEmail.textContent = "Email must include only valid characters.";
            paraEmail.style.background = "red";
            return;
        }
    }

    for (const letter of emailDomain) {
        if (!validCharacters.includes(letter)) {
            paraEmail.textContent = "Email must include only valid characters.";
            paraEmail.style.background = "red";
            return;
        }
    }

    if (dot === -1 || email.value.startsWith(".") === true) {
        paraEmail.textContent = `Domain must include "." but not start with ".".`;
        paraEmail.style.background = "red";
        return;
    } else if (email.value.length - dot <= 2) {
        paraEmail.textContent = `Domain's last "." should be 2 characters or more from the end.`;
        paraEmail.style.background = "red";
        return;
    }
    else if((dot - at) < 4 ){
        paraEmail.textContent = 'Email domain incorrect.'
        paraEmail.style.background = "red";
        return
    }
    else {
        paraEmail.textContent = "Email correct.";
        paraEmail.style.background = "green";
    }
}

function validateUsername(){
    for(let userN of users){
        if(userN.username === username.value){
            paraUsername.textContent = 'Username already exist.'
            paraUsername.style.background = 'red';
            return
        }
    }
    
    if(username.value.match(format)){
        paraUsername.textContent = "Username is correct.";
        paraUsername.style.background = "green";
    }
    else{
        paraUsername.textContent = 'Username is incorrect.'
        paraUsername.style.background = 'red';
    }
}

function validatePassword(){
    if((pass.value === '' || pass.value.includes(' ')) && (confirmPass.value === '' || confirmPass.value.includes(' '))){
        parapass.textContent = 'Password is incorrect.';
        parapass.style.background = "red";
        paraConfirmpass.textContent = 'Confirm password is incorrect.';
        paraConfirmpass.style.background = "red";
        return
    }

    if(pass.value === username.value){
        parapass.textContent = 'Password and user must be different.'
        parapass.style.background = 'red';
    }
    else if(pass.value.match(format)){
        parapass.textContent = "Password is correct.";
        parapass.style.background = "green";
    }

    else{
        parapass.textContent = 'Password is incorrect.'
        parapass.style.background = 'red';
    }
    
    if(confirmPass.value !== pass.value){
        paraConfirmpass.textContent = 'Confirm password is incorrect.';
        paraConfirmpass.style.background = "red";
    }
    else{
        paraConfirmpass.textContent = 'Confirm password is correct.';
        paraConfirmpass.style.background = "green";
    }
}

function nameValidate(){
    let nameFormat = /^[A-Z][A-Za-z]{1,}$/;
    if(firstname.value.match(nameFormat)){
        paraFirstname.textContent = 'First name is correct.';
        paraFirstname.style.background = 'green';
    }
    else{
        paraFirstname.textContent = 'First name is incorrect.';
        paraFirstname.style.background = 'red';
    }

    if(lastname.value.match(nameFormat)){
        paraLastname.textContent = 'Last name is correct.';
        paraLastname.style.background = 'green';
    }
    else{
        paraLastname.textContent = 'Last name is incorrect.';
        paraLastname.style.background = 'red';
    }
}

function validateAge() {
    if (age.value == "") {
        paraAge.textContent = "Age is empty.";
        paraAge.style.background = "red";
        return;
    } else if (age.value < 18 || age.value > 65) {
        paraAge.textContent = "Age must be greater than 18 and bigger than 65.";
        paraAge.style.background = "red";
        return;
    }
     else {
        paraAge.textContent = "Age is correct.";
        paraAge.style.background = "green";
    }
    
}

//stergerea valorilor din input
function clearDisplay() {
    email.value = "";
    paraEmail.textContent = "";
    username.value = "";
    paraUsername.textContent = "";
    pass.value = "";
    parapass.textContent = "";
    confirmPass.value = "";
    paraConfirmpass.textContent = "";
    firstname.value = "";
    paraFirstname.textContent = "";
    lastname.value = "";
    paraLastname.textContent = "";
    age.value = "";
    paraAge.textContent = "";
}



registerButton.addEventListener("click", function (e) {
    let isValid = true; // Flag variable to track validation status

    validateEmail();
    validateUsername();
    validatePassword();
    nameValidate();
    validateAge();

    // Check if any validation failed
    if (
        paraEmail.style.background === "red" ||
        paraUsername.style.background === "red" ||
        parapass.style.background === "red" ||
        paraConfirmpass.style.background === "red" ||
        paraFirstname.style.background === "red" ||
        paraLastname.style.background === "red" ||
        paraAge.style.background === "red"
    ) {
        isValid = false;
    }

    if (isValid) {
        userDetails = {
            email: email.value,
            username: username.value,
            pass: pass.value,
            firstname: firstname.value,
            lastname: lastname.value,
            age: age.value,
        };
        alert(`The ${username.value} was created.`);
        users.push(userDetails);
        localStorage.setItem("users", JSON.stringify(users));
        clearDisplay();
        window.location.href = "../login_screen/index_login.html";
    }

    e.preventDefault();

});

//redirect login page
loginButton.addEventListener('click', (e)=>{
    window.location.href = '../login_screen/index_login.html';
    e.preventDefault();
})

//localStorage.clear();