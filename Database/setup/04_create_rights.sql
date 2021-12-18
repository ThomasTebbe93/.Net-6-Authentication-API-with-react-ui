CREATE TABLE public.rights
(
    ident uuid NOT NULL DEFAULT uuid_generate_v4(),
    name character varying COLLATE pg_catalog."default",
    description character varying COLLATE pg_catalog."default",
    key character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT rights_pkey PRIMARY KEY (ident)
);