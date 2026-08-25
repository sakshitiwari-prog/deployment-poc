const mongoose = require("mongoose");
const { google } = require("googleapis");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");

const url = require("url");
const User = require("../Schema/onboarding");
const jwt = require("jsonwebtoken");
const { Order } = require("../Schema/order");
const bcrypt = require("bcrypt");
const { Product } = require("../Schema/products");
function testHandler(req, res) {
  res.send({ status: "success", body: req.body });
}
async function signUpHandler(req, res) {
  try {
    const { name, email, wallet, password } = req.body;
    console.log({ name, email, wallet, password });
    if (!name || !email || !wallet || !password) {
      return res.status(400).json({
        message: "Name, Email, Wallet and Password are required",
      });
    }
    const userExist = await User.find({ email });
    console.log(userExist, "edfrgt");
    if (userExist.length > 0) {
      return res.status(400).json({
        message: "User already exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      wallet,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    throw e;
  }
}
async function signInHandler(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: " Email and Password are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user?.password);
    if (!isPasswordMatch)
      return res.status(400).json({
        message: "password is incorrect",
      });

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "2m" },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
      },
    });
  } catch (e) {
    throw e;
  }
}
async function refreshHandler(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken, "refreshToken");

    if (!refreshToken) {
      return res.status(401).json({ msg: "refresh token missing" });
    }
    const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { userId: decode.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m",
      },
    );
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });
    return res.status(200).json({ msg: "token generated" });
  } catch (e) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(401).json({
      msg: "refresh token expired, login again",
    });
  }
}
async function getOrderList(req, res) {
  try {
    const result = await Product.find({});
    res.json({ data: result });
  } catch (e) {
    console.log(e);

    throw e;
  }
}
async function getProductList(req, res) {
  try {
    console.log(req?.query, req?.user, "def");
    // skip/limit pagination
    // const page = parseInt(req?.query?.page ?? 1);

    // const limit = parseInt(req?.query?.limit ?? 5);
    // const skip = (page - 1) * limit;
    // const result = await Product.find({}).skip(skip).limit(limit);
    // res.json({ data: result, page, limit });

    // cursor pagination
    const cursor = req?.query?.cursor;

    const limit = parseInt(req?.query?.limit ?? 5);
    let query = {};

    // ✅ validate cursor properly
    if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const result = await Product.find(query).sort({ _id: -1 }).limit(limit);

    const nextCursor = result.length > 0 ? result[result.length - 1]._id : null;
    console.log({ data: result, cursor: nextCursor, limit });

    res.json({ data: result, cursor: nextCursor, limit });
  } catch (e) {
    console.log(e);

    throw e;
  }
}
async function addProduct(req, res) {
  try {
    const data = req.body;
    await Product.insertOne({ ...data });
    res.send({ status: "added successfully", body: req.body });
  } catch (e) {
    throw e;
  }
}

async function orderPlaceHandler(req, res) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { product, userId, quantity, totalAmount } = req.body;

    // 1️⃣ Check stock first (important)
    const productDoc = await Product.findOne({ _id: product }).session(session);

    if (!productDoc) {
      throw new Error("Product not found");
    }

    if (productDoc.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    // 2️⃣ Reduce stock safely
    const updatedProduct = await Product.findByIdAndUpdate(
      product,
      { $inc: { stock: -Number(quantity) } },
      { new: true, session },
    );

    // 3️⃣ Create order
    const order = await Order.create(
      [
        {
          productId: product,
          userId,
          quantity,
          totalAmount,
          status: "placed",
        },
      ],
      { session },
    );

    // 4️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    // 5️⃣ Populate after commit (safe)
    const populatedOrder = await Order.findById(order[0]._id).populate(
      "productId",
    );

    res.json({
      success: true,
      updatedProduct,
      order: populatedOrder,
    });
  } catch (error) {
    // ❌ rollback everything
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
async function redirectLogin(req, res) {
  let q = url.parse(req.url, true).query;
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:5000/users/redirect",
  );
  if (q.error) {
    // An error response e.g. error=access_denied
    console.log("Error:" + q.error);
  } else if (q.state !== req.session.state) {
    //check state value
    console.log("State mismatch. Possible CSRF attack");
    res.end("State mismatch. Possible CSRF attack");
  } else {
    // Get access and refresh tokens (if access_type is offline)

    let { tokens } = await oauth2Client.getToken(q.code);
    console.log(tokens, "tokens");

    oauth2Client.setCredentials(tokens);
    res.end("pas");
  }
}
async function googleLogin(req, res) {
  /**
   * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
   * from the client_secret.json file. To get these credentials for your application, visit
   * https://console.cloud.google.com/apis/credentials.
   */
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:5000/users/redirect",
  );

  // Access scopes for two non-Sign-In scopes: Read-only Drive activity and Google Calendar.
  const scopes = [
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/calendar.readonly",
  ];

  // Generate a secure random state value.
  const state = crypto.randomBytes(32).toString("hex");

  // Store state in the session
  req.session.state = state;

  // Generate a url that asks permissions for the Drive activity and Google Calendar scope
  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    /** Pass in the scopes array defined above.
     * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    // Include the state parameter to reduce the risk of CSRF attacks.
    state: state,
  });
  console.log(authorizationUrl, "authorizationUrl");

  res.redirect(authorizationUrl);
}

module.exports = {
  googleLogin,
  testHandler,
  getProductList,
  addProduct,
  signUpHandler,
  redirectLogin,
  refreshHandler,
  signInHandler,
  getOrderList,
  orderPlaceHandler,
};
