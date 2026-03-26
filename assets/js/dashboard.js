const dashboardBody = document.body;
const dashboardHeader = document.getElementById("dashboardHeader");
const sidebarToggle = document.getElementById("dashboardToggle");
const sidebarOverlay = document.getElementById("dashboardOverlay");
const profileMenu = document.getElementById("profileMenu");
const profileToggle = document.getElementById("profileToggle");
const profileItems = profileMenu?.querySelectorAll(".dropdown-item") ?? [];
const panelLinks = document.querySelectorAll(".dashboard-link[data-panel]");
const panels = document.querySelectorAll(".dashboard-panel");
const bookingFilters = document.querySelectorAll(".filter-chip[data-filter]");
const bookingRows = document.querySelectorAll(".booking-row[data-status]");
const themeToggle = document.getElementById("themeToggle");
const rtlToggle = document.getElementById("rtlToggle");
const modal = document.getElementById("bookingModal");
const modalTriggers = document.querySelectorAll("[data-modal-target]");
const modalCloseButtons = document.querySelectorAll("[data-modal-close]");
const modalFields = modal?.querySelectorAll("[data-modal-field]") ?? [];
const userSearch = document.getElementById("userSearch");
const userRoleFilter = document.getElementById("userRoleFilter");
const userStatusFilter = document.getElementById("userStatusFilter");
const userRows = Array.from(document.querySelectorAll(".admin-user-row"));
const userPagination = document.getElementById("userPagination");

const chartInstances = new Map();

const setHeaderState = () => {
  if (!dashboardHeader) return;
  dashboardHeader.classList.toggle("is-scrolled", window.scrollY > 8);
};

const setTheme = (mode) => {
  if (!themeToggle) return;
  const icon = themeToggle.querySelector("i");
  if (mode === "dark") {
    dashboardBody.classList.add("dark-mode");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
    themeToggle.setAttribute("aria-pressed", "true");
  } else {
    dashboardBody.classList.remove("dark-mode");
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    themeToggle.setAttribute("aria-pressed", "false");
  }
};

const setRtl = (enabled) => {
  if (!rtlToggle) return;
  dashboardBody.classList.toggle("rtl", enabled);
  rtlToggle.setAttribute("aria-pressed", enabled ? "true" : "false");
};

const getChartPalette = () => {
  const isDark = dashboardBody.classList.contains("dark-mode");
  return {
    grid: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(27, 43, 52, 0.08)",
    ticks: isDark ? "rgba(239, 247, 246, 0.7)" : "rgba(27, 43, 52, 0.6)",
    line: isDark ? "rgba(95, 182, 173, 0.85)" : "rgba(58, 141, 140, 0.85)",
    lineFill: isDark ? "rgba(95, 182, 173, 0.15)" : "rgba(58, 141, 140, 0.18)",
    bar: isDark ? "rgba(244, 200, 107, 0.55)" : "rgba(244, 200, 107, 0.45)",
    barBorder: isDark ? "rgba(244, 200, 107, 0.8)" : "rgba(244, 200, 107, 0.7)",
    pie: [
      isDark ? "rgba(95, 182, 173, 0.75)" : "rgba(58, 141, 140, 0.7)",
      isDark ? "rgba(244, 200, 107, 0.75)" : "rgba(244, 200, 107, 0.65)",
      isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(27, 43, 52, 0.2)"
    ]
  };
};

const createChart = (canvasId, config) => {
  if (!window.Chart) return null;
  const canvas = document.getElementById(canvasId);
  if (!canvas || chartInstances.has(canvasId)) return null;
  const ctx = canvas.getContext("2d");
  const chart = new Chart(ctx, config);
  chartInstances.set(canvasId, chart);
  return chart;
};

