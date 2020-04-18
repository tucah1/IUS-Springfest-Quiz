import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    getAdminQuestions,
    deleteQuestion,
    resetQuiz,
    changeSettings
} from '../actions/adminQuestions';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import { Link } from 'react-router-dom';
import { logout } from '../actions/auth';
import { getSettings } from '../actions/questions';

const AdminQuestions = ({
    getAdminQuestions,
    deleteQuestion,
    logout,
    adminQuestions: { adminQuests, loading },
    resetQuiz,
    questions,
    settings,
    changeSettings,
    getSettings
}) => {
    useEffect(() => {
        getAdminQuestions();
        getSettings();
    }, [getAdminQuestions, getSettings]);

    useEffect(() => {
        setQuizSettings({
            numberOfQuestions:
                settings.questionsNumber === null
                    ? 0
                    : settings.questionsNumber,
            timer: settings.timer === null ? 0 : settings.timer,
            isBlocked:
                settings.isBlocked === null
                    ? false
                    : // : adminQuests.length === 0
                      // ? true
                      settings.isBlocked,
            isRankListVisible:
                settings.isRankListVisible === null
                    ? false
                    : settings.isRankListVisible
        });
    }, [
        settings.questionsNumber,
        settings.timer,
        settings.isBlocked,
        settings.isRankListVisible
    ]);

    const [quizSettings, setQuizSettings] = useState({
        numberOfQuestions: 0,
        timer: '',
        isBlocked: false,
        isRankListVisible: false
    });

    const onChange = e => {
        setQuizSettings({
            ...quizSettings,
            [e.target.name]: e.target.value.trim()
        });
    };

    const onChangeIsBlocked = e => {
        if (adminQuests.length === 0 && quizSettings.isBlocked === true) {
            alert('Quiz cannot be available when there is no questions!');
        } else {
            setQuizSettings({
                ...quizSettings,
                isBlocked: !quizSettings.isBlocked
            });
        }
    };

    const onChangeIsVisible = e => {
        setQuizSettings({
            ...quizSettings,
            isRankListVisible: !quizSettings.isRankListVisible
        });
    };

    const onSubmitForm = e => {
        e.preventDefault();

        if (
            isNaN(quizSettings.timer) ||
            isNaN(quizSettings.numberOfQuestions)
        ) {
            alert('Please enter a number!');
        } else if (
            quizSettings.timer < 0 ||
            quizSettings.numberOfQuestions < 0
        ) {
            alert('You cannot enter negative number!');
        } else if (quizSettings.numberOfQuestions > adminQuests.length) {
            alert('There is no that much questions!');
        } else if (
            adminQuests.length !== 0 &&
            quizSettings.numberOfQuestions === 0
        ) {
            alert('Number of questions cannot be zero!');
        } else {
            const settingsObject = {
                isQuizBlocked: quizSettings.isBlocked,
                isRankListVisible: quizSettings.isRankListVisible,
                questionsNumber: quizSettings.numberOfQuestions,
                timeForQuiz: quizSettings.timer
            };

            changeSettings(settingsObject);
        }
    };

    return (
        <Fragment>
            {loading ||
            questions.loading ||
            adminQuests === undefined ||
            adminQuests === null ? (
                <Spinner />
            ) : (
                <Fragment>
                    <div className="admin">
                        <div className="admin-questions">
                            {adminQuests.map((quest, index) => (
                                <Fragment key={quest.id}>
                                    <div className="admin-questions-single">
                                        <h5>
                                            {index + 1}. {quest.text}
                                        </h5>
                                        <p>
                                            (
                                            {quest.answers.map((ans, index) => (
                                                <Fragment key={index}>
                                                    {ans.isTrue ? (
                                                        <b>{ans.body}</b>
                                                    ) : (
                                                        ans.body
                                                    )}
                                                    {index === 3 ? '' : ', '}
                                                </Fragment>
                                            ))}
                                            )
                                        </p>
                                        <div className="admin-questions-single-links">
                                            <Link
                                                to={`/edit-question/${quest.id}`}
                                            >
                                                <span>Edit</span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    deleteQuestion(quest.id);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </Fragment>
                            ))}
                        </div>
                        <Link to="/add-question" id="add-question-link">
                            <span>Add question</span>
                        </Link>{' '}
                        <div className="admin-settings-wrapper">
                            <div className="admin-quiz-settings">
                                <form onSubmit={e => onSubmitForm(e)}>
                                    Number of questions:
                                    <input
                                        type="text"
                                        name="numberOfQuestions"
                                        value={quizSettings.numberOfQuestions}
                                        onChange={e => onChange(e)}
                                        required
                                    />
                                    <br />
                                    Set timer:{' '}
                                    <input
                                        type="text"
                                        name="timer"
                                        value={quizSettings.timer}
                                        onChange={e => onChange(e)}
                                        required
                                    />
                                    <br />
                                    <div className="checkbox-wrapper">
                                        <label htmlFor="">
                                            Lock the quiz{' '}
                                            <input
                                                className="admin-settings-checkbox"
                                                type="checkbox"
                                                name="isBlocked"
                                                value={quizSettings.isBlocked}
                                                checked={
                                                    quizSettings.isBlocked ===
                                                    true
                                                }
                                                onChange={e =>
                                                    onChangeIsBlocked(e)
                                                }
                                            />
                                        </label>
                                        <br />
                                        <label htmlFor="">
                                            Show rank list
                                            <input
                                                className="admin-settings-checkbox"
                                                type="checkbox"
                                                name="isRankListVisible"
                                                value={
                                                    quizSettings.isRankListVisible
                                                }
                                                checked={
                                                    quizSettings.isRankListVisible ===
                                                    true
                                                }
                                                onChange={e =>
                                                    onChangeIsVisible(e)
                                                }
                                            />
                                        </label>
                                    </div>
                                    <div className="admin-settings-button">
                                        <button type="submit">Apply</button>
                                        <button
                                            onClick={() => {
                                                resetQuiz();
                                            }}
                                        >
                                            Reset quiz
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="admin-links">
                                <ul>
                                    <li>
                                        <Link to="/ranklist">
                                            <span>Rank list</span>
                                        </Link>{' '}
                                    </li>

                                    <li>
                                        <Link to="/">
                                            <span>Homepage</span>
                                        </Link>{' '}
                                    </li>
                                    <li>
                                        <Link onClick={logout} to="/">
                                            <span>Logout</span>{' '}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

AdminQuestions.propTypes = {
    adminQuestions: PropTypes.object.isRequired,
    getAdminQuestions: PropTypes.func.isRequired,
    deleteQuestion: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    resetQuiz: PropTypes.func.isRequired,
    changeSettings: PropTypes.func.isRequired,
    getSettings: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    adminQuestions: state.adminQuestions,
    questions: state.questions,
    settings: state.questions.settings
});

export default connect(mapStateToProps, {
    getAdminQuestions,
    deleteQuestion,
    logout,
    resetQuiz,
    changeSettings,
    getSettings
})(AdminQuestions);
