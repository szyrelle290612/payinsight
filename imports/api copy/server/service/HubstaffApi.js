import moment from 'moment';
import 'moment-timezone';
import DB from '../../DB';
import Utilities from '../../classes/Utilities';
import fetch from 'node-fetch';
import ClientService from './ClientService';

const getToken = (userId) =>{
   const res = Meteor.users.find({_id:userId},{fields:{token:1,profile:{orgId:1}}}).fetch()
   return {token: res[0]?.token?.access_token,orgId:res[0]?.profile?.orgId}
}



function totalAmount(seconds,rate) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return { total:((hours * rate) + (minutes/60 * rate)).toFixed(2)};
}

const validateOrganizationExist = async (organizations) => {
    const data = []
    for (const organization of organizations) {
      const res = await DB.Organization.rawCollection().findOne({id: organization.id});
      if (!res) {
        data.push(organization)
      }
    }
    return data
  }


const insertDocuments =  async (documents) => {
    try {
      const result = await DB.Organization.rawCollection().insertMany(documents, { ordered: false, upsert: true });
      const insertedIds = Object.values(result.insertedIds);
      const insertedDocs = await DB.Organization.rawCollection().find({_id: {$in: insertedIds}},{projection:{id:1,name:1}}).toArray();
      return insertedDocs;
    } catch (err) {
      throw err; // Rethrow the error
    }
  }



