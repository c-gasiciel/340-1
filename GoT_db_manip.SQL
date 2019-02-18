-- Game of Thrones database manipulation queries.
-- All queries are usable for a SQL implementation as per project step 3 requirements, no JS included
-- order of functions per project requirement: 1. insert, 2. select, 3. delete, 4. update


-- 1. 
-- INSERT

-- add new life status and description of life status 
INSERT INTO life_status (status_id, status) VALUES (4, 'witch');

-- add new location 
INSERT INTO GoT_Locations (loc_name, loc_type, population) VALUES ('Sunspear', 'Castle', 100000);

-- add new house
INSERT INTO Houses (house_name, sigil, base_city) VALUES ('Martell', 'A red sun pierced by a gold spear on orange', 38);

-- add new character
INSERT INTO GoT_Character (first_name, last_name, life_status, homeland, current_location) VALUES ('Sansa', 'Stark', 2, 34, 34);

-- add new character into a house 
INSERT INTO GoT_House_Members (house_id, character_id) VALUES (1,4);

-- add location for a new house
INSERT INTO GoT_House_Location (location_id, house_id) VALUES (38, 3);


-- 2
-- SELECT 

-- shows the partially complete location defintions so far
SELECT * FROM GoT_Locations;

-- group all the characters together by life status
SELECT * FROM life_status LEFT JOIN GoT_Character ON life_status.status_id = GoT_Character.life_status;

-- show all the houses
-- SELECT * FROM Houses;

-- shows all characters with last name 'Stark' who share the same homeland -- as a house does (ex: sansa stark and eddard stark both have the last name -- 'stark', and both have the same homeland as a house's base city.
 
SELECT GoT_Character.first_name, GoT_Character.last_name, Houses.base_city, Houses.house_name FROM Houses INNER JOIN GoT_Character ON Houses.base_city = GoT_Character.homeland WHERE GoT_Character.last_name = 'Stark';

-- shows the houses and locations
SELECT * FROM GoT_House_Location;

-- shows the house members per house
SELECT * FROM GOT_House_Members;


-- 3
-- DELETE

-- rid a character
DELETE FROM GoT_Characters WHERE life_status = 1;

 
-- 4
-- UPDATE

-- change eddard stark homeland from winterfell to castlerly rock. 
UPDATE GoT_Character SET homeland = 2 WHERE first_name = 'Eddard';

