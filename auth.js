import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

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

        if (nameElement) {
            nameElement.textContent = "Welcome!";
        }

    }

});

// Logout
window.logout = async function () {

    await signOut(auth);

    document.getElementById("authMsg").innerHTML =
        "✅ Logged out successfully.";

    showSection("auth");

};