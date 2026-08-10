// =========================================
// LABPULSE HEALTH
// ADMIN PANEL
// =========================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getDatabase,
    ref,
    get,
    update
} from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


// =========================================
// FIREBASE CONFIGURATION
// =========================================

const firebaseConfig = {

    apiKey: "AIzaSyBdurMGIYSPrBdhS2Q4yNjV0-KnO8p-CFE",

    authDomain:
        "labpulse-health.firebaseapp.com",

    databaseURL:
        "https://labpulse-health-default-rtdb.firebaseio.com",

    projectId:
        "labpulse-health",

    storageBucket:
        "labpulse-health.firebasestorage.app",

    messagingSenderId:
        "215495630178",

    appId:
        "1:215495630178:web:c0f494b60f342b7ede203b"
};


// =========================================
// INITIALIZE FIREBASE
// =========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const database = getDatabase(app);


// =========================================
// ADMIN UID
// =========================================

const ADMIN_UID =
    "I21NcEMBgYUUPJKMvz8A5p7zXsH2";


// =========================================
// PAGE ELEMENTS
// =========================================

const loginPage =
    document.getElementById("adminLoginPage");

const dashboard =
    document.getElementById("adminDashboard");

const loginForm =
    document.getElementById("adminLoginForm");

const loginMessage =
    document.getElementById("adminAuthMessage");

const logoutButton =
    document.getElementById("adminLogout");

const laboratoryList =
    document.getElementById("laboratoryList");

const totalLabs =
    document.getElementById("totalLabs");

const pendingLabs =
    document.getElementById("pendingLabs");

const approvedLabs =
    document.getElementById("approvedLabs");

const rejectedLabs =
    document.getElementById("rejectedLabs");

const refreshButton =
    document.getElementById("refreshLabs");

const labModal =
    document.getElementById("labModal");

const closeLabModal =
    document.getElementById("closeLabModal");

const modalLabName =
    document.getElementById("modalLabName");

const modalLabDetails =
    document.getElementById("modalLabDetails");

const approveLabButton =
    document.getElementById("approveLabButton");

const rejectLabButton =
    document.getElementById("rejectLabButton");


// =========================================
// CURRENT LABORATORY
// =========================================

let selectedLabId = null;


// =========================================
// INITIAL STATE
// =========================================

loginPage.style.display = "flex";

dashboard.style.display = "none";


// =========================================
// ADMIN LOGIN
// =========================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const email =
            document
                .getElementById("adminEmail")
                .value
                .trim();

        const password =
            document
                .getElementById("adminPassword")
                .value;

        if (!email || !password) {

            loginMessage.innerHTML =
                "❌ Please enter your email and password.";

            return;
        }

        loginMessage.innerHTML =
            "Signing in...";

        try {

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user =
                userCredential.user;


            // =================================
            // VERIFY ADMIN UID
            // =================================

            if (user.uid !== ADMIN_UID) {

                await signOut(auth);

                loginMessage.innerHTML =
                    "❌ You are not authorized to access the LabPulse Admin Panel.";

                return;
            }


            // =================================
            // ADMIN AUTHORIZED
            // =================================

            loginMessage.innerHTML =
                "✅ Admin login successful.";

            showAdminDashboard();

        }

        catch (error) {

            console.error(
                "Admin login error:",
                error
            );

            loginMessage.innerHTML =
                "❌ Invalid admin email or password.";

        }

    }
);


// =========================================
// AUTH STATE
// =========================================

onAuthStateChanged(
    auth,
    function (user) {

        if (!user) {

            showLoginPage();

            return;
        }


        // User exists, but must be the
        // designated administrator.

        if (user.uid !== ADMIN_UID) {

            signOut(auth);

            showLoginPage();

            return;
        }


        showAdminDashboard();

    }
);


// =========================================
// SHOW LOGIN
// =========================================

function showLoginPage() {

    loginPage.style.display = "flex";

    dashboard.style.display = "none";

}


// =========================================
// SHOW DASHBOARD
// =========================================

