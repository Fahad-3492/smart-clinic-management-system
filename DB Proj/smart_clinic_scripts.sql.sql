CREATE DATABASE SmartClinic;
USE SmartClinic;

-- USERS TABLE
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    role ENUM('patient','doctor','admin')
);

-- PATIENTS TABLE
CREATE TABLE Patients (
    patient_id INT PRIMARY KEY,
    age INT,
    gender VARCHAR(10),
    FOREIGN KEY (patient_id) REFERENCES Users(user_id)
);

-- DOCTORS TABLE
CREATE TABLE Doctors (
    doctor_id INT PRIMARY KEY,
    specialization VARCHAR(100),
    experience INT,
    FOREIGN KEY (doctor_id) REFERENCES Users(user_id)
);

-- ADMINS TABLE
CREATE TABLE Admins (
    admin_id INT PRIMARY KEY,
    FOREIGN KEY (admin_id) REFERENCES Users(user_id)
);

-- SCHEDULES TABLE
CREATE TABLE Schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT,
    day VARCHAR(20),
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id)
);

-- APPOINTMENTS TABLE
CREATE TABLE Appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    appointment_date DATE,
    status ENUM('booked','cancelled','completed'),
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id)
);

-- MEDICAL RECORDS TABLE
CREATE TABLE MedicalRecords (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    diagnosis VARCHAR(255),
    treatment VARCHAR(255),
    record_date DATE,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id)
);

---------------------------------------------------
-- SAMPLE DATA
---------------------------------------------------

INSERT INTO Users (name,email,password,role) VALUES
('Ali','ali@email.com','123','patient'),
('Ahmed','ahmed@email.com','123','doctor'),
('Admin','admin@email.com','123','admin');

INSERT INTO Patients VALUES (1,22,'Male');
INSERT INTO Doctors VALUES (2,'Cardiologist',5);
INSERT INTO Admins VALUES (3);

INSERT INTO Schedules (doctor_id,day,start_time,end_time)
VALUES (2,'Monday','09:00:00','13:00:00');

INSERT INTO Appointments (patient_id,doctor_id,appointment_date,status)
VALUES (1,2,'2026-04-15','booked');

INSERT INTO MedicalRecords (patient_id,doctor_id,diagnosis,treatment,record_date)
VALUES (1,2,'Flu','Medication','2026-04-10');

--Procedures

DELIMITER $$

CREATE PROCEDURE sp_UserLogin(
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(100)
)
BEGIN
    SELECT * FROM Users
    WHERE email = p_email
    AND password = p_password;
END $$

CREATE PROCEDURE sp_UserSignup(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(100),
    IN p_role VARCHAR(20)
)
BEGIN
    INSERT INTO Users(name,email,password,role)
    VALUES(p_name,p_email,p_password,p_role);
END $$

DELIMITER ;

--Views

CREATE VIEW vw_AppointmentDetails AS
SELECT
    a.appointment_id,
    u1.name AS patient_name,
    u2.name AS doctor_name,
    a.appointment_date,
    a.status
FROM Appointments a
JOIN Users u1 ON a.patient_id = u1.user_id
JOIN Users u2 ON a.doctor_id = u2.user_id;

-- Trigger

DELIMITER $$

CREATE TRIGGER trg_PreventPastAppointment
BEFORE INSERT ON Appointments
FOR EACH ROW
BEGIN
    IF NEW.appointment_date < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Appointment date cannot be in the past';
    END IF;
END $$

DELIMITER ;

-- Transaction

START TRANSACTION;

INSERT INTO Appointments(patient_id,doctor_id,appointment_date,status)
VALUES(1,2,'2026-05-20','booked');

UPDATE Schedules
SET start_time='10:00:00'
WHERE doctor_id=2;

COMMIT;