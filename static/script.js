// Utility function to create tables from JSON data
function createTable(data, containerId) {
  if (data.length === 0) {
    document.getElementById(containerId).innerHTML = "<p>No data available</p>";
    return;
  }

  const headers = Object.keys(data[0]);
  let table = "<table><thead><tr>";

  // Create headers
  headers.forEach((header) => {
    table += `<th>${header.replace(/_/g, " ").toUpperCase()}</th>`;
  });
  table += "</tr></thead><tbody>";

  // Create rows
  data.forEach((row) => {
    table += "<tr>";
    headers.forEach((header) => {
      table += `<td>${row[header] ?? ""}</td>`;
    });
    table += "</tr>";
  });

  table += "</tbody></table>";
  document.getElementById(containerId).innerHTML = table;
}

// Show message function
function showMessage(containerId, message, isError = false) {
  const messageDiv = document.getElementById(containerId);
  messageDiv.textContent = message;
  messageDiv.className = `message ${isError ? "error" : "success"}`;
  setTimeout(() => {
    messageDiv.className = "message";
  }, 3000);
}

// Load High Risk Pathogens
async function loadHighRiskPathogens() {
  const threshold = document.getElementById("mutationThreshold").value;
  try {
    const response = await fetch(
      `/api/high_risk_pathogens/${parseFloat(threshold)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    createTable(data, "highRiskPathogensTable");
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("highRiskPathogensTable").innerHTML =
      '<p class="error">Error loading pathogen data. Please try again.</p>';
  }
}

// Load Research Labs
async function loadResearchLabs() {
  const pathogenType = document.getElementById("pathogenType").value;
  try {
    const response = await fetch(`/api/labs_by_pathogen_type/${pathogenType}`);
    const data = await response.json();
    createTable(data, "researchLabsTable");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Load Vaccine Distribution Stats
async function loadVaccineStats() {
  try {
    const response = await fetch("/api/vaccine_distribution_stats");
    const data = await response.json();
    createTable(data, "vaccineDistributionTable");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Load Mutation Impact
async function loadMutationImpact() {
  try {
    const response = await fetch("/api/mutation_impact");
    const data = await response.json();
    createTable(data, "mutationImpactTable");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Load Project Success
async function loadProjectSuccess() {
  try {
    const response = await fetch("/api/project_success_metrics");
    const data = await response.json();
    createTable(data, "projectSuccessTable");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Update Vaccine Effectiveness
async function updateVaccineEffectiveness() {
  const vaccineId = document.getElementById("vaccineId").value;
  const effectiveness = document.getElementById("vaccineEffectiveness").value;

  try {
    const response = await fetch("/api/update_vaccine_effectiveness", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vaccine_id: vaccineId,
        effectiveness: effectiveness,
      }),
    });

    const result = await response.json();
    showMessage(
      "vaccineUpdateMessage",
      result.message,
      result.status === "error"
    );
  } catch (error) {
    showMessage(
      "vaccineUpdateMessage",
      "Failed to update vaccine effectiveness",
      true
    );
  }
}

// Update Project Status
async function updateProjectStatus() {
  const projectId = document.getElementById("projectId").value;
  const status = document.getElementById("projectStatus").value;

  try {
    const response = await fetch("/api/update_project_status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: projectId,
        status: status,
        end_date:
          status === "completed"
            ? new Date().toISOString().split("T")[0]
            : null,
      }),
    });

    const result = await response.json();
    showMessage(
      "projectUpdateMessage",
      result.message,
      result.status === "error"
    );
  } catch (error) {
    showMessage(
      "projectUpdateMessage",
      "Failed to update project status",
      true
    );
  }
}

// Update Lab Funding
async function updateLabFunding() {
  const labId = document.getElementById("labId").value;
  const fundingChange = document.getElementById("fundingChange").value;

  try {
    const response = await fetch("/api/update_lab_funding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lab_id: labId,
        funding_change: fundingChange,
      }),
    });

    const result = await response.json();
    showMessage("labUpdateMessage", result.message, result.status === "error");
  } catch (error) {
    showMessage("labUpdateMessage", "Failed to update lab funding", true);
  }
}

// Add event listener when document loads
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      // Remove active class from all cards
      cards.forEach((c) => c.classList.remove("active"));
      // Add active class to clicked card
      this.classList.add("active");
    });
  });

  // Add input validation for mutation threshold
  const mutationThreshold = document.getElementById("mutationThreshold");
  if (mutationThreshold) {
    mutationThreshold.addEventListener("input", function () {
      let value = parseFloat(this.value);
      if (value < 0) this.value = 0;
      if (value > 100) this.value = 100;
    });
  }
});

// Table configurations
const tables = [
  "Country",
  "Country_response_to_pathogen",
  "Global_vaccine_distribution",
  "Government_response",
  "Infection",
  "Milestones",
  "Mutation",
  "Pathogen",
  "Project_under_lab",
  "Research_aim",
  "Research_focus",
  "Research_lab",
  "Research_project",
  "Resistance",
  "Vaccine",
  "Vaccine_development",
  "Vaccine_distribution_cost",
];

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  // Populate table dropdowns
  const tableSelects = ["insert-table", "update-table", "delete-table"];
  tableSelects.forEach((selectId) => {
    const select = document.getElementById(selectId);
    tables.forEach((table) => {
      const option = document.createElement("option");
      option.value = table;
      option.textContent = table.replace(/_/g, " ");
      select.appendChild(option);
    });
  });
});

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  // Clear any forms or results
  const formContainer = document.getElementById(`${modalId}-form-container`);
  if (formContainer) formContainer.innerHTML = "";
  const resultsContainer = document.getElementById("analysis-results");
  if (resultsContainer) resultsContainer.innerHTML = "";
}

// Load table form based on operation type
async function loadTableForm(operation) {
  const table = document.getElementById(`${operation}-table`).value;
  if (!table) return;

  try {
    const response = await fetch(`/api/table-schema/${table}`);
    const schema = await response.json();

    const formContainer = document.getElementById(
      `${operation}-form-container`
    );
    formContainer.innerHTML = "";

    const form = document.createElement("form");
    form.id = `${operation}-form`;
    form.onsubmit = (e) => handleFormSubmit(e, operation, table);

    schema.forEach((field) => {
      const formRow = createFormField(field, operation);
      form.appendChild(formRow);
    });

    // Add submit button
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent =
      operation.charAt(0).toUpperCase() + operation.slice(1);
    form.appendChild(submitBtn);

    formContainer.appendChild(form);
  } catch (error) {
    console.error("Error loading table schema:", error);
  }
}

// Create form field based on schema
function createFormField(field, operation) {
  const div = document.createElement("div");
  div.className = "form-row";

  const label = document.createElement("label");
  label.textContent = field.name.replace(/_/g, " ");
  label.htmlFor = `${field.name}-input`;

  const input = document.createElement("input");
  input.id = `${field.name}-input`;
  input.name = field.name;
  input.required = field.required;

  // Set input type based on field type
  switch (field.type) {
    case "number":
      input.type = "number";
      if (field.min !== undefined) input.min = field.min;
      if (field.max !== undefined) input.max = field.max;
      break;
    case "date":
      input.type = "date";
      break;
    default:
      input.type = "text";
  }

  div.appendChild(label);
  div.appendChild(input);
  return div;
}

// Handle form submission
async function handleFormSubmit(event, operation, table) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`/api/${operation}/${table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    showMessage(result.message, result.status === "error");
  } catch (error) {
    showMessage("An error occurred while processing your request.", true);
  }
}

// Load analysis results
async function loadAnalysis(type) {
  const resultsContainer = document.getElementById("analysis-results");
  resultsContainer.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(`/api/analysis/${type}`);
    const data = await response.json();

    // Create table from data
    let table = "<table><thead><tr>";
    const headers = Object.keys(data[0] || {});
    headers.forEach((header) => {
      table += `<th>${header.replace(/_/g, " ")}</th>`;
    });
    table += "</tr></thead><tbody>";

    data.forEach((row) => {
      table += "<tr>";
      headers.forEach((header) => {
        table += `<td>${row[header]}</td>`;
      });
      table += "</tr>";
    });
    table += "</tbody></table>";

    resultsContainer.innerHTML = table;
  } catch (error) {
    resultsContainer.innerHTML =
      '<p class="error-message">Error loading analysis results.</p>';
  }
}

// Show message function
function showMessage(message, isError = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = isError ? "error-message" : "success-message";
  messageDiv.textContent = message;

  const container = document.querySelector(".modal-content");
  container.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// Close modal when clicking outside
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
};

async function fetchTableData(table) {
  try {
      const response = await fetch(`/api/read/${table}`);
      const data = await response.json();
      createTable(data, "readTableContainer");
  } catch (error) {
      console.error("Error fetching table data:", error);
  }
}

function loadTableSchema(table, containerId, forUpdate = false) {
  fetch(`/api/table-schema/${table}`)
      .then((res) => res.json())
      .then((schema) => {
          const container = document.getElementById(containerId);
          container.innerHTML = "";

          schema.forEach((field) => {
              const row = document.createElement("div");
              row.className = "form-row";

              const label = document.createElement("label");
              label.textContent = field.name.replace(/_/g, " ");
              row.appendChild(label);

              if (forUpdate) {
                  const input = document.createElement("input");
                  input.name = field.name;
                  input.placeholder = "Enter value or leave blank";
                  row.appendChild(input);
              } else {
                  const btn = document.createElement("button");
                  btn.textContent = `Delete ${field.name}`;
                  btn.onclick = () => deleteRow(table, field.name);
                  row.appendChild(btn);
              }
              container.appendChild(row);
          });
      })
      .catch((err) => console.error(err));
}

async function fetchTableData(table) {
  if (!table) return;

  try {
    const response = await fetch(`/api/read/${table}`);
    const data = await response.json();

    const tableContainer = document.getElementById('readTableContainer');
    tableContainer.innerHTML = '';

    if (data.status === 'error') {
      tableContainer.innerHTML = `<p>Error: ${data.message}</p>`;
      return;
    }

    const tableElement = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create table headers
    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Create table rows
    data.forEach(row => {
      const tr = document.createElement('tr');
      headers.forEach(header => {
        const td = document.createElement('td');
        td.textContent = row[header];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    tableElement.appendChild(thead);
    tableElement.appendChild(tbody);
    tableContainer.appendChild(tableElement);
  } catch (error) {
    console.error('Error fetching table data:', error);
  }
}

async function loadTableOptions() {
  try {
    const response = await fetch('/api/tables');
    const tables = await response.json();

    const select = document.getElementById('read-table');
    tables.forEach(table => {
      const option = document.createElement('option');
      option.value = table;
      option.textContent = table;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading table options:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadTableOptions);

document.addEventListener('DOMContentLoaded', function() {
  const selectionTableSelect = document.getElementById('selection-table');
  const projectionTableSelect = document.getElementById('projection-table');
  const aggregationTableSelect = document.getElementById('aggregation-table');
  const searchTableSelect = document.getElementById('search-table');

  fetch('/api/tables')
      .then(response => response.json())
      .then(tables => {
          const selectElements = [
              selectionTableSelect, 
              projectionTableSelect, 
              aggregationTableSelect, 
              searchTableSelect
          ];

          selectElements.forEach(select => {
              tables.forEach(table => {
                  const option = document.createElement('option');
                  option.value = table;
                  option.textContent = table;
                  select.appendChild(option);
              });
          });
      });
});

function loadSelectionOptions(table) {
  fetch(`/api/tables/columns?table=${table}`)
      .then(response => response.json())
      .then(columns => {
          const columnSelect = document.getElementById('selection-column');
          columnSelect.innerHTML = '';
          columns.forEach(column => {
              const option = document.createElement('option');
              option.value = column;
              option.textContent = column;
              columnSelect.appendChild(option);
          });
      });
}

function performSelection() {
  const table = document.getElementById('selection-table').value;
  const column = document.getElementById('selection-column').value;
  const condition = document.getElementById('selection-condition').value;
  const value = document.getElementById('selection-value').value;

  fetch('/api/selection', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ table, column, condition, value })
  })
  .then(response => response.json())
  .then(data => {
      const resultsContainer = document.getElementById('selection-results');
      createTable(data, 'selection-results');
  })
  .catch(error => {
      console.error('Error:', error);
      const resultsContainer = document.getElementById('selection-results');
      resultsContainer.innerHTML = '<p class="error">Error performing selection</p>';
  });
}

function performProjection() {
  const table = document.getElementById('projection-table').value;
  const columnCheckboxes = document.querySelectorAll('input[name="projection-columns"]:checked');
  const columns = Array.from(columnCheckboxes).map(cb => cb.value);

  fetch('/api/projection', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ table, columns })
  })
  .then(response => response.json())
  .then(data => createTable(data, 'projection-results'))
  .catch(error => {
      console.error('Error:', error);
  });
}

function performAggregation() {
  const table = document.getElementById('aggregation-table').value;
  const column = document.getElementById('aggregation-column').value;
  const operation = document.getElementById('aggregation-operation').value;

  fetch('/api/aggregation', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ table, column, operation })
  })
  .then(response => response.json())
  .then(data => createTable(data, 'aggregation-results'))
  .catch(error => {
      console.error('Error:', error);
  });
}

