// ===============================
// BioTrack - Frontend JavaScript
// ===============================


// ===============================
// Mock Waste Data
// ===============================

const wasteData = [
    {
        facility: "City Care Clinic",
        container: "CNT-001",
        category: "Yellow",
        capacity: 20,
        weight: 16.8,
        status: "Warning",
        date: "2026-09-22",
        time: "10:30",
        notes: ""
    },

    {
        facility: "Mediscan Diagnostics",
        container: "CNT-007",
        category: "Red",
        capacity: 20,
        weight: 18.8,
        status: "Critical",
        date: "2026-09-22",
        time: "11:15",
        notes: ""
    },

    {
        facility: "Sunrise Hospital",
        container: "CNT-014",
        category: "Blue",
        capacity: 20,
        weight: 9.2,
        status: "Normal",
        date: "2026-09-22",
        time: "09:45",
        notes: ""
    },

    {
        facility: "HealthPlus Clinic",
        container: "CNT-019",
        category: "Yellow",
        capacity: 20,
        weight: 15.6,
        status: "Warning",
        date: "2026-09-22",
        time: "12:10",
        notes: ""
    }
];


// ===============================
// Facility Data
// ===============================

const facilityData = {

    "City Care Clinic": {
        location: "Jaipur, Rajasthan",
        ward: "Ward 12",
        status: "Active",
        containers: 3,
        waste: "16.8 kg",
        monitoring: "BioTrack Connected"
    },

    "Mediscan Diagnostics": {
        location: "Jaipur, Rajasthan",
        ward: "Ward 8",
        status: "Active",
        containers: 4,
        waste: "18.8 kg",
        monitoring: "BioTrack Connected"
    },

    "Sunrise Hospital": {
        location: "Jaipur, Rajasthan",
        ward: "Ward 5",
        status: "Active",
        containers: 5,
        waste: "9.2 kg",
        monitoring: "BioTrack Connected"
    },

    "HealthPlus Clinic": {
        location: "Jaipur, Rajasthan",
        ward: "Ward 15",
        status: "Pending",
        containers: 2,
        waste: "15.6 kg",
        monitoring: "BioTrack Connected"
    }
};


// ===============================
// Utility
// ===============================

function calculateFillPercentage(weight, capacity) {

    if (capacity <= 0) {
        return 0;
    }

    return Math.round(
        (weight / capacity) * 100
    );
}


function getContainerStatus(percentage) {

    if (percentage >= 90) {
        return "Critical";
    }

    if (percentage >= 75) {
        return "Warning";
    }

    return "Normal";
}


function calculateTotalWaste() {

    return wasteData
        .reduce(
            (total, item) =>
                total + Number(item.weight || 0),
            0
        )
        .toFixed(1);
}


function updateWasteData() {

    wasteData.forEach(item => {

        item.fillPercentage =
            calculateFillPercentage(
                Number(item.weight),
                Number(item.capacity)
            );

        item.status =
            getContainerStatus(
                item.fillPercentage
            );
    });
}


// ===============================
// Dashboard Stats
// ===============================

function updateDashboardStats() {

    const totalWaste =
        document.getElementById("total-waste");

    const containerCount =
        document.getElementById("container-count");

    const criticalCount =
        document.getElementById("critical-alert-count");


    if (totalWaste) {

        totalWaste.textContent =
            `${calculateTotalWaste()} kg`;
    }


    if (containerCount) {

        containerCount.textContent =
            wasteData.length;
    }


    if (criticalCount) {

        criticalCount.textContent =
            wasteData.filter(
                item =>
                    item.status === "Critical"
            ).length;
    }
}


// ===============================
// Navigation
// ===============================

const pageInfo = {

    dashboard: [
        "Dashboard",
        "Biomedical waste monitoring system"
    ],

    facilities: [
        "Facilities",
        "Manage registered healthcare facilities"
    ],

    "waste-management": [
        "Waste Management",
        "Record and monitor biomedical waste"
    ],

    containers: [
        "Containers",
        "Monitor container capacity and status"
    ],

    collection: [
        "Collection",
        "Manage biomedical waste collection"
    ],

    tracking: [
        "Tracking",
        "Monitor healthcare facilities and containers"
    ],

    analytics: [
        "Analytics",
        "Waste monitoring analytics"
    ],

    alerts: [
        "Alerts",
        "Monitor containers and collections requiring attention"
    ],

    settings: [
        "Settings",
        "BioTrack system configuration"
    ]
};


