
import moment from 'moment';
import 'moment-timezone';
import { sendEmail } from '../../../ui/components/extra/EmailSender';
import DB from '../../DB';
import Utilities from '../../classes/Utilities';
import { Accounts } from 'meteor/accounts-base';
import fetch from 'node-fetch';
import HubstaffApi from './HubstaffApi';


const getToken = async (userId) =>{
    try {
     const res = await Meteor.users.find({_id:userId},{fields:{token:1,profile:{orgId:1}}}).fetch()
     if(res.length && res[0].token.expires_in < moment().valueOf()){
        Utilities.showNotice('refresh Token')
        const data = await refreshToken(res[0].token.refresh_token)
        if(data){
          let newToken = {...data,expires_in:moment().add(data.expires_in,'seconds').valueOf()}
          Meteor.users.update({_id:userId},{$set:{token:newToken}})
          return {token: newToken?.access_token,orgId:res[0].profile?.orgId}
        }
     }else{
        Utilities.showStatus('retrieve token')
        return {token: res[0].token.access_token,orgId:res[0].profile?.orgId}
     }
    } catch (error) {
      console.log(error)
    }
  }

async function validateifExist(id,user){

    try {
      const res = await DB.Payroll.rawCollection().findOne({userId:user,from:id},{projection:{from:1}})
      return res
    } catch (error) {
        Utilities.showError("Unable validate: ", Utilities.errorMsg(error));
    }
}


