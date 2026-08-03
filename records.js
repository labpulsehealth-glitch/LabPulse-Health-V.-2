import { auth, database } from "./firebase.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

window.loadRecords = async function () {

    const user = auth.currentUser;

    if (!user) return;

    const recordList = document.getElementById("recordList");

    recordList.innerHTML = "";

    try {

        const snapshot = await get(ref(database, "appointments"));

        if (!snapshot.exists()) {

            recordList.innerHTML =
                "<p>No laboratory results available.</p>";

            return;

        }

        snapshot.forEach((child) => {

            const appointment = child.val();

            if (
                appointment.patientId === user.uid &&
                appointment.status === "Completed"
            ) {

                recordList.innerHTML += `

                <div class="lab-card">

                    <h3>${appointment.test}</h3>

                    <p><strong>🏥 Laboratory:</strong>
                    ${appointment.laboratory}</p>

                    <p><strong>📅 Date:</strong>
                    ${appointment.date}</p>

                    <p>
<strong>Status:</strong>
<span class="status ${appointment.status.toLowerCase()}">
${appointment.status}
</span>
</p>
                    <hr>

                    <h4>Laboratory Result</h4>

                    <p>${appointment.result}</p>
                    <br>
                    <button onclick="downloadReport('${child.key}')">
📄 Download Report
</button>

                </div>
                <br>

                `;

            }

        });

        if (recordList.innerHTML === "") {

            recordList.innerHTML =
                "<p>No laboratory results available.</p>";

        }

    } catch (error) {

    console.error(error);

    recordList.innerHTML =
        "<p>Error loading laboratory records.</p>";

}

};