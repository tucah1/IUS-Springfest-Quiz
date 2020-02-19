import React, { Fragment, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../actions/auth';

const Login = ({ auth, login }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        login(email, password);
    };

    //Redirect if logged in
    if (auth.isAuthenticated) {
        return <Redirect to="/quiz-settings" />;
    }

    return (
        <Fragment>
            <div className="login-outer">
                <div className="login">
                    <form className="login-form" onSubmit={e => onSubmit(e)}>
                        {/* <h3>Please login in</h3> */}
                        <input
                            type="email"
                            placeholder="email"
                            name="email"
                            value={email}
                            onChange={e => onChange(e)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="password"
                            name="password"
                            minLength="6"
                            value={password}
                            onChange={e => onChange(e)}
                        />
                        <button type="submit">Login</button>
                    </form>
                </div>
                <div className="login-link">
                    <Link to="/">Go to homepage</Link>
                </div>
            </div>
        </Fragment>
    );
};

Login.propTypes = {
    auth: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ auth: state.auth });

export default connect(mapStateToProps, { login })(Login);