function showSection(sectionId) {

    const target =
        document.getElementById(sectionId);

    if (!target) {
        return;
    }


    document
        .querySelectorAll(".content-section")
        .forEach(section => {

            section.classList.remove(
                "active-section"
            );
        });


    target.classList.add(
        "active-section"
    );


    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            link.classList.toggle(
                "active",
                link.dataset.section === sectionId
            );
        });


    const info =
        pageInfo[sectionId];


    if (info) {

        const title =
            document.getElementById(
                "page-title"
            );

        const subtitle =
            document.getElementById(
                "page-subtitle"
            );


        if (title) {
            title.textContent = info[0];
        }

        if (subtitle) {
            subtitle.textContent = info[1];
        }
    }


    history.replaceState(
        null,
        "",
        `#${sectionId}`
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function setupNavigation() {

    document
        .querySelectorAll(
            ".nav-link, [data-section]:not(.nav-link)"
        )
        .forEach(element => {

            element.addEventListener(
                "click",
                function(event) {

                    const section =
                        element.dataset.section;

                    if (!section) {
                        return;
                    }

                    event.preventDefault();

                    showSection(section);
                }
            );
        });
}


function loadInitialSection() {

    const hash =
        window.location.hash.replace(
            "#",
            ""
        );


    if (
        hash &&
        document.getElementById(hash)
    ) {
        showSection(hash);
    } else {
        showSection("dashboard");
    }
}


// ===============================
// Search
// ===============================

function setupSearch() {

    const input =
        document.getElementById(
            "facility-search"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function() {

            const value =
                input.value
                    .toLowerCase()
                    .trim();


            document
                .querySelectorAll(
                    "#facility-list .facility"
                )
                .forEach(item => {

                    const text =
                        item.textContent
                            .toLowerCase();


                    item.style.display =
                        text.includes(value)
                            ? "flex"
                            : "none";
                });
        }
    );
}


// ===============================
// Facility Modal
// ===============================

function openLocationModal(facilityName) {

    const data =
        facilityData[facilityName];


    if (!data) {
        return;
    }


    closeAllModals();


    const modal =
        document.createElement("div");

    modal.className =
        "location-modal show";


    modal.id =
        "facility-detail-modal";


    modal.innerHTML = `

        <div class="location-modal-content">

            <button
                class="location-modal-close"
                type="button"
                data-close-modal
            >
                <i data-lucide="x"></i>
            </button>


            <div class="modal-icon green">
                <i data-lucide="map-pin"></i>
            </div>


            <h2>
                ${facilityName}
            </h2>


            <p class="modal-subtitle">
                ${data.location} • ${data.ward}
            </p>


            <div class="modal-info-grid">

                <div>
                    <span>Location</span>
                    <strong>
                        ${data.location}
                    </strong>
                </div>

                <div>
                    <span>Status</span>
                    <strong>
                        ${data.status}
                    </strong>
                </div>

                <div>
                    <span>Containers</span>
                    <strong>
                        ${data.containers}
                    </strong>
                </div>

                <div>
                    <span>Current Waste</span>
                    <strong>
                        ${data.waste}
                    </strong>
                </div>

                <div>
                    <span>Ward</span>
                    <strong>
                        ${data.ward}
                    </strong>
                </div>

                <div>
                    <span>Monitoring</span>
                    <strong>
                        ${data.monitoring}
                    </strong>
                </div>

            </div>


            <button
                class="modal-action"
                type="button"
                data-section="facilities"
            >
                View Facility
            </button>

        </div>
    `;


    document.body.appendChild(modal);

    refreshIcons();


    modal
        .querySelector(
            "[data-close-modal]"
        )
        .addEventListener(
            "click",
            () => modal.remove()
        );


    modal
        .querySelector(
            "[data-section]"
        )
        .addEventListener(
            "click",
            function() {

                modal.remove();

                showSection(
                    "facilities"
                );
            }
        );


    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {
                modal.remove();
            }
        }
    );
}


// ===============================
// Facility Clicks
// ===============================

function setupFacilityRows() {

    document
        .querySelectorAll(
            ".facility[data-facility]"
        )
        .forEach(row => {

            row.addEventListener(
                "click",
                function() {

                    openLocationModal(
                        row.dataset.facility
                    );
                }
            );
        });


    document
        .querySelectorAll(
            ".feature-panel[data-facility]"
        )
        .forEach(card => {

            card.addEventListener(
                "click",
                function() {

                    openLocationModal(
                        card.dataset.facility
                    );
                }
            );
        });
}