function showAdminDashboard() {

    loginPage.style.display = "none";

    dashboard.style.display = "block";

    loadLaboratories();

}


// =========================================
// LOGOUT
// =========================================

logoutButton.addEventListener(
    "click",
    async function () {

        try {

            await signOut(auth);

            showLoginPage();

            loginMessage.innerHTML =
                "";

        }

        catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    }
);


// =========================================
// LOAD LABORATORIES
// =========================================

async function loadLaboratories() {

    laboratoryList.innerHTML =
        '<div class="loading">Loading laboratories...</div>';

    try {

        const labsRef =
            ref(database, "laboratories");

        const snapshot =
            await get(labsRef);


        if (!snapshot.exists()) {

            laboratoryList.innerHTML =
                '<div class="empty-message">No laboratory applications found.</div>';

            updateStatistics([]);

            return;
        }


        const data =
            snapshot.val();


        const laboratories =
            Object.entries(data).map(
                ([id, lab]) => ({

                    id: id,

                    ...lab

                })
            );


        updateStatistics(
            laboratories
        );


        // Newest applications first

        laboratories.sort(
            function (a, b) {

                return new Date(
                    b.createdAt || 0
                ) -
                new Date(
                    a.createdAt || 0
                );

            }
        );


        laboratoryList.innerHTML =
            "";


        laboratories.forEach(
            function (lab) {

                laboratoryList.appendChild(
                    createLaboratoryCard(lab)
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Error loading laboratories:",
            error
        );

        laboratoryList.innerHTML =
            `
            <div class="empty-message">
                ❌ Unable to load laboratories.
                <br><br>
                ${escapeHtml(error.message)}
            </div>
            `;

    }

}


// =========================================
// UPDATE STATISTICS
// =========================================

function updateStatistics(
    laboratories
) {

    const total =
        laboratories.length;

    const pending =
        laboratories.filter(
            lab => lab.status === "Pending"
        ).length;

    const approved =
        laboratories.filter(
            lab => lab.status === "Approved"
        ).length;

    const rejected =
        laboratories.filter(
            lab => lab.status === "Rejected"
        ).length;


    totalLabs.textContent =
        total;

    pendingLabs.textContent =
        pending;

    approvedLabs.textContent =
        approved;

    rejectedLabs.textContent =
        rejected;

}


// =========================================
// CREATE LABORATORY CARD
// =========================================

function createLaboratoryCard(lab) {

    const card =
        document.createElement("div");

    card.className =
        "admin-lab-card";


    const status =
        lab.status || "Pending";


    const statusClass =
        status.toLowerCase();


    card.innerHTML = `

        <div class="admin-lab-header">

            <div>

                <h3>
                    ${escapeHtml(
                        lab.labName ||
                        "Unnamed Laboratory"
                    )}
                </h3>

                <p class="lab-email">
                    ${escapeHtml(
                        lab.email ||
                        "No email provided"
                    )}
                </p>

            </div>

            <span class="status status-${statusClass}">
                ${escapeHtml(status)}
            </span>

        </div>


        <button
            class="view-lab-button"
            data-lab-id="${escapeHtml(lab.id)}"
        >
            View Application
        </button>

    `;


    const button =
        card.querySelector(
            ".view-lab-button"
        );


    button.addEventListener(
        "click",
        function () {

            openLaboratory(
                lab
            );

        }
    );


    return card;

}


// =========================================
// OPEN LABORATORY
// =========================================

function openLaboratory(lab) {

    selectedLabId =
        lab.id;


    modalLabName.textContent =
        lab.labName ||
        "Laboratory";


    modalLabDetails.innerHTML = `

        ${detail(
            "Laboratory Name",
            lab.labName
        )}

        ${detail(
            "Owner / Manager",
            lab.ownerName
        )}

        ${detail(
            "Email",
            lab.email
        )}

        ${detail(
            "Phone",
            lab.phone
        )}

        ${detail(
            "Address",
            lab.address
        )}

        ${detail(
            "City",
            lab.city
        )}

        ${detail(
            "State",
            lab.state
        )}

        ${detail(
            "Country",
            lab.country
        )}

        ${detail(
            "Laboratory Type",
            lab.labType
        )}

        ${detail(
            "Operating Hours",
            lab.operatingHours
        )}

        ${detail(
            "About",
            lab.description
        )}

        ${detail(
            "Tests",
            formatTests(
                lab.tests
            )
        )}

        ${detail(
            "Status",
            lab.status || "Pending"
        )}

        ${detail(
            "Created",
            lab.createdAt
        )}

    `;


    // Show/hide action buttons

    if (
        lab.status === "Approved"
    ) {

        approveLabButton.style.display =
            "none";

        rejectLabButton.style.display =
            "block";

    }

    else if (
        lab.status === "Rejected"
    ) {

        approveLabButton.style.display =
            "block";

        rejectLabButton.style.display =
            "none";

    }

    else {

        approveLabButton.style.display =
            "block";

        rejectLabButton.style.display =
            "block";

    }


    labModal.style.display =
        "flex";

}


// =========================================
// DETAIL HELPER
// =========================================

function detail(
    label,
    value
) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return "";

    }


    return `

        <div class="modal-detail">

            <strong>
                ${escapeHtml(label)}
            </strong>

            <span>
                ${escapeHtml(
                    String(value)
                )}
            </span>

        </div>

    `;

}


