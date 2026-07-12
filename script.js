// =========================================
// LABPULSE HEALTH
// Main JavaScript
// Part 1 of 3
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    // -----------------------------
    // Default Page
    // -----------------------------

    showSection("home");

    // -----------------------------
    // Laboratory Database
    // -----------------------------

    window.labs = [

        {
            id: 1,
            name: "Ace-Biomed Laboratories",
            city: "Benin City",
            verified: true,
            rating: 4.8,
            tests: [
                { name: "Malaria Test", price: 3500 },
                { name: "Full Blood Count", price: 6000 },
                { name: "Blood Glucose", price: 2500 },
                { name: "Pregnancy Test", price: 2500 }
            ]
        },

        {
            id: 2,
            name: "Alpha Diagnostics",
            city: "Ogun",
            verified: true,
            rating: 4.6,
            tests: [
                { name: "Malaria Test", price: 3200 },
                { name: "Pregnancy Test", price: 2000 },
                { name: "HIV Screening", price: 4500 },
                { name: "Lipid Profile", price: 8000 }
            ]
        },

        {
            id: 3,
            name: "LifeCare Diagnostics",
            city: "Lagos",
            verified: false,
            rating: 4.3,
            tests: [
                { name: "Kidney Function Test", price: 9000 },
                { name: "Liver Function Test", price: 8500 },
                { name: "Full Blood Count", price: 5500 },
                { name: "Blood Glucose", price: 2300 }
            ]
        }

    ];

});


// =========================================
// PAGE NAVIGATION
// =========================================

window.showSection = function(section){

    let pages = document.querySelectorAll(".page");

    pages.forEach(function(page){

        page.style.display = "none";

    });

    let activePage = document.getElementById(section);

    if(activePage){

        activePage.style.display = "block";

    }

};


// =========================================
// FIND LABS
// =========================================

window.findLabs = function(){

    let search = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    let output = "";

    labs.forEach(function(lab){

        lab.tests.forEach(function(test){

            if(

                lab.name.toLowerCase().includes(search) ||

                lab.city.toLowerCase().includes(search) ||

                test.name.toLowerCase().includes(search)

            ){

                output += `

<div class="lab-card">

<h3>${lab.name}</h3>

<p><strong>📍 City:</strong> ${lab.city}</p>

<p><strong>🧪 Test:</strong> ${test.name}</p>

<p><strong>💰 Price:</strong> ₦${test.price.toLocaleString()}</p>

<p><strong>⭐ Rating:</strong> ${lab.rating}/5</p>

<p>

${

lab.verified

?

'<span class="verified">✅ Verified by LabPulse</span>'

:

'<span class="pending">⏳ Pending Verification</span>'

}

</p>

<button onclick="favoriteLab('${lab.name}')">

⭐ Save Favourite

</button>

</div>

`;

            }

        });

    });

    if(output===""){

        output = `

<div class="lab-card">

<h3>No Results Found</h3>

<p>No laboratories matched your search.</p>

</div>

`;

    }

    document.getElementById("labResults").innerHTML = output;

};
// =========================================
// COMPARE TEST PRICES
// =========================================

window.comparePrices = function () {

    let search = document
        .getElementById("compareInput")
        .value
        .toLowerCase()
        .trim();

    let results = "";

    labs.forEach(function (lab) {

        lab.tests.forEach(function (test) {

            if (test.name.toLowerCase().includes(search)) {

                results += `

<div class="lab-card">

<h3>${lab.name}</h3>

<p><strong>🧪 Test:</strong> ${test.name}</p>

<p><strong>💰 Price:</strong> ₦${test.price.toLocaleString()}</p>

<p><strong>📍 City:</strong> ${lab.city}</p>

<p><strong>⭐ Rating:</strong> ${lab.rating}/5</p>

<p>

${lab.verified
? '<span class="verified">✅ Verified by LabPulse</span>'
: '<span class="pending">⏳ Pending Verification</span>'}

</p>

</div>

`;

            }

        });

    });

    if(results===""){

        results = `

<div class="lab-card">

<h3>No Results Found</h3>

<p>No laboratory currently offers this test.</p>

</div>

`;

    }

    document.getElementById("compareResults").innerHTML = results;

};


// =========================================
// BOOK APPOINTMENT
// =========================================

