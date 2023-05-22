


import Watcher from "../Watcher";
import ClientWatcher from "./ClientWatcher";
import Utilities from "../Utilities";
import { AUTH } from "../../const";
import DB from "../../DB";


class AuthWatcher extends Watcher {
    constructor(parent) {
        super(parent);

    }

authRedirect(){
    //'https://payinsightapp.myddns.me/oauth'
    const clientId = Meteor.settings.private.client_id
    const params = new URLSearchParams({
        response_type: 'code',
        redirect_uri: uri, 
        realm: 'hubstaff',
        client_id:clientId,
        scope: 'hubstaff:write hubstaff:read',
        state: 'oauth2',
        nonce: Utilities.genRandomString(5)
      });
      window.location.href = `https://account.hubstaff.com/authorizations/new?${params.toString()}`;
}

generateToken(code){
    console.log(code)
    this.Parent.callFunc(AUTH.saveToken).then((data) => {
        console.log(data)
    }).catch((err) => {
        console.log(err);
    })
}



get Token(){
 return DB.Organization.find().fetch()
}

getSubscribeToken() {
    return this.Parent.subscribe(AUTH.SubscribeToken);
}



}

export default new AuthWatcher(ClientWatcher);

