CREATE DATABASE IF NOT EXISTS mcdo_db;
USE mcdo_db;

CREATE TABLE IF NOT EXISTS calendar_notes (
    note_date DATE PRIMARY KEY,
    note_text TEXT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cooperatives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    status VARCHAR(50),
    members VARCHAR(50),
    businessActivity TEXT,
    products TEXT,
    numberMembers VARCHAR(50),
    dateEstablished DATE,
    businessAddress TEXT,
    contactNumber VARCHAR(100),
    email VARCHAR(255),
    trainingGeneral TEXT,
    boardRows TEXT,
    staffRows TEXT,
    committeeRows TEXT,
    createdBy VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE,
    content TEXT,
    image LONGTEXT,
    status VARCHAR(50) DEFAULT 'Active',
    createdBy VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS about_content (
    id INT PRIMARY KEY DEFAULT 1,
    description TEXT,
    vision TEXT,
    mission TEXT
);

INSERT IGNORE INTO about_content (id, description, vision, mission) VALUES (1, '', '', '');