window.bookTest = function(){

    let lab = document.getElementById("labSelect").value;
    let test = document.getElementById("testSelect").value;
    let date = document.getElementById("bookingDate").value;
    let time = document.getElementById("bookingTime").value;

    if(

        lab==="Select a Laboratory" ||

        test==="Select a Test" ||

        date==="" ||

        time===""

    ){

        document.getElementById("bookingMessage").innerHTML =
        "❌ Please complete every booking field.";

        return;

    }

    document.getElementById("bookingMessage").innerHTML = `

✅ <strong>Booking Request Submitted!</strong>

<br><br>

<b>Laboratory:</b> ${lab}<br>

<b>Test:</b> ${test}<br>

<b>Date:</b> ${date}<br>

<b>Time:</b> ${time}<br><br>

The laboratory will review your request and contact you shortly.

`;

};


// =========================================
// UPLOAD REPORT
// =========================================

window.uploadReport = function(){

    let file = document
        .getElementById("fileUpload")
        .files[0];

    if(!file){

        document.getElementById("uploadMessage").innerHTML =
        "❌ Please choose a report first.";

        return;

    }

    let li = document.createElement("li");

    li.innerHTML = `📄 ${file.name}`;

    document
        .getElementById("recordList")
        .appendChild(li);

    document.getElementById("uploadMessage").innerHTML =
    "✅ Laboratory report uploaded successfully.";

};


// =========================================
// SAVE PROFILE
// =========================================

window.saveProfile = function(){

    let name = document.getElementById("profileName").value;
    let email = document.getElementById("profileEmail").value;
    let phone = document.getElementById("profilePhone").value;

    if(name==="" || email===""){

        alert("Please complete your profile.");

        return;

    }

    alert(

`Profile Saved Successfully!

Name: ${name}

Email: ${email}

Phone: ${phone}

Status: Patient`

    );

};


// =========================================
// FAVOURITE LABS
// =========================================

window.favoriteLab = function(lab){

    alert("⭐ " + lab + " has been added to your favourite laboratories.");

};
// =========================================
// AI LAB RESULT INTERPRETER
// =========================================

window.interpretResult = function () {

    let test = document
        .getElementById("testName")
        .value
        .toLowerCase()
        .trim();

    let value = parseFloat(
        document.getElementById("testValue").value
    );

    let result = "";

    if (isNaN(value)) {

        result = "⚠️ Please enter a valid test value.";

    }

    else if (test === "hemoglobin") {

        if (value < 12) {

            result =
            "🔴 Your haemoglobin appears lower than the normal range. This may suggest anaemia. Please consult a healthcare professional.";

        }

        else if (value <= 16) {

            result =
            "🟢 Your haemoglobin is within the normal range.";

        }

        else {

            result =
            "🟠 Your haemoglobin is above the normal range. Your healthcare provider may recommend further evaluation.";

        }

    }

    else if (test === "glucose") {

        if (value < 70) {

            result =
            "🔴 Your blood glucose appears low.";

        }

        else if (value <= 100) {

            result =
            "🟢 Your blood glucose appears to be within the normal fasting range.";

        }

        else {

            result =
            "🟠 Your blood glucose appears elevated. Please discuss this result with your healthcare provider.";

        }

    }

    else if (test === "malaria") {

        if (value === 0) {

            result =
            "🟢 No malaria parasite detected.";

        }

        else {

            result =
            "🔴 Malaria parasite detected. Please seek medical care promptly.";

        }

    }

    else if (test === "pregnancy") {

        if (value === 1) {

            result =
            "🟢 Pregnancy test appears positive.";

        }

        else {

            result =
            "⚪ Pregnancy test appears negative.";

        }

    }

    else {

        result =
        "⚠️ This laboratory test is not yet supported by LabPulse AI.";

    }

    document.getElementById("aiResult").innerHTML = result;

};


// =========================================
// LAB EQUIPMENT POPUP
// =========================================

window.openPopup = function(title, text, icon){

    document.getElementById("popupTitle").innerHTML = title;

    document.getElementById("popupText").innerHTML = text;

    document.getElementById("popupIcon").innerHTML = icon;

    document.getElementById("popup").style.display = "flex";

};


window.closePopup = function(){

    document.getElementById("popup").style.display = "none";

};


// =========================================
// CLOSE POPUP WHEN USER CLICKS OUTSIDE
// =========================================

window.onclick = function(event){

    let popup = document.getElementById("popup");

    if(event.target === popup){

        popup.style.display = "none";

    }

};


// =========================================
// FUTURE FEATURES
// =========================================

// These will connect to Firebase or another backend later:
//
// • Patient login
// • Laboratory login
// • Admin dashboard
// • Real appointment booking
// • Real AI interpretation
// • Payment gateway
// • Notifications
// • Real patient records
//
// Current version is a frontend prototype.

console.log("✅ LabPulse Health Loaded Successfully");