function performSearch() {
  const table = document.getElementById('search-table').value;
  const column = document.getElementById('search-column').value;
  const pattern = document.getElementById('search-pattern').value;

  fetch('/api/search', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ table, column, pattern })
  })
  .then(response => response.json())
  .then(data => createTable(data, 'search-results'))
  .catch(error => {
      console.error('Error:', error);
  });
}

function loadProjectionColumns(table) {
  fetch(`/api/tables/columns?table=${table}`)
      .then(response => response.json())
      .then(columns => {
          const columnsContainer = document.getElementById('projection-columns');
          columnsContainer.innerHTML = '';
          columns.forEach(column => {
              const div = document.createElement('div');
              div.innerHTML = `
                  <input type="checkbox" name="projection-columns" 
                         id="projection-${column}" value="${column}">
                  <label for="projection-${column}">${column}</label>
              `;
              columnsContainer.appendChild(div);
          });
      });
}

function loadAggregationColumns(table) {
  fetch(`/api/tables/columns?table=${table}`)
      .then(response => response.json())
      .then(columns => {
          const columnSelect = document.getElementById('aggregation-column');
          columnSelect.innerHTML = '';
          columns.forEach(column => {
              const option = document.createElement('option');
              option.value = column;
              option.textContent = column;
              columnSelect.appendChild(option);
          });
      });
}

function loadSearchColumns(table) {
  fetch(`/api/tables/columns?table=${table}`)
      .then(response => response.json())
      .then(columns => {
          const columnSelect = document.getElementById('search-column');
          columnSelect.innerHTML = '';
          columns.forEach(column => {
              const option = document.createElement('option');
              option.value = column;
              option.textContent = column;
              columnSelect.appendChild(option);
          });
      });
}