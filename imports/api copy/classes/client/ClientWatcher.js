import moment from "moment";
import 'moment-timezone';
import { Toast } from "../../../ui/components/extra/Toast";
import { AUTH, CLIENT, HUBSTAFF } from "../../const";
import Utilities from "../Utilities";
import Watcher from "../Watcher";
import AuthWatcher from "./AuthWatcher";

class ClientWatcher extends Watcher {
    #users;
    #retryfetch=0
    #userlist
    #currentRate
    #payrollData
    constructor(parent) {
        super(parent);
        this.secureTransaction();
        this.#users = {
            email: "",
            password: "",
            password2: "",
            firstName: "",
            lastName: "",
            isLoading: false,
        };
    }


    init() {
        return this.users.find().fetch();
    }


    setUsers(users) {
        this.#users = { ...this.#users, ...users };
        this.activateWatcher();
    }


    get Userlist(){
        return this.#userlist
    }

    get UserNameAccount() {
        return this.#users;
    }


    get currentRates(){
        return this.#currentRate
    }

    get PayrollData(){
        return this.#payrollData
    }

    reset({ forceRender = true }) {
        this.#users = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            password2: "",
            isLoading: false,
        };
        forceRender && this.activateWatcher();
    }

    setLoading(isLoading) {
        this.#users.isLoading = isLoading;
        this.activateWatcher();
    }


    loginWithPassword = (email, password) => {
        return new Promise((resolve, reject) => {
            this.login(email, password, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    logoutUser = () => {
        return new Promise((resolve, reject) => {
            this.logout(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }


    createUserAccount = () => {

        this.#users.isLoading = true;
        this.activateWatcher();
        this.callFunc(CLIENT.CreateAccount, this.#users).then((data) => {
           switch(data.status){
                case 'not_verified':
                    Toast({ text: "Account created successfully! Please check your email for verification link.", type: "success" });
                    this.reset({ forceRender: true })
                    this.activateWatcher();
                    break
                case 'verified':
                    Toast({ text: "Account is Already Registered.", type: "warning" });
                    this.reset({ forceRender: true })
                    this.#users.isLoading = false;
                    this.activateWatcher();
                    break
                default:    
                    localStorage.setItem('id',data.userId)
                    const params = new URLSearchParams({
                            response_type: 'code',
                            redirect_uri: data.uri, 
                            realm: 'hubstaff',
                            client_id:data.clientId,
                            scope: 'hubstaff:read',
                            state: 'oauth2',
                            nonce: Utilities.genRandomString(5)
                            });
                            window.location.href = `https://account.hubstaff.com/authorizations/new?${params.toString()}`;
                        this.#users.isLoading = false;
                        this.activateWatcher();
            }
        
        }).catch((err) => {
            this.#users.isLoading = false;
            this.activateWatcher();
            Toast({ text: err.error.reason, type: "error" });
        });
    }

    generateToken(code,userId){
      return this.callFunc(AUTH.saveToken,[code,userId]).then((data) => {
            if(data){
                Toast({ text: "Account created successfully! Please check your email for verification link.", type: "success" });
                this.reset({ forceRender: true })
                this.activateWatcher();
                return true
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    getOrganization(){
        this.callFunc(HUBSTAFF.getOrganization).then((data) => {
            if(data){

            }
        }).catch((err) => {
            console.log(err);
        })
    }

    verifyEmail(token) {
        return new Promise((resolve, reject) => {
            Accounts.verifyEmail(token, function (err) {
                if (err) reject(err);
                resolve("Email successfully verified!");
            });
        });
    }

    forgotPassword(email) {
    this.setLoading(true)
     return this.callFunc(CLIENT.ForgotPassword, email).then((data) => {
            if (data) {
                Toast({ text: "Please check your email for reset link.", type: "success" });
          
            } else {
                Toast({ text: "Email not found!", type: "error" });
            }
            this.setLoading(false)
            return true
        }).catch((err) => {
            return Toast({ text: err.error.error, type: "error" });
        }
        );

    }

    resetPassword(token, password) {
        return new Promise((resolve, reject) => {
            Accounts.resetPassword(token, password, function (err) {
                if (err) reject(err);
                resolve("Password successfully updated!");
            });
        });
    }

    getSubscribeUser() {
        return this.subscribe("user");
    }

    getUserlist(){
        this.callFunc(CLIENT.GetUserlist).then((data) => {
            console.log(data)
            if(data && data.length){
                this.#userlist = data
            }
            this.activateWatcher();
        }).catch((err) => {
            console.log(err);
        });
    }


    updateBaseRate(id,rate){
        this.callFunc(CLIENT.UpdateBaseRate,{id,rate}).then((data) => {
            if(data){
                Toast({text:"Update Succesfully",type:'success'})
            }
        }).catch((err) => {
            console.log(err);
        });
    }



    getCurrentExchange(){
        this.callFunc(CLIENT.currentExchange).then((data) => {
            if(data.rates){
                this.#currentRate = data
            }
            this.activateWatcher()
        }).catch((err) => {
            console.log(err);
        });
    }

    getPayroll(id){
        this.callFunc(CLIENT.getActivityData,id).then((data) => {
            this.#payrollData = data
            this.activateWatcher()
        }).catch((err) => {
            console.log(err);
        });
    }

    perHourCalc(baserate,seconds){
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.round((seconds % 3600) / 60);
        return { total:((hours * baserate) + (minutes/60 * baserate)).toFixed(2)};
    }


    UpdatePayrollRelease(currentExchange,start,end,earn,id){
        this.callFunc(CLIENT.UpdatePayrollRelease,{currentExchange,start,end,earn,id}).then((data) => {
            if(data){
                Toast({text:'Release Success',type:'success'})
                this.getPayroll(id)
            }
            this.activateWatcher()
        }).catch((err) => {
            console.log(err);
        });
    }

    computeSalary()

//     PhTimeZone(date){
//     //    console.log(moment.utc(date).tz('Asia/Manila').format('MMM DD YYYY'))
//        console.log(moment(date).tz('Asia/Manila').format('MMM DD YYYY'))
//    }  

}
export default new ClientWatcher();
