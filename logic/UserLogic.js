import async from "async";
import bcrypt from "bcryptjs";
import Utils from "../lib/Utils.js";
import { Consts } from "../lib/Consts.js";
import jwt from "jsonwebtoken";
import DatabaseManager from "../lib/DatabaseManager.js";

class CreateUserLogic {
    static create(body, callback) {
        async.waterfall(
            [
            // Step 1: Validate input fields
            function (done) {
                if (Utils.isEmpty(body.companyName))
                return done("Company name cannot be empty");
                if (Utils.isEmpty(body.phone))
                return done("Phone number is required");
                if (Utils.isEmpty(body.email))
                return done("Email is required");

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(body.email))
                return done("Please enter a valid email address");

                if (Utils.isEmpty(body.password))
                return done("Password is required");

                // Check if a user with the same email already exists
                DatabaseManager.user
                .findOne({ where: { email: body.email } })
                .then((existingUser) => {
                    if (existingUser)
                    return done("User with this email already exists");
                    done(null);
                })
                .catch((err) => done(err));
            },

            // Step 2: Prepare and insert user data
            function (done) {
                const params = {
                companyName: body.companyName,
                phone: body.phone,
                email: body.email,
                password: bcrypt.hashSync(body.password, 8),
                role: body.role ? body.role : "client", // default role
                status: "active",
                };

                DatabaseManager.user
                .create(params)
                .then((newUser) => done(null, newUser))
                .catch((err) => done(err));
            },
            ],
            // Final callback
            function (err, data) {
            if (err) {
                return callback({
                status: Consts.httpCodeServerError,
                message: "Failed to create user",
                error: err,
                });
            }

            return callback({
                status: Consts.httpCodeSuccess,
                message: "User created successfully",
                data,
            });
            }
        );
    }
static login(body, callback) {
  async.waterfall(
    [
      // ✅ Step 1: Verify reCAPTCHA (no async keyword)
      function (done) {
        try {
          if (Utils.isEmpty(body.recaptchaToken)) {
            return done("Please complete the reCAPTCHA");
          }

          verifyRecaptcha(body.recaptchaToken)
            .then(async (isHuman) => {
              if (!isHuman) {
                return done("reCAPTCHA verification failed. Please try again.");
              }

              // ✅ If verification passes, update recaptchaVerified = true for this user (if email is known)
              if (body.username) {
                await DatabaseManager.user.update(
                  { recaptchaVerified: true },
                  { where: { email: body.username } }
                );
              }

              return done(null); // continue to next step
            })
            .catch((err) => done(err));
        } catch (err) {
          return done(err);
        }
      },

      // ✅ Step 2: Validate inputs and find user
      function (done) {
        try {
          if (Utils.isEmpty(body.password)) return done("Password cannot be empty");
          if (Utils.isEmpty(body.username)) return done("Username is required");

          DatabaseManager.user
            .findOne({
              attributes: ["userID", "companyName", "phone", "email", "password"],
              where: { email: body.username },
            })
            .then((user) => {
              if (!user) return done("Invalid credentials");
              return done(null, user);
            })
            .catch((err) => {
              return done(err);
            });
        } catch (err) {
          return done(err);
        }
      },

      // ✅ Step 3: Validate password and update session
      function (user, done) {
        try {
          if (!bcrypt.compareSync(body.password, user.password)) {
            return done("Invalid credentials");
          }

          const session = Utils.randomString(40);
          const expiry = Utils.addTimeToDate(0, 0, 1, 0, 0); // 1 hour expiry

          DatabaseManager.user
            .update({ session, expiry }, { where: { email: user.email } })
            .then(() => {
              user.session = session;
              user.expiry = expiry;
              return done(null, user, session, expiry);
            })
            .catch((err) => {
              return done(err);
            });
        } catch (err) {
          return done(err);
        }
      },

      // ✅ Step 4: Generate JWT
      function (user, session, expiry, done) {
        try {
          const payload = {
            session,
            expiry,
            companyName: user.companyName,
            email: user.email,
            userID: user.userID,
          };

          jwt.sign(
            payload,
            process.env["JWT_KEY"],
            { expiresIn: process.env["JWT_EXPIRY_TIME"] },
            (err, token) => {
              if (err) return done(err);
              return done(null, token, user);
            }
          );
        } catch (err) {
          return done(err);
        }
      },
    ],
    function (err, token, user) {
      if (err) {
        console.error("Login error:", err);
        return callback({
          status: Consts.httpCodeServerError,
          message: "Failed to login",
          error: err.message || err,
        });
      }

      return callback({
        status: Consts.httpCodeSuccess,
        jwtToken: token,
        user: {
          userID: user.userID,
          companyName: user.companyName,
          phone: user.phone,
          session: user.session,
          email: user.email,
          expiry: user.expiry,
          recaptchaVerified: true,
        },
      });
    }
  );
}



}

export default CreateUserLogic;