// ===============================
// Container Modal
// ===============================

function showContainerInfo(container) {

    closeAllModals();


    const percentage =
        calculateFillPercentage(
            container.weight,
            container.capacity
        );


    const modal =
        document.createElement("div");


    modal.className =
        "location-modal show";


    modal.id =
        "container-detail-modal";


    modal.innerHTML = `

        <div class="location-modal-content">

            <button
                class="location-modal-close"
                type="button"
                data-close-modal
            >
                <i data-lucide="x"></i>
            </button>


            <div class="modal-icon green">
                <i data-lucide="box"></i>
            </div>


            <h2>
                ${container.container}
            </h2>


            <p class="modal-subtitle">
                ${container.facility}
            </p>


            <div class="container-detail-grid">

                <div class="container-detail-item">
                    <span>Waste Type</span>
                    <strong>
                        ${container.category}
                    </strong>
                </div>

                <div class="container-detail-item">
                    <span>Status</span>
                    <strong>
                        ${container.status}
                    </strong>
                </div>

                <div class="container-detail-item">
                    <span>Current Weight</span>
                    <strong>
                        ${container.weight} kg
                    </strong>
                </div>

                <div class="container-detail-item">
                    <span>Capacity</span>
                    <strong>
                        ${container.capacity} kg
                    </strong>
                </div>

                <div class="container-detail-item">
                    <span>Fill Level</span>
                    <strong>
                        ${percentage}%
                    </strong>
                </div>

                <div class="container-detail-item">
                    <span>Facility</span>
                    <strong>
                        ${container.facility}
                    </strong>
                </div>

            </div>


            <div class="container-progress-box">

                <div class="progress-heading">

                    <span>
                        Container Capacity
                    </span>

                    <strong>
                        ${percentage}%
                    </strong>

                </div>


                <div class="container-progress">

                    <div
                        class="container-progress-fill"
                        style="width:${percentage}%"
                    ></div>

                </div>


                <div class="progress-footer">

                    <span>
                        ${container.weight} kg used
                    </span>

                    <span>
                        ${container.capacity} kg total
                    </span>

                </div>

            </div>


            <button
                class="modal-action"
                type="button"
                data-close-modal
            >
                Close
            </button>

        </div>
    `;


    document.body.appendChild(modal);

    refreshIcons();


    modal
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => modal.remove()
            );
        });


    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {
                modal.remove();
            }
        }
    );
}


// ===============================
// Container Cards
// ===============================

function setupContainerCards() {

    document
        .querySelectorAll(
            ".container-card[data-container]"
        )
        .forEach(card => {

            card.addEventListener(
                "click",
                function() {

                    const container =
                        wasteData.find(
                            item =>
                                item.container ===
                                card.dataset.container
                        );


                    if (container) {
                        showContainerInfo(
                            container
                        );
                    }
                }
            );
        });
}


// ===============================
// Critical Alerts
// ===============================

