import { ErrorCode } from '../constants/ErrorCode';

export function throwError(errorCode: ErrorCode): never {
  throw new Error(errorCode);
}
