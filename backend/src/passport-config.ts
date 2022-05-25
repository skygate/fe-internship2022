import { VerifyFunction } from "passport-local/index";
import users from "./models/users";
import bcrypt from "bcryptjs";
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const authenticateUser: VerifyFunction = async (email: string, password: string, done) => {
    const user = await users.findOne({ email: email });
    if (user == null) return done(null, false);

    try {
        if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
        } else {
            return done(null, false, { message: "Password incorrect" });
        }
    } catch (e) {
        return done(null);
    }
};

const strategy = new LocalStrategy({ usernameField: "email" }, authenticateUser);
passport.use(strategy);

passport.serializeUser((user: Express.User, done: (err: null, id: string) => void) => {
    done(null, user._id);
});

passport.deserializeUser((id: string, done: (err: Error, user: {}) => void) => {
    users.findOne({ _id: id }, (err: Error, user: Express.User) => {
        const userInformation = {
            userID: user._id,
        };
        done(err, userInformation);
    });
});

module.exports = authenticateUser;
