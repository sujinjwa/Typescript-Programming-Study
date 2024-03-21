// 선언합치기
// a. 컴패니언 객체 패턴에서 소개한 컴패니언 객체를 값과 타입대신 네임스페이스와 인터페이스로 재구현하자

export interface Currency {
  unit: 'EUR' | 'GPB' | 'JPY' | 'USD';
  value: number;
}

namespace Currency {
  export const DEFAULT: Currency['unit'] = 'USD';

  export function from(value: number, unit = DEFAULT): Currency {
    return { unit, value };
  }
}

// b. 열거형에 정적 메서들르 추가하자

export {};
