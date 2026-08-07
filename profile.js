console.log("Profile.js loaded successfully!");
import { auth, database } from "./firebase.js";

import { ref, set, get } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

window.saveProfile = async function () {

    const user = auth.currentUser;

    if (!user) {
        document.getElementById("profileMessage").innerHTML =
            "❌ Please log in first.";
        return;
    }

    const fullName = document.getElementById("profileName").value.trim();
    const phone = document.getElementById("profilePhone").value.trim();
    const location = document.getElementById("profileLocation").value.trim();

    if (!fullName || !phone || !location) {

        document.getElementById("profileMessage").innerHTML =
            "❌ Please complete every field.";

        return;
    }

    try {

        await set(ref(database, "patients/" + user.uid), {

            fullName: fullName,
            phone: phone,
            location: location,
            email: user.email

        });

        document.getElementById("profileMessage").innerHTML =
            "✅ Profile saved successfully!";

    } catch (error) {

        document.getElementById("profileMessage").innerHTML =
            "❌ " + error.message;

    }

};
// ===============================
// LOAD PROFILE
// ===============================

window.loadProfile = async function () {

    console.log("loadProfile is running");
    const user = auth.currentUser;

console.log("Current User:", user);

if (!user) {
    console.log("No user yet.");
    return;
}

    try {

        document.getElementById("profileName").value = "";
document.getElementById("profilePhone").value = "";
document.getElementById("profileLocation").value = "";

const welcome = document.getElementById("patientName");
if (welcome) {
    welcome.textContent = "Welcome!";
}

const email = document.getElementById("patientEmail");
if (email) {
    email.textContent = "Loading...";
}
console.log("UID:", user.uid);
console.log("Email:", user.email);
const snapshot = await get(ref(database, "patients/" + user.uid));

        if (snapshot.exists()) {

            const data = snapshot.val();
            console.log("Full Name:", data.fullName);
console.log("Phone:", data.phone);
console.log("Email:", data.email);
console.log("Location:", data.location);
            document.getElementById("profileName").value =
                data.fullName || "";

            document.getElementById("profilePhone").value =
                data.phone || "";

            document.getElementById("profileLocation").value =
                data.location || "";
                const welcome = document.getElementById("patientName");

if (welcome) {
    welcome.textContent =
        "Welcome, " + data.fullName + "! 👋";
}

const email = document.getElementById("patientEmail");

if (email) {
    email.textContent = data.email;
}

        }
else {

    document.getElementById("profileName").value = "";
    document.getElementById("profilePhone").value = "";
    document.getElementById("profileLocation").value = "";

    const welcome = document.getElementById("patientName");

    if (welcome) {
        welcome.textContent = "Welcome!";
    }

    const email = document.getElementById("patientEmail");

    if (email) {
        email.textContent = user.email;
    }

}
    } catch (error) {

        console.log(error);

    }

};