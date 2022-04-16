import { BehaviorSubject } from "rxjs";
import { AuthenticationUser } from "../types/user";
import { requestService } from "./requestService";
import { history } from "../helpers/history";
import { RequestResult } from "../types/requestResult";
import { userSettingsService } from "./userSettingsService";

const getUserSettingsFromLocalStorage = () => {
    const settings = localStorage.getItem("currentUser");

    if (!!settings && settings !== "undefined")
        return JSON.parse(settings) as AuthenticationUser;
    return {} as AuthenticationUser;
};

const currentUserSubject = new BehaviorSubject<AuthenticationUser | null>(
    getUserSettingsFromLocalStorage()
);

export const authenticationService = {
    login,
    logout,
    sendPasswordReset,
    renewUser,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value;
    },
};

function login(userName: string, password: string) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: userName, password: password }),
        credentials: "include" as RequestCredentials,
    };
    return requestService
        .login<AuthenticationUser | RequestResult>(requestOptions)
        .then((res: AuthenticationUser | RequestResult) => {
            if ((res as AuthenticationUser)?.ident)
                setUser(res as AuthenticationUser);

            return res;
        });
}

function sendPasswordReset(userName: string) {
    return requestService
        .postAnonym<RequestResult>("/user/sendResetPassword", {
            userName: userName,
        })
        .then((res: RequestResult) => {
            return res;
        });
}

function renewUser(user: AuthenticationUser) {
    setUser(user);
}

function setUser(user: AuthenticationUser) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    currentUserSubject.next(user);
}

function logout() {
    localStorage.clear();
    currentUserSubject.next(null);
    history.push("/login");
    requestService.logout(() => {
        localStorage.clear();
        currentUserSubject.next(null);
        userSettingsService.setValueSelcetedSideBarElement(null);
        history.push("/login");
    });
}
