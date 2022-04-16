export type OfficeFile = {
    name: string;
    mimeType: string;
    createTime?: Date;
    size?: number;
    ident?: { ident: string };
    clientIdent?: string;
    downloadPath?: string;
    viewPath?: string;
};
