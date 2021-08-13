CREATE DATABASE smssender;

CREATE TABLE messages(
    msg_id SERIAL PRIMARY KEY,
    message VARCHAR(800),
    recipient VARCHAR(15)
);

CREATE TABLE templates(
    temp_id SERIAL PRIMARY KEY,
    message VARCHAR(800),
    mobile_no VARCHAR(15)
);