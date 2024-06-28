CREATE DATABASE convocorner


CREATE TABLE users(
	id int NOT NULL AUTO_INCREMENT,
	username varchar(255),
	password varchar(255),
	PRIMARY KEY (id)
)

INSERT INTO users(username, password)
SELECT 'chuckp', 'p@$$w0rd'
UNION SELECT 'adamc', 'gopackgo'

-- SELECT * FROM users