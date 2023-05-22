import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Toast } from './components/extra/Toast';
import Utilities from '../api/classes/Utilities';
import ClientWatcher from '../api/classes/client/ClientWatcher';
import AuthWatcher from '../api/classes/client/AuthWatcher';

export default class Signup extends Component {
    constructor(props){
        super(props)
        ClientWatcher.setWatcher(this,'SIGNUP')
    }

    
handleSubmit = async (e) => {
        e.preventDefault();
        if (Utilities.checkEmailFormat(ClientWatcher.UserNameAccount.email) === false || ClientWatcher.UserNameAccount.email === "") {
            return Toast({ text: "Email must be valid.", type: "warning" });
        }

        else if (ClientWatcher.UserNameAccount.password === "" || ClientWatcher.UserNameAccount.password.length < 8) {
            return Toast({ text: "Password must be at least 8 characters.", type: "warning" });
        }
         else {
            try {
                ClientWatcher.createUserAccount();
            } catch (err) {
                if (err?.message) {
                    Toast({ text: err?.message, type: "error" });
                } else {
                    Toast({ text: "Something went wrong.", type: "error" });
                }
            }
        }
    }

  render() {
    ClientWatcher.initiateWatch('SIGNUP')
    let loading = ClientWatcher.UserNameAccount.isLoading
    return (
<div className="rb-page-wrapper-form">
    <div className="rb-sign-up">
        <div className="rb-card">
            <div className="rb-form-card-div">
                <div className="form-block w-form">
                    <form id="email-form" name="email-form" data-name="Email Form" method="get" aria-label="Email Form">
                        <div className="rb-form-hd">
                            <a href="#" className="brand-name-form w-inline-block"><img src="https://assets.website-files.com/645265ba6badb1d4e481514b/64526a474b0877c09be4e337_Asset%208.svg" loading="lazy" alt="" /></a>
                            <h2 className="rb-h2">Sign Up</h2>
                            <p>Please fill the details and create account</p>
                        </div>
                        <div className="rb-form-row">
                            <label className="rb-field-label">First Name</label>
                            <div className="rb-form-control"><input  value={ClientWatcher.UserNameAccount.firstName} onChange={(e) => ClientWatcher.setUsers({ firstName: e.target.value })}  type="text" className="rb-text-field w-input" maxLength="256" placeholder="" required="" /></div>
                        </div>
                        <div className="rb-form-row">
                            <label className="rb-field-label">Last Name</label>
                            <div className="rb-form-control"><input  value={ClientWatcher.UserNameAccount.lastName} onChange={(e) => ClientWatcher.setUsers({ lastName: e.target.value })}  type="text" className="rb-text-field w-input" maxLength="256" placeholder="" required="" /></div>
                        </div>
                        <div className="rb-form-row">
                            <label className="rb-field-label">Email Address</label>
                            <div className="rb-form-control"><input value={ClientWatcher.UserNameAccount.email} onChange={(e) => ClientWatcher.setUsers({ email: e.target.value })} type="email" className="rb-text-field w-input" maxLength="256" name="field-3" data-name="Field 3" placeholder="Your Email Address" id="field-3" required="" /></div>
                        </div>
                        <div className="rb-form-row">
                            <label className="rb-field-label">Password</label>
                            <div className="rb-form-control">
                                <div className="rb-password-input">
                                    <input type="password" value={ClientWatcher.UserNameAccount.password} onChange={(e) => ClientWatcher.setUsers({ password: e.target.value })}  className="rb-text-field w-input" maxLength="256" name="field-2" data-name="Field 2" placeholder="" id="field-2" required="" />
                                </div>
                            </div>
                        </div>
                        <div className="rb-form-btn">
                            <a onClick={this.handleSubmit.bind(this)} className={`${loading ? 'loading-btn':'rb-btn-main wide w-button'}`}>Sign Up</a>
                            <div>Already have an account? <Link to="/login">Log In</Link></div>
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