function openCriticalAlertModal(type) {

    closeAllModals();


    let title = "";
    let subtitle = "";
    let icon = "triangle-alert";
    let iconClass = "alert-modal-icon";
    let details = "";


    if (type === "CNT-007") {

        title =
            "Container CNT-007";

        subtitle =
            "Critical container requires immediate attention";

        icon =
            "triangle-alert";


        details = `

            <div class="container-detail-grid">

                <div class="container-detail-item">
                    <span>Facility</span>
                    <strong>
                        Mediscan Diagnostics
                    </strong>
                </div>

                <div class="container-detail-item">
                    <span>Waste Type</span>
                    <strong>Red</strong>
                </div>

                <div class="container-detail-item">
                    <span>Current Weight</span>
                    <strong>18.8 kg</strong>
                </div>

                <div class="container-detail-item">
                    <span>Capacity</span>
                    <strong>20 kg</strong>
                </div>

                <div class="container-detail-item">
                    <span>Fill Level</span>
                    <strong>94%</strong>
                </div>

                <div class="container-detail-item">
                    <span>Status</span>
                    <strong>Critical</strong>
                </div>

            </div>
        `;
    }


    if (type === "collection") {

        title =
            "Collection Pending";

        subtitle =
            "A collection request is waiting for action";

        icon =
            "clock-3";

        iconClass =
            "alert-modal-icon";


        details = `

            <div class="container-detail-grid">

                <div class="container-detail-item">
                    <span>Facility</span>
                    <strong>
                        City Care Clinic
                    </strong>
                </div>

                <div class="container-detail-item">
                    <span>Container</span>
                    <strong>
                        CNT-001
                    </strong>
                </div>

                <div class="container-detail-item">
                    <span>Fill Level</span>
                    <strong>
                        84%
                    </strong>
                </div>

                <div class="container-detail-item">
                    <span>Status</span>
                    <strong>
                        Collection Pending
                    </strong>
                </div>

            </div>
        `;
    }


    if (type === "CNT-019") {

        title =
            "Container CNT-019";

        subtitle =
            "Container capacity warning";

        icon =
            "circle-alert";


        details = `

            <div class="container-detail-grid">

                <div class="container-detail-item">
                    <span>Facility</span>
                    <strong>
                        HealthPlus Clinic
                    </strong>
                </div>

                <div class="container-detail-item">
                    <span>Waste Type</span>
                    <strong>
                        Yellow
                    </strong>
                </div>

                <div class="container-detail-item">
                    <span>Current Weight</span>
                    <strong>
                        15.6 kg
                    </strong>
                </div>

                <div class="container-detail-item">
                    <span>Capacity</span>
                    <strong>
                        20 kg
                    </strong>
                </div>

                <div class="container-detail-item">
                    <span>Fill Level</span>
                    <strong>
                        78%
                    </strong>
                </div>

                <div class="container-detail-item">
                    <span>Status</span>
                    <strong>
                        Warning
                    </strong>
                </div>

            </div>
        `;
    }


    const modal =
        document.createElement("div");


    modal.className =
        "location-modal show";


    modal.id =
        "critical-alert-modal";


    modal.innerHTML = `

        <div class="location-modal-content">

            <button
                class="location-modal-close"
                type="button"
                data-close-modal
            >
                <i data-lucide="x"></i>
            </button>


            <div class="modal-icon ${iconClass}">

                <i data-lucide="${icon}"></i>

            </div>


            <h2>
                ${title}
            </h2>


            <p class="modal-subtitle">
                ${subtitle}
            </p>


            ${details}


            <button
                class="modal-action"
                type="button"
                data-close-modal
            >
                Close
            </button>

        </div>
    `;


    document.body.appendChild(modal);

    refreshIcons();


    modal
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => modal.remove()
            );
        });


    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {
                modal.remove();
            }
        }
    );
}


function setupCriticalAlerts() {

    document
        .querySelectorAll(
            ".critical-alert-item[data-alert]"
        )
        .forEach(alert => {

            alert.addEventListener(
                "click",
                function() {

                    openCriticalAlertModal(
                        alert.dataset.alert
                    );
                }
            );
        });
}


// ===============================
// Add Waste
// ===============================

function openWasteEntry() {

    closeAllModals();


    const modal =
        document.createElement("div");


    modal.className =
        "location-modal show";


    modal.id =
        "waste-entry-modal";


    modal.innerHTML = `

        <div
            class="
                location-modal-content
                waste-entry-content
            "
        >

            <button
                class="location-modal-close"
                type="button"
                data-close-modal
            >
                <i data-lucide="x"></i>
            </button>


            <div class="modal-icon green">
                <i data-lucide="plus"></i>
            </div>


            <h2>
                Add Waste Entry
            </h2>


            <p class="modal-subtitle">
                Enter biomedical waste details manually
            </p>


            <form id="waste-entry-form">

                <div class="waste-form-grid">

                    <div class="form-group">

                        <label>
                            Facility
                        </label>

                        <select
                            id="waste-facility"
                            required
                        >

                            <option value="">
                                Select facility
                            </option>

                            <option>
                                City Care Clinic
                            </option>

                            <option>
                                Mediscan Diagnostics
                            </option>

                            <option>
                                Sunrise Hospital
                            </option>

                            <option>
                                HealthPlus Clinic
                            </option>

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Container ID
                        </label>

                        <input
                            id="waste-container"
                            type="text"
                            placeholder="CNT-025"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Waste Category
                        </label>

                        <select
                            id="waste-category"
                            required
                        >

                            <option value="">
                                Select category
                            </option>

                            <option value="Yellow">
                                Yellow
                            </option>

                            <option value="Red">
                                Red
                            </option>

                            <option value="Blue">
                                Blue
                            </option>

                            <option value="White">
                                White
                            </option>

                        </select>

                    </div>


                    <div class="form-group">

                        <label>
                            Current Weight (kg)
                        </label>

                        <input
                            id="waste-weight"
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="12.5"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Container Capacity (kg)
                        </label>

                        <input
                            id="waste-capacity"
                            type="number"
                            min="1"
                            step="0.1"
                            value="20"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Waste Date
                        </label>

                        <input
                            id="waste-date"
                            type="date"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Waste Time
                        </label>

                        <input
                            id="waste-time"
                            type="time"
                            required
                        >

                    </div>

                </div>


                <div class="form-group full-width">

                    <label>
                        Notes
                    </label>

                    <textarea
                        id="waste-notes"
                        rows="3"
                        placeholder="Add additional information..."
                    ></textarea>

                </div>


                <div class="form-actions">

                    <button
                        type="button"
                        class="secondary-btn"
                        data-close-modal
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        class="primary-btn"
                    >

                        <i data-lucide="save"></i>

                        Save Waste

                    </button>

                </div>

            </form>

        </div>
    `;


    document.body.appendChild(modal);


    const now =
        new Date();


    document.getElementById(
        "waste-date"
    ).value =
        now.toISOString()
            .split("T")[0];


    document.getElementById(
        "waste-time"
    ).value =
        now.toTimeString()
            .slice(0, 5);


    refreshIcons();


    modal
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => modal.remove()
            );
        });


    modal
        .querySelector(
            "#waste-entry-form"
        )
        .addEventListener(
            "submit",
            function(event) {

                event.preventDefault();

                saveWasteEntry();
            }
        );


    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {
                modal.remove();
            }
        }
    );
}


