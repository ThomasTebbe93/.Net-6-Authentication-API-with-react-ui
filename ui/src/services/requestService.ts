import { authenticationService } from "./authenticationService";

export const requestService = {
    get,
    postAnonym,
    post,
    login,
    getBaseUrl,
};

export const IS_DEBUG = true;

export function getBaseUrl(): string {
    const base = window.location.origin;
    if (IS_DEBUG) return base.replace(":3000", ":4000");
    return base + "/api";
}

function authHeader(): Record<string, string> {
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return { Authorization: `Bearer ${currentUser.token}` };
    } else {
        return {};
    }
}

export function authHeaderWithJson(): Record<string, string> {
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return {
            Authorization: `Bearer ${currentUser.token}`,
            Accept: "application/json",
            "Content-Type": "application/json; charset=UTF-8",
        };
    } else {
        return {};
    }
}

export function headerWithJson(): Record<string, string> {
    return {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
    };
}

function get<T>(url: string): Promise<T> {
    const requestOptions: RequestInit = {
        method: "GET",
        headers: authHeader(),
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
        headers: authHeaderWithJson(),
        body: JSON.stringify(body),
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

function login<T>(requestOptions: RequestInit): Promise<T> {
    return fetch(`${getBaseUrl()}/authentication/authenticate`, requestOptions)
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
