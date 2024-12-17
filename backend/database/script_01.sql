DROP TABLE IF EXISTS user;
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  oauth_id VARCHAR(255) NULL,
  provider CHAR(4) NOT NULL DEFAULT '', -- gogl, fb, gh, tw, self
  role CHAR(2) NOT NULL DEFAULT 'us', -- us, ad
  email VARCHAR(100) UNIQUE NOT NULL,
  username VARCHAR(40) NOT NULL,
  hashed_password VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP NULL,
  UNIQUE (oauth_id, provider),
  INDEX `idx_oauth_id` (`oauth_id`),
  INDEX `idx_email` (`email`)
);
INSERT INTO user (oauth_id, email, role, username, hashed_password)
VALUES (null, 'admin', 'ad', 'admin', null);

DROP TABLE IF EXISTS medal;
CREATE TABLE IF NOT EXISTS medal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  score INT NOT NULL
);
INSERT IGNORE INTO medal(name, score)
values
    ('UNRANKED', 0),
    ('MADERA', 10),
    ('HIERRO', 15),
    ('BRONCE', 25),
    ('PLATA', 40),
    ('ORO', 60),
    ('PLATINIUM', 85),
    ('DIAMANTE', 115),
    ('INMORTAL', 150),
    ('RADIANTE', 190)
;

DROP TABLE IF EXISTS usermedal;
CREATE TABLE IF NOT EXISTS usermedal (
    user_id   INT NOT NULL,
    medal_id  INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score     INT NOT NULL,
    PRIMARY KEY (user_id, medal_id)
);

DROP TABLE IF EXISTS pokemon;
CREATE TABLE IF NOT EXISTS pokemon (
    id     INT AUTO_INCREMENT PRIMARY KEY,
    name   VARCHAR(100) UNIQUE NOT NULL,
    power  VARCHAR(100)        NOT NULL,
    status VARCHAR(4) DEFAULT 'pend' -- pend dene acep
);

DROP TABLE IF EXISTS user_pokemon;
CREATE TABLE IF NOT EXISTS user_pokemon (
  user_id INT NOT NULL,
  pokemon_id INT NOT NULL,
  medal_id INT,
  status VARCHAR(4) DEFAULT 'pend', -- pend dene acep
  PRIMARY KEY (user_id, pokemon_id)
);
