"use strict";

const helloUser = document.querySelector("#helloUser");
const loggedUser = JSON.parse(localStorage.getItem("current user"));

const userL = loggedUser;
helloUser.textContent = `Hello ${userL.username}`;

//var shift
const shiftDate = document.querySelector("#shiftDate");
const startShift = document.querySelector("#startTime");
const endShift = document.querySelector("#endTime");
const shiftPlace = document.querySelector("#shiftPlace");
const paid = document.querySelector("#paid");
const shiftName = document.querySelector("#shiftSlug");
const comment = document.querySelector("textarea");

//shifts
const paraStatus = document.querySelector("#status");
paraStatus.style.color = "white";
const titleShift = document.getElementById("labelAdd");
const saveShift = document.querySelector("#save_shift");
const closeTab = document.querySelector("#close_shift");
const displayAddShift = document.querySelector("#addShift");
const topShiftsButton = document.querySelector("#topShifts");

//edit profile
const username = document.querySelector("#username_user");
const email = document.querySelector("#email_user");
const pass = document.querySelector("#pass_user");
const firstname = document.querySelector("#fName_user");
const lastname = document.querySelector("#lName_user");
const age = document.querySelector("#age_user");
const editProfileShow = document.querySelector("#editProfile");
const saveProfileButton = document.querySelector("#saveProfile");
const closeProfileButton = document.querySelector("#closeProfile");

//log out button
const logOutButton = document.querySelector("#logOut");

let indexGlobal;
let users = JSON.parse(localStorage.getItem("users"));
let shiftDetails;
let index = users.findIndex((elem) => userL.username === elem.username);
let dailyPay;

//filter shifts
const startDate = document.querySelector("#startDate");
const endDate = document.querySelector("#endDate");
const nameShift = document.querySelector("#name");
const filterButtonDate = document.querySelector("#filterByDate");
const filterButtonName = document.querySelector("#filterByName");
const resetFilterButton = document.querySelector("#resetFilter");

//check if the user already has an property called shift
users.forEach((user) => {
    if (!user.shifts) {
        user.shifts = []; // Create the "shifts" property if it doesn't exist
    }
});

let currentUserShifts = userL.shifts || [];
console.log(currentUserShifts);

//Add a shift
function addShift() {
    dailyPay = Math.abs(
        Math.round(
            ((new Date("1970-07-01 " + endShift.value) -
                new Date("1970-07-01 " + startShift.value)) /
                1000 /
                60 /
                60) *
                parseFloat(paid.value)
        )
    );
    shiftDetails = {
        shiftDate: shiftDate.value.trim(),
        startShift: startShift.value.trim(),
        endShift: endShift.value.trim(),
        shiftPlace: shiftPlace.value.trim(),
        paid: paid.value.trim(),
        shiftName: shiftName.value.trim(),
        dailyPay: dailyPay,
        comment: comment.value.trim(),
    };

    for (let shift of currentUserShifts) {
        if (shiftName.value === shift.shiftName) {
            paraStatus.textContent = "This name of shift already exist";
            paraStatus.style.background = "red";
            return;
        }
    }
    if (
        shiftDate.value.trim() === "" ||
        startShift.value.trim() === "" ||
        endShift.value.trim() === "" ||
        shiftPlace.value.trim() === "" ||
        paid.value.trim() === "" ||
        shiftName.value.trim() === ""
    ) {
        paraStatus.textContent = "All fields are mandatory!";
        paraStatus.style.background = "red";
    } else {
        users.forEach((user) => {
            if (loggedUser.username === user.username) {
                user.shifts.push(shiftDetails);
                localStorage.setItem("users", JSON.stringify(users));
                localStorage.setItem(
                    "current user",
                    JSON.stringify(users[index])
                );
            }
        });
        paraStatus.textContent = "Shift saved!";
        paraStatus.style.background = "green";

        completeTable();
        clearInputs();
        location.reload();
    }
}

function clearInputs() {
    shiftDate.value = "";
    startShift.value = "";
    endShift.value = "";
    shiftPlace.value = "";
    paid.value = "";
    shiftName.value = "";
    comment.value = "";
    paraStatus.textContent = "";
}

displayAddShift.addEventListener("click", (e) => {
    divShift.style.display = "block";
    document.getElementById("labelAdd").textContent = "Add Shift";
    e.preventDefault();
});

//save shift in Local Storage
saveShift.addEventListener("click", (e) => {
    if (saveShift.value === "Save") {
        paraStatus.style.display = "inherit";
        addShift();
    } else {
        // Update the shift details in the currentUserShifts array
        const updatedShiftDetails = {
            shiftDate: shiftDate.value,
            startShift: startShift.value,
            endShift: endShift.value,
            shiftPlace: shiftPlace.value,
            paid: paid.value,
            shiftName: shiftName.value,
            dailyPay: dailyPay,
            comment: comment.value,
        };

        currentUserShifts[indexGlobal] = updatedShiftDetails;
        userL.shifts = currentUserShifts; // Update the shifts in the user object

        // Update the users array with the updated user
        users[indexGlobal] = userL;
        localStorage.setItem("users", JSON.stringify(users));

        // Update the current user in local storage with the updated user
        localStorage.setItem("current user", JSON.stringify(userL));

        paraStatus.textContent = "Shift updated!";
        paraStatus.style.background = "green";

        completeTable();
        calculateMonthlyPay(); // Refresh the table with the updated shifts

        titleShift.textContent = "Add Shifts";
        saveShift.value = "Save";
        clearInputs();

        location.reload();
    }
    e.preventDefault();
});

