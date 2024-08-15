insert into codes (code, description_short, description_long) values
('A1', 'Short description A1', 'This is a longer description for code A1.'),
('B2', 'Short description B2', 'This is a longer description for code B2.'),
('C3', 'Short description C3', 'This is a longer description for code C3.');

insert into cases (id, patient_name, status, code, visit_details) values
(1, 'John Doe', 'Open', 'A1', 'Visit details for John Doe.'),
(2, 'Jane Smith', 'Ready', 'B2', 'Visit details for Jane Smith.'),
(3, 'Alice Johnson', 'Coded', 'C3', 'Visit details for Alice Johnson.');

insert into cases (id, patient_name, status, code, visit_details) values
(4, 'Delete Me', 'Coded', 'C3', 'Visit details for Alice Johnson.');
