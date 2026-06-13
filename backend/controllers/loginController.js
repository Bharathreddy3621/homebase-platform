import { check,validationResult  } from "express-validator";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const createSessionUser = (user) => ({
  _id: user._id.toString(),
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  userType: user.userType,
});

const saveSession = (req) =>
  new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });


export const getCurrentUserApi = async (req, res, next) => {
  try {
    if (!req.session.isLoggedIn || !req.session.user?._id) {
      return res.json({ isLoggedIn: false, user: null });
    }

    const currentUser = await User.findById(req.session.user._id).populate(
      "favourites"
    );

    if (!currentUser) {
      req.session.destroy(() => {});
      return res.json({ isLoggedIn: false, user: null });
    }

    const serializeHome = (home) => {
      const plainHome = home.toObject({ versionKey: false });
      return {
        ...plainHome,
        _id: plainHome._id.toString(),
        photoUrl: plainHome.photoUrl
          ? `/${plainHome.photoUrl.replace(/\\/g, "/")}`
          : "",
        houseRules: plainHome.houseRules
          ? `/${plainHome.houseRules.replace(/\\/g, "/")}`
          : "",
      };
    };

    return res.json({
      isLoggedIn: true,
      user: {
        ...createSessionUser(currentUser),
        favourites: currentUser.favourites.map(serializeHome),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const postSignUpApi = [
  check("firstName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("First Name must be at least 3 characters long")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("First Name must contain only alphabetic characters"),

  check("lastName")
    .trim()
    .matches(/^[a-zA-Z]+$/)
    .withMessage("Last Name must contain only alphabetic characters"),

  check("email").isEmail().withMessage("Invalid email address").normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Passwords have to match");
      }
      return true;
    }),

  check("userType")
    .trim()
    .notEmpty()
    .withMessage("User type is required")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  check("terms").custom((val) => {
    if (val !== "on" && val !== true) {
      throw new Error("You must agree to the terms and conditions");
    }
    return true;
  }),

  async (req, res, next) => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      userType,
      terms,
    } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map((err) => err.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          userType,
          terms,
        },
      });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(422).json({
          errors: [
            "Email already exists. Please use a different email or log in.",
          ],
          oldInput: {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            userType,
            terms,
          },
        });
      }

      const hashPassword = await bcrypt.hash(password, 12);
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashPassword,
        userType,
      });
      await user.save();
      res.status(201).json({
        message: "Signup successful. You can now log in.",
      });
    } catch (err) {
      next(err);
    }
  },
];

export const postLoginApi = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).json({
        errors: ["User does not exist"],
        oldInput: { email },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(422).json({
        errors: ["Invalid Password"],
        oldInput: { email },
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = createSessionUser(user);
    await saveSession(req);

    return res.json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (error) {
    next(error);
  }
};

export const postLogoutApi = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }
    return res.json({ message: "Logged out successfully" });
  });
};
