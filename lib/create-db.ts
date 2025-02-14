import mysql from 'mysql2/promise';
import { connectToDatabase } from './db';


const createTablesSQL = `
CREATE TABLE IF NOT EXISTS Hospitals (
    HospitalID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Location VARCHAR(255),
    ContactInformation VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Doctors (
    DoctorID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Specialization VARCHAR(255),
    ContactInformation VARCHAR(255),
    HospitalID INT
);

CREATE TABLE IF NOT EXISTS Donors (
    DonorID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    DateOfBirth DATE,
    Gender VARCHAR(10),
    ContactInformation VARCHAR(255),
    Address TEXT,
    MedicalHistory TEXT,
    DonationHistory TEXT
);

CREATE TABLE IF NOT EXISTS Patients (
    PatientID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    DateOfBirth DATE,
    Gender VARCHAR(10),
    ContactInformation VARCHAR(255),
    Address TEXT,
    MedicalHistory TEXT,
    DoctorID INT,
    HospitalID INT
);

CREATE TABLE IF NOT EXISTS StemCells (
    StemCellID INT PRIMARY KEY AUTO_INCREMENT,
    Type VARCHAR(255) NOT NULL,
    CollectionDate DATE,
    ExpiryDate DATE,
    StorageCondition TEXT,
    PatientID INT, 
    DonorID INT,
    Status VARCHAR(50),
    HospitalID INT
);

CREATE TABLE IF NOT EXISTS StorageUnits (
    StorageUnitID INT PRIMARY KEY AUTO_INCREMENT,
    Location VARCHAR(255),
    Capacity INT,
    CurrentLoad INT,
    Temperature FLOAT,
    HospitalID INT
);

CREATE TABLE IF NOT EXISTS Treatments (
    TreatmentID INT PRIMARY KEY AUTO_INCREMENT,
    PatientID INT,
    DoctorID INT,
    StemCellID INT,
    TreatmentDate DATE,
    Outcome TEXT,
    Notes TEXT
);

CREATE TABLE IF NOT EXISTS MarketplaceRequests (
    RequestID INT PRIMARY KEY AUTO_INCREMENT,
    RequestType VARCHAR(255),
    RequesterID INT,
    DonorID INT NULL,
    StemCellID INT NULL,
    Status VARCHAR(50),
    RequestDate DATE,
    FulfillmentDate DATE,
    Message TEXT
);

CREATE TABLE IF NOT EXISTS Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('Admin', 'HospitalStaff', 'Donor') NOT NULL,
    HospitalID INT NULL
);

CREATE TABLE IF NOT EXISTS PatientDoctorAssignments (
    PatientID INT,
    DoctorID INT,
    PRIMARY KEY (PatientID, DoctorID)
);

CREATE TABLE IF NOT EXISTS Roles (
    RoleID INT PRIMARY KEY AUTO_INCREMENT,
    RoleName VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS UserRoles (
    UserID INT,
    RoleID INT,
    PRIMARY KEY (UserID, RoleID)
);

`;


// 3. Helper Functions to Initialize Database Components
async function setupDatabaseComponents() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    // DDL for Tables
    await connection.query(createTablesSQL);

    // Trigger
    await connection.query('DROP TRIGGER IF EXISTS UpdateStemCellStatus;');
    const createTriggerSQL = `
        CREATE TRIGGER UpdateStemCellStatus
        BEFORE UPDATE ON StemCells
        FOR EACH ROW
        BEGIN
            IF NEW.ExpiryDate < CURRENT_DATE THEN
                SET NEW.Status = 'Expired';
            END IF;
        END;
        `;
    await connection.query(createTriggerSQL);

    // Function
    await connection.query('DROP FUNCTION IF EXISTS IsStemCellAvailable;');
    const createFunctionSQL = `
        CREATE FUNCTION IsStemCellAvailable(stemcell_id INT)
        RETURNS BOOLEAN
        DETERMINISTIC
        BEGIN
            DECLARE is_available BOOLEAN;
            SELECT CASE
                WHEN Status = 'Available' AND (ExpiryDate IS NULL OR ExpiryDate >= CURRENT_DATE)
                THEN TRUE
                ELSE FALSE
            END INTO is_available
            FROM StemCells
            WHERE StemCellID = stemcell_id;
            RETURN is_available;
        END;
        `;
    await connection.query(createFunctionSQL);

    // Procedure
    await connection.query('DROP PROCEDURE IF EXISTS AssignAvailableStemCellToPatient;');
    const createProcedureSQL = `
        DELIMITER //
        CREATE PROCEDURE AssignAvailableStemCellToPatient(
            IN patient_id INT,
            IN stemcell_id INT
        )
        BEGIN
            IF IsStemCellAvailable(stemcell_id) THEN
                UPDATE StemCells
                SET PatientID = patient_id, Status = 'Reserved'
                WHERE StemCellID = stemcell_id;

                INSERT INTO Treatments (PatientID, StemCellID, TreatmentDate)
                VALUES (patient_id, stemcell_id, CURRENT_DATE);
            ELSE
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stem Cell is not available';
            END IF;
        END //
        DELIMITER ;
        `;
    await connection.query(createProcedureSQL);
  } catch (error) {
    console.error("Error setting up database components:", error);
  } finally {
    await connection.end();
  }
}

// 4. Helper Function to Assign Stem Cell to Patient
export async function assignStemCellToPatient(patientId: number, stemCellId: number) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [result] = await connection.query(
      `CALL AssignAvailableStemCellToPatient(?, ?)`,
      [patientId, stemCellId]
    );
    return result;
  } catch (error) {
    console.error("Error assigning stem cell to patient:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Initialize the components when setting up or deploying the app
setupDatabaseComponents();
