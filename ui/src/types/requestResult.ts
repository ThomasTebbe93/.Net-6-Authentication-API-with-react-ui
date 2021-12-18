import { List } from "immutable";

export type RequestResult = {
    statusCode: StatusCode | null;
    validationFailures: List<ValidationFailure> | null;
    exception: Exception | null;
    permissionFailure: PermissionFailure | null;
};

export enum StatusCode {
    validationError = 442,
    PermissionFailure = 403,
    ok = 200,
    internalServerError = 500,
}

export type ValidationFailure = {
    propertyName: string;
    errorMessage: string;
    attemptedValue: any;
};

export type PermissionFailure = {
    failureMessage: string;
    underlyingRight: string;
};

export type Exception = {
    message: string;
    innerException: any;
};
