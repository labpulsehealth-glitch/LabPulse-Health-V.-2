import { auth } from "./firebase.js";
import { database } from "./firebase.js";
import "./profile.js";
import "./booking.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

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
  const message = document.getElementById("authMsg");

  if (!email || !password) {
    message.innerHTML = "❌ Please enter your email and password.";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);

    message.innerHTML =
      "✅ Account created successfully! You can now log in.";

  } catch (error) {

    message.innerHTML = "❌ " + error.message;

  }

};

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

    if (laboratoryAccounts.includes(user.email)) {

        dashboardBtn.style.display = "block";

    } else {

        dashboardBtn.style.display = "none";

    }

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
    }

});

// Logout
window.logout = async function () {

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

    if (!laboratoryAccounts.includes(email)) {

        message.innerHTML =
            "❌ This account is not registered as a laboratory.";

        return;

    }

    try {

        await signInWithEmailAndPassword(auth, email, password);

        message.innerHTML =
            "✅ Laboratory login successful!";

        setTimeout(() => {

            showSection("dashboard");

        }, 1000);

    } catch (error) {

        message.innerHTML =
            "❌ " + error.message;

    }

};