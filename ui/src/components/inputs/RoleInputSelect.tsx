import React from "react";
import { requestService } from "../../services/requestService";
import { Role } from "../../types/role";
import InputSelect from "./Inputselect";

interface Props {
    onChange: (value: unknown) => void;
    value: Role | undefined;
    disabled?: boolean;
}

const loade = (inputValue: string) =>
    requestService.post<Role[]>(`/Role/autocomplete`, {
        searchValue: inputValue,
    });

export default function RoleInputSelect({
    onChange,
    value,
    disabled = false,
}: Props) {
    return (
        <InputSelect
            loade={loade}
            onChange={onChange}
            value={value ?? ({} as Role)}
            disabled={disabled}
        />
    );
}
