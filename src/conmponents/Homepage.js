import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import { Link } from 'react-router-dom';
import { clearQuestions, getSettings } from '../actions/questions';

// import P5Wrapper from 'react-p5-wrapper';
// import setup from '../util/tes';

const Homepage = ({
    logout,
    auth: { isAuthenticated },
    clearQuestions,
    isBlocked,
    isRankListVisible,
    history,
    getSettings
}) => {
    useEffect(() => {
        getSettings();
    }, [getSettings]);

    useEffect(() => {
        clearQuestions();
    }, [clearQuestions]);

    return (
        <Fragment>
            {isAuthenticated ? (
                <Fragment>
                    <div className="homepage-admin">
                        <ul>
                            <li>
                                <Link to="/ranklist">
                                    <span>Rank list</span>
                                </Link>{' '}
                            </li>
                            <li>
                                <Link to="/quiz-settings">
                                    <span>Quiz Settings</span>
                                </Link>{' '}
                            </li>
                            <li>
                                <Link onClick={logout} to="/">
                                    Logout
                                </Link>{' '}
                            </li>
                        </ul>
                    </div>
                </Fragment>
            ) : (
                <div></div>
            )}

            <div className="homepage">
                <div className="homepage-heading">QUIZ</div>
                <div className="hompage-instructions">
                    <div>
                        {isRankListVisible ? (
                            <Fragment>
                                <p>
                                    Quiz finished. Rank list is available on
                                    following link: <br />
                                    <Link to="/ranklist">Rank list</Link> <br />
                                    Congratulations to winners! Please contact
                                    us (devius@gmail.com) to get your rewards!
                                </p>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <h3>Instructions</h3>
                                <p>
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Quibusdam consequatur
                                    aliquid in quis a par Lorem ipsum dolor sit
                                    amet consectetur adipisicing elit. Odio in
                                    at distinctio? Voluptatem, rem ab?
                                </p>
                            </Fragment>
                        )}
                    </div>
                </div>

                <button
                    className="homepage-button"
                    onClick={() => {
                        if (!isBlocked) {
                            history.push('/scanid');
                        } else {
                            alert('Sorry, quiz currently is not available!');
                        }
                    }}
                >
                    play
                </button>
            </div>
        </Fragment>
    );
};

Homepage.propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    clearQuestions: PropTypes.func.isRequired,
    isBlocked: PropTypes.bool
};

const mapStateToProps = state => ({
    auth: state.auth,
    isBlocked: state.questions.settings.isBlocked,
    isRankListVisible: state.questions.settings.isRankListVisible
});

export default connect(mapStateToProps, {
    logout,
    clearQuestions,
    getSettings
})(Homepage);
