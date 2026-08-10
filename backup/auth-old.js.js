import { auth } from "./firebase.js";
import { database } from "./firebase.js";
import "./profile.js";
import "./booking.js";
import { ref, get, set } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
const laboratoryAccounts = [

    "admin@labpulse.com",
    "lab@labpulse.com"

];
window.signUp = async function () {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("userRole").value;
  const message = document.getElementById("authMsg");

  if (!email || !password) {
    message.innerHTML = "❌ Please enter your email and password.";
    return;
  }

  try {

    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    // Check if this user is a patient
    const patientSnapshot = await get(ref(database, "patients/" + user.uid));

    if (!patientSnapshot.exists()) {

        await signOut(auth);

        message.innerHTML =
            "❌ This account belongs to a laboratory. Please use the Laboratory Login.";

        return;

    }

    localStorage.setItem("userRole", "patient");

    message.innerHTML =
        "✅ Login successful! Redirecting...";

    setTimeout(() => {

        showSection("profile");

    }, 1000);

} catch (error) {

    message.innerHTML = "❌ " + error.message;

}
window.login = async function () {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("authMsg");

  if (!email || !password) {
    message.innerHTML = "❌ Please enter your email and password.";
    return;
  }

  try {

    await signInWithEmailAndPassword(auth, email, password);

    message.innerHTML =
  "✅ Login successful! Redirecting...";

setTimeout(() => {
  showSection("profile");
}, 1000);
  } catch (error) {

    message.innerHTML = "❌ " + error.message;

  }

};
// Show logged-in user's email
onAuthStateChanged(auth, (user) => {

    if (user) {
        const role = localStorage.getItem("userRole");
        const patientButtons = [
    "bookBtn",
    "appointmentsBtn",
    "aiBtn",
    "recordsBtn"
];

patientButtons.forEach((id) => {

    const button = document.getElementById(id);

    if (button) {

        button.style.display =
            role === "laboratory" ? "none" : "inline-block";

    }

});

        const emailElement = document.getElementById("patientEmail");

        if (emailElement) {
            emailElement.textContent = user.email;
        }

        const nameElement = document.getElementById("patientName");

        if (nameElement && typeof loadProfile === "function") {

    const profileRef = ref(database, "patients/" + user.uid);

    get(profileRef).then((snapshot) => {

        if (snapshot.exists()) {

            nameElement.textContent =
                "Welcome, " + snapshot.val().fullName + "! 👋";

        }

    });
    const dashboardBtn = document.getElementById("dashboardBtn");

if (dashboardBtn) {

    dashboardBtn.style.display =
        role === "laboratory" ? "block" : "none";

}

}
        
        if (typeof loadProfile === "function") {
    loadProfile();
}
if (typeof loadAppointments === "function") {
    loadAppointments();
}
if (typeof loadDashboard === "function") {
    loadDashboard();
}
if (typeof loadRecords === "function") {
    loadRecords();
}
if (typeof loadNotifications === "function") {
    loadNotifications();
}
const patientPages = [
    "booking",
    "appointments",
    "records",
    "ai"
];

patientPages.forEach((id) => {

    const page = document.getElementById(id);

    if (page) {

        if (role === "laboratory") {

            page.style.display = "none";

        }

    }

});
    }

});

// Logout
window.logout = async function () {
localStorage.removeItem("userRole");
    await signOut(auth);

    document.getElementById("authMsg").innerHTML =
        "✅ Logged out successfully.";
const dashboardBtn = document.getElementById("dashboardBtn");

if (dashboardBtn) {

    dashboardBtn.style.display = "none";

}
    showSection("auth");

};
window.labLogin = async function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("authMsg");

    

    try {

        await signInWithEmailAndPassword(auth, email, password);

        message.innerHTML =
            "✅ Laboratory login successful!";
            if (laboratoryAccounts.includes(email)) {

    localStorage.setItem("userRole", "laboratory");

} else {

    localStorage.setItem("userRole", "patient");

}

        setTimeout(() => {

            showSection("dashboard");

        }, 1000);

    } catch (error) {

        message.innerHTML =
            "❌ " + error.message;

    }

};