// ===============================
// Save Waste
// ===============================

function saveWasteEntry() {

    const facility =
        document.getElementById(
            "waste-facility"
        ).value;

    const container =
        document.getElementById(
            "waste-container"
        ).value.trim();

    const category =
        document.getElementById(
            "waste-category"
        ).value;

    const weight =
        parseFloat(
            document.getElementById(
                "waste-weight"
            ).value
        );

    const capacity =
        parseFloat(
            document.getElementById(
                "waste-capacity"
            ).value
        );

    const date =
        document.getElementById(
            "waste-date"
        ).value;

    const time =
        document.getElementById(
            "waste-time"
        ).value;

    const notes =
        document.getElementById(
            "waste-notes"
        ).value.trim();


    if (
        !facility ||
        !container ||
        !category ||
        Number.isNaN(weight) ||
        Number.isNaN(capacity) ||
        !date ||
        !time
    ) {

        alert(
            "Please fill all required fields."
        );

        return;
    }


    if (weight > capacity) {

        alert(
            "Current weight cannot be greater than container capacity."
        );

        return;
    }


    const newContainer = {

        facility,
        container,
        category,
        capacity,
        weight,
        date,
        time,
        notes,

        fillPercentage:
            calculateFillPercentage(
                weight,
                capacity
            ),

        status:
            getContainerStatus(
                calculateFillPercentage(
                    weight,
                    capacity
                )
            )
    };


    wasteData.push(
        newContainer
    );


    updateWasteData();

    updateDashboardStats();


    addContainerCard(
        newContainer
    );


    addContainerToAllContainers(
        newContainer
    );


    const modal =
        document.getElementById(
            "waste-entry-modal"
        );


    if (modal) {
        modal.remove();
    }


    showToast(
        "Waste entry saved successfully."
    );
}


// ===============================
// Add Container Card
// ===============================

function createContainerCard(container) {

    const percentage =
        calculateFillPercentage(
            container.weight,
            container.capacity
        );


    const card =
        document.createElement("div");


    card.className =
        "container-card";


    card.dataset.container =
        container.container;


    let progressClass = "";


    if (container.category === "Red") {
        progressClass =
            "red-progress";
    }

    if (container.category === "Blue") {
        progressClass =
            "blue-progress";
    }


    card.innerHTML = `

        <div class="container-top">

            <span>
                ${container.container}
            </span>

            <span
                class="
                    container-status
                    ${getStatusClass(container.status)}
                "
            >
                ${container.status}
            </span>

        </div>


        <h3>
            ${container.facility}
        </h3>


        <p>
            ${container.category} Waste
        </p>


        <div class="fill-info">

            <strong>
                ${container.weight} kg
            </strong>

            <span>
                / ${container.capacity} kg
            </span>

        </div>


        <div class="progress large">

            <div
                class="
                    progress-bar
                    ${progressClass}
                "
                style="width:${percentage}%"
            ></div>

        </div>


        <div class="fill-footer">

            <span>
                ${percentage}% filled
            </span>

            <span>
                ${container.status}
            </span>

        </div>
    `;


    card.addEventListener(
        "click",
        function() {

            showContainerInfo(
                container
            );
        }
    );


    return card;
}


