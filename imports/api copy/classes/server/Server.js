import { Meteor } from 'meteor/meteor';

process.env.MAIL_URL = Meteor.settings.private.email_secret;

Accounts.urls.verifyEmail = function (token) {
    return Meteor.absoluteUrl("email-verification/" + token);
};

Accounts.urls.resetPassword = function (token) {
    // Modify the reset password URL here
    const url = Meteor.absoluteUrl(`reset-password/${token}`);
    return url;
  };

Accounts.emailTemplates.resetPassword.subject = () => {
    return "User reset password request";
};

Accounts.emailTemplates.verifyEmail.subject = () => {
    return "User email verification";
};



class Server {
    #settings = null
    constructor(settings) {

        this.functions = {};
        this.#settings = settings
    }

    get Config() {
        return this.#settings
    }

    initServer() {

    }

    registerFunctions() {
        Meteor.methods(this.functions);
    }

    addFunction(name, func) {
        if (typeof func != "function") throw new Error("func not a function");
        if (this.functions[name]) throw new Error(`function "${name}" is already registered`);
        this.functions[name] = func;
    }

    addPub(name, func) {
        if (typeof func != "function") throw new Error("Invalid publication!");
        Meteor.publish(name, func);
    }

    async initDB() {
        if (!Meteor.users.findOne()) {
            Accounts.createUser({
              email: "admin@gmail.com",
              password: "123456",
              profile: {
                name: "admin",
                email: "admin@gmail.com",
                roles: ['admin']
              }
            }
            )
          }
    }



    async run() {
        return Promise.all([this.initDB()]).then(() => {
            console.log("Server is ready")
        })
    }


}

export default new Server(Meteor.settings)