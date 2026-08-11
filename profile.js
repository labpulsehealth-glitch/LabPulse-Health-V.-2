console.log("Profile.js loaded successfully!");
import { auth, database } from "./firebase.js";

import { ref, set, get } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

window.saveProfile = async function () {

    const user = auth.currentUser;

    if (!user) {
        document.getElementById("profileMessage").innerHTML =
            "❌ Your login session is still loading. Please wait a moment and try again.";
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

        // Immediately update what the patient sees
        document.getElementById("profileNameDisplay").textContent =
            fullName;

        document.getElementById("profilePhoneDisplay").textContent =
            phone;

        document.getElementById("profileLocationDisplay").textContent =
            location;

        const welcome =
            document.getElementById("patientName");

        if (welcome) {
            welcome.textContent =
                "Welcome, " + fullName + "! 👋";
        }

        // Hide edit mode
        document.getElementById("profileEditForm").style.display =
            "none";

        // Show Edit Profile again
        document.getElementById("editProfileButton").style.display =
            "inline-block";

        document.getElementById("profileMessage").innerHTML =
            "✅ Your profile changes have been saved.";

    } catch (error) {

        console.error("Profile save error:", error);

        document.getElementById("profileMessage").innerHTML =
            "❌ Unable to save your changes. " + error.message;

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

        const role = localStorage.getItem("userRole");

        console.log("User role:", role);
        console.log("UID:", user.uid);
        console.log("Email:", user.email);

        // ==========================================
        // LABORATORY PROFILE
        // ==========================================

        if (role === "laboratory") {

            const snapshot =
                await get(
                    ref(database, "laboratories/" + user.uid)
                );

            console.log(
                "Laboratory profile:",
                snapshot.exists() ? snapshot.val() : "Not found"
            );

            if (snapshot.exists()) {

                const data = snapshot.val();

                // Laboratory name
                const profileName =
                    document.getElementById("profileName");

                if (profileName) {
                    profileName.value = data.labName || "";
                }

                // Phone field — laboratories currently don't
                // have a phone number stored in Firebase
                const profilePhone =
                    document.getElementById("profilePhone");

                if (profilePhone) {
                    profilePhone.value = "";
                }

                // Location field — laboratories currently don't
                // have a location stored in Firebase
                const profileLocation =
                    document.getElementById("profileLocation");

                if (profileLocation) {
                    profileLocation.value = "";
                }

                // Welcome text
                 const labName =
    document.getElementById("labProfileName");

if (labName) {
    labName.textContent =
        data.labName || "Laboratory";
}

                // Email

const labEmail =
    document.getElementById("labProfileEmail");

if (labEmail) {
    labEmail.textContent =
        data.email || user.email;
}

const labStatus =
    document.getElementById("labProfileStatus");

if (labStatus) {
    labStatus.textContent =
        data.status || "Pending";
}

                console.log(
                    "Laboratory Name:",
                    data.labName
                );

                console.log(
                    "Laboratory Email:",
                    data.email
                );

                console.log(
                    "Laboratory Status:",
                    data.status
                );

            } else {

                console.log(
                    "No laboratory record found for this UID."
                );

                const welcome =
                    document.getElementById("patientName");

                if (welcome) {
                    welcome.textContent =
                        "Laboratory Profile";
                }

                const email =
                    document.getElementById("patientEmail");

                if (email) {
                    email.textContent =
                        user.email;
                }
            }

            return;
        }


        // ==========================================
        // PATIENT PROFILE
        // ==========================================

        document.getElementById("profileName").value = "";
        document.getElementById("profilePhone").value = "";
        document.getElementById("profileLocation").value = "";

        const patientWelcome =
            document.getElementById("patientName");

        if (patientWelcome) {
            patientWelcome.textContent = "Welcome!";
        }

        const patientEmail =
            document.getElementById("patientEmail");

        if (patientEmail) {
            patientEmail.textContent = "Loading...";
        }

        const snapshot =
            await get(
                ref(database, "patients/" + user.uid)
            );

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
                document.getElementById("profileNameDisplay").textContent =
    data.fullName || "Not provided";

document.getElementById("profilePhoneDisplay").textContent =
    data.phone || "Not provided";

document.getElementById("profileLocationDisplay").textContent =
    data.location || "Not provided";
    document.getElementById("profileEditForm").style.display =
    "block";

document.getElementById("editProfileButton").style.display =
    "none";
    document.getElementById("profileEditForm").style.display =
    "none";

document.getElementById("editProfileButton").style.display =
    "inline-block";

            if (patientWelcome) {
                patientWelcome.textContent =
                    "Welcome, " +
                    (data.fullName || "") +
                    "! 👋";
            }

            if (patientEmail) {
                patientEmail.textContent =
                    data.email || user.email;
            }

        } else {

            document.getElementById("profileName").value = "";
            document.getElementById("profilePhone").value = "";
            document.getElementById("profileLocation").value = "";

            if (patientWelcome) {
                patientWelcome.textContent =
                    "Welcome!";
            }

            if (patientEmail) {
                patientEmail.textContent =
                    user.email;
            }
        }
        window.editProfile = function () {

    document.getElementById("profileEditForm").style.display =
        "block";

    document.getElementById("editProfileButton").style.display =
        "none";
};
window.cancelEditProfile = function () {

    document.getElementById("profileEditForm").style.display =
        "none";

    document.getElementById("editProfileButton").style.display =
        "inline-block";

    document.getElementById("profileMessage").innerHTML = "";

};

    } catch (error) {

        console.error(
            "Error loading profile:",
            error
        );

    }

};
window.openProfile = async function () {

    const user = auth.currentUser;

    if (!user) {
        showSection("auth");
        return;
    }

    try {

        const snapshot = await get(
            ref(database, "users/" + user.uid)
        );

        if (snapshot.exists()) {

            const data = snapshot.val();

            if (data.role === "laboratory") {
                showSection("labProfile");
            } else {
                showSection("profile");
            }

        } else {

            // Fallback: check laboratory directly
            const labSnapshot = await get(
                ref(database, "laboratories/" + user.uid)
            );

            if (labSnapshot.exists()) {
                showSection("labProfile");
            } else {
                showSection("profile");
            }
        }

    } catch (error) {

        console.error("Profile routing error:", error);
        showSection("profile");

    }
};