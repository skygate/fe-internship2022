const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport: any, getUserByEmail: any, getUserById: any) {
    const authenticateUser = async (
        email: string,
        password: string,
        done: (a: any, b?: any, c?: any) => void //PORPAWIĆ!!!
    ) => {
        const user = getUserByEmail(email);
        if (user == null) {
            return done(null, false, { message: "No user with that email" });
        }

        try {
            // if (password == user.password) {
            if (await bcrypt.compare(password, user.password)) {
                console.log("ok");
                return done(null, user);
            } else {
                console.log("bledne haslo");
                return done(null, false, { message: "Password incorrect" });
            }
        } catch (e) {
            return done(e);
        }
    };

    passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
    passport.serializeUser((user: any, done: any) => done(null, user.userID));
    passport.deserializeUser((id: any, done: any) => {
        return done(null, getUserById);
    });
}

module.exports = initialize;
