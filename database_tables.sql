CREATE TABLE category (
	id serial primary key,
	name varchar(250) NOT NULL
);

CREATE TABLE task (
	id serial primary key,
	description varchar(250) NOT NULL,
	created DATE DEFAULT CURRENT_DATE,
	due DATE,
	complete BOOL DEFAULT FALSE,
	category_id int NOT NULL REFERENCES category 
);
