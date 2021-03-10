export function throwError(errorCode: string): never {
  throw new Error(errorCode);
}
