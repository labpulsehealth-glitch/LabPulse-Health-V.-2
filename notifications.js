import { auth, database } from "./firebase.js";

import {
    ref,
    push,
    onValue
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

export async function sendNotification(
    patientId,
    title,
    message
) {

    await push(ref(database, "notifications"), {

        patientId,
        title,
        message,
        date: new Date().toLocaleString(),
        read: false

    });

};

window.loadNotifications = function () {

    const user = auth.currentUser;

    if (!user) return;

    const notificationRef = ref(database, "notifications");

    onValue(notificationRef, (snapshot) => {

        let html = "";

        if (!snapshot.exists()) {

            html = "<p>No notifications yet.</p>";

        } else {

            snapshot.forEach((child) => {

                const notification = child.val();

                if (notification.patientId === user.uid) {

                    html += `

                    <div class="lab-card">

                        <h3>${notification.title}</h3>

                        <p>${notification.message}</p>

                        <small>${notification.date}</small>

                    </div>

                    <br>

                    `;

                }

            });

        }

        document.getElementById("notificationList").innerHTML = html;

    });

};