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

window.showSection = function(section) {

    const role = localStorage.getItem("userRole");

    // Laboratory users cannot use patient-only sections.
    if (
        role === "laboratory" &&
        ["booking", "appointments", "records", "ai", "compare"].includes(section)
    ) {
        alert("Access denied. This page is available only to patients.");
        return;
    }

    // Only logged-in laboratories should see the Register Your Lab button.
    const labRegisterBtn =
        document.getElementById("labRegisterBtn");

    if (labRegisterBtn) {
        labRegisterBtn.style.display =
            role === "laboratory" ? "inline-block" : "none";
    }

    // Load patient records when needed.
    if (
        section === "records" &&
        typeof loadRecords === "function"
    ) {
        loadRecords();
    }

    if (
        section === "notifications" &&
        typeof loadNotifications === "function"
    ) {
        loadNotifications();
    }

    // Keep hero visible
    const hero = document.querySelector(".hero");

    if (hero) {
        hero.style.display = "block";
    }

    // Hide home content
    const homeContent =
        document.getElementById("homeContent");

    if (homeContent) {
        homeContent.style.display = "none";
    }

    // Hide all pages
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });

    // Home
    if (section === "home") {

        if (homeContent) {
            homeContent.style.display = "block";
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return;
    }

    // Show selected page
    const activePage =
        document.getElementById(section);

    if (activePage) {

    activePage.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    // Load profile only after the Profile page is displayed
    if (
        section === "profile" &&
        typeof loadProfile === "function"
    ) {
        loadProfile();
    }
        // Load appointments when opened
        if (
            section === "appointments" &&
            typeof loadAppointments === "function"
        ) {
            loadAppointments();
        }

        // Load laboratories when Find Labs opens
        if (
            section === "labs" &&
            typeof loadLaboratories === "function"
        ) {
            loadLaboratories();
        }
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

// Booking has been moved to booking.js

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

window.saveProfile = async function () {

    const user = auth.currentUser;

    if (!user) {
        document.getElementById("profileMessage").innerHTML =
            "❌ Please log in first.";
        return;
    }

    const fullName =
        document.getElementById("profileName").value.trim();

    const phone =
        document.getElementById("profilePhone").value.trim();

    const location =
        document.getElementById("profileLocation").value.trim();

    if (!fullName || !phone || !location) {

        document.getElementById("profileMessage").innerHTML =
            "❌ Please complete every field.";

        return;
    }

    try {

        await set(
            ref(database, "patients/" + user.uid),
            {
                fullName: fullName,
                phone: phone,
                location: location,
                email: user.email
            }
        );

        // Show saved information
        document.getElementById("profileNameDisplay").textContent =
            fullName;

        document.getElementById("profilePhoneDisplay").textContent =
            phone;

        document.getElementById("profileLocationDisplay").textContent =
            location;

        // Hide editing fields
        document.getElementById("profileEditForm").style.display =
            "none";

        // Show Edit Profile button
        document.getElementById("editProfileButton").style.display =
            "inline-block";

        document.getElementById("profileMessage").innerHTML =
            "✅ Profile saved successfully!";

    } catch (error) {

        console.error(error);

        document.getElementById("profileMessage").innerHTML =
            "❌ " + error.message;
    }

};
window.editProfile = function () {

    document.getElementById("profileEditForm").style.display =
        "block";

    document.getElementById("editProfileButton").style.display =
        "none";

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

    const test = document
        .getElementById("testName")
        .value
        .toLowerCase()
        .trim();

    const value = parseFloat(
        document.getElementById("testValue").value
    );

    let result = "";

    if (!test) {

        result = "⚠️ Please select a laboratory test.";

    }

    else if (isNaN(value)) {

        result = "⚠️ Please enter a valid numerical result.";

    }

    // =========================
    // PCV / PACKED CELL VOLUME
    // =========================

    else if (
        test === "pcv" ||
        test === "packed cell volume"
    ) {

        if (value < 36) {

            result =
                "🔴 Your PCV appears lower than the typical adult reference range. A low PCV can occur with anaemia and other conditions. The appropriate interpretation depends on your age, sex, symptoms, and your laboratory's reference range. Please discuss the result with a healthcare professional.";

        }

        else if (value <= 50) {

            result =
                "🟢 Your PCV is within a commonly used adult reference range. Reference ranges can vary between laboratories, so compare this result with the range printed on your laboratory report.";

        }

        else {

            result =
                "🟠 Your PCV appears higher than a commonly used adult reference range. This can occur for several reasons, including reduced body water or increased red-cell concentration. Please discuss the result with a healthcare professional.";
        }

    }

    // =========================
    // HAEMOGLOBIN
    // =========================

    else if (test === "hemoglobin" || test === "haemoglobin") {

        if (value < 12) {

            result =
                "🔴 Your haemoglobin is below a commonly used adult reference range and may be consistent with anaemia. Your age, sex, pregnancy status, symptoms and laboratory reference range are important for proper interpretation.";

        }

        else if (value <= 16) {

            result =
                "🟢 Your haemoglobin falls within a commonly used adult reference range. Compare it with the reference range on your laboratory report.";

        }

        else {

            result =
                "🟠 Your haemoglobin is above a commonly used adult reference range. Your healthcare provider may recommend further evaluation depending on your other results and symptoms.";

        }

    }

    // =========================
    // WHITE BLOOD CELLS
    // =========================

    else if (
        test === "wbc" ||
        test === "white blood cell count"
    ) {

        if (value < 4) {

            result =
                "🔴 Your white blood cell count appears low. Low white-cell counts can have several causes. Discuss the result with a healthcare professional.";

        }

        else if (value <= 11) {

            result =
                "🟢 Your white blood cell count is within a commonly used reference range.";

        }

        else {

            result =
                "🟠 Your white blood cell count appears elevated. Infection, inflammation and other conditions can cause this. Your healthcare provider should interpret it alongside your symptoms and other results.";

        }

    }

    // =========================
    // PLATELETS
    // =========================

    else if (
        test === "platelets" ||
        test === "platelet count"
    ) {

        if (value < 150) {

            result =
                "🔴 Your platelet count appears low. This can have several causes and should be interpreted by a healthcare professional.";

        }

        else if (value <= 450) {

            result =
                "🟢 Your platelet count is within a commonly used reference range.";

        }

        else {

            result =
                "🟠 Your platelet count appears elevated. Your healthcare provider may recommend further evaluation.";

        }

    }

    // =========================
    // BLOOD GLUCOSE
    // =========================

    else if (
        test === "glucose" ||
        test === "blood glucose"
    ) {

        if (value < 70) {

            result =
                "🔴 Your blood glucose appears low. If you have symptoms such as weakness, sweating, confusion or dizziness, seek appropriate medical attention.";

        }

        else if (value <= 100) {

            result =
                "🟢 This result is within the commonly used fasting blood-glucose range. Whether it is appropriate depends on whether the sample was fasting and on your laboratory's reference range.";

        }

        else {

            result =
                "🟠 Your blood glucose is above the commonly used fasting range. A single result does not establish a diagnosis. Discuss it with your healthcare provider.";

        }

    }

    // =========================
    // HbA1c
    // =========================

    else if (test === "hba1c") {

        if (value < 5.7) {

            result =
                "🟢 This HbA1c value is below the commonly used prediabetes threshold. Your healthcare provider should interpret it alongside your medical history.";

        }

        else if (value < 6.5) {

            result =
                "🟠 This HbA1c value falls in the commonly used prediabetes range. Please discuss the result with your healthcare provider.";

        }

        else {

            result =
                "🔴 This HbA1c value is in a range commonly used to indicate diabetes. Diagnosis should be made by a qualified healthcare professional and may require confirmation.";

        }

    }

    // =========================
    // CHOLESTEROL
    // =========================

    else if (test === "cholesterol") {

        if (value < 200) {

            result =
                "🟢 Your total cholesterol is below 200 mg/dL, which is commonly considered desirable.";

        }

        else if (value < 240) {

            result =
                "🟠 Your total cholesterol is in a commonly used borderline-high range. Discuss your overall cardiovascular risk with a healthcare professional.";

        }

        else {

            result =
                "🔴 Your total cholesterol is in a commonly used high range. A healthcare professional should interpret this together with your other lipid results and risk factors.";

        }

    }

    // =========================
    // LDL
    // =========================

    else if (test === "ldl") {

        if (value < 100) {

            result =
                "🟢 Your LDL cholesterol is below 100 mg/dL, a commonly used desirable level.";

        }

        else if (value < 160) {

            result =
                "🟠 Your LDL cholesterol is above the commonly used desirable level. Your individual target depends on your cardiovascular risk.";

        }

        else {

            result =
                "🔴 Your LDL cholesterol is substantially elevated. Please discuss the result with a healthcare professional.";

        }

    }

    // =========================
    // HDL
    // =========================

    else if (test === "hdl") {

        if (value < 40) {

            result =
                "🟠 Your HDL cholesterol appears low. HDL is one part of the overall lipid profile, so your healthcare provider should consider all your results together.";

        }

        else {

            result =
                "🟢 Your HDL cholesterol is not below the commonly used low threshold. Your complete lipid profile is still important.";

        }

    }

    // =========================
    // TRIGLYCERIDES
    // =========================

    else if (test === "triglycerides") {

        if (value < 150) {

            result =
                "🟢 Your triglycerides are below 150 mg/dL, a commonly used desirable level.";

        }

        else if (value < 500) {

            result =
                "🟠 Your triglycerides are elevated. Discuss the result and possible causes with a healthcare professional.";

        }

        else {

            result =
                "🔴 Your triglycerides are very high and require medical attention. Please discuss this result promptly with a healthcare professional.";

        }

    }

    // =========================
    // CREATININE
    // =========================

    else if (test === "creatinine") {

        result =
            "ℹ️ Creatinine is commonly used as part of kidney-function assessment. Its interpretation depends on factors such as age, sex, muscle mass and the laboratory reference range. Your healthcare provider may also consider eGFR.";

    }

    // =========================
    // UREA
    // =========================

    else if (test === "urea") {

        result =
            "ℹ️ Urea is one of the substances measured when assessing kidney function and hydration. A result outside the laboratory reference range can have several causes and should be interpreted with other kidney tests.";

    }

    // =========================
    // SODIUM
    // =========================

    else if (test === "sodium") {

        if (value < 135) {

            result =
                "🟠 Your sodium appears below a commonly used reference range. Low sodium can have several causes and should be assessed by a healthcare professional.";

        }

        else if (value <= 145) {

            result =
                "🟢 Your sodium is within a commonly used reference range.";

        }

        else {

            result =
                "🟠 Your sodium appears above a commonly used reference range. Discuss the result with a healthcare professional.";

        }

    }

    // =========================
    // POTASSIUM
    // =========================

    else if (test === "potassium") {

        if (value < 3.5) {

            result =
                "🟠 Your potassium appears low. Potassium abnormalities can be important and should be discussed with a healthcare professional.";

        }

        else if (value <= 5.0) {

            result =
                "🟢 Your potassium is within a commonly used reference range.";

        }

        else {

            result =
                "🔴 Your potassium appears elevated. Abnormal potassium levels can sometimes be serious and should be assessed by a healthcare professional.";

        }

    }

    // =========================
    // ESR
    // =========================

    else if (test === "esr") {

        result =
            "ℹ️ ESR is a non-specific marker that can increase with inflammation and several other conditions. It cannot by itself identify a specific disease. Your healthcare provider should interpret it alongside your symptoms and other results.";

    }

    // =========================
    // CRP
    // =========================

    else if (
        test === "crp" ||
        test === "c-reactive protein"
    ) {

        result =
            "ℹ️ C-reactive protein is a marker of inflammation. An elevated result can occur for many reasons, including infection or inflammation, and does not identify a specific condition by itself.";

    }

    // =========================
    // MALARIA
    // =========================

    else if (test === "malaria") {

        if (value === 0) {

            result =
                "🟢 No malaria parasite was indicated by the numerical result entered. The exact interpretation depends on the type of malaria test used.";

        }

        else {

            result =
                "🔴 The numerical result entered indicates a positive malaria result. Please discuss the result with a qualified healthcare professional for appropriate treatment.";

        }

    }

    // =========================
    // PREGNANCY
    // =========================

    else if (test === "pregnancy") {

        if (value === 1) {

            result =
                "🟢 The result entered corresponds to a positive pregnancy test. Please discuss the result with a qualified healthcare professional.";

        }

        else {

            result =
                "⚪ The result entered corresponds to a negative pregnancy test. If pregnancy is still suspected, a healthcare professional can advise whether repeat testing is appropriate.";

        }

    }

    // =========================
    // UNSUPPORTED
    // =========================

    else {

        result =
            "⚠️ This laboratory test is not yet supported by LabPulse AI. Please use the reference range and interpretation provided by your laboratory and discuss unusual results with a healthcare professional.";

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

// ===============================
// LABORATORY REGISTRATION
// ===============================

window.registerLab = async function () {

    const user = auth.currentUser;

    if (!user) {

        document.getElementById("labRegisterMessage").innerHTML =
            "❌ Please log in to your laboratory account first.";

        return;
    }

    const labName =
        document.getElementById("labName").value.trim();

    const ownerName =
        document.getElementById("ownerName").value.trim();

    const email =
        document.getElementById("labEmail").value.trim();

    const phone =
        document.getElementById("labPhone").value.trim();

    const address =
        document.getElementById("labAddress").value.trim();

    const city =
        document.getElementById("labCity").value.trim();

    const state =
        document.getElementById("labState").value.trim();

    const description =
        document.getElementById("labDescription").value.trim();

    const country =
        document.getElementById("labCountry").value;

    const labType =
        document.getElementById("labType").value;

    const openTime =
        document.getElementById("openTime").value;

    const closeTime =
        document.getElementById("closeTime").value;


    // Required fields

    if (
        labName === "" ||
        ownerName === "" ||
        email === "" ||
        phone === "" ||
        address === "" ||
        city === "" ||
        state === "" ||
        description === ""
    ) {

        document.getElementById("labRegisterMessage").innerHTML =
            "❌ Please complete all required fields.";

        return;
    }


    // Collect selected tests and prices

    const selectedTests = {};

    const testCheckboxes =
        document.querySelectorAll(
            'input[name="labTest"]:checked'
        );


    for (const checkbox of testCheckboxes) {

        const testName =
            checkbox.value;

        const priceInput =
            document.querySelector(
                `input[name="testPrice_${testName
                    .replace(/[^a-zA-Z0-9]/g, "_")}"]`
            );


        const price =
            priceInput
                ? priceInput.value.trim()
                : "";


        if (price === "") {

            document.getElementById("labRegisterMessage").innerHTML =
                `❌ Please enter a price for ${testName}.`;

            return;
        }


        selectedTests[testName] = {

            name: testName,

            price: Number(price)

        };

    }


    if (testCheckboxes.length === 0) {

        document.getElementById("labRegisterMessage").innerHTML =
            "❌ Please select at least one laboratory test.";

        return;
    }


    try {

        const labRef =
            ref(database, "laboratories/" + user.uid);


        const snapshot =
            await get(labRef);


        if (!snapshot.exists()) {

            document.getElementById("labRegisterMessage").innerHTML =
                "❌ Laboratory account not found.";

            return;
        }


        const existingData =
            snapshot.val();


        await update(labRef, {

            labName: labName,

            ownerName: ownerName,

            email: email,

            phone: phone,

            address: address,

            city: city,

            state: state,

            country: country,

            labType: labType,

            openTime: openTime,

            closeTime: closeTime,

            description: description,

            tests: selectedTests,

            status: existingData.status || "Pending",

            updatedAt:
                new Date().toISOString()

        });


        document.getElementById("labRegisterMessage").innerHTML =

            `✅ <strong>${labName}</strong>, your laboratory information has been submitted successfully.<br><br>

            Your laboratory is currently <strong>${existingData.status || "Pending Verification"}</strong>.

            <br><br>

            Once approved, patients will be able to find your laboratory, compare your prices, and book your available tests through LabPulse.`;


    } catch (error) {

        console.error(
            "Laboratory registration error:",
            error
        );

        document.getElementById("labRegisterMessage").innerHTML =
            "❌ " + error.message;

    }

};
