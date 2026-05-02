/* =====================================================
   MAIN
   ===================================================== */

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
    const gender = getRandomGender();
    const name = getRandomNameByGender(gender);
    const surname = getRandomSurname();
    const workload = getRandomWorkload();
    const birthdate = generateBirthdate(age.min, age.max);

    employees.push({
      gender: gender,
      name: name,
      surname: surname,
      birthdate: birthdate,
      workload: workload
    });
  }

  return employees;
}

/* =====================================================
   STATISTIKY
   ===================================================== */

export function getEmployeeStatistics(employees) {
  const total = employees.length;

  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  for (let i = 0; i < employees.length; i++) {
    const w = employees[i].workload;
    if (w === 10) workload10++;
    else if (w === 20) workload20++;
    else if (w === 30) workload30++;
    else if (w === 40) workload40++;
  }

  /* ===== PŘESNÉ VĚKY (FLOAT) ===== */

  const yearMs = 365.25 * 24 * 60 * 60 * 1000;
  const agesExact = [];

  for (let i = 0; i < employees.length; i++) {
    const birthMs = new Date(employees[i].birthdate).getTime();
    const exactAge = (Date.now() - birthMs) / yearMs;
    agesExact.push(exactAge);
  }

  let sumExact = 0;
  for (let i = 0; i < agesExact.length; i++) {
    sumExact += agesExact[i];
  }

  const averageAge = Number((sumExact / total).toFixed(1));

  /* ===== CELÉ VĚKY PRO MIN / MAX ===== */

  const agesWhole = [];
  for (let i = 0; i < employees.length; i++) {
    agesWhole.push(getAge(employees[i].birthdate));
  }

  const minAge = Math.min.apply(null, agesWhole);
  const maxAge = Math.max.apply(null, agesWhole);

  // 
  const medianAge = Math.trunc(getMedian(agesExact));

  /* ===== MEDIÁN WORKLOAD ===== */

  const workloadsArr = [];
  for (let i = 0; i < employees.length; i++) {
    workloadsArr.push(employees[i].workload);
  }

  const medianWorkload = getMedian(workloadsArr);

  /* ===== PRŮMĚR WOMEN WORKLOAD ===== */

  let womenSum = 0;
  let womenCount = 0;

  for (let i = 0; i < employees.length; i++) {
    if (employees[i].gender === "female") {
      womenSum += employees[i].workload;
      womenCount++;
    }
  }

  let averageWomenWorkload = 0;
  if (womenCount > 0) {
    averageWomenWorkload = Math.round(womenSum / womenCount);
  }

  /* ===== SORT ===== */

  const sortedByWorkload = employees.slice();
  sortedByWorkload.sort(function (a, b) {
    return a.workload - b.workload;
  });

  return {
    total: total,
    workload10: workload10,
    workload20: workload20,
    workload30: workload30,
    workload40: workload40,
    averageAge: averageAge,
    minAge: minAge,
    maxAge: maxAge,
    medianAge: medianAge,
    medianWorkload: medianWorkload,
    averageWomenWorkload: averageWomenWorkload,
    sortedByWorkload: sortedByWorkload
  };
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
  const sorted = values.slice();
  sorted.sort(function (a, b) {
    return a - b;
  });

  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    return sorted[mid];
  }
}

/* =====================================================
   DATA
   ===================================================== */

const maleNames = [
  "Jan", "Petr", "Martin", "Tomáš", "Lukáš",
  "David", "Jakub", "Michal", "Ondřej", "Daniel"
];

const femaleNames = [
  "Anna", "Jana", "Petra", "Lucie", "Kateřina",
  "Tereza", "Eliška", "Barbora", "Klára", "Hana"
];

const surnames = [
  "Novák", "Svoboda", "Novotný", "Dvořák", "Černý",
  "Procházka", "Kučera", "Veselý", "Horák", "Němec"
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

  const randomTime = oldest + Math.random() * (youngest - oldest);
  return new Date(randomTime).toISOString();
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
``