create table codes (
    code varchar(50) primary key,
    description_short text,
    description_long text
);

create type case_status_enum as enum ('Open', 'Ready', 'Coded');

create table cases (
    id int primary key,
    patient_name varchar(200),
    status case_status_enum,
    code varchar(50) references codes (code),
    visit_details text
);
