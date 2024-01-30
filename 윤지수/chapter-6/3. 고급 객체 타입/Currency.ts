type Currency = {
  unit: "EUR" | "GBP" | "JPY" | "USD";
  value: number;
};

let Currency = {
  DEFAULT: "USD",
  from(value: number, unit = Currency.DEFAULT): Currency {
    return { unit, value };
  },
};

export default Currency;
