import { database } from "./firebase.js";
import { sendNotification } from "./notifications.js";

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

window.loadDashboard = async function () {

    const dashboard = document.getElementById("dashboardAppointments");

    if (!dashboard) return;

    dashboard.innerHTML = "";

    let total = 0;
let pending = 0;
let completed = 0;

    try {

        const searchInput = document.getElementById("dashboardSearch");

const search = searchInput
    ? searchInput.value.toLowerCase()
    : "";
    
    const snapshot = await get(ref(database, "appointments"));

        if (!snapshot.exists()) {

            dashboard.innerHTML = "<p>No appointments found.</p>";

            document.getElementById("totalBookings").textContent = 0;
            document.getElementById("pendingBookings").textContent = 0;

            return;

        }

        snapshot.forEach((child) => {

            total++;

            const appointment = child.val();
            const patientName = (appointment.patientName || "").toLowerCase();
const test = (appointment.test || "").toLowerCase();
const laboratory = (appointment.laboratory || "").toLowerCase();
const status = (appointment.status || "").toLowerCase();

if (
    search &&
    !patientName.includes(search) &&
    !test.includes(search) &&
    !laboratory.includes(search) &&
    !status.includes(search)
) {
    return;
}

            if (appointment.status === "Pending") {

                pending++;

            }
            if (appointment.status === "Completed") {

    completed++;

}

            dashboard.innerHTML += `

            <div class="lab-card">

                <h3>${appointment.patientName}</h3>

                <p><strong>🧪 Test:</strong> ${appointment.test}</p>

                <p><strong>🏥 Laboratory:</strong> ${appointment.laboratory}</p>

                <p><strong>📅 Date:</strong> ${appointment.date}</p>

                <p><strong>🕒 Time:</strong> ${appointment.time}</p>

                <p><strong>Status:</strong> ${appointment.status}</p>
<textarea
id="result-${child.key}"
placeholder="Enter laboratory test results here..."
rows="4"
style="width:100%; margin-top:10px;"></textarea>

<br><br>

<button onclick="uploadResult('${child.key}')">
📤 Upload Result
</button>

<br><br>
                <button onclick="approveAppointment('${child.key}')">
                    ✅ Approve
                </button>

                <button onclick="rejectAppointment('${child.key}')">
                    ❌ Reject
                </button>

            </div>

            <br>

            `;

        });

        document.getElementById("totalBookings").textContent = total;
        document.getElementById("pendingBookings").textContent = pending;
        document.getElementById("uploadedResults").textContent = completed;

    } catch (error) {

    console.error(error);

    dashboard.innerHTML =
        "<p>Error loading appointments.</p>";

}
    
};

window.approveAppointment = async function (id) {

    const appointmentRef = ref(database, "appointments/" + id);

    const snapshot = await get(appointmentRef);

    const appointment = snapshot.val();

    await update(appointmentRef, {

        status: "Approved"

    });

    await sendNotification(

        appointment.patientId,

        "✅ Appointment Approved",

        `Your ${appointment.test} appointment at ${appointment.laboratory} has been approved.`

    );

    loadDashboard();

    if (typeof loadAppointments === "function") {

        loadAppointments();

    }

};
window.rejectAppointment = async function (id) {

    const appointmentRef = ref(database, "appointments/" + id);

    const snapshot = await get(appointmentRef);

    const appointment = snapshot.val();

    await update(appointmentRef, {

        status: "Rejected"

    });

    await sendNotification(

        appointment.patientId,

        "❌ Appointment Rejected",

        `Your ${appointment.test} appointment at ${appointment.laboratory} was rejected. Please book another date.`

    );

    loadDashboard();

    if (typeof loadAppointments === "function") {

        loadAppointments();

    }

};
window.uploadResult = async function (id) {

    const result = document.getElementById("result-" + id).value.trim();

    if (result === "") {

        alert("Please enter the laboratory result.");

        return;

    }

    const appointmentRef = ref(database, "appointments/" + id);

    const snapshot = await get(appointmentRef);

    const appointment = snapshot.val();

    await update(appointmentRef, {

        result: result,
        status: "Completed"

    });

    await sendNotification(

        appointment.patientId,

        "📄 Laboratory Result Ready",

        `Your ${appointment.test} result from ${appointment.laboratory} is now available in My Records.`

    );

    alert("Result uploaded successfully!");

    loadDashboard();

    if (typeof loadAppointments === "function") {

        loadAppointments();

    }

};