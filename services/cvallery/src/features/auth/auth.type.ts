import { UserRole } from "shared";

export interface TokenPayload {
  sub: string;
  role: UserRole;
}