function addContainerCard(container) {

    const grid =
        document.getElementById(
            "container-grid"
        );


    if (!grid) {
        return;
    }


    const card =
        createContainerCard(
            container
        );


    grid.appendChild(card);
}


function addContainerToAllContainers(container) {

    const grid =
        document.getElementById(
            "all-container-grid"
        );


    if (!grid) {
        return;
    }


    const card =
        createContainerCard(
            container
        );


    grid.appendChild(card);
}


function getStatusClass(status) {

    if (status === "Critical") {
        return "danger-status";
    }

    if (status === "Warning") {
        return "warning-status";
    }

    return "active-status";
}


function renderAllContainers() {

    const grid =
        document.getElementById(
            "all-container-grid"
        );


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    wasteData.forEach(
        container => {

            grid.appendChild(
                createContainerCard(
                    container
                )
            );
        }
    );
}


// ===============================
// Add Waste Buttons
// ===============================

function setupWasteButtons() {

    document
        .querySelectorAll(
            "#add-waste-btn, #section-add-waste"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    openWasteEntry();
                }
            );
        });
}


// ===============================
// Notification
// ===============================

function setupNotification() {

    const button =
        document.getElementById(
            "notification-btn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function() {

            showSection("alerts");
        }
    );
}


// ===============================
// Waste Filter
// ===============================

function setupWasteFilter() {

    const filter =
        document.getElementById(
            "waste-period"
        );


    if (!filter) {
        return;
    }


    filter.addEventListener(
        "change",
        function() {

            console.log(
                "Selected period:",
                filter.value
            );
        }
    );
}


// ===============================
// Map
// ===============================

function setupMapMarkers() {

    document
        .querySelectorAll(
            ".map-marker[data-facility]"
        )
        .forEach(marker => {

            marker.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    event.stopPropagation();


                    openLocationModal(
                        marker.dataset.facility
                    );
                }
            );
        });
}


// ===============================
// Escape / Modal
// ===============================

function closeAllModals() {

    document
        .querySelectorAll(
            ".location-modal"
        )
        .forEach(modal => {

            modal.remove();
        });
}


function setupEscapeKey() {

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape"
            ) {
                closeAllModals();
            }
        }
    );
}


// ===============================
// Toast
// ===============================

function showToast(message) {

    const oldToast =
        document.getElementById(
            "biotrack-toast"
        );


    if (oldToast) {
        oldToast.remove();
    }


    const toast =
        document.createElement("div");


    toast.id =
        "biotrack-toast";


    toast.innerHTML = `

        <i data-lucide="check-circle-2"></i>

        <span>
            ${message}
        </span>
    `;


    Object.assign(
        toast.style,
        {
            position: "fixed",
            right: "24px",
            bottom: "24px",
            zIndex: "1000",
            display: "flex",
            alignItems: "center",
            gap: "9px",
            padding: "13px 17px",
            borderRadius: "11px",
            background: "#15803d",
            color: "#fff",
            fontSize: "12px",
            fontWeight: "700",
            boxShadow:
                "0 12px 30px rgba(15,23,42,.18)"
        }
    );


    document.body.appendChild(
        toast
    );


    refreshIcons();


    setTimeout(
        () => toast.remove(),
        2600
    );
}


// ===============================
// Icons
// ===============================

function refreshIcons() {

    if (
        typeof lucide !== "undefined"
    ) {
        lucide.createIcons();
    }
}


// ===============================
// Initialize
// ===============================

function initializeBioTrack() {

    updateWasteData();

    updateDashboardStats();

    setupNavigation();

    setupSearch();

    setupFacilityRows();

    setupContainerCards();

    setupCriticalAlerts();

    setupWasteButtons();

    setupNotification();

    setupWasteFilter();

    setupMapMarkers();

    setupEscapeKey();

    renderAllContainers();

    loadInitialSection();

    refreshIcons();


    console.log(
        "BioTrack loaded successfully."
    );
}


// ===============================
// Start
// ===============================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeBioTrack
    );

} else {

    initializeBioTrack();
}