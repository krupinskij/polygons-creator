import { ErrorCode } from '../constants/ErrorCode';

export function throwError(errorCode: ErrorCode | string): never {
  throw new Error(errorCode);
}
