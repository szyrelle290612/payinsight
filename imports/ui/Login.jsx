import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Toast } from './components/extra/Toast';
import { withNavigation } from './components/extra/withNavigation';
import { withTracker } from 'meteor/react-meteor-data';
import ClientWatcher from '../api/classes/client/ClientWatcher';
import LoadingSpinner from './components/extra/LoadingSpinner';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        }
        ClientWatcher.setWatcher(this, "LOGINWATCHER");
    }
    componentDidUpdate(prevProps) {
        if (this.props.user && !prevProps.user) {
            let privilages = this.props.user.profile.roles;
            if ((privilages.includes("admin")) && this.props.user.emails[0].verified || (privilages.includes("user")) && this.props.user.emails[0].verified ) {
                this.props.navigate("/dashboard")
            }
        }
    }
    handleLogin = async (e) => {
        ClientWatcher.setLoading(true);
        try {
            await ClientWatcher.loginWithPassword(this.state.email, this.state.password)
            let user = ClientWatcher.init();
            if (user[0]?.profile.roles.includes("user") && user[0]?.emails[0]?.verified) {
                this.props.navigate("/dashboard")
                Toast({ text: `Welcome ${user[0].profile.email}`, type: "success" });
            };
            if (user[0]?.profile.roles.includes("admin") && user[0]?.emails[0]?.verified) {
                this.props.navigate("/dashboard")
            };
            if (!user[0]?.emails[0]?.verified) {
                Toast({ text: "Please verify your email.", type: "error" });
            }
            ClientWatcher.setLoading(false);
        } catch (err) {
            if (err?.message) {
                Toast({ text: err?.message, type: "error" });
            } else {
                Toast({ text: "Something went wrong.", type: "error" });
            }
            ClientWatcher.setLoading(false);
        }
    }
  render() {
    if (ClientWatcher.UserNameAccount.isLoading || this.props.loading) return <LoadingSpinner />
    return (
        <div className="rb-page-wrapper-form">
        <div className="rb-sign-up">
            <div className="rb-card">
                <div className="rb-form-card-div">
                    <div className="form-block w-form">
                        <form id="email-form" name="email-form" data-name="Email Form" onSubmit={this.handleLogin} aria-label="Email Form">
                            <div className="rb-form-hd">
                                <a href="#" className="brand-name-form w-inline-block"><img src="https://assets.website-files.com/645265ba6badb1d4e481514b/64526a474b0877c09be4e337_Asset%208.svg" loading="lazy" alt="" /></a>
                                <h2 className="rb-h2">Log In</h2>
                                <p>Create an account and access thousand of cool stuffs</p>
                            </div>
                            <div className="rb-form-row">
                                <label className="rb-field-label">Email address</label>
                                <div className="rb-form-control"><input type="email" value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} className="rb-text-field w-input" maxLength="256" name="field" data-name="Field" placeholder="Your Email Address" id="field" required="" /></div>
                            </div>
                            <div className="rb-form-row">
                                <label className="rb-field-label">Password</label>
                                <div className="rb-form-control">
                                    <div className="rb-password-input">
                                        <input type="password" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })}  className="rb-text-field w-input" maxLength="256" name="field-2" data-name="Field 2" placeholder="password" id="field-2" required="" />
                                    </div>
                                    <div className="rb-forgot-password-idv"><a onClick={()=>this.props.navigate('/forgotpassword')} className="rb-link-dark">Forgot Password</a></div>
                                </div>
                            </div>
                            <div className="rb-form-btn">
                                <button type='submit' className="rb-btn-main wide w-button">Log In</button>
                                <div>Don’t have an account? <Link to="/signup" >Sign Up</Link></div>
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
    )
  }
}
export default withTracker(() => {
    ClientWatcher.initiateWatch("LOGINWATCHER");
    const isReady = ClientWatcher.getSubscribeUser()

    return {
        user: ClientWatcher.user(),
        loading: !isReady
    };
})(withNavigation(Login));