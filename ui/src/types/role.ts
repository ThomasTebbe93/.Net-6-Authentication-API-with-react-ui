import { List } from "immutable";
import { Right } from "./right";

export type Role = {
    ident: { ident: string };
    name: string;
    description: string;
    rights: List<Right>;
};
