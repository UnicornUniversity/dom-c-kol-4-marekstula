export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  const dtoOut = getEmployeeStatistics(employees);
  return dtoOut;
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

    const employee = {
      gender: gender,
      name: name,
      surname: surname,
      birthdate: birthdate,
      workload: workload
    };

    employees.push(employee);
  }

  return employees;
}

/* =====================================================
   STATISTIKY
   ===================================================== */

export function getEmployeeStatistics(employees) {
  return calculateStatistics(employees);
}

function calculateStatistics(employees) {
  const total = employees.length;

  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  for (let i = 0; i < employees.length; i++) {
    const workload = employees[i].workload;

    if (workload === 10) {
      workload10++;
    } else if (workload === 20) {
      workload20++;
    } else if (workload === 30) {
      workload30++;
    } else if (workload === 40) {
      workload40++;
    }
  }

  const ages = [];

  for (let i = 0; i < employees.length; i++) {
    const age = getAge(employees[i].birthdate);
    ages.push(age);
  }

  let ageSum = 0;
  for (let i = 0; i < ages.length; i++) {
    ageSum += ages[i];
  }

  const averageAge = Number((ageSum / total).toFixed(1));

  const minAge = Math.min.apply(null, ages);
  const maxAge = Math.max.apply(null, ages);
  const medianAge = getMedian(ages);

  const workloadArray = [];
  for (let i = 0; i < employees.length; i++) {
    workloadArray.push(employees[i].workload);
  }

  const medianWorkload = getMedian(workloadArray);

  let womenWorkloadSum = 0;
  let womenCount = 0;

  for (let i = 0; i < employees.length; i++) {
    if (employees[i].gender === "female") {
      womenWorkloadSum += employees[i].workload;
      womenCount++;
    }
  }

  let averageWomenWorkload = 0;
  if (womenCount > 0) {
    averageWomenWorkload = Math.round(womenWorkloadSum / womenCount);
  }

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
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0) {
    age--;
  } else if (
    monthDiff === 0 &&
    today.getDate() < birth.getDate()
  ) {
    age--;
  }

  return age;
}

function getMedian(values) {
  const sorted = values.slice();
  sorted.sort(function (a, b) {
    return a - b;
  });

  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
}

/* =====================================================
   ZDROJE DAT
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
  "Novák", "Svoboda", "Novotný", "Dvořák", "Černý"
];

const workloads = [10, 20, 30, 40];

/* =====================================================
   GENERÁTORY
   ===================================================== */

function getRandomGender() {
  const random = Math.random();

  if (random < 0.5) {
    return "male";
  } else {
    return "female";
  }
}

function getRandomNameByGender(gender) {
  let list;

  if (gender === "male") {
    list = maleNames;
  } else {
    list = femaleNames;
  }

  return randomItem(list);
}

function getRandomSurname() {
  return randomItem(surnames);
}

function getRandomWorkload() {
  return randomItem(workloads);
}


function generateBirthdate(minAge, maxAge) {
  const now = Date.now();
  const yearInMs = 365.25 * 24 * 60 * 60 * 1000;

  const youngest = now - minAge * yearInMs;
  const oldest = now - maxAge * yearInMs;

  const randomTime =
    oldest + Math.random() * (youngest - oldest);

  const birthdate = new Date(randomTime);
  return birthdate.toISOString();
}

/* =====================================================
   UTIL FUNKCE
   ===================================================== */

function randomItem(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}