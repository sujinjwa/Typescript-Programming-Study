// 타입스크립트는 심벌 수행의 일종인 흐름 기반 타입 추론을 수행한다.
// 타입 검사기는 typeof, instanceof, in 등의 타입 질의뿐 아니라, 마치 프로그래머가 코드를 읽듯 if, ? ||, switch 같은 제어 흐름 문장까지 고려하여 타입을 정제한다.

type Unit = "cm" | "px" | "%";

let units: Unit[] = ["cm", "px", "%"];

function parseUnit(value: string): Unit | null {
  for (let i = 0; i < units.length; i++) {
    if (value.endsWith(units[i])) {
      return units[i];
    }
  }
  return null;
}

type Width = {
  unit: Unit;
  value: number;
};

function parseWidth(width: number | string | null | undefined): Width | null {
  // width가 null이거나 undefined면 일찍 반환
  if (width == null) {
    return null;
  }

  // width가 숫자면 픽셀로 취급
  if (typeof width === "number") {
    return { unit: "px", value: width };
  }

  // width로부터 단위 파싱
  let unit = parseUnit(width);
  if (unit) {
    return { unit, value: parseFloat(width) };
  }

  // 이 외에 경우엔 null 반환
  return null;
}
