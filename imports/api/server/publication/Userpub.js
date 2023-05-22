import DB from "../../DB";
import Server from "../../classes/server/Server";
import { AUTH } from "../../const";

if (Meteor.isServer) {

    Server.addPub("user", function () {
        try {
            if (this.userId) {
                return Meteor.users.find({ _id: this.userId }, { fields: { emails: 1, profile: 1 } });
            }
        } catch (error) {
            console.log(error);
        }
        this.ready();
    });


    Server.addPub(AUTH.SubscribeToken, function () {
        try {
            if (this.userId) {
                return DB.Organization.find({});
            }
        } catch (error) {
            console.log(error);
        }
        this.ready();
    });
}