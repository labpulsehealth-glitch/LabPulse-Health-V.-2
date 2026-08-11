import { auth, database } from "./firebase.js";
import {
  ref,
  push,
  get
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

async function loadApprovedLaboratories() {

    const labSelect = document.getElementById("labSelect");

    if (!labSelect) return;

    try {

        const snapshot =
            await get(ref(database, "laboratories"));

        labSelect.innerHTML =
            '<option value="">Select a Laboratory</option>';

        if (!snapshot.exists()) {
            return;
        }

        snapshot.forEach((child) => {

            const lab = child.val();

            if (lab.status === "Approved") {

                const option =
                    document.createElement("option");

                option.value = child.key;

                option.textContent =
                    lab.labName;

                labSelect.appendChild(option);
            }

        });

    } catch (error) {

        console.error(
            "Error loading laboratories:",
            error
        );

    }
}
window.loadApprovedLaboratories =
    loadApprovedLaboratories;
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
// ===============================
// LOAD APPOINTMENTS
// ===============================

window.loadAppointments = async function () {

    const user = auth.currentUser;

    if (!user) return;

    const appointmentList =
        document.getElementById("appointmentList");

    appointmentList.innerHTML = "";

    try {

        const snapshot = await get(ref(database, "appointments"));

        if (!snapshot.exists()) {

            appointmentList.innerHTML =
                "<p>No appointments found.</p>";

            return;

        }

        snapshot.forEach((child) => {

            const appointment = child.val();

            if (appointment.patientId === user.uid) {

                appointmentList.innerHTML += `

                <div class="lab-card">

                    <h3>${appointment.test}</h3>

                    <p><strong>🏥 Laboratory:</strong>
                    ${appointment.laboratory}</p>

                    <p><strong>📅 Date:</strong>
                    ${appointment.date}</p>

                    <p><strong>🕒 Time:</strong>
                    ${appointment.time}</p>

                    <p><strong>Status:</strong>
<span class="status ${appointment.status.toLowerCase()}">
${
appointment.status === "Pending" ? "🟡" :
appointment.status === "Approved" ? "🟢" :
appointment.status === "Rejected" ? "🔴" :
"🔵"
}
${appointment.status}
</span>
</p>

                </div>

                `;

            }

        });

        if (appointmentList.innerHTML === "") {

            appointmentList.innerHTML =
                "<p>No appointments found.</p>";

        }

    } catch (error) {

        appointmentList.innerHTML =
            "<p>Error loading appointments.</p>";

    }

};