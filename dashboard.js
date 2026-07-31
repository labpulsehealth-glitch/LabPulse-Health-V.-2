import { database } from "./firebase.js";

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

    try {

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

            if (appointment.status === "Pending") {

                pending++;

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

    } catch (error) {

        dashboard.innerHTML = "<p>Error loading appointments.</p>";

    }

};

window.approveAppointment = async function (id) {

    await update(ref(database, "appointments/" + id), {

        status: "Approved"

    });

    loadDashboard();

    if (typeof loadAppointments === "function") {

        loadAppointments();

    }

};

window.rejectAppointment = async function (id) {

    await update(ref(database, "appointments/" + id), {

        status: "Rejected"

    });

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

    await update(ref(database, "appointments/" + id), {

        result: result,
        status: "Completed"

    });

    alert("Result uploaded successfully!");

    loadDashboard();

    if (typeof loadAppointments === "function") {

        loadAppointments();

    }

};