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
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
const laboratoryAccounts = [

    "admin@labpulse.com"

];
window.updateAuthButton = function (user) {

    const loginButton = document.getElementById("loginBtn");

    if (!loginButton) return;

    if (user) {

        loginButton.textContent = "🚪 Logout";

        loginButton.onclick = function () {
            logout();
        };

    } else {

        loginButton.textContent = "🔐 Login";

        loginButton.onclick = function () {
            showSection("auth");
        };

    }
};
window.login = async function () {

    // Make sure the previous user is completely signed out
    if (auth.currentUser) {
        await signOut(auth);
    }

    
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
window.patientSignUp = async function () {

    const fullName = document.getElementById("registerPatientName").value.trim();
    const phone = document.getElementById("registerPatientPhone").value.trim();
    const dob = document.getElementById("registerPatientDOB").value;
    const gender = document.getElementById("registerPatientGender").value;

    const email = document.getElementById("registerPatientEmail").value.trim();
    const password = document.getElementById("registerPatientPassword").value.trim();
    const confirmPassword = document.getElementById("registerPatientConfirmPassword").value.trim();

    const message = document.getElementById("patientRegisterMsg");

    // Validation
    if (
        !fullName ||
        !phone ||
        !dob ||
        !gender ||
        !email ||
        !password ||
        !confirmPassword
    ) {

        message.innerHTML = "❌ Please complete all fields.";
        return;
    }

    if (password !== confirmPassword) {

        message.innerHTML = "❌ Passwords do not match.";
        return;
    }

    if (password.length < 6) {

        message.innerHTML = "❌ Password must be at least 6 characters.";
        return;
    }

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        await set(
            ref(database, "patients/" + user.uid),
            {

                fullName: fullName,
                phone: phone,
                dob: dob,
                gender: gender,
                email: email,
                createdAt: new Date().toISOString()

            }
        );

        localStorage.setItem("userRole", "patient");

        message.innerHTML =
            "✅ Patient account created successfully!";

        setTimeout(() => {

            showSection("profile");

        }, 1000);

    }

    catch (error) {

        message.innerHTML =
            "❌ " + error.message;

    }

};
window.labSignUp = async function () {

    const labName =
        document.getElementById("labName").value.trim();

    const email =
        document.getElementById("labEmail").value.trim();

    const password =
        document.getElementById("labPassword").value.trim();

    if (!labName || !email || !password) {

        alert("❌ Please complete all fields.");
        return;

    }

    if (password.length < 6) {

        alert("❌ Password must be at least 6 characters.");
        return;

    }

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        await set(
            ref(database, "laboratories/" + user.uid),
            {
                labName: labName,
                email: email,
                status: "Pending",
                createdAt: new Date().toISOString()
            }
        );

        localStorage.setItem(
            "userRole",
            "laboratory"
        );

        alert(
            "✅ Laboratory account created successfully! Your account is pending verification."
        );

        showSection("dashboard");

    } catch (error) {

        alert("❌ " + error.message);

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

    if (auth.currentUser) {
        await signOut(auth);
    }

    const email =
        document.getElementById("labLoginEmail").value.trim();

    const password =
        document.getElementById("labLoginPassword").value.trim();

    const message =
        document.getElementById("labAuthMsg");

    if (!email || !password) {

        message.innerHTML =
            "❌ Please enter your laboratory email and password.";

        return;

    }

    try {

        // Sign in with Firebase Authentication
        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        // Check whether this account exists as a laboratory
        const labRef =
            ref(database, "laboratories/" + user.uid);

        const snapshot =
            await get(labRef);

        if (!snapshot.exists()) {

            await signOut(auth);

            message.innerHTML =
                "❌ This account is not registered as a laboratory.";

            return;

        }

        // Laboratory account confirmed
        localStorage.setItem(
            "userRole",
            "laboratory"
        );

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
onAuthStateChanged(auth, async (user) => {

    // Update Login / Logout button
    updateAuthButton(user);

    // Nobody is logged in
    if (!user) {
        return;
    }

    console.log("User detected:", user.email);

    const role = localStorage.getItem("userRole");


    // ================= PATIENT =================

    if (role === "patient") {

        if (typeof loadProfile === "function") {
            await loadProfile();
        }

        if (typeof loadAppointments === "function") {
            loadAppointments();
        }

        if (typeof loadRecords === "function") {
            loadRecords();
        }

        if (typeof loadNotifications === "function") {
            loadNotifications();
        }

    }


    // ================= LABORATORY =================

    if (role === "laboratory") {

        const dashboardBtn =
            document.getElementById("dashboardBtn");

        if (dashboardBtn) {
            dashboardBtn.style.display = "block";
        }

        if (typeof loadDashboard === "function") {
            loadDashboard();
        }

        if (typeof loadProfile === "function") {
            await loadProfile();
        }

    }

});
window.handleAuthNav = function () {

    const user = auth.currentUser;

    if (user) {
        logout();
    } else {
    updateAuthButton(null);
        showSection("auth");
    }

};
function updateAuthButton(user) {

    const btn = document.getElementById("authNavBtn");

    if (!btn) return;

    if (user) {

        btn.innerHTML = "🚪 Logout";

    } else {

        btn.innerHTML = "🔐 Login";

    }
}