export default{

getMe:async function(){
       try {

       } catch (error) {
        Utilities.showError("Unable get Me: ", Utilities.errorMsg(error));
        throw new Meteor.Error(error);
    }
},

getActivity:async function({start,end,currentBaseRate,userId}){
    try {
      const startRecord = moment('2023-05-01').tz('Asia/Manila').valueOf()
      const token = getToken(this.userId).token
      const orgId = getToken(this.userId).orgId
      const result = await fetch(`https://api.hubstaff.com/v2/organizations/${orgId}/activities/daily?date[start]=${start}&date[stop]=${end}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization':`Bearer ${token}`
            }
        })
        .then(res => res.json())
        .catch(err => console.error(err));
       return result.daily_activities
    //   if(!result ) return

    //     //initialize data
    //     let ids = []
    //     let daily = result.daily_activities
    //     //get the id 
    //     for(const i in daily){
    //       let totalUSD = parseFloat(totalAmount(daily[i].tracked,currentBaseRate).total)
    //       let isOldRecord = startRecord > moment(daily[i].date).tz('Asia/Manila').valueOf() 

    //         ids.push({
    //           userId:this.userId,
    //           id:daily[i].id,
    //           tracked:daily[i].tracked,
    //           baseRate:isOldRecord?'-':currentBaseRate,
    //           totalEarnUSD:isOldRecord? '-': totalUSD,
    //           totalEarnPHP: "-",
    //           idle:daily[i].idle,
    //           isCompleted:false,
    //           createdAt:moment(daily[i].created_at).tz('Asia/Manila').valueOf(),
    //           updateAt:moment(daily[i].updated_at).tz('Asia/Manila').valueOf()})
    //     }
    //     async function insertDocument(document) {
    //       try {
    //         const existingDocument = await DB.Activity.rawCollection().findOne({ _id: { $in: document._id } });
    //         if (existingDocument) {
    //           Utilities.showNotice('Document with one of the IDs already exists!');
    //           return;
    //         }
    //         await DB.Activity.insert(document);
    //         Utilities.showStatus('New Document inserted successfully!');
    //       } catch (err) {
    //         console.error(err);
    //         // Handle error
    //       }
    //     }


    //     //filterAndInsertDocument
    //     async function filterAndInsertDocuments(documents) {
    //       try {
    //         const existingDocuments = await DB.Activity.rawCollection().find({ id: { $in: documents.map(doc => doc.id) } },{projection:{id:1,tracked:1,user_id:1,idle:1,created_at:1,updated_at:1}}).toArray();
    //         const existingIds = existingDocuments.map(doc => doc.id);
    //         const newDocuments = documents.filter(doc => !existingIds.includes(doc.id));
            
    //         for (const document of newDocuments) {
    //           await insertDocument(document);
    //         }
    //         return true
    //       } catch (err) {
    //         console.error(err);
    //         // Handle error
    //       }
    //     }

 

    //  return  filterAndInsertDocuments(ids).then(async (res) =>{
    //     if(res){
    //       await ClientService.generatePayroll(orgId,this.userId)   

    //       const docs = await DB.Activity.rawCollection().find({
    //         userId:this.userId,
    //         createdAt:{
    //           $gte:moment(start).tz('Asia/Manila').valueOf(),
    //           $lt:moment(end).tz('Asia/Manila').valueOf()
    //         }
    //       },{sort:{createdAt:-1}}).toArray()

    //       return docs
    //     }
    //    })

    } catch (error) {
     Utilities.showError("Unable to get Activity: ", Utilities.errorMsg(error));
     throw new Meteor.Error(error);
 }
},


getOrganization:async function(){
    try {
  
      //get token
      const token = getToken(this.userId).token
      
      //get organization
      const result = await fetch('https://api.hubstaff.com/v2/organizations', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization':`Bearer ${token}`
            }
        }).then(res => res.json())

     //validate existing organization and get new organization 
      const validate = await validateOrganizationExist(result.organizations).then((res) => {
            if(res.length){
                Utilities.showNotice('New Organization Detect')
                return res
            }
        })

    if(validate && validate.length) {
     //insert a new organization 
        await insertDocuments(validate).then(res=>{
        if(res) return Utilities.showStatus('New Organization Added')
      })
    }

    //   //refetch Organization
    //   const fetchOrg = await DB.Organization.rawCollection().find().toArray()
    //   //map org and api call to organizations/${orgId}/members
    //   if(fetchOrg && fetchOrg.length){
    //     for(const i in fetchOrg){
    //         const result = await fetch(`https://api.hubstaff.com/v2/organizations/${fetchOrg[i].id}/members?include_removed=false&include_projects=false&include_profile=false&include=users`, {
    //               method: 'GET',
    //               headers: {
    //                 'Accept': 'application/json',
    //                 'Authorization':`Bearer ${token}`
    //               }
    //           })
    //           .then(res => res.json())
    //           .catch(err => console.error(err));
    //           data = [...data,{_id:fetchOrg[i]._id,orgId:fetchOrg[i].id,name:fetchOrg[i].name, member:result.users}]
    //     }
    //   }
   
 
    // //check if have data and insert new user
    // await Promise.all(data.map(data => {
    //     data.member.map(member=>createUser(member,data._id,data.orgId,data.name))
    // }));

    return true
    
    } catch (error) {
     Utilities.showError("Unable to get Organization: ", Utilities.errorMsg(error));
     throw new Meteor.Error(error);
 }
},

getActivityAttendance:async function({start,end,userId}){
  try {
    const orgId = getToken(this.userId).orgId
    const token = getToken(this.userId).token
    const result = await fetch(`https://api.hubstaff.com/v2/organizations/${orgId}/activities/daily?date[start]=${start}&date[stop]=${end}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization':`Bearer ${token}`
          }
      })
      .then(res => res.json())
      .catch(err => console.error(err));

      return result
    } catch (error) {
      Utilities.showError("Unable to get Organization: ", Utilities.errorMsg(error));
      throw new Meteor.Error(error);
  }
},

  getOrganizationId:async function(token){
    try {
      //get organization
      const result = await fetch('https://api.hubstaff.com/v2/organizations', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization':`Bearer ${token}`
            }
        }).then(res => res.json()
        )
        return {id:result.organizations[0].id}
      } catch (error) {
        Utilities.showError("Unable to get Organization: ", Utilities.errorMsg(error));
        throw new Meteor.Error(error);
    }
  },

}

