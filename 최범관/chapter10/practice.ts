interface Currency {
  unit: 'EUR' | 'GPB' | 'JPY' | 'USD';
  value: number;
}

namespace Currency {
  export const DEFAULT: Currency['unit'] = 'USD';

  export function from(value: number, unit = Currency.DEFAULT): Currency {
    return { unit, value };
  }
}
