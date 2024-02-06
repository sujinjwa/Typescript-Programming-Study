// @ts-check

/**
 * @param {string} word 변환할 입력 문자열
 * @returns {string} 파스칼 표기법(pascal case)로 변환된 문자열
 */
export function toPascalCase(word) {
  return word.replace(
    /\w+/g,
    ([a, ...b]) => a.toUpperCase() + b.join('').toLowerCase()
  );
}

toPascalCase('abc');
