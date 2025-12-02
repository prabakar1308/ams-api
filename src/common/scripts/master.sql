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
VALUES(1, 1, nextval('master.unit_sector_id_seq'::regclass), 'Unit 1 ABC.Sec', 'Unit 1 ABC.Sec', 'Marakaanam', now(), now());
INSERT INTO master.unit_sector
("createdBy", "updatedBy", id, "name", description, "location", "createdAt", "updatedAt")
VALUES(1,1, nextval('master.unit_sector_id_seq'::regclass), 'Unit 1 D.Sec', 'Unit 1 D.Sec', 'Marakaanam', now(), now());
INSERT INTO master.unit_sector
("createdBy", "updatedBy", id, "name", description, "location", "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_sector_id_seq'::regclass), 'Unit 1 GWP', 'Unit 1 GWP', 'Marakaanam', now(), now());
INSERT INTO master.unit_sector
("createdBy", "updatedBy", id, "name", description, "location", "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_sector_id_seq'::regclass), 'Unit 2', 'Unit 2', 'Sirkazhi', now(), now());
INSERT INTO master.unit_sector
("createdBy", "updatedBy", id, "name", description, "location", "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_sector_id_seq'::regclass), 'Unit 3', 'Unit 3', 'Marakaanam', now(), now());
INSERT INTO master.unit_sector
("createdBy", "updatedBy", id, "name", description, "location", "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_sector_id_seq'::regclass), 'Unit 4', 'Unit 4', 'Mugaiyur', now(), now());
INSERT INTO master.unit_sector
("createdBy", "updatedBy", id, "name", description, "location", "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_sector_id_seq'::regclass), 'Unit 5', 'Unit 5', 'Marakaanam', now(), now());
INSERT INTO master.unit_sector
("createdBy", "updatedBy", id, "name", description, "location", "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_sector_id_seq'::regclass), 'Unit 6', 'Unit 6', 'Marakaanam', now(), now());
INSERT INTO master.unit_sector
("createdBy", "updatedBy", id, "name", description, "location", "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_sector_id_seq'::regclass), 'Unit 7 AB.Sec', 'Unit 7 AB.Sec', 'Marakaanam', now(), now());
INSERT INTO master.unit_sector
("createdBy", "updatedBy", id, "name", description, "location", "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_sector_id_seq'::regclass), 'Unit 8 CD.Sec', 'Unit 8 CD.Sec', 'Marakaanam', now(), now());
INSERT INTO master.unit_sector
("createdBy", "updatedBy", id, "name", description, "location", "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_sector_id_seq'::regclass), 'Unit 9 Bio Farm', 'Unit 9 Bio Farm', 'Marakaanam', now(), now());


--- Default User -----
---- Login with the below credentials
---- userName: GMH-AMS-1
---- password: welcome123
INSERT INTO master."user"
("createdBy", "updatedBy", id, "userCode", "firstName", "lastName", "password", email, "mobileNumber", "role", designation, "dateOfBirth", address, "dateOfJoining", remarks, "createdAt", "updatedAt")
VALUES(0, 0, nextval('master.user_id_seq'::regclass), 'GMH-AMS-1', 'AMS', 'Admin', '$2b$10$bcjIyTjwrH9AkCdJnpH3HuegIz2K5HWdLfzzXGxjF5KqPj6HnmbwW', 'test', '950000', 'super_admin', 'Manager', '1998-09-18 23:04:02.666', 'test', '2016-09-18 23:04:02.666', '', now(), now());




---- Worksheet Unit -----

INSERT INTO master.worksheet_unit
("createdBy", "updatedBy", id, value, brand, specs, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.worksheet_unit_id_seq'::regclass), 'Millions', '', '', '2025-05-17 23:08:19.979', '2025-05-17 23:08:19.979');
INSERT INTO master.worksheet_unit
("createdBy", "updatedBy", id, value, brand, specs, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.worksheet_unit_id_seq'::regclass), 'Frozen Cups', NULL, NULL, '2025-05-18 13:03:25.357', '2025-05-18 13:03:25.357');
INSERT INTO master.worksheet_unit
("createdBy", "updatedBy", id, value, brand, specs, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.worksheet_unit_id_seq'::regclass), 'Tins', 'Inve', NULL, '2025-05-18 13:06:30.932', '2025-05-18 13:06:30.932');
INSERT INTO master.worksheet_unit
("createdBy", "updatedBy", id, value, brand, specs, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.worksheet_unit_id_seq'::regclass), 'Tins', 'Sha', NULL, '2025-05-18 13:06:30.932', '2025-05-18 13:06:30.932');
INSERT INTO master.worksheet_unit
("createdBy", "updatedBy", id, value, brand, specs, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.worksheet_unit_id_seq'::regclass), 'Bags', 'Arsal', '5 kgs', '2025-05-18 07:31:58.480', '2025-05-18 07:31:58.480');

----Unit-----
INSERT INTO master.unit
("createdBy", "updatedBy", id, value, description, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_id_seq'::regclass), '°C', 'Degree Celsius', now(), now());
INSERT INTO master.unit
("createdBy", "updatedBy", id, value, description, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_id_seq'::regclass), 'PPT', 'Parts per thousand', now(), now());
INSERT INTO master.unit
("createdBy", "updatedBy", id, value, description, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_id_seq'::regclass), 'Tins', '', now(), now());
INSERT INTO master.unit
("createdBy", "updatedBy", id, value, description, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_id_seq'::regclass), 'Bags', '', now(), now());
INSERT INTO master.unit
("createdBy", "updatedBy", id, value, description, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_id_seq'::regclass), 'Millions', '', now(), now());
INSERT INTO master.unit
("createdBy", "updatedBy", id, value, description, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_id_seq'::regclass), 'Frozen Cups', '', now(), now());

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
(id, value, "shortName", description, "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.worksheet_status_id_seq'::regclass), 'Ready For Stocking', 'rfs', 'Indicates the tank is ready for stocking', now(), now(), 1, 1);
INSERT INTO master.worksheet_status
(id, value, "shortName", description, "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.worksheet_status_id_seq'::regclass), 'In Culture', 'ic', 'Indicates the tank is In Culture', now(), now(), 1, 1);
INSERT INTO master.worksheet_status
(id, value, "shortName", description, "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.worksheet_status_id_seq'::regclass), 'Ready For Harvest', 'rfh', 'Indicates the tank is ready for harvest', now(), now(), 1, 1);
INSERT INTO master.worksheet_status
(id, value, "shortName", description, "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.worksheet_status_id_seq'::regclass), 'Completed', 'complete', 'Indicates the tank harvest is completed', now(), now(), 1, 1);
INSERT INTO master.worksheet_status
(id, value, "shortName", description, "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.worksheet_status_id_seq'::regclass), 'Empty', 'empty', 'Indicates the tank is free', now(), now(), 1, 1);
INSERT INTO master.worksheet_status
(id, value, "shortName", description, "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.worksheet_status_id_seq'::regclass), 'Washing', 'wm', 'Indicates the tank is in washing status', now(), now(), 1, 1);



---- Temperature -----
INSERT INTO master.temperature
(id, min, max, "defaultValue", "unitId", "createdAt", "updatedAt", "createdBy", "updatedBy", "step")
VALUES(nextval('master.temperature_id_seq'::regclass), 20, 35, 30, 1, now(), now(), 1, 1, 1);


---- Tank -----
INSERT INTO master.tank
(id, min, max, "unitId", "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.tank_id_seq'::regclass), 1, 25, NULL, now(), now(), 1, 1);

---- PH -----
INSERT INTO master.ph
(id, min, max, "defaultValue", "unitId", "createdAt", "updatedAt", "createdBy", "updatedBy", "step")
VALUES(nextval('master.ph_id_seq'::regclass), 7.5, 9.5, 7.8, NULL, now(), now(), 1, 1, 0.1);

---- Salinity -----
INSERT INTO master.salnity
(id, min, max, "defaultValue", "unitId", "createdAt", "updatedAt", "createdBy", "updatedBy", "step")
VALUES(nextval('master.salnity_id_seq'::regclass), 25, 35, 28, 2, now(), now(), 1, 1, 1);

-- Sample data for source_tracker
INSERT INTO master.source_tracker
("sourceOrigin", "count", "generatedAt", "createdBy", "updatedBy", "createdAt", "updatedAt", "unitSource")
VALUES
('Source Tracker 1', 1000, '2025-09-25 10:00:00', 1, 1, now(), now(), 3),
('Source Tracker 1', 500, '2025-09-24 09:30:00', 1, 1, now(), now(), 3),
('Source Tracker 1', 200, '2025-09-23 08:15:00', 1, 1, now(), now(), 4);