import { List } from "immutable";
import { Role } from "./role";

export type User = {
    ident?: { ident: string };
    firstName: string;
    lastName: string;
    userName: string;
    role: Role;
    password?: string;
    passwordRetyped?: string;
};

export type AuthenticationUser = {
    ident?: { ident: string };
    firstName: string;
    lastName: string;
    userName: string;
    rights?: List<string>;
};
