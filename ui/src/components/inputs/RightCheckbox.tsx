import { Checkbox } from "@material-ui/core";
import React from "react";

interface Props {
    handleChange: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        rightKey: string,
        value: boolean
    ) => void;
    rigtKey: string;
    value: boolean;
    disabled?: boolean;
}

export default function RightCheckbox({
    rigtKey,
    handleChange,
    value,
    disabled = false,
}: Props) {
    const onChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
        handleChange(event, rigtKey, !value);
    return (
        <Checkbox
            disabled={disabled}
            id={rigtKey}
            checked={value}
            onClick={onChange}
            name={rigtKey}
            color="primary"
        />
    );
}