// =========================================
// FORMAT TESTS
// =========================================

function formatTests(tests) {

    if (!tests) {

        return "No tests submitted.";

    }


    if (Array.isArray(tests)) {

        return tests.join(", ");

    }


    if (
        typeof tests === "object"
    ) {

        return Object.values(tests)
            .join(", ");

    }


    return String(tests);

}


// =========================================
// APPROVE LABORATORY
// =========================================

approveLabButton.addEventListener(
    "click",
    async function () {

        if (!selectedLabId) {

            return;
        }


        const confirmed =
            confirm(
                "Approve this laboratory? It will become visible to patients."
            );


        if (!confirmed) {

            return;
        }


        await changeLaboratoryStatus(
            selectedLabId,
            "Approved"
        );

    }
);


// =========================================
// REJECT LABORATORY
// =========================================

rejectLabButton.addEventListener(
    "click",
    async function () {

        if (!selectedLabId) {

            return;
        }


        const confirmed =
            confirm(
                "Reject this laboratory application?"
            );


        if (!confirmed) {

            return;
        }


        await changeLaboratoryStatus(
            selectedLabId,
            "Rejected"
        );

    }
);


// =========================================
// CHANGE STATUS
// =========================================

async function changeLaboratoryStatus(
    labId,
    newStatus
) {

    try {

        const labRef =
            ref(
                database,
                "laboratories/" +
                labId
            );


        await update(
            labRef,
            {
                status:
                    newStatus,

                reviewedAt:
                    new Date().toISOString(),

                reviewedBy:
                    auth.currentUser.uid
            }
        );


        alert(
            newStatus === "Approved"
                ? "✅ Laboratory approved successfully."
                : "❌ Laboratory rejected."
        );


        labModal.style.display =
            "none";


        selectedLabId =
            null;


        await loadLaboratories();

    }

    catch (error) {

        console.error(
            "Status update error:",
            error
        );


        alert(
            "❌ Unable to update laboratory status."
        );

    }

}


// =========================================
// CLOSE MODAL
// =========================================

closeLabModal.addEventListener(
    "click",
    function () {

        labModal.style.display =
            "none";

        selectedLabId =
            null;

    }
);


labModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            labModal
        ) {

            labModal.style.display =
                "none";

            selectedLabId =
                null;

        }

    }
);


// =========================================
// REFRESH
// =========================================

refreshButton.addEventListener(
    "click",
    function () {

        loadLaboratories();

    }
);


// =========================================
// HTML ESCAPING
// =========================================

function escapeHtml(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


console.log(
    "✅ LabPulse Admin Panel Loaded"
);