import { auth, database } from "./firebase.js";

import {
  ref,
  push
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

window.bookTest = async function () {

    const user = auth.currentUser;

    if (!user) {

        document.getElementById("bookingMessage").innerHTML =
            "❌ Please log in first.";

        return;

    }

    const patientName =
        document.getElementById("bookingPatientName").value.trim();

    const patientPhone =
        document.getElementById("bookingPatientPhone").value.trim();

    const laboratory =
        document.getElementById("labSelect").value;

    const test =
        document.getElementById("testSelect").value;

    const date =
        document.getElementById("bookingDate").value;

    const time =
        document.getElementById("bookingTime").value;

    if (
        patientName === "" ||
        patientPhone === "" ||
        laboratory === "Select a Laboratory" ||
        test === "Select a Test" ||
        date === "" ||
        time === ""
    ) {

        document.getElementById("bookingMessage").innerHTML =
            "❌ Please complete every field.";

        return;

    }

    try {

        await push(ref(database, "appointments"), {

            patientId: user.uid,
            patientEmail: user.email,
            patientName: patientName,
            patientPhone: patientPhone,
            laboratory: laboratory,
            test: test,
            date: date,
            time: time,
            status: "Pending"

        });

        document.getElementById("bookingMessage").innerHTML =
            "✅ Appointment booked successfully!";

    } catch (error) {

        document.getElementById("bookingMessage").innerHTML =
            "❌ " + error.message;

    }

};