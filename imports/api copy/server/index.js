import { Meteor } from 'meteor/meteor'
import Server from '../classes/server/Server';
import HubstaffApi from './service/HubstaffApi';
import { AUTH, CLIENT, DASHBOARD, HUBSTAFF } from '../const';
import ClientService from './service/ClientService';
import AuthService from './service/AuthService';


if (Meteor.isServer) {
   

    

    //Client
    Server.addFunction(CLIENT.CreateAccount, ClientService.createUser);
    Server.addFunction(CLIENT.ForgotPassword, ClientService.resetPassword);
    Server.addFunction(CLIENT.GetUserlist, ClientService.getUserList);
    Server.addFunction(CLIENT.UpdateBaseRate, ClientService.updateBaseRate);
    Server.addFunction(CLIENT.currentExchange, ClientService.getCurrentExchange);
    Server.addFunction(CLIENT.UpdatePayrollRelease, ClientService.updatePayrollRelease);
    Server.addFunction(CLIENT.getActivityData, ClientService.getPayroll);




    Server.addFunction(AUTH.saveToken, AuthService.generateToken);


    //Hubstaff 
    Server.addFunction(HUBSTAFF.getOrganization, HubstaffApi.getOrganization);
    Server.addFunction(DASHBOARD.Me, HubstaffApi.getMe);
    Server.addFunction(DASHBOARD.getActivity, HubstaffApi.getActivity);
    Server.addFunction(DASHBOARD.getActivityAttendance, HubstaffApi.getActivityAttendance);
}