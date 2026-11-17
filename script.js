"use strict";

const form = document.querySelector("#marks-form");
const nameInput = document.querySelector("#student-name");
const markInputs = Array.from(document.querySelectorAll(".mark-input"));
const results = document.querySelector("#results");
const formError = document.querySelector("#form-error");

function gradeFor(average) {
  if (average >= 90) return "A+";
  if (average >= 80) return "A";
  if (average >= 70) return "B";
  if (average >= 60) return "C";
  if (average >= 50) return "D";
  return "F";
}

function clearErrors() {
  formError.hidden = true;
  formError.textContent = "";

  [nameInput, ...markInputs].forEach((input) => {
    input.removeAttribute("aria-invalid");
    document.querySelector(`#${input.id}-error`).textContent = "";
  });
}

function showFieldError(input, message) {
  input.setAttribute("aria-invalid", "true");
  document.querySelector(`#${input.id}-error`).textContent = message;
}

function validateForm() {
  clearErrors();
  const invalidFields = [];
  const studentName = nameInput.value.trim();

  if (!studentName) {
    showFieldError(nameInput, "Enter the student's name.");
    invalidFields.push(nameInput);
  }

  const marks = markInputs.map((input) => {
    const rawValue = input.value.trim();
    const value = input.valueAsNumber;

    if (!rawValue || !Number.isFinite(value)) {
      showFieldError(input, "Enter a mark from 0 to 100.");
      invalidFields.push(input);
      return null;
    }

    if (value < 0 || value > 100) {
      showFieldError(input, "Mark must be between 0 and 100.");
      invalidFields.push(input);
      return null;
    }

    return value;
  });

  if (invalidFields.length > 0) {
    const noun = invalidFields.length === 1 ? "field" : "fields";
    formError.textContent = `Please correct the ${invalidFields.length} highlighted ${noun} before calculating.`;
    formError.hidden = false;
    invalidFields[0].focus();
    return null;
  }

  return { studentName, marks };
}

function displayResults(studentName, marks) {
  const total = marks.reduce((sum, mark) => sum + mark, 0);
  const average = total / marks.length;
  const passed = marks.every((mark) => mark >= 40);
  const gradeBadge = document.querySelector("#result-grade");
  const status = document.querySelector("#result-status");

  document.querySelector("#result-name").textContent = studentName;
  document.querySelector("#result-total").textContent = Number.isInteger(total)
    ? String(total)
    : total.toFixed(2);
  document.querySelector("#result-average").textContent = average.toFixed(2);
  gradeBadge.textContent = gradeFor(average);
  gradeBadge.classList.toggle("is-fail", !passed);
  status.textContent = passed ? "Pass" : "Fail";
  status.classList.toggle("is-fail", !passed);
  results.hidden = false;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  results.hidden = true;

  const validated = validateForm();
  if (validated) {
    displayResults(validated.studentName, validated.marks);
  }
});

form.addEventListener("reset", () => {
  clearErrors();
  results.hidden = true;
  ["result-name", "result-total", "result-average", "result-grade", "result-status"].forEach((id) => {
    document.querySelector(`#${id}`).textContent = "";
  });
  document.querySelector("#result-grade").classList.remove("is-fail");
  document.querySelector("#result-status").classList.remove("is-fail");
});