function completeTable() {
    let tableBody = document.getElementById("tableBody");
    let addShift = "";

    //create the rows in the table
    currentUserShifts.forEach((user, index) => {
        addShift += `
        <tr>
            <td>${user.shiftName}</td>
            <td>${user.shiftDate}</td>
            <td>${user.startShift}</td>
            <td>${user.endShift}</td>
            <td>${user.paid}</td>
            <td>${user.shiftPlace}</td>
            <td>${user.dailyPay}</td>
            <td>
                <button class='tableButton' onclick="editShift(${index})">Edit</button>
                <button class='tableButton' onclick="deleteShift(${index})">Delete</button>
            </td>
        </tr>`;
    });
    tableBody.innerHTML = addShift;
}
completeTable();

const divShift = document.querySelector("#add_shift");

function editShift(editIndex) {
    indexGlobal = editIndex;

    divShift.style.display = "block";
    titleShift.textContent = "Edit Shift";
    saveShift.value = "Update";

    let shiftDetails = currentUserShifts[editIndex];

    shiftDate.value = shiftDetails.shiftDate;
    startShift.value = shiftDetails.startShift;
    endShift.value = shiftDetails.endShift;
    shiftPlace.value = shiftDetails.shiftPlace;
    paid.value = shiftDetails.paid;
    shiftName.value = shiftDetails.shiftName;
    comment.value = shiftDetails.comment;

    // Calculate and set the dailyPay value based on the shift details
    dailyPay = Math.abs(
        Math.round(
            ((new Date("1970-07-01 " + shiftDetails.endShift) -
                new Date("1970-07-01 " + shiftDetails.startShift)) /
                1000 /
                60 /
                60) *
                parseFloat(shiftDetails.paid)
        )
    );
    // Event listeners for input fields to update the dailyPay value dynamically
    endShift.addEventListener("input", updateDailyPay);
    startShift.addEventListener("input", updateDailyPay);
    paid.addEventListener("input", updateDailyPay);
}

function updateDailyPay() {
    // Update the dailyPay value based on the current input field values
    dailyPay = Math.abs(
        Math.round(
            ((new Date("1970-07-01 " + endShift.value) -
                new Date("1970-07-01 " + startShift.value)) /
                1000 /
                60 /
                60) *
                parseFloat(paid.value)
        )
    );
}


function deleteShift(index) {
    if (confirm("Are you sure you want to delete this shift?")) {
        currentUserShifts.splice(index, 1); // Remove the shift from the array
        userL.shifts = currentUserShifts; // Update the shifts in the user object

        // Update the users array with the updated user
        users[index] = userL;
        localStorage.setItem("users", JSON.stringify(users));

        // Update the current user in local storage with the updated user
        localStorage.setItem("current user", JSON.stringify(userL));

        completeTable();
        location.reload();
        updateChart(monthlyData);
    }
}

closeTab.addEventListener("click", (e) => {
    divShift.style.display = "none";
    paraStatus.style.display = "none";
    e.preventDefault();
});

//Edit Profile
function populateProfile(loggedUser) {
    // Populate the input fields with the current user's information
    username.value = userL.username;
    email.value = userL.email;
    pass.value = userL.pass;
    firstname.value = userL.firstname;
    lastname.value = userL.lastname;
    age.value = userL.age;
}

function editProfile(loggedUser) {
    document.querySelector("#edit_profile").style.display = "block";
    populateProfile(loggedUser);
}

editProfileShow.addEventListener("click", (e) => {
    editProfile(loggedUser);
    e.preventDefault();
});

saveProfileButton.addEventListener("click", (e) => {
    // Get the updated values from the input fields
    const updatedUsername = username.value.trim();
    const updatedEmail = email.value.trim();
    const updatedPassword = pass.value.trim();
    const updatedFName = firstname.value.trim();
    const updatedLName = lastname.value.trim();
    const updatedAge = age.value.trim();

    // Update the current user's information
    userL.username = updatedUsername;
    userL.email = updatedEmail;
    userL.pass = updatedPassword;
    userL.firstname = updatedFName;
    userL.lastname = updatedLName;
    userL.age = updatedAge;

    // Find the index of the current user in the users array and update it
    const index = users.findIndex((elem) => userL.username === elem.username);
    users[index] = userL;

    // Update the users array in local storage
    localStorage.setItem("users", JSON.stringify(users));

    // Update the current user in local storage with the updated user
    localStorage.setItem("current user", JSON.stringify(userL));

    alert("Profile updated successfully!");

    document.querySelector("#edit_profile").style.display = "none";
    window.location.reload();

    e.preventDefault();
});

