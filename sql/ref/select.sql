-- select * from codes;

select
    code,
    description_short
from codes
limit 10;

select
    cases.id,
    cases.patient_name,
    codes.code,
    codes.description_short
from cases
left join codes on cases.code = codes.code;
