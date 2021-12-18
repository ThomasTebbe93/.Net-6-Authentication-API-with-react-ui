import React, { useState, useEffect } from "react";
import {
    makeStyles,
    Theme,
    createStyles,
    TextField,
    useTheme,
} from "@material-ui/core";
import Autocomplete, {
    AutocompleteChangeDetails,
    AutocompleteChangeReason,
    AutocompleteRenderInputParams,
    AutocompleteRenderOptionState,
} from "@material-ui/lab/Autocomplete";

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 300,
            display: "flex",
        },
        input: {
            color: theme.palette.getContrastText(
                theme.palette.background.default
            ),
        },
        item: {
            width: "100%",
            color: theme.palette.getContrastText(
                theme.palette.background.paper
            ),
        },
        itemSelected: {
            width: "100%",
            color: theme.palette.primary.main,
        },
    })
);

interface Props {
    onChange: (value: any) => void;
    value: any;
    loade: (inputValue: string) => Promise<any[]>;
    disabled: boolean;
    error?: boolean;
    helperText?: React.ReactNode;
}

export default function InputSelect({
    onChange,
    value,
    loade,
    disabled,
    error,
    helperText,
}: Props) {
    const theme = useTheme();
    const classes = useStyles();
    const [entities, setEntities] = useState<any[] | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        loade(searchValue).then((res) => {
            setEntities(res);
            setIsLoading(false);
        });
    }, [searchValue]);

    const onChangeSelect = (
        event: React.ChangeEvent<{}>,
        value: unknown,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<unknown> | undefined
    ) => {
        onChange(value);
    };

    const handleChange = (
        event: React.ChangeEvent<{}>,
        newInputValue: string
    ) => {
        if (!!timer) clearTimeout(timer);
        setInputValue(newInputValue);
        setTimer(
            setTimeout(() => setSearchValue(newInputValue), WAIT_INTERVAL)
        );
    };

    const onFocus = (event: React.FocusEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setSearchValue("");
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.keyCode === ENTER_KEY) {
            setSearchValue(inputValue);
        }
    };

    return (
        <Autocomplete
            getOptionSelected={(option: any, value: any) =>
                option?.ident?.ident === value?.ident?.ident
            }
            onFocus={onFocus}
            disabled={disabled}
            loading={isLoading}
            inputValue={inputValue}
            onInputChange={handleChange}
            onKeyDown={handleKeyDown}
            id="autocomplete"
            options={
                entities !== undefined
                    ? entities ?? ([] as any[])
                    : ([] as any[])
            }
            getOptionLabel={(option: any | undefined) => option?.name ?? ""}
            className={classes.formControl}
            onChange={onChangeSelect}
            value={value}
            renderOption={(
                option: any,
                state: AutocompleteRenderOptionState
            ) => (
                <div
                    className={
                        state.selected ? classes.itemSelected : classes.item
                    }
                >
                    {option?.name ?? ""}
                </div>
            )}
            renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        classes: {
                            input: classes.input,
                        },
                    }}
                    error={error}
                    helperText={helperText}
                />
            )}
        />
    );
}
