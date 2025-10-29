// controllers/nationalIDController.js
import NationalID from "../models/NationalID.js";
import { getNextSequence } from "../utils/counter.js";
import excelToJson from "convert-excel-to-json";
import fs from "fs";
export const uploadNationalIDsExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
        type: "validation",
      });
    }

    const filePath = req.file.path;

    // Convert Excel to JSON
    const result = excelToJson({
      sourceFile: filePath,
      sheets: [
        {
          name: "Sheet1",
          header: { rows: 1 },
          columnToKey: {
            A: "firstName",
            B: "middleName",
            C: "lastName",
            D: "gender",
          },
        },
      ],
    });

    const nationalIDsData = result.Sheet1;

    if (!nationalIDsData || nationalIDsData.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: "No valid data found in the Excel file",
        type: "validation",
      });
    }

    // Validate required fields
    const requiredFields = ["firstName", "middleName", "lastName", "gender"];
    const missingFields = requiredFields.filter(
      (field) => !nationalIDsData[0][field]
    );

    if (missingFields.length > 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
        type: "validation",
      });
    }

    // Process and validate each record
    const validNationalIDs = [];
    const errors = [];

    for (const [index, record] of nationalIDsData.entries()) {
      try {
        // Validate required fields
        if (
          !record.firstName ||
          !record.lastName ||
          !record.lastName ||
          !record.gender
        ) {
          throw new Error(
            "First name, middle name,  last name, and gender are required"
          );
        }

        // Check for existing record
        const existingID = await NationalID.findOne({
          firstName: record.firstName.trim(),
          middleName: record.middleName?.trim(),
          lastName: record.lastName.trim(),
          gender: record.gender.trim(),
        });

        if (existingID) {
          throw new Error("National ID already exists for this person");
        }

        // Generate national ID number
        const nationalIdNumber = await getNextSequence("nationalId");

        // Prepare the record
        validNationalIDs.push({
          firstName: record.firstName.trim(),
          middleName: record.middleName?.trim(),
          lastName: record.lastName.trim(),
          gender: record.gender.trim(),
          nationalIdNumber, // Include the generated National ID number
        });
      } catch (error) {
        errors.push(`Row ${index + 2}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: "Validation errors found",
        type: "validation",
        errors,
        recordsProcessed: 0,
      });
    }

    // Insert records
    try {
      const result = await NationalID.insertMany(validNationalIDs, {
        ordered: false,
      });
      fs.unlinkSync(filePath);

      return res.status(201).json({
        success: true,
        message: "File processed successfully",
        recordsProcessed: result.length,
        nationalIDs: result,
      });
    } catch (mongoError) {
      fs.unlinkSync(filePath);

      if (mongoError.code === 11000) {
        const duplicates = mongoError.writeErrors?.map(
          (err) => err.err.op.nationalIdNumber
        ) || [mongoError.keyValue?.nationalIdNumber] || ["Unknown"];

        return res.status(400).json({
          success: false,
          message: `Duplicate national IDs detected: ${duplicates.join(", ")}`,
          type: "duplicate",
          duplicateIds: duplicates,
          recordsProcessed: mongoError.result?.insertedCount || 0,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Database error occurred",
        type: "database",
        error: mongoError.message,
      });
    }
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Upload error:", error);
    next(error);
  }
};

export const createNationalID = async (req, res) => {
  const { firstName, middleName, lastName, gender } = req.body;

  if (!firstName || !middleName || !lastName || !gender) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  try {
    let nationalIdNumber;
    let retries = 3; // Retry up to 3 times in case of duplicate key error

    while (retries > 0) {
      try {
        nationalIdNumber = await getNextSequence("nationalId");
        break; // Exit loop if successful
      } catch (error) {
        if (error.code === 11000) {
          retries -= 1;
          console.warn("Duplicate nationalIdNumber detected, retrying...");
        } else {
          throw error;
        }
      }
    }

    if (!nationalIdNumber) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to generate a unique National ID number after multiple attempts",
      });
    }

    const existingID = await NationalID.findOne({
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      lastName: lastName.trim(),
      gender: gender.trim(),
    });

    if (existingID) {
      return res.status(400).json({
        success: false,
        message: "National ID already exists for this person",
      });
    }

    const nationalID = new NationalID({
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      lastName: lastName.trim(),
      gender: gender.trim(),
      nationalIdNumber: nationalIdNumber.toString(), // Convert BigInt to string
    });

    await nationalID.save();

    res.status(201).json({
      success: true,
      nationalID,
    });
  } catch (error) {
    console.error("Error creating National ID:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const searchNationalIDs = async (req, res) => {
  try {
    // Extract query parameters
    const { gender, firstName, middleName, lastName } = req.query;

    // Build the search filter dynamically
    const filter = {};

    if (gender) filter.gender = { $regex: new RegExp(gender, "i") };
    if (firstName) filter.firstName = { $regex: new RegExp(firstName, "i") };
    if (middleName) filter.middleName = { $regex: new RegExp(middleName, "i") };
    if (lastName) filter.lastName = { $regex: new RegExp(lastName, "i") };

    // Execute the query
    const nationalIDs = await NationalID.find(filter);

    res.status(200).json({
      success: true,
      count: nationalIDs.length,
      data: nationalIDs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// get single national ID by first name, middle name, last name and gender

export const getNationalIDByName = async (req, res) => {
  const { firstName, middleName, lastName, gender } = req.query;

  try {
    const nationalID = await NationalID.findOne({
      firstName: { $regex: new RegExp(`^${firstName}$`, "i") }, // Case-insensitive match
      middleName: { $regex: new RegExp(`^${middleName}$`, "i") }, // Case-insensitive match
      lastName: { $regex: new RegExp(`^${lastName}$`, "i") }, // Case-insensitive match
      gender: { $regex: new RegExp(`^${gender}$`, "i") }, // Case-insensitive match
    });

    if (!nationalID) {
      return res.status(404).json({
        success: false,
        error: "National ID not found",
      });
    }
    res.status(200).json(nationalID);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getNationalIdByFIN = async (req, res) => {
  const { nationalIdNumber } = req.params;
  if (!nationalIdNumber) {
    return res.status(400).json({
      success: false,
      message: "Please provide a national ID number",
    });
  }
  if (nationalIdNumber.length !== 16) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid national ID number",
    });
  }
  try {
    const nationalID = await NationalID.findOne({ nationalIdNumber });
    if (!nationalID) {
      return res.status(404).json({
        success: false,
        error: "National ID not found",
      });
    }
    res.status(200).json({ success: true, nationalID });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// get all national id in the database

export const getAllNationalId = async (req, res) => {
  const AllNationalId = await NationalID.find();
  if (!AllNationalId) {
    return res.status(404).json({
      success: false,
      error: "National ID not found",
    });
  }
  res.status(200).json(AllNationalId);
};
