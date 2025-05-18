--- These are master data required for the application to run.
--- Delete the tables and sequences if they exist before creating them again.
CREATE ROLE msadmin WITH SUPERUSER CREATEDB CREATEROLE LOGIN ENCRYPTED PASSWORD 'gms_admin';
CREATE DATABASE gms WITH OWNER msadmin;
CREATE SCHEMA master AUTHORIZATION msadmin;
CREATE SCHEMA worksheet AUTHORIZATION msadmin;

---CREATE TABLES --> It will be automatically done after building the ams-api code



---- Unit Sector ------
INSERT INTO master.unit_sector
("createdBy", "updatedBy", id, "name", description, "location", "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_sector_id_seq'::regclass), 'Unit-I', 'Unit I - produces raw materials', 'Pondy 1', now(), now());
INSERT INTO master.unit_sector
("createdBy", "updatedBy", id, "name", description, "location", "createdAt", "updatedAt")
VALUES(1,1, nextval('master.unit_sector_id_seq'::regclass), 'Unit-II', 'Unit II - produces raw materials', 'Pondy 2', now(), now());
INSERT INTO master.unit_sector
("createdBy", "updatedBy", id, "name", description, "location", "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_sector_id_seq'::regclass), 'Unit-III', 'Unit III - produces raw materials', 'Pondy 3', now(), now());


--- Default User -----
---- Login with the below credentials
---- userName: GMH-AMS-1
---- password: welcome123
INSERT INTO master."user"
("createdBy", "updatedBy", id, "userCode", "firstName", "lastName", "password", email, "mobileNumber", "role", designation, "dateOfBirth", address, "dateOfJoining", remarks, "createdAt", "updatedAt", "unitSectorId")
VALUES(0, 0, nextval('master.user_id_seq'::regclass), 'GMH-AMS-1', 'Bala', 'Sir', '$2b$10$bcjIyTjwrH9AkCdJnpH3HuegIz2K5HWdLfzzXGxjF5KqPj6HnmbwW', 'test', '950000', 'admin', 'Manager', '1998-09-18 23:04:02.666', 'test', '2016-09-18 23:04:02.666', '', now(), now(), 1);

----Unit-----
INSERT INTO master.unit
("createdBy", "updatedBy", id, value, description, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_id_seq'::regclass), 'Tins', '', now(), now());
INSERT INTO master.unit
("createdBy", "updatedBy", id, value, description, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_id_seq'::regclass), 'Bags', '5 kgs', now(), now());
INSERT INTO master.unit
("createdBy", "updatedBy", id, value, description, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_id_seq'::regclass), 'Millions', '', now(), now());
INSERT INTO master.unit
("createdBy", "updatedBy", id, value, description, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_id_seq'::regclass), 'Frozen Cups', '', now(), now());
INSERT INTO master.unit
("createdBy", "updatedBy", id, value, description, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_id_seq'::regclass), '°C', 'Degree Celsius', now(), now());
INSERT INTO master.unit
("createdBy", "updatedBy", id, value, description, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_id_seq'::regclass), 'PPT', 'Parts per thousand', now(), now());

---- Worksheet Unit -----

INSERT INTO master.worksheet_unit
("createdBy", "updatedBy", id, value, brand, specs, "createdAt", "updatedAt")
VALUES(1, 1, 1, 'Millions', '', '', '2025-05-17 23:08:19.979', '2025-05-17 23:08:19.979');
INSERT INTO master.worksheet_unit
("createdBy", "updatedBy", id, value, brand, specs, "createdAt", "updatedAt")
VALUES(1, 1, 2, 'Frozen Cups', NULL, NULL, '2025-05-18 13:03:25.357', '2025-05-18 13:03:25.357');
INSERT INTO master.worksheet_unit
("createdBy", "updatedBy", id, value, brand, specs, "createdAt", "updatedAt")
VALUES(1, 1, 3, 'Tins', 'Inve', NULL, '2025-05-18 13:06:30.932', '2025-05-18 13:06:30.932');
INSERT INTO master.worksheet_unit
("createdBy", "updatedBy", id, value, brand, specs, "createdAt", "updatedAt")
VALUES(1, 1, 4, 'Bags', 'Ria', '5 kgs', '2025-05-18 07:31:58.480', '2025-05-18 07:31:58.480');

---Tank Types ---

INSERT INTO master.tank_type
(id, value, description, "createdAt", "updatedAt", "createdBy", "updatedBy", "limit")
VALUES(nextval('master.tank_type_id_seq'::regclass), 'Machinery', 'Tanks with automated process setup', now(), now(), 1, 1, 25);

INSERT INTO master.tank_type
(id, value, description, "createdAt", "updatedAt", "createdBy", "updatedBy", "limit")
VALUES(nextval('master.tank_type_id_seq'::regclass), 'Conventional', 'Tanks with manual process setup', now(), now(), 1, 1, 25);

----- Harvest Types ------- 

INSERT INTO master.harvest_type
(id, value, description, "createdAt", "updatedAt", "createdBy", "updatedBy", "harvestTime")
VALUES(nextval('master.harvest_type_id_seq'::regclass), 'Instar1', 'Harvest after 18 hours', now(), now(), 1, 1, 18);

INSERT INTO master.harvest_type
(id, value, description, "createdAt", "updatedAt", "createdBy", "updatedBy", "harvestTime")
VALUES(nextval('master.harvest_type_id_seq'::regclass), 'Instar2', 'Harvest after 24 hours', now(), now(), 1, 1, 24);

INSERT INTO master.harvest_type
(id, value, description, "createdAt", "updatedAt", "createdBy", "updatedBy", "harvestTime")
VALUES(nextval('master.harvest_type_id_seq'::regclass), 'Manual', 'Harvest based on manual setup', now(), now(), 1, 1, 0);

INSERT INTO master.harvest_type
(id, value, description, "createdAt", "updatedAt", "createdBy", "updatedBy", "harvestTime")
VALUES(nextval('master.harvest_type_id_seq'::regclass), 'Restocking', 'Harvest based on manual setup', now(), now(), 1, 1, 0);

---- Worksheet Status ----
INSERT INTO master.worksheet_status
(id, value, description, "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.worksheet_status_id_seq'::regclass), 'Ready For Stocking', 'Indicates the tank is ready for stocking', now(), now(), 1, 1);
INSERT INTO master.worksheet_status
(id, value, description, "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.worksheet_status_id_seq'::regclass), 'In Stocking', 'Indicates the tank is in stocking', now(), now(), 1, 1);
INSERT INTO master.worksheet_status
(id, value, description, "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.worksheet_status_id_seq'::regclass), 'Ready For Harvest', 'Indicates the tank is ready for harvest', now(), now(), 1, 1);
INSERT INTO master.worksheet_status
(id, value, description, "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.worksheet_status_id_seq'::regclass), 'Completed', 'Indicates the tank harvest is completed', now(), now(), 1, 1);
INSERT INTO master.worksheet_status
(id, value, description, "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.worksheet_status_id_seq'::regclass), 'Free/Open', 'Indicates the tank is free', now(), now(), 1, 1);


---- Temperature -----
INSERT INTO master.temperature
(id, min, max, "defaultValue", "unitId", "createdAt", "updatedAt", "createdBy", "updatedBy", "step")
VALUES(nextval('master.temperature_id_seq'::regclass), 25, 35, 30, 5, now(), now(), 1, 1, 1);


---- Tank -----
INSERT INTO master.tank
(id, min, max, "unitId", "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.tank_id_seq'::regclass), 1, 25, NULL, now(), now(), 1, 1);

---- PH -----
INSERT INTO master.ph
(id, min, max, "defaultValue", "unitId", "createdAt", "updatedAt", "createdBy", "updatedBy", "step")
VALUES(nextval('master.ph_id_seq'::regclass), 7.5, 8.5, 7.8, NULL, now(), now(), 1, 1, 0.1);

---- Salinity -----
INSERT INTO master.salnity
(id, min, max, "defaultValue", "unitId", "createdAt", "updatedAt", "createdBy", "updatedBy", "step")
VALUES(nextval('master.salnity_id_seq'::regclass), 25, 35, 28, 6, now(), now(), 1, 1, 1);

