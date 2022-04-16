import { BehaviorSubject } from "rxjs";
import { UserSettings } from "../types/userSettings";

const userSettingsSubject = new BehaviorSubject<UserSettings | null>(
    JSON.parse(localStorage.getItem("userSettings") || "{}")
);

export const userSettingsService = {
    setValueSelcetedSideBarElement,
    userSettings: userSettingsSubject.asObservable(),
    get userSettingsValue() {
        return userSettingsSubject.value;
    },
};

function setValueSelcetedSideBarElement(value: any) {
    const newSettings = {
        ...userSettingsSubject.value,
        selcetedSideBarElement: value,
    } as UserSettings;
    update(newSettings);
}
function update(newSwttings: UserSettings) {
    localStorage.setItem("userSettings", JSON.stringify(newSwttings));
    userSettingsSubject.next(newSwttings);
}
