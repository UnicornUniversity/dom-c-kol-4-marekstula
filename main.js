export function main(dtoIn) {
  const count = dtoIn.count;
  const age = dtoIn.age;

  const employees = [];

  for (let i = 0; i < count; i++) {
    // Krok 2.1 – výběr pohlaví zaměstnance
    const gender = getRandomGender();

    // Krok 2.1 – výběr křestního jména dle pohlaví
    const name = getRandomNameByGender(gender);

    // Krok 2.2 – výpočet data narození v zadaném intervalu věku
    const birthdate = generateBirthdate(age.min, age.max);

    // Další atributy zaměstnance
    const surname = getRandomSurname();
    const workload = getRandomWorkload();

    const employee = {
      gender: gender,
      name: name,
      surname: surname,
      birthdate: birthdate,
      workload: workload
    };

    employees.push(employee);
  }

  // Rozšíření – výpočet statistik ze seznamu zaměstnanců
  const dtoOut = calculateStatistics(employees);

  return dtoOut;
}

/* =====================================
   IS DOC – ZDROJE DAT
   ===================================== */

const maleNames = [
  "Jan", "Petr", "Martin", "Tomáš", "Lukáš",
  "David", "Jakub", "Michal", "Ondřej", "Daniel",
  "Radek", "Marek", "Roman", "Jiří", "Adam",
  "Filip", "Matěj", "Vojtěch", "Karel", "Josef"
];

const femaleNames = [
  "Anna", "Jana", "Petra", "Lucie", "Kateřina",
  "Markéta", "Tereza", "Veronika", "Eliška", "Barbora",
  "Klára", "Nikola", "Adéla", "Kristýna", "Monika",
  "Ivana", "Michaela", "Lenka", "Hana", "Alena"
];

const surnames = [
  "Novák", "Svoboda", "Novotný", "Dvořák", "Černý",
  "Procházka", "Kučera", "Veselý", "Horák", "Němec",
  "Pokorný", "Hájek", "Král", "Blažek", "Fiala",
  "Růžička", "Krejčí", "Beneš", "Pospíšil", "Jelínek"
];

const workloads = [10, 20, 30, 40];

/* =====================================
   IS DOC – HELPER FUNKCE
   ===================================== */

function getRandomGender() {
  const randomNumber = Math.random();

  if (randomNumber < 0.5) {
    return "male";
  } else {
    return "female";
  }
}

function getRandomNameByGender(gender) {
  let nameList;

  if (gender === "male") {
    nameList = maleNames;
  } else {
    nameList = femaleNames;
  }

  const name = randomItem(nameList);
  return name;
}

function getRandomSurname() {
  const surname = randomItem(surnames);
  return surname;
}

function getRandomWorkload() {
  const workload = randomItem(workloads);
  return workload;
}

function generateBirthdate(minAge, maxAge) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const minYear = currentYear - maxAge;
  const maxYear = currentYear - minAge;

  const year = randomInt(minYear, maxYear);
  const month = randomInt(0, 11);
  const day = randomInt(1, 28);

  const birthdate = new Date(year, month, day);
  return birthdate.toISOString();
}

/* =====================================
   POMOCNÉ FUNKCE
   ===================================== */

function randomItem(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

function randomInt(min, max) {
  const difference = max - min + 1;
  const random = Math.floor(Math.random() * difference);
  return min + random;
}

/* =====================================
   ROZŠÍŘENÍ – STATISTIKY (dtoOut)
   ===================================== */

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
    ageSum = ageSum + ages[i];
  }

  const averageAge = Number((ageSum / total).toFixed(1));

  const minAge = Math.min.apply(null, ages);
  const maxAge = Math.max.apply(null, ages);
  const medianAge = getMedian(ages);

  const workloadsArray = [];
  for (let i = 0; i < employees.length; i++) {
    workloadsArray.push(employees[i].workload);
  }

  const medianWorkload = getMedian(workloadsArray);

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

function getAge(birthdate) {
  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const monthDifference = today.getMonth() - birth.getMonth();

  if (monthDifference < 0) {
    age--;
  } else if (
    monthDifference === 0 &&
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

  const middleIndex = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middleIndex - 1] + sorted[middleIndex]) / 2;
  } else {
    return sorted[middleIndex];
  }
}