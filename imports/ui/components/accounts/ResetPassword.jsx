import React from "react";

import { withTracker } from "meteor/react-meteor-data";
const watcherName = "auth-watcher-reset-password";
import { withNavigation } from "../extra/withNavigation";
import withRouter from "../extra/WithRouter";
import ClientWatcher from "../../../api/classes/client/ClientWatcher";
import { Toast } from "../extra/Toast";


class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state={
          password:"",
          password2:""
        }
        ClientWatcher.setWatcher(this, watcherName);
    }




    handleSubmit = async (e) => {
        e.preventDefault();
  
        const { token } = this.props.params;

        if (this.state.password !== this.state.password2) {
            return  Toast({text:"Password and Confirm Password don't match!",type:'warning'});
        }
        try {
            const result = await ClientWatcher.resetPassword(token, this.state.password);
            if(result) {
              Toast({text:result,type:'success'})
              this.props.navigate("/login");
            }
        } catch (err) {
          Toast({text:"We are sorry but something went wrong.",type:"warning"});
            // this.props.navigate("/login");
        }
      this.setState({password:""})
      this.setState({password2:""})
    };

    render() {
      ClientWatcher.initiateWatch(watcherName)
      let loading = ClientWatcher.UserNameAccount.isLoading
        if(loading){
            return <div>Loading....</div>
        }
        return (
          <div className="rb-page-wrapper-form">
          <div className="rb-sign-up">
              <div className="rb-card">
                  <div className="rb-form-card-div">
                      <div className="form-block w-form">
                          <form id="email-form" name="email-form" data-name="Email Form" method="get" aria-label="Email Form">
                              <div className="rb-form-row">
                                  <label className="rb-field-label">Password</label>
                                  <div className="rb-form-control">
                                      <div className="rb-password-input">
                                          <input type="password" value={this.state.password}  onChange={(e)=>this.setState({password:e.target.value})}  className="rb-text-field w-input" maxLength="256" name="field-2" data-name="Field 2" placeholder="password" id="field-2" required="" />
                                      </div>
                                  </div>
                                  <div className="rb-form-control">
                                      <div className="rb-password-input">
                                          <input type="password"  value={this.state.password2} onChange={(e)=>this.setState({password2:e.target.value})}  className="rb-text-field w-input" maxLength="256" name="field-2" data-name="Field 2" placeholder="confirm password" id="field-2" required="" />
                                      </div>                           
                                  </div>
                              </div>
                              <div className="rb-form-btn">
                                  <a onClick={this.handleSubmit.bind(this)} className="rb-btn-main wide w-button">Submit</a>
                              </div>
                              {/* <div className="rb-form-connect">
                                  <div className="rb-form-connect-line-div">
                                      <div className="rb-form-connect-line"></div>
                                      <div className="rb-connect-text">or connect with</div>
                                      <div className="rb-form-connect-line"></div>
                                  </div>
                                  <div className="rb-connect-links-div">
                                      <a href="#" className="rb-connect-links w-inline-block"><img src="https://assets.website-files.com/645265ba6badb1d4e481514b/6452909bdc1de943d6368e3f_Asset%202.svg" loading="lazy" alt="" /></a>
                                      <a href="#" className="rb-connect-links w-inline-block"><img src="https://assets.website-files.com/645265ba6badb1d4e481514b/6452909bdc1de98564368e3e_Asset%203.svg" loading="lazy" alt="" /></a>
                                      <a href="#" className="rb-connect-links w-inline-block"><img src="https://assets.website-files.com/645265ba6badb1d4e481514b/6452909bdc1de933a2368e3d_Asset%204.svg" loading="lazy" alt="" /></a>
                                  </div>
                              </div> */}
                          </form>
                          <div className="w-form-done" tabIndex="-1" role="region" aria-label="Email Form success"><div>Thank you! Your submission has been received!</div></div>
                          <div className="w-form-fail" tabIndex="-1" role="region" aria-label="Email Form failure"><div>Oops! Something went wrong while submitting the form.</div></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
        );
    }
}

export default withNavigation(withRouter(ResetPassword));