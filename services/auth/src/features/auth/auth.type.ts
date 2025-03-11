import { consts } from "shared";

export interface TokenPayload {
  sub: string;
  role: consts.enums.UserRole;
}