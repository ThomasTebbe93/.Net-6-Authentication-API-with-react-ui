CREATE TABLE public.users
(
    ident uuid NOT NULL DEFAULT uuid_generate_v4(),
    firstname character varying(255) COLLATE pg_catalog."default" NOT NULL,
    lastname character varying(255) COLLATE pg_catalog."default" NOT NULL,
    username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    passwordhash character varying(255) COLLATE pg_catalog."default" NOT NULL,
    deleted boolean,
    roleident uuid,
    passwordsalt character varying(255) COLLATE pg_catalog."default",
    passwordchangeddate timestamp without time zone DEFAULT statement_timestamp(),
    passwordforgottenhash character varying COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    passwordforgottenhashdate timestamp without time zone,
    CONSTRAINT users_pkey PRIMARY KEY (ident)
);