const { School } = require("../Schema/School");
const { IdempotencyRegister } = require("../Schema/Idempotency");
const { schoolUserPair } = require("../Schema/School_User");
const { roleSchema } = require("../Schema/Role_Permission");
const { Permission } = require("../Schema/Permission");
const { Role } = require("../Schema/Role");
const { schoolUser } = require("../Schema/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
async function getSchoolList(req, res) {
  try {
    const result = await School.find({});
    res.json({ data: result });
  } catch (e) {
    console.log(e);

    throw e;
  }
}
async function userInfo(req, res) {
  try {
    res.json({ data: "user info" });
  } catch (e) {
    console.log(e);
    throw e;
  }
}
async function addSchoolList(req, res) {
  try {
    const { name, email } = req.body;
    const result = await School.create({ name, email });
    res.json({ data: result });
  } catch (e) {
    console.log(e);
    throw e;
  }
}
async function getPermissionList(req, res) {
  try {
    const result = await Permission.find({});
    res.json({ data: result });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function addPermissionList(req, res) {
  try {
    const { name } = req.body;
    const result = await Permission.create({ name });
    res.json({ data: result });
  } catch (e) {
    console.log(e);

    throw e;
  }
}
async function addRolePermissionList(req, res) {
  try {
    const { role, permission } = req.body;
    const result = await roleSchema.findOneAndUpdate(
      { role }, // 1. Filter: Find by this role
      { $set: { permission } }, // 2. Update: Set the new permissions
      {
        returnDocument: "after", // 3. Option: Return the modified/created document
        upsert: true, // 3. Option: Create it if it doesn't exist
        runValidators: true, // 3. Option: Ensure schema rules are followed on insert
      },
    );

    // Because it never returns null  anymore, this single response handles both cases safely
    return res.json({
      data: result,
      msg: "Permission processed successfully (created or updated).",
    });
  } catch (e) {
    console.log(e);

    throw e;
  }
}
async function getRolesList(req, res) {
  try {
    const result = await Role.find({});
    res.json({ data: result });
  } catch (e) {
    console.log(e);
    throw e;
  }
}
async function addRolesList(req, res) {
  try {
    const { name, email } = req.body;
    const result = await Role.create({ name });
    res.json({ data: result });
  } catch (e) {
    console.log(e);

    throw e;
  }
}

async function register(req, res) {
  try {
    const { name, email, password, role, schoolId } = req.body;
    const idempotencyKey = req?.headers["idempotency-key"];
    if (!idempotencyKey) {
      return res.status(400).json({
        message: "Idempotency-Key required",
      });
    }
    // 1. Validate input
    if (!name || !email || !password || !role || !schoolId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const existInIdempotent = await IdempotencyRegister.findOne({
      key: idempotencyKey,
    });
    if (existInIdempotent) {
      return res.status(existInIdempotent.statusCode).json({
        msg: "User already exist",
        data: existInIdempotent.response,
      });
    }
    // 2. Check school
    const school = await School.findById(schoolId);

    if (!school) {
      return res.status(404).json({
        message: "School not found",
      });
    }

    // 3. Check whether user already exists
    let user = await schoolUser.findOne({
      email,
    });

    // ------------------------------------------------
    // CASE 1: User already exists
    // ------------------------------------------------

    if (user) {
      // Check whether user already belongs to this school
      const existingMapping = await schoolUserPair.findOne({
        userId: user._id,
        schoolId,
      });

      if (existingMapping) {
        return res.status(409).json({
          message: "User already belongs to this school",
        });
      }

      // Add existing user to new school
      const mapping = await schoolUserPair.create({
        userId: user._id,
        schoolId,
        role,
      });

      return res.status(201).json({
        message: "User added to school successfully",
        data: {
          userId: user._id,
          schoolId: mapping.schoolId,
          role: mapping.role,
        },
      });
    }

    // ------------------------------------------------
    // CASE 2: New user
    // ------------------------------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await schoolUser.create({
      name,
      email,
      password: hashedPassword,
    });

    // Create User ↔ School ↔ Role relationship
    const mapping = await schoolUserPair.create({
      userId: user._id,
      schoolId,
      role,
    });
    await IdempotencyRegister.create({
      key: idempotencyKey,
      statusCode: 201,
      response: {
        id: user._id,
        name: user.name,
        email: user.email,
        schoolId: mapping.schoolId,
        role: mapping.role,
      },
      userId: user._id,
    });
    return res.status(201).json({
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        schoolId: mapping.schoolId,
        role: mapping.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
async function Login(req, res) {
  try {
    const { email, password, role, schoolId } = req.body;

    // 1. Find user
    const user = await schoolUser.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        msg: "Invalid credentials",
      });
    }

    // 2. Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        msg: "Invalid credentials",
      });
    }

    // 3. Check user's relationship with school + role
    const userSchool = await schoolUserPair.findOne({
      userId: user._id,
      schoolId,
      role,
    });

    if (!userSchool) {
      return res.status(403).json({
        msg: "User is not associated with this school or role",
      });
    }

    // 4. Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: userSchool.role,
        schoolId: userSchool.schoolId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    // 5. Store JWT in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "lax",
      secure: false, // true in production HTTPS
    });

    return res.status(200).json({
      msg: "Successful Login",
      data: {
        id: user._id,
        email: user.email,
        schoolId: userSchool.schoolId,
        role: userSchool.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      msg: "Internal server error",
    });
  }
}

module.exports = {
  getSchoolList,
  getRolesList,
  addRolesList,
  addRolePermissionList,
  userInfo,
  getPermissionList,
  addPermissionList,
  Login,
  register,
  addSchoolList,
};
