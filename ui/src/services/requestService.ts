import { OfficeFile } from "../types/officeFile";
import { UploadeFile } from "../types/uploadeFile";
import { authenticationService } from "./authenticationService";

export const requestService = {
    get,
    postAnonym,
    post,
    login,
    logout,
    getBaseUrl,
};

export function getBaseUrl(): string {
    return "/api";
}

export function headerWithJson(): Record<string, string> {
    return {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
    };
}

function headerWithMultipart(): Record<string, string> {
    return {
        Accept: "application/json",
    };
}

function get<T>(url: string): Promise<T> {
    const requestOptions: RequestInit = {
        method: "GET",
        headers: headerWithJson(),
        credentials: "include" as RequestCredentials,
    };
    return fetch(`${getBaseUrl()}${url}`, requestOptions)
        .then((response) => {
            if (!response.ok) {
                if ([400, 401, 403].indexOf(response.status) !== -1) {
                    authenticationService.logout();
                    return;
                }
            }
            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((x) => {
            authenticationService.logout();
        });
}

function post<T>(url: string, body: any): Promise<T> {
    return fetch(`${getBaseUrl()}${url}`, {
        method: "POST",
        headers: headerWithJson(),
        body: JSON.stringify(body),
        credentials: "include" as RequestCredentials,
    })
        .then((response) => {
            if (!response.ok) {
                if ([400, 401, 403].indexOf(response.status) !== -1) {
                    authenticationService.logout();
                    return;
                }
            }
            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((x) => {
            authenticationService.logout();
        });
}

function postAnonym<T>(url: string, body: any): Promise<T> {
    return fetch(`${getBaseUrl()}${url}`, {
        method: "POST",
        headers: headerWithJson(),
        body: JSON.stringify(body),
        credentials: "include" as RequestCredentials,
    })
        .then((response) => {
            if (!response.ok) {
                if ([400, 401, 403].indexOf(response.status) !== -1) {
                    authenticationService.logout();
                    return;
                }
            }
            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((x) => {
            authenticationService.logout();
        });
}

function multipart<T>(
    url: string,
    body: any,
    files: UploadeFile[] | null
): Promise<T> {
    const formdata = new FormData();
    formdata.append("data", JSON.stringify(body));
    files?.forEach((file: UploadeFile) =>
        formdata.append("files", file.file, file.clientIdent)
    );

    return fetch(`${getBaseUrl()}${url}`, {
        method: "POST",
        headers: headerWithMultipart(),
        body: formdata,
        credentials: "include" as RequestCredentials,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error on http-request");
            }
            return response.json();
        })
        .catch((x) => {
            authenticationService.logout();
            return {} as T;
        });
}

function login<T>(requestOptions: RequestInit): Promise<T> {
    return fetch(
        `${getBaseUrl()}/authentication/authenticateWithCookie`,
        requestOptions
    )
        .then((response) => {
            if (!response.ok) {
                if ([400, 401, 403].indexOf(response.status) !== -1) {
                    authenticationService.logout();
                    return;
                }
            }
            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((x) => {
            authenticationService.logout();
        });
}

function logout(onSucc: () => void) {
    return fetch(`${getBaseUrl()}/authentication/logout`, {
        method: "POST",
        headers: headerWithJson(),
        credentials: "include" as RequestCredentials,
    })
        .then((response) => {
            if (!response.ok) {
                if ([400, 401, 403].indexOf(response.status) !== -1) {
                    authenticationService.logout();
                    return;
                }
            }
        })
        .then(() => onSucc())
        .catch((x) => {
            authenticationService.logout();
        });
}

function openFileBlank(file: OfficeFile) {
    window.open(file.downloadPath, "_blank");
}
