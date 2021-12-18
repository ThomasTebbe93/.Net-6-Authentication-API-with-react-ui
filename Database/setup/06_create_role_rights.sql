CREATE TABLE public.role_rights
(
    ident uuid NOT NULL DEFAULT uuid_generate_v4(),
    roleident uuid NOT NULL,
    rightident uuid NOT NULL,
    deleted boolean NOT NULL DEFAULT false,
    CONSTRAINT role_rights_pkey PRIMARY KEY (ident)
);
