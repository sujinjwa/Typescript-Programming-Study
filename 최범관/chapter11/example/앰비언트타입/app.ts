function toArray<T>(a: T): ToArray<T> {
  if (Array.isArray(a)) {
    return a as ToArray<T>;
  }
  return [a] as ToArray<T>;
}
