document.addEventListener('DOMContentLoaded', () => {
  loadStoredData();
  rentInput.addEventListener('input', updateMonthlyExpenses);
  foodInput.addEventListener('input', updateMonthlyExpenses);
  utilitiesInput.addEventListener('input', updateMonthlyExpenses);
  insuranceInput.addEventListener('input', updateMonthlyExpenses);
  otherInput.addEventListener('input', updateMonthlyExpenses);
  holidaysInput.addEventListener('input', updateAnnualHours);
  sickDaysInput.addEventListener('input', updateAnnualHours);
  calculateButton.addEventListener('click', calculateRate);
});

const currencySelect = document.getElementById('currency');
const rentInput = document.getElementById('rent');
const foodInput = document.getElementById('food');
const utilitiesInput = document.getElementById('utilities');
const insuranceInput = document.getElementById('insurance');
const otherInput = document.getElementById('other');
const holidaysInput = document.getElementById('holidays');
const sickDaysInput = document.getElementById('sick-days');
const taxRateInput = document.getElementById('tax-rate');
const monthlyExpensesTotal = document.getElementById('monthly-expenses-total');
const annualHoursTotal = document.getElementById('annual-hours-total');
const calculateButton = document.getElementById('calculate');
const resultDiv = document.getElementById('result');

function loadStoredData() {
  const storedCurrency = localStorage.getItem('currency');
  const storedRent = localStorage.getItem('rent');
  const storedFood = localStorage.getItem('food');
  const storedUtilities = localStorage.getItem('utilities');
  const storedInsurance = localStorage.getItem('insurance');
  const storedOther = localStorage.getItem('other');
  const storedHolidays = localStorage.getItem('holidays');
  const storedSickDays = localStorage.getItem('sick-days');
  const storedTaxRate = localStorage.getItem('tax-rate');

  if (storedCurrency) currencySelect.value = storedCurrency;
  if (storedRent) rentInput.value = storedRent;
  if (storedFood) foodInput.value = storedFood;
  if (storedUtilities) utilitiesInput.value = storedUtilities;
  if (storedInsurance) insuranceInput.value = storedInsurance;
  if (storedOther) otherInput.value = storedOther;
  if (storedHolidays) holidaysInput.value = storedHolidays;
  if (storedSickDays) sickDaysInput.value = storedSickDays;
  if (storedTaxRate) taxRateInput.value = storedTaxRate;

  updateMonthlyExpenses();
  updateAnnualHours();
}

function saveData() {
  localStorage.setItem('currency', currencySelect.value);
  localStorage.setItem('rent', rentInput.value);
  localStorage.setItem('food', foodInput.value);
  localStorage.setItem('utilities', utilitiesInput.value);
  localStorage.setItem('insurance', insuranceInput.value);
  localStorage.setItem('other', otherInput.value);
  localStorage.setItem('holidays', holidaysInput.value);
  localStorage.setItem('sick-days', sickDaysInput.value);
  localStorage.setItem('tax-rate', taxRateInput.value);
}

function updateMonthlyExpenses() {
  const rent = parseFloat(rentInput.value) || 0;
  const food = parseFloat(foodInput.value) || 0;
  const utilities = parseFloat(utilitiesInput.value) || 0;
  const insurance = parseFloat(insuranceInput.value) || 0;
  const other = parseFloat(otherInput.value) || 0;
  const totalMonthlyExpenses = rent + food + utilities + insurance + other;
  monthlyExpensesTotal.innerText = `Total Monthly Expenses: ${currencySelect.value}${totalMonthlyExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  saveData();
  return totalMonthlyExpenses;
}

function updateAnnualHours() {
  const holidays = parseFloat(holidaysInput.value) || 0;
  const sickDays = parseFloat(sickDaysInput.value) || 0;
  const workingDaysPerYear = 260 - holidays - sickDays;
  const workingHoursPerYear = workingDaysPerYear * 8; // Assuming 8-hour workdays
  annualHoursTotal.innerText = `Estimated Working Hours per Year: ${workingHoursPerYear.toLocaleString()}`;
  saveData();
  return workingHoursPerYear;
}

function calculateRate() {
  const currency = currencySelect.value;
  const totalMonthlyExpenses = updateMonthlyExpenses();
  const totalAnnualExpenses = totalMonthlyExpenses * 12;
  const workingHoursPerYear = updateAnnualHours();
  const billableHours = workingHoursPerYear * 0.6; // Assuming 60% of working hours are billable
  const hourlyRate = totalAnnualExpenses / billableHours;

  const taxRate = parseFloat(taxRateInput.value) / 100 || 0;
  const postTaxHourlyRate = hourlyRate * (1 - taxRate);

  resultDiv.innerHTML = `
    <div>Estimated Minimum Required Yearly Income: ${currency}${totalAnnualExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    <div>Estimated Working Hours per Year: ${workingHoursPerYear.toLocaleString()}</div>
    <div>Estimated Billable Hours per Year: ${billableHours.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
    <div>Your Estimated Minimum Hourly Rate: ${currency}${hourlyRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    <div>Your Estimated Post-Tax Hourly Rate: ${currency}${postTaxHourlyRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
  `;
}
