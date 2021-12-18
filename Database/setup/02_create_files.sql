CREATE TABLE public.files
(
    ident uuid NOT NULL,
    name character varying COLLATE pg_catalog."default",
    mimetype character varying COLLATE pg_catalog."default" NOT NULL,
    size bigint,
    createtime timestamp with time zone DEFAULT CURRENT_TIMESTAMP(6),
    deleted boolean,
    CONSTRAINT "files_pkey" PRIMARY KEY (ident)
);