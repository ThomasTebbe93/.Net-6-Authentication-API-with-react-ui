CREATE TABLE public.roles
(
    ident uuid NOT NULL DEFAULT uuid_generate_v4(),
    name character varying COLLATE pg_catalog."default",
    description character varying COLLATE pg_catalog."default",
    deleted boolean,
    CONSTRAINT roles_pkey PRIMARY KEY (ident)
);