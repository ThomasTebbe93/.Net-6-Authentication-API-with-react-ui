import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const APPLICATION_NAME = "<APPLICATION_NAME>"; // TODO: change to the name of your Application

const resources = {
    de: {
        translation: {
            "application.name": APPLICATION_NAME,
            "common.info": "Info",
            "common.files": "Dateien",
            "common.myUser": "Mein Benutzer",
            "common.logout": "Abmelden",
            "common.reset": "zurücksetzen",
            "common.dataProtection": "Datenschutz",
            "common.imprint": "Impressum",
            "common.toLogin": "einloggen",
            "common.id": "Id",
            "common.name": "Name",
            "common.state": "Status",
            "common.pzn": "PZN",
            "common.role": "Rolle",
            "common.roles": "Rollen",
            "common.member": "Mitglied",
            "common.members": "Mitglieder",
            "common.user": "Benutzer",
            "common.users": "Benutzer",
            "common.userName": "Benutzername",
            "common.lastName": "Nachname",
            "common.firstName": "Vorname",
            "common.passwordReset": "Passwort zurücksetzen",
            "common.password": "Passwort",
            "common.newPassword": "neues Passwort",
            "common.material": "Material",
            "common.materials": "Materialien",
            "common.description": "Beschreibung",
            "common.type": "Typ",
            "common.materialType": "Materialtyp",
            "common.materialTypes": "Materialtypen",
            "common.equipmentType": "Gerätetyp",
            "common.equipment": "Gerät",
            "common.equipmentTypes": "Gerätetypen",
            "common.equipments": "Geräte",
            "common.serialNumber": "Seriennummer",
            "common.dashboard": "Dashboard",
            "common.stock": "Lager",
            "common.stocks": "Lager",
            "common.stocking": "Lagerhaltung",
            "common.logBook": "Fahrtenbuch",
            "common.masterData": "Stammdaten",
            "common.amount": "Anzahl",
            "common.debit": "Soll",
            "common.deadline": "Verfall",
            "common.expired": "Abgelaufen",
            "common.almostExpired": "Fast abgelaufen",
            "common.ok": "Ok",
            "common.tooLittle": "Zu wenig",
            "common.origin": "Herkunft",
            "common.settings": "Einstellungen",
            "common.vehicles": "Fahrzeuge",
            "common.administration": "Administration",
            "common.vehicle": "Fahrzeug",
            "common.licensePlate": "Kennzeichen",
            "common.inspectionDate": "Inspektionsdatum",
            "common.radioName": "Funkrufname",
            "common.myFiles": "Meine Dateien",
            "common.size": "Größe",
            "common.country": "Land",
            "common.city": "Stadt",
            "common.postCode": "Postleitzahl",
            "common.street": "Straße",
            "common.additionalAddress": "Adresszusatz",
            "common.mailAddress": "Email-Adresse",
            "common.telephoneNumber": "Telefonnummer",
            "common.customers": "Mandanten",
            "common.date": "Datum",
            "common.title": "Titel",
            "common.documents": "Dokumente",
            "common.reporter": "Meldender",
            "common.driver": "Fahrer",
            "common.target": "Ziel",
            "common.kmStart": "Start",
            "common.kmEnd": "Ende",
            "common.timeStart": "Beginn",
            "common.timeEnd": "Ende",
            "common.reason": "Anlass",
            "common.creator": "Erfasser",
            "common.overView": "Überblick",
            "common.beginning": "Beginn",
            "common.end": "Ende",
            "common.acquisitionType": "Erfassungsart",
            "common.vehicleName": "Fahrzeugname",
            "common.damageReport": "Schadensmeldung",
            "common.damageReports": "Schadensmeldungen",
            "common.dopAFileOrClick":
                "Ziehen Sie ein Bild hierher und legen Sie es ab oder klicken Sie",

            "common.pagination": "{{from}} - {{to}} von {{count}}",
            "common.rowsPerPage": "Zeilen pro Seite:",
            "common.previousPage": "Vorherige Seite",
            "common.nextPage": "Nächste Seite",
            "common.cancelLabel": "Abbrechen",
            "common.notSet": "Nicht ausgewählt",

            "dates.month.0": "Januar",
            "dates.month.1": "Februar",
            "dates.month.2": "März",
            "dates.month.3": "April",
            "dates.month.4": "Mai",
            "dates.month.5": "Juni",
            "dates.month.6": "Juli",
            "dates.month.7": "August",
            "dates.month.8": "September",
            "dates.month.9": "Oktober",
            "dates.month.10": "November",
            "dates.month.11": "Dezember",

            "dates.day.0": "Montag",
            "dates.day.1": "Dienstag",
            "dates.day.2": "Mittwoch",
            "dates.day.3": "Donnerstag",
            "dates.day.4": "Freitag",
            "dates.day.5": "Samstag",
            "dates.day.6": "Sonntag",

            "dates.day.0.short": "Mo",
            "dates.day.1.short": "Di",
            "dates.day.2.short": "Mi",
            "dates.day.3.short": "Do",
            "dates.day.4.short": "Fr",
            "dates.day.5.short": "Sa",
            "dates.day.6.short": "So",

            "rights.administration": "Administration anzeigen",
            "rights.administrationUsers": "Benutzer anzeigen",
            "rights.administrationUsersCreate": "erstellen",
            "rights.administrationUsersEdit": "bearbeiten",
            "rights.administrationUsersDelete": "löschen",
            "rights.administrationFiles": "Dateien anzeigen",
            "rights.administrationFilesEdit": "bearbeiten",
            "rights.administrationSettings": "Einstellungen anzeigen",
            "rights.administrationSettingsEdit": "bearbeiten",
            "rights.administrationRoles": "Rollen anzeigen",
            "rights.administrationRolesCreate": "erstellen",
            "rights.administrationRolesEdit": "bearbeiten",
            "rights.administrationRolesDelete": "löschen",

            "user.passwordRetype": "Passwort wiederholen",
            "user.deleteMessageShort":
                "Willst Du {{firstName}} {{lastName}} wirklich löschen?",
            "user.deleteMessageLong":
                "Wenn Du den Benutzer löscht, kann dieses Mitglied sich nicht mehr anmelden.",

            "passwordReset.title": "Passwort Vergessen",
            "passwordReset.message":
                'Hast du dein Passwort für den Account "{{login}}" vergessen und wills dieses zurücksetzen?',
            "passwordReset.messageLong":
                "{{applicationNam}} versendet dazu eine E-Mail mit einem Link an die von dir angegebene Adresse. Über diesen Link gelangst du zu einer Eingabemaske, auf der du dann dein neues Passwort setzen kannst.",
            "passwordReset.messageDuration":
                "Aus Sicherheitsgründen ist der Link nur 30 Minuten gültig.",

            "action.create": "erstellen",
            "action.createSomething": "{{something}} erstellen",
            "action.update": "bearbeiten",
            "action.updateSomething": "{{something}} bearbeiten",

            "action.abort": "Abbrechen",
            "action.delete": "Löschen",
            "action.confirm": "Bestätigen",
            "action.save": "Speichern",
            "action.register": "Registrieren",
            "action.setPassword": "Passwort setzen",

            "error.invalidPasswortResetHash":
                "Dieser Link ist veraltet und Steht nicht merht zum ändern eine vergessenen Passworts bereit",
            "validation.error.usernameDoesNotExists":
                "Benutzer existiert nicht",
            "validation.error.invalidPassword": "Falsches Passwort",
            "validation.error.notNull": "Das Feld darf nicht leer sein",
            "validation.error.notValidMailAddress":
                "Entspricht keiner gültigen Email-Adresse",
            "validation.error.passwordResetUserName.usernameDoesNotExists":
                "Der angegebene Benutzer existiert nicht",
            "validation.error.passwordResetUserName.notValidMailAddress":
                "Der angegebene Benutzername entspricht keiner gültigen Email-Adresse",
            "validation.error.notEmpty": "Das Feld darf nicht leer sein",
            "validation.error.duplicateLogin":
                "Dieser login wurde bereits vergeben",
            "validation.error.notSamePassword":
                "Passwörter stimmen nicht überein",
            "validation.error.userNameOrPasswordInvalid":
                "Login oder Passwort falsch",
            "validation.error.toShortPassword":
                "Das eingegebene Passwort ist zu kurz (mindestens 8 Zeichen)",

            "authorization.error.missingPermission": "Fehlende Berechtigung",

            "helpMessage.userSelfRegisterWelcome":
                "Willkommen bei {{applicationNam}}!",
            "helpMessage.userSelfRegister":
                'Wenn du hier gelandet bist, bist du einen Einladungslink deiner Organisation gefolgt. Über diese Seite kannst Du dich selbstständig für die Organisation "{{organisation}}" als Benutzer registrieren. Du bekommst eine von der Organisation definierte Rolle hinterlegt und kannst dich im Anschluss direkt hier im Browser oder über die App in {{applicationNam}} anmelden.',
            "helpMessage.userSelfRegisterHaveFun":
                "Viel Spaß wünscht Dir dein {{applicationName}}-Team :)",
            "helpMessage.userResetPasswordWelcome":
                "Willkommen bei {{applicationNam}}!",
            "helpMessage.userResetPasswor":
                "Wenn du hier gelandet bist, hast du wahrscheinlich dein Passwort vergessen und bist einem Passwort-Vergessen-Link aus deiner Mail gefolgt. Über diese Seite kannst Du dein Passwort neu setzen. Im Anschluss wirst du dann direkt zum Login weitergeleitet. Bitte beachte, dass der Link nur 30 Minuten nach versenden der Mail funktioniert.",
            "helpMessage.userResetPassworHaveFun":
                "Viel Spaß wünscht Dir dein {{applicationNam}}-Team :)",
            "helpMessage.passwordResetSent":
                "Eine Mail mit dem Link zum Zurücksetzen des Passwortes wurde an die angegebene E-Mail-Adresse versendet.",
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "de",

    keySeparator: false,

    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
