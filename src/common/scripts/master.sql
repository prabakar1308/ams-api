--- These are master data required for the application to run.
--- Delete the tables and sequences if they exist before creating them again.

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


---- Temperature -----
INSERT INTO master.temperature
(id, min, max, unit, "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.temperature_id_seq'::regclass), 25, 35, '', now(), now(), 1, 1);


---- Tank -----
INSERT INTO master.tank
(id, min, max, unit, "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.tank_id_seq'::regclass), 1, 25, '', now(), now(), 1, 1);

---- PH -----
INSERT INTO master.ph
(id, min, max, unit, "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.ph_id_seq'::regclass), 7.5, 8.5, '', now(), now(), 0, 0);

---- Salinity -----
INSERT INTO master.salnity
(id, min, max, unit, "createdAt", "updatedAt", "createdBy", "updatedBy")
VALUES(nextval('master.salnity_id_seq'::regclass), 25, 30, '', now(), now(), 0, 0);

----Unit-----
INSERT INTO master.unit
("createdBy", "updatedBy", id, value, description, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_id_seq'::regclass), 'Tins', 'Tins', now(), now());
INSERT INTO master.unit
("createdBy", "updatedBy", id, value, description, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_id_seq'::regclass), 'Frozen Cups', 'Frozen Cups', now(), now());
INSERT INTO master.unit
("createdBy", "updatedBy", id, value, description, "createdAt", "updatedAt")
VALUES(1, 1, nextval('master.unit_id_seq'::regclass), 'Millions', 'Millions', now(), now());




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