export default {

    createUser:async function (users) {
        const clientId = Meteor.settings.private.client_id
        const uri = Meteor.settings.private.redirect_uri
        try {
       
            const { email, password,firstName,lastName } = users;
            const user = await Meteor.users.rawCollection().findOne({'emails.address':email},{projection:{_id:1,emails:1}}).then(res=>{
               if(res){
                    if (res.emails[0].verified) {
                        return { status:'verified'}
                    }
                    if(!res.emails[0].verified){
                        return { status:'not_verified',user:res}
                    }
               }
               else{
                const result = Accounts.createUser({
                        email,
                        password,
                        profile: {
                            name:firstName+" "+lastName,
                            email,
                            createdAt:moment().valueOf(),
                            baseRate:2,
                            balance:0,
                            roles:['user']
                        }
                    })
                    if(result){
                        return { status:'not_exist',id:result}
                    }
                }   
            })

           return {status:user.status, clientId:clientId,userId:user.id,uri}
        } catch (error) {
            Utilities.showError("Unable Create new Account.: ", Utilities.errorMsg(error));
            throw new Meteor.Error(error);
        }
    },

    resetPassword: function (email) {
        try {
            const user = Accounts.findUserByEmail(email);

            if (!user) {
                throw new Meteor.Error('user-not-found', 'User not found');
            }

            const token = Accounts.generateResetToken(user._id);
            const resetUrl = Meteor.absoluteUrl(`reset-password/${token.token}`);
            sendEmail(email, resetUrl, "reset")
            return true
        } catch (error) {
            Utilities.showError("Unable Reset Password.: ", Utilities.errorMsg(error));
            throw new Meteor.Error(error);

        }
    },

    getUserList: function () {
        try {
           const res = Meteor.users.find({},{fields:{profile:1}}).fetch()
            return res
        } catch (error) {
            Utilities.showError("Unable Get User.: ", Utilities.errorMsg(error));
            throw new Meteor.Error(error);

        }

    },

    updateBaseRate: function ({id,rate}) {
        try {
            Meteor.users.update({_id:id},{ $set: { "profile.baseRate": rate } })
            return true
        } catch (error) {
            Utilities.showError("Unable Update rate: ", Utilities.errorMsg(error));
            throw new Meteor.Error(error);

        }

    },


    getCurrentExchange: async function () {
        try {
            const exRate = Meteor.settings.private.exchange_api
            const apiKey = exRate
            const result = await fetch(` https://v6.exchangerate-api.com/v6/${apiKey}/pair/USD/PHP`, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                }
            })
            .then(res => res.json())
            .catch(err => console.error(err));
        return {rates:result.conversion_rate.toFixed(2)}        
        } catch (error) {
            Utilities.showError("Unable get current Exchange: ", Utilities.errorMsg(error));
            throw new Meteor.Error(error);

        }

    },


    getPayroll: async function (id) {
        let _id = id ? id : this.userId 
        try {
            const docs = await DB.Payroll.rawCollection().find({
                userId:_id
              }).toArray()
          return docs
        } catch (error) {
            Utilities.showError("Unable get current rate: ", Utilities.errorMsg(error));
            throw new Meteor.Error(error);

        }

    },

    generatePayroll: async function ({selectedMonth,quarter,baseRate,received}) {
        try {
    
            let start
            let end
                // Set the start and end dates for 1 to 15 period
                if(quarter == "First"){
                    start = moment.utc(`${selectedMonth} 2023`, 'MMMM YYYY').tz('Asia/Manila').startOf('month').format('YYYY-MM-DDTHH:mm:ssZ');
                    end  = moment.utc(`${selectedMonth} 2023`, 'MMMM YYYY').tz('Asia/Manila').startOf('month').add(14,'days').add(23,'hours').add(59,'minutes').format('YYYY-MM-DDTHH:mm:ssZ');
                }
                if(quarter == "Second"){
                // Set the start and end dates for 16 to 30/31 period
                    start = moment.utc(`${selectedMonth} 2023`, 'MMMM YYYY').tz('Asia/Manila').startOf('month').add(15,'days').format('YYYY-MM-DDTHH:mm:ssZ');
                    end =moment.utc(`${selectedMonth} 2023`, 'MMMM YYYY').tz('Asia/Manila').endOf('month').format('YYYY-MM-DDTHH:mm:ssZ');
                }


                const token =await getToken(this.userId)

                const result = await fetch(`https://api.hubstaff.com/v2/organizations/${token.orgId}/activities/daily?date[start]=${start}&date[stop]=${end}`, {
                      method: 'GET',
                      headers: {
                        'Accept': 'application/json',
                        'Authorization':`Bearer ${token.token}`
                      }
                  })
                  .then(res => res.json())
                  .catch(err => console.error(err));

                 if(result){
                   let total= 0
                   let days =0
                    result.daily_activities.map(item=>{
                        total = total + item.tracked
                        days =   days + 1
                    })
                    return {totalTracked:total,days,startDate:start,endDate:end}
                 }

                // Perform aggregation to group and sum the data for 1 to 15 period
                // const firstHalfData = await DB.Activity.rawCollection().aggregate([
                //   {
                //     $match: {
                //       userId,
                //       createdAt: { $gte: startFirstHalf, $lte: endFirstHalf }
                //     } 
                //   },
                //   {
                //     $group: {
                //       _id: null,
                //       totalDays: { $sum: 1 },
                //       tracked: { $sum: "$tracked" },
                //       totalEarnUSD: { $sum: "$totalEarnUSD" },
                //       totalEarnPHP: { $sum: "$totalEarnPHP" }
                //     }
                //   }
                // ]).toArray().then(res=>{return res});
            
                // // Perform aggregation to group and sum the data for 16 to 30/31 period
                // const secondHalfData = await DB.Activity.rawCollection().aggregate([
                //   {
                //     $match: {
                //       userId,
                //       createdAt: { $gte: startSecondHalf, $lte: endSecondHalf }
                //     }
                //   },
                //   {
                //     $group: {
                //       _id: null,
                //       totalDays: { $sum: 1 },
                //       tracked: { $sum: "$tracked" },
                //       totalEarnUSD: { $sum: "$totalEarnUSD" },
                //       totalEarnPHP: { $sum: "$totalEarnPHP" }
                //     }
                //   }
                // ]).toArray().then(res=>{return res});
            

                // Insert the summed data into the payroll collection
                // if(firstHalfData.length > 0){
                
                //     const result = await validateifExist(startFirstHalf,userId)
                    
                //     if(result){
                //         DB.Payroll.update({from:result.from,userId},{$set:{total:firstHalfData[0]}})
                //     }else{
                //         DB.Payroll.insert({
                //             userId,
                //             orgId:orgId,
                //             from:moment(startFirstHalf).tz('Asia/Manila').valueOf(),
                //             to:moment(endFirstHalf).tz('Asia/Manila').valueOf(),
                //             isCompleted:false,
                //             total: firstHalfData.length ? firstHalfData[0] : [],
                //             createdAt: moment().valueOf(),
                //             index1:startFirstHalf
                //           });
                //     }
                // }  
                // if(secondHalfData.length > 0){
                //     const result = await validateifExist(startSecondHalf,userId)
                //     if(result){
                //         DB.Payroll.update({from:result.from,userId},{$set:{total:secondHalfData[0]}})
                //     }else{
                //         DB.Payroll.insert({
                //             userId,
                //             orgId:orgId,
                //             from:moment(startSecondHalf).tz('Asia/Manila').valueOf(),
                //             to:moment(endSecondHalf).tz('Asia/Manila').valueOf(),
                //             isCompleted:false,
                //             total: firstHalfData.length ? secondHalfData[0] : [],
                //             createdAt: moment().valueOf(),
                //             index1:startSecondHalf
                //           });
                //     }
                // }  
                Utilities.showStatus("Create Payroll Success: ");
        } catch (error) {
            Utilities.showError("Unable generate Payroll: ", Utilities.errorMsg(error));
            throw new Meteor.Error(error);

        }

    },


    updatePayrollRelease:async function({currentExchange,start,end,earn,id}){
        try{
            DB.Payroll.update({userId:id,from:start},{$set:{isCompleted:true}})
            DB.Activity.update({userId:id,createdAt: {$gte: start,$lte: end}},{$set: {isCompleted: true,totalEarnPHP:currentExchange}},{ multi: true });
            Meteor.users.update({_id:id},{$inc:{'profile.balance':earn},$set:{'profile.lastSalary':end}})
            return true
        } catch (error) {
            Utilities.showError("Unable update Payroll.: ", Utilities.errorMsg(error));
            throw new Meteor.Error(error);

        }
    },


 updateBalance:async function({id,earn}){
        try{
            Meteor.users.update({_id:id},{$set:{'profile.balance':earn}})
        } catch (error) {
            Utilities.showError("Unable update Payroll.: ", Utilities.errorMsg(error));
            throw new Meteor.Error(error);

        }
    },


    resetPassword: function (email) {
        try {
            const user = Accounts.findUserByEmail(email);

            if (!user) {
                throw new Meteor.Error('user-not-found', 'User not found');
            }

            const token = Accounts.generateResetToken(user._id);
            const resetUrl = Meteor.absoluteUrl(`reset-password/${token.token}`);
            
            Accounts.sendResetPasswordEmail(user._id, email);
            return true
        } catch (error) {
            Utilities.showError("Unable Reset Password.: ", Utilities.errorMsg(error));
            throw new Meteor.Error(error);

        }
    },
}