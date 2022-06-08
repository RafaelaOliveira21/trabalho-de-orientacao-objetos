CREATE TABLE personagem
(
    id             SERIAL         NOT NULL PRIMARY KEY,
    nome           VARCHAR(100)   NOT NULL,
    tipo_elemental VARCHAR(7)     NOT NULL,
    arma           VARCHAR(17)    NOT NULL,
    poder          VARCHAR(100)   NOT NULL,
    nota           DECIMAL(10, 2) NOT NULL
);