closeProfileButton.addEventListener("click", (e) => {
    document.querySelector("#edit_profile").style.display = "none";
    e.preventDefault();
});

//Top shifts
let monthlyData = generateMonthlyData();

function generateMonthlyData() {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const monthlyData = {};

    months.forEach((month, index) => {
        monthlyData[index + 1] = 0;
    });

    return monthlyData;
}

function calculateMonthlyPay() {
    // Reset the monthly data
    monthlyData = generateMonthlyData();

    // Calculate the monthly total daily pay
    currentUserShifts.forEach((shift) => {
        const shiftDate = new Date(shift.shiftDate);
        const month = shiftDate.getMonth() + 1;
        const dailyPay = parseInt(shift.dailyPay); // Convert dailyPay to a number
        if (!isNaN(dailyPay)) {
            monthlyData[month] += dailyPay;
        }
    });
    console.log("Monthly Data:", monthlyData);

    // Update the chart
    updateChart(monthlyData);
}

function updateChart(monthlyData) {
    const canvas = document.getElementById("chartCanvas");
    const ctx = canvas.getContext("2d");

    // If the chart is already initialized, destroy it first
    if (window.monthlyChart) {
        window.monthlyChart.destroy();
    }

    // Create the chart
    window.monthlyChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(monthlyData),
            datasets: [
                {
                    label: "Monthly Earnings",
                    data: Object.values(monthlyData),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                },
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

function displayChart() {
    calculateMonthlyPay();
    updateChart(monthlyData);
    console.log(monthlyData);
}

window.onload = function () {
    displayChart();
};

//filter shits

// Filter shifts by date range
function filterShiftsByDate(startDate, endDate) {
    const filteredShifts = currentUserShifts.filter((shift) => {
        const shiftDate = new Date(shift.shiftDate);
        return (
            shiftDate >= new Date(startDate) && shiftDate <= new Date(endDate)
        );
    });

    return filteredShifts;
}

// Filter shifts by name
function filterShiftsByName(name) {
    const filteredShifts = currentUserShifts.filter((shift) => {
        return shift.shiftName.toLowerCase().includes(name.toLowerCase());
    });

    return filteredShifts;
}

//display the filter in the table
function displayFilteredShifts(filteredShifts) {
    let tableBody = document.getElementById("tableBody");
    let filteredShiftsHtml = "";

    filteredShifts.forEach((user, index) => {
        filteredShiftsHtml += `
        <tr>
            <td>${user.shiftName}</td>
            <td>${user.shiftDate}</td>
            <td>${user.startShift}</td>
            <td>${user.endShift}</td>
            <td>${user.paid}</td>
            <td>${user.shiftPlace}</td>
            <td>${user.dailyPay}</td>
            <td>
                <button class='tableButton' onclick="editShift(${index})">Edit</button>
                <button class='tableButton' onclick="deleteShift(${index})">Delete</button>
            </td>
        </tr>`;
    });

    tableBody.innerHTML = filteredShiftsHtml;

    // Recalculate the monthly data based on the filtered shifts
    const filteredMonthlyData = generateMonthlyData();
    filteredShifts.forEach((shift) => {
        const shiftDate = new Date(shift.shiftDate);
        const month = shiftDate.getMonth() + 1;
        const dailyPay = parseInt(shift.dailyPay);
        if (!isNaN(dailyPay)) {
            filteredMonthlyData[month] += dailyPay;
        }
    });

    // Update the chart with the filtered monthly data
    updateChart(filteredMonthlyData);
}

// Event listener for the "Filter by Date" button
filterButtonDate.addEventListener("click", () => {
    const startDateValue = startDate.value;
    const endDateValue = endDate.value;
    const filteredShiftsByDate = filterShiftsByDate(
        startDateValue,
        endDateValue
    );
    displayFilteredShifts(filteredShiftsByDate);
});

// Event listener for the "Filter by Name" button
filterButtonName.addEventListener("click", () => {
    const nameValue = nameShift.value;
    const filteredShiftsByName = filterShiftsByName(nameValue);
    displayFilteredShifts(filteredShiftsByName);
});

function resetFilter() {
    // Clear the input fields for filtering
    startDate.value = "";
    endDate.value = "";
    nameShift.value = "";

    // Restore the original shifts to currentUserShifts
    currentUserShifts = userL.shifts || [];

    // Display all the shifts in the table and the chart
    completeTable();
    calculateMonthlyPay();
    updateChart(monthlyData);
}

resetFilterButton.addEventListener("click", (e) => {
    resetFilter();
    e.preventDefault();
});

//log out from the page
logOutButton.addEventListener("click", (e) => {
    window.location.href = "../login_screen/index_login.html";
    localStorage.removeItem("current user");
    e.preventDefault();
});