const initAdminCharts = () => {
  if (!window.Chart) return;
  const palette = getChartPalette();
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { intersect: false, mode: "index" }
    },
    scales: {
      x: {
        grid: { color: palette.grid },
        ticks: { color: palette.ticks }
      },
      y: {
        grid: { color: palette.grid },
        ticks: { color: palette.ticks }
      }
    }
  };
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom", labels: { color: palette.ticks } } },
    cutout: "70%"
  };

  createChart("adminBookingsChart", {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          data: [180, 240, 210, 280],
          borderColor: palette.line,
          backgroundColor: palette.lineFill,
          fill: true,
          tension: 0.35,
          pointRadius: 0
        }
      ]
    },
    options: commonOptions
  });

  createChart("adminServicesChart", {
    type: "bar",
    data: {
      labels: ["Walking", "Sitting", "Daycare", "Grooming"],
      datasets: [
        {
          data: [420, 310, 260, 140],
          backgroundColor: palette.bar,
          borderColor: palette.barBorder,
          borderWidth: 1.5,
          borderRadius: 10
        }
      ]
    },
    options: commonOptions
  });

  createChart("adminRevenueChart", {
    type: "doughnut",
    data: {
      labels: ["Subscriptions", "One-time", "Add-ons"],
      datasets: [
        {
          data: [52, 32, 16],
          backgroundColor: palette.pie,
          borderWidth: 0
        }
      ]
    },
    options: doughnutOptions
  });

  createChart("usersGrowthChart", {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8"],
      datasets: [
        {
          data: [120, 140, 160, 190, 210, 235, 260, 290],
          borderColor: palette.line,
          backgroundColor: palette.lineFill,
          fill: true,
          tension: 0.35,
          pointRadius: 0
        }
      ]
    },
    options: commonOptions
  });

  createChart("usersRoleChart", {
    type: "doughnut",
    data: {
      labels: ["Clients", "Sitters", "Admins"],
      datasets: [
        {
          data: [68, 28, 4],
          backgroundColor: palette.pie,
          borderWidth: 0
        }
      ]
    },
    options: doughnutOptions
  });

  createChart("sittersApprovalChart", {
    type: "line",
    data: {
      labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
      datasets: [
        {
          data: [14, 18, 20, 22, 26, 24],
          borderColor: palette.line,
          backgroundColor: palette.lineFill,
          fill: true,
          tension: 0.35,
          pointRadius: 0
        }
      ]
    },
    options: commonOptions
  });

  createChart("sittersRatingChart", {
    type: "doughnut",
    data: {
      labels: ["5★", "4★", "3★+"],
      datasets: [
        {
          data: [58, 32, 10],
          backgroundColor: palette.pie,
          borderWidth: 0
        }
      ]
    },
    options: doughnutOptions
  });

  createChart("bookingsVolumeChart", {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"],
      datasets: [
        {
          data: [36, 42, 38, 50, 56, 64, 58, 62, 66, 70],
          borderColor: palette.line,
          backgroundColor: palette.lineFill,
          fill: true,
          tension: 0.35,
          pointRadius: 0
        }
      ]
    },
    options: commonOptions
  });

  createChart("bookingsStatusChart", {
    type: "doughnut",
    data: {
      labels: ["Confirmed", "Pending", "Completed"],
      datasets: [
        {
          data: [52, 18, 30],
          backgroundColor: palette.pie,
          borderWidth: 0
        }
      ]
    },
    options: doughnutOptions
  });

  createChart("servicesTrendChart", {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          data: [180, 210, 240, 230, 260, 290],
          borderColor: palette.line,
          backgroundColor: palette.lineFill,
          fill: true,
          tension: 0.35,
          pointRadius: 0
        }
      ]
    },
    options: commonOptions
  });

  createChart("servicesShareChart", {
    type: "doughnut",
    data: {
      labels: ["Walking", "Sitting", "Daycare"],
      datasets: [
        {
          data: [46, 34, 20],
          backgroundColor: palette.pie,
          borderWidth: 0
        }
      ]
    },
    options: doughnutOptions
  });

  createChart("paymentsTrendChart", {
    type: "line",
    data: {
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
      datasets: [
        {
          data: [28, 30, 32, 34, 36, 38, 41, 40, 44, 46, 48, 52],
          borderColor: palette.line,
          backgroundColor: palette.lineFill,
          fill: true,
          tension: 0.35,
          pointRadius: 0
        }
      ]
    },
    options: commonOptions
  });

  createChart("paymentsMethodChart", {
    type: "doughnut",
    data: {
      labels: ["Card", "Wallet", "Bank"],
      datasets: [
        {
          data: [62, 26, 12],
          backgroundColor: palette.pie,
          borderWidth: 0
        }
      ]
    },
    options: doughnutOptions
  });

  createChart("reviewsTrendChart", {
    type: "line",
    data: {
      labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
      datasets: [
        {
          data: [48, 52, 55, 60, 58, 64],
          borderColor: palette.line,
          backgroundColor: palette.lineFill,
          fill: true,
          tension: 0.35,
          pointRadius: 0
        }
      ]
    },
    options: commonOptions
  });

  createChart("reviewsRatingChart", {
    type: "doughnut",
    data: {
      labels: ["5★", "4★", "3★"],
      datasets: [
        {
          data: [64, 26, 10],
          backgroundColor: palette.pie,
          borderWidth: 0
        }
      ]
    },
    options: doughnutOptions
  });

  createChart("notificationsTrendChart", {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          data: [12, 18, 14, 22, 20, 16, 24],
          borderColor: palette.line,
          backgroundColor: palette.lineFill,
          fill: true,
          tension: 0.35,
          pointRadius: 0
        }
      ]
    },
    options: commonOptions
  });

  createChart("notificationsTypeChart", {
    type: "doughnut",
    data: {
      labels: ["Operations", "Payments", "Support"],
      datasets: [
        {
          data: [46, 28, 26],
          backgroundColor: palette.pie,
          borderWidth: 0
        }
      ]
    },
    options: doughnutOptions
  });

  createChart("settingsUsageChart", {
    type: "bar",
    data: {
      labels: ["Auto-approve", "Background Check", "Dynamic Pricing", "Alerts"],
      datasets: [
        {
          data: [84, 92, 46, 78],
          backgroundColor: palette.bar,
          borderColor: palette.barBorder,
          borderWidth: 1.5,
          borderRadius: 10
        }
      ]
    },
    options: commonOptions
  });

  createChart("settingsChannelChart", {
    type: "doughnut",
    data: {
      labels: ["Email", "SMS", "In-app"],
      datasets: [
        {
          data: [52, 18, 30],
          backgroundColor: palette.pie,
          borderWidth: 0
        }
      ]
    },
    options: doughnutOptions
  });

  createChart("reportsLineChart", {
    type: "line",
    data: {
      labels: ["Mar 1", "Mar 7", "Mar 14", "Mar 21", "Mar 25"],
      datasets: [
        {
          data: [320, 360, 410, 380, 450],
          borderColor: palette.line,
          backgroundColor: palette.lineFill,
          fill: true,
          tension: 0.35,
          pointRadius: 0
        }
      ]
    },
    options: commonOptions
  });

  createChart("reportsBarChart", {
    type: "bar",
    data: {
      labels: ["Walking", "Sitting", "Daycare", "Other"],
      datasets: [
        {
          data: [36, 28, 22, 14],
          backgroundColor: palette.bar,
          borderColor: palette.barBorder,
          borderWidth: 1.5,
          borderRadius: 10
        }
      ]
    },
    options: commonOptions
  });

  createChart("reportsPieChart", {
    type: "pie",
    data: {
      labels: ["Premium", "Standard", "Enterprise"],
      datasets: [
        {
          data: [45, 35, 20],
          backgroundColor: palette.pie,
          borderWidth: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom", labels: { color: palette.ticks } } }
    }
  });
};

const refreshCharts = () => {
  if (!window.Chart || chartInstances.size === 0) {
    initAdminCharts();
    return;
  }
  chartInstances.forEach((chart) => chart.destroy());
  chartInstances.clear();
  initAdminCharts();
};

const resizeCharts = () => {
  if (!window.Chart) return;
  chartInstances.forEach((chart) => chart.resize());
};

const setSidebarOpen = (isOpen) => {
  dashboardBody.classList.toggle("sidebar-open", isOpen);
  if (sidebarToggle) {
    sidebarToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
  if (sidebarOverlay) {
    sidebarOverlay.setAttribute("aria-hidden", isOpen ? "false" : "true");
  }
};

const closeSidebar = () => setSidebarOpen(false);

const setActivePanel = (panelName) => {
  if (!panelName) return;
  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === panelName;
    panel.classList.toggle("is-active", isActive);
    panel.setAttribute("aria-hidden", isActive ? "false" : "true");
  });

  panelLinks.forEach((link) => {
    const isActive = link.dataset.panel === panelName;
    link.classList.toggle("is-active", isActive);
    link.setAttribute("aria-selected", isActive ? "true" : "false");
    link.setAttribute("aria-current", isActive ? "page" : "false");
  });

  if (panelName) {
    window.history.replaceState(null, "", `#${panelName}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
  requestAnimationFrame(() => resizeCharts());
};

const closeProfileMenu = () => {
  if (!profileMenu || !profileToggle) return;
  profileMenu.classList.remove("open");
  profileToggle.setAttribute("aria-expanded", "false");
};

const setModalOpen = (targetModal, isOpen, trigger = null) => {
  if (!targetModal) return;
  targetModal.classList.toggle("open", isOpen);
  targetModal.setAttribute("aria-hidden", isOpen ? "false" : "true");
  if (isOpen && trigger && modalFields.length) {
    modalFields.forEach((field) => {
      const key = field.dataset.modalField;
      if (!key) return;
      const nextValue = trigger.dataset[key];
      if (nextValue) {
        field.textContent = nextValue;
      }
    });
  }
};

const setupUserTable = () => {
  if (!userRows.length || !userPagination) return;
  const rowsPerPage = 4;
  let currentPage = 1;

  const getFilteredRows = () => {
    const searchValue = userSearch?.value.trim().toLowerCase() ?? "";
    const roleValue = userRoleFilter?.value ?? "all";
    const statusValue = userStatusFilter?.value ?? "all";

    return userRows.filter((row) => {
      const name = row.dataset.name?.toLowerCase() ?? "";
      const email = row.dataset.email?.toLowerCase() ?? "";
      const role = row.dataset.role ?? "";
      const status = row.dataset.status ?? "";
      const matchesSearch = !searchValue || name.includes(searchValue) || email.includes(searchValue);
      const matchesRole = roleValue === "all" || roleValue === role;
      const matchesStatus = statusValue === "all" || statusValue === status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  const renderPagination = (totalPages) => {
    userPagination.innerHTML = "";
    if (totalPages <= 1) return;

    const buildButton = (label, page) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-outline btn-sm";
      button.textContent = label;
      button.dataset.page = page;
      if (page === currentPage) {
        button.classList.add("is-active");
      }
      return button;
    };

    userPagination.appendChild(buildButton("Prev", "prev"));
    for (let i = 1; i <= totalPages; i += 1) {
      userPagination.appendChild(buildButton(`${i}`, `${i}`));
    }
    userPagination.appendChild(buildButton("Next", "next"));
  };

  const updateTable = () => {
    const filtered = getFilteredRows();
    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    userRows.forEach((row) => {
      row.style.display = "none";
    });

    const start = (currentPage - 1) * rowsPerPage;
    const paged = filtered.slice(start, start + rowsPerPage);
    paged.forEach((row) => {
      row.style.display = "grid";
    });

    renderPagination(totalPages);
  };

  const handlePaginationClick = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const page = target.dataset.page;
    if (!page) return;
    const filtered = getFilteredRows();
    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

    if (page === "prev") {
      currentPage = Math.max(1, currentPage - 1);
    } else if (page === "next") {
      currentPage = Math.min(totalPages, currentPage + 1);
    } else {
      currentPage = Number.parseInt(page, 10) || 1;
    }
    updateTable();
  };

  if (userSearch) {
    userSearch.addEventListener("input", () => {
      currentPage = 1;
      updateTable();
    });
  }

  if (userRoleFilter) {
    userRoleFilter.addEventListener("change", () => {
      currentPage = 1;
      updateTable();
    });
  }

  if (userStatusFilter) {
    userStatusFilter.addEventListener("change", () => {
      currentPage = 1;
      updateTable();
    });
  }

  userPagination.addEventListener("click", handlePaginationClick);
  updateTable();
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

if (storedTheme) {
  setTheme(storedTheme);
} else {
  setTheme(prefersDark.matches ? "dark" : "light");
}

prefersDark.addEventListener("change", (event) => {
  if (!localStorage.getItem("theme")) {
    setTheme(event.matches ? "dark" : "light");
    refreshCharts();
  }
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = dashboardBody.classList.contains("dark-mode") ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    refreshCharts();
  });
}

const storedRtl = localStorage.getItem("rtl") === "true";
setRtl(storedRtl);

if (rtlToggle) {
  rtlToggle.addEventListener("click", () => {
    const nextRtl = !dashboardBody.classList.contains("rtl");
    setRtl(nextRtl);
    localStorage.setItem("rtl", nextRtl ? "true" : "false");
  });
}

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", () => {
    const shouldOpen = !dashboardBody.classList.contains("sidebar-open");
    setSidebarOpen(shouldOpen);
  });
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", closeSidebar);
}

panelLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActivePanel(link.dataset.panel);
    closeSidebar();
  });
});

bookingFilters.forEach((filterBtn) => {
  filterBtn.addEventListener("click", () => {
    const filter = filterBtn.dataset.filter;
    bookingFilters.forEach((btn) => btn.classList.remove("is-active"));
    filterBtn.classList.add("is-active");

    bookingRows.forEach((row) => {
      const status = row.dataset.status;
      const shouldShow = filter === "all" || filter === status;
      row.style.display = shouldShow ? "grid" : "none";
    });
  });
});

if (profileToggle && profileMenu) {
  profileToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = profileMenu.classList.toggle("open");
    profileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

profileItems.forEach((item) => {
  item.addEventListener("click", closeProfileMenu);
});

document.addEventListener("click", (event) => {
  if (!profileMenu) return;
  if (!profileMenu.contains(event.target)) {
    closeProfileMenu();
  }
});

modalTriggers.forEach((trigger) => {
  const targetId = trigger.dataset.modalTarget;
  if (!targetId) return;
  const targetModal = document.getElementById(targetId);
  if (!targetModal) return;
  trigger.addEventListener("click", () => setModalOpen(targetModal, true, trigger));
});

modalCloseButtons.forEach((button) => {
  const targetModal = button.closest(".modal");
  button.addEventListener("click", () => setModalOpen(targetModal, false));
});

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      setModalOpen(modal, false);
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSidebar();
    closeProfileMenu();
    setModalOpen(modal, false);
  }
});

if (panels.length) {
  const panelNames = Array.from(panels).map((panel) => panel.dataset.panel);
  const hashPanel = window.location.hash.replace("#", "");
  const defaultPanel = document.querySelector(".dashboard-link.is-active")?.dataset.panel || panelNames[0];
  const initialPanel = panelNames.includes(hashPanel) ? hashPanel : defaultPanel;
  setActivePanel(initialPanel);
}

initAdminCharts();
setupUserTable();
