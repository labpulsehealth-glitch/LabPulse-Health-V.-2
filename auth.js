import { auth } from "./firebase.js";
import { database } from "./firebase.js";

import "./profile.js";
import "./booking.js";
import "./dashboard.js";
import "./records.js";
import "./notifications.js";

import {
    ref,
    get,
    set,
    update
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

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

window.login = async function () {

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    const message = document.getElementById("authMsg");

    if (!email || !password) {

        message.innerHTML =
            "❌ Please enter your email and password.";

        return;

    }

    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        const patientRef =
            ref(database, "patients/" + user.uid);

        const snapshot =
            await get(patientRef);

        if (!snapshot.exists()) {

            await signOut(auth);

            message.innerHTML =
                "❌ This account is not registered as a patient.";

            return;

        }

        localStorage.setItem(
            "userRole",
            "patient"
        );

        message.innerHTML =
            "✅ Login successful!";

        setTimeout(() => {

            showSection("profile");

        },1000);

    }

    catch(error){

        message.innerHTML =
            "❌ " + error.message;

    }

};

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

    if (!laboratoryAccounts.includes(email)) {

        message.innerHTML =
            "❌ This account is not registered as a laboratory.";

        return;

    }

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