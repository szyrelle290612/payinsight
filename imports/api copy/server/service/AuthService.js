import DB from "../../DB";
import Utilities from "../../classes/Utilities";
import fetch from 'node-fetch';
import { Meteor } from 'meteor/meteor';
import btoa from 'btoa';
import HubstaffApi from "./HubstaffApi";




export default{

    saveToken:async function (data) {
        try {
           await DB.Organization.insert(data)
        } catch (error) {
            Utilities.showError("Unable Save Token.: ", Utilities.errorMsg(error));
            throw new Meteor.Error(error);
        }
    },

  generateToken: async function ([code,userId]){
      const uri = Meteor.settings.private.redirect_uri
      const clientId = Meteor.settings.private.client_id;
      const clientSecret = Meteor.settings.private.client_secret
      const token = btoa(`${clientId}:${clientSecret}`);
      
      const formData = new URLSearchParams();
      formData.append('grant_type', 'authorization_code');
      formData.append('code', code);
      formData.append('redirect_uri', uri);
      
      const url = 'https://account.hubstaff.com/access_tokens';
      
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${token}`,
        },
        body: formData.toString()
      };
      
    return fetch(url, options)
        .then(response => response.json())
        .then(async(data) => {
          const orgId = await HubstaffApi.getOrganizationId(data.access_token)
          if(!orgId) return
          Meteor.users.update({_id:userId},{$set:{token:data,'profile.orgId':orgId.id}})

          Accounts.sendVerificationEmail(userId);
          return data;
        })
        .catch(error => console.error(error));
    }

}