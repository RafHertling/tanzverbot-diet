export enum Sex {
  Male = "m",
  Female = "f",
}

const CALORIES_PER_KG_FAT = 9000;

const foods = [
  { name: "Kellogg's Tresor", calories: 137, servings: 4 },
  { name: "Weihenstephan Haltbare Milch", calories: 64, servings: 8 },
  { name: "Mühle Frikadellen", calories: 271, servings: 4 },
  { name: "Volvic Tee", calories: 40, servings: 12 },
  { name: "Neuburger lockerer Sahnepudding", calories: 297, servings: 1 },
  { name: "Lagnese Viennetta", calories: 125, servings: 6 },
  { name: "Schöller 10ForTwo", calories: 482, servings: 2 },
  { name: "Ristorante Pizza Salame", calories: 835, servings: 2 },
  { name: "Schweppes Ginger Ale", calories: 37, servings: 25 },
  { name: "Mini Babybel", calories: 59, servings: 20 },
];

const dailyCaloriesOnDiet = foods.reduce(
  (sum, food) => sum + food.calories * food.servings,
  0,
);

// Harris-Benedict formula coefficients: [base, weight, height (cm), age]
const bmrCoefficients: Record<Sex, [number, number, number, number]> = {
  [Sex.Male]: [66.47, 13.7, 5.003, 6.75],
  [Sex.Female]: [655.1, 9.563, 1.85, 4.676],
};

export function calcDateOnDiet(
  currentWeightKg: number,
  targetWeightKg: number,
  heightM: number,
  ageY: number,
  sex: Sex,
): number {
  const weightGainKg = targetWeightKg - currentWeightKg;
  if (weightGainKg < 0) {
    throw new Error(`This diet is for gaining weight, not loosing it!`);
  }
  if (ageY < 16 || heightM < 1.5) {
    throw new Error(`You do not qualify for this kind of diet.`);
  }
  const [base, weightCoeff, heightCoeff, ageCoeff] = bmrCoefficients[sex];
  const heightCm = heightM * 100;
  const dailyCaloriesBasicMetabolicRate = Math.ceil(
    base + weightCoeff * currentWeightKg + heightCoeff * heightCm - ageCoeff * ageY,
  );
  const dailyExcessCalories = dailyCaloriesOnDiet - dailyCaloriesBasicMetabolicRate;
  if (dailyExcessCalories <= 0) {
    throw new Error("This diet is not sufficient for you to gain weight.");
  }
  return Math.ceil((CALORIES_PER_KG_FAT * weightGainKg) / dailyExcessCalories);
}
