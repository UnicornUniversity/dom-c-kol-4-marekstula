export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  return getEmployeeStatistics(employees);
}

/* =====================================================
   GENEROVÁNÍ ZAMĚSTNANCŮ
   ===================================================== */

export function generateEmployeeData(dtoIn) {
  const count = dtoIn.count;
  const age = dtoIn.age;
  const employees = [];

  for (let i = 0; i < count; i++) {
    employees.push({
      gender: getRandomGender(),
      name: getRandomNameByGender(getRandomGender()),
      surname: getRandomSurname(),
      birthdate: generateBirthdate(age.min, age.max),
      workload: getRandomWorkload()
    });
  }

  return employees;
}

/* =====================================================
   STATISTIKY 
   ===================================================== */

export function getEmployeeStatistics(employees) {
  const workloadsCount = countWorkloads(employees);
  const ageData = computeAges(employees);
  const womenWorkload = computeWomenWorkload(employees);

  return {
    total: employees.length,
    workload10: workloadsCount.workload10,
    workload20: workloadsCount.workload20,
    workload30: workloadsCount.workload30,
    workload40: workloadsCount.workload40,
    averageAge: ageData.averageAge,
    minAge: ageData.minAge,
    maxAge: ageData.maxAge,
    medianAge: ageData.medianAge,
    medianWorkload: getMedian(employees.map(e => e.workload)),
    averageWomenWorkload: womenWorkload,
    sortedByWorkload: sortByWorkload(employees)
  };
}

/* =====================================================
   HELPER FUNKCE – STATISTIKY
   ===================================================== */

function countWorkloads(employees) {
  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  for (const emp of employees) {
    if (emp.workload === 10) workload10++;
    else if (emp.workload === 20) workload20++;
    else if (emp.workload === 30) workload30++;
    else if (emp.workload === 40) workload40++;
  }

  return { workload10, workload20, workload30, workload40 };
}

function computeAges(employees) {
  const yearMs = 365.25 * 24 * 60 * 60 * 1000;
  const exactAges = [];
  const wholeAges = [];

  for (const emp of employees) {
    const birthMs = new Date(emp.birthdate).getTime();
    exactAges.push((Date.now() - birthMs) / yearMs);
    wholeAges.push(getAge(emp.birthdate));
  }

  return {
    averageAge: computeAverageAge(exactAges),
    minAge: Math.min(...wholeAges),
    maxAge: Math.max(...wholeAges),
    medianAge: Math.trunc(getMedian(exactAges))
  };
}

function computeAverageAge(ages) {
  let sum = 0;
  for (const age of ages) sum += age;
  return Number((sum / ages.length).toFixed(1));
}

function computeWomenWorkload(employees) {
  let sum = 0;
  let count = 0;

  for (const emp of employees) {
    if (emp.gender === "female") {
      sum += emp.workload;
      count++;
    }
  }

  return count === 0 ? 0 : Math.round(sum / count);
}

function sortByWorkload(employees) {
  return employees.slice().sort((a, b) => a.workload - b.workload);
}

/* =====================================================
   VÝPOČTY
   ===================================================== */

function getAge(birthdate) {
  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function getMedian(values) {
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/* =====================================================
   DATA
   ===================================================== */

const maleNames = ["Jan", "Petr", "Martin", "Tomáš", "Lukáš"];
const femaleNames = ["Anna", "Jana", "Petra", "Lucie", "Kateřina"];
const surnames = [
  "Novák", "Svoboda", "Novotný", "Dvořák", "Černý",
  "Procházka", "Kučera", "Veselý", "Horák"
];
const workloads = [10, 20, 30, 40];

/* =====================================================
   GENERÁTORY
   ===================================================== */

function getRandomGender() {
  return Math.random() < 0.5 ? "male" : "female";
}

function getRandomNameByGender(gender) {
  return gender === "male"
    ? randomItem(maleNames)
    : randomItem(femaleNames);
}

function getRandomSurname() {
  return randomItem(surnames);
}

function getRandomWorkload() {
  return randomItem(workloads);
}

function generateBirthdate(minAge, maxAge) {
  const now = Date.now();
  const yearMs = 365.25 * 24 * 60 * 60 * 1000;
  const youngest = now - minAge * yearMs;
  const oldest = now - maxAge * yearMs;
  return new Date(oldest + Math.random() * (youngest - oldest)).toISOString();
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}