import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getResults } from '../actions/questions';
import Spinner from './Spinner';
import Timer from 'react-compound-timer';
import { Prompt } from 'react-router-dom';

const Questions = ({
    questions,
    validUser,
    history,
    getResults,
    questionsImporting,
    timer
}) => {
    const [countQuestions, setCountQuestions] = useState(0);

    const [currentQuest, setCurrentQuest] = useState({
        quest: questions.length === 0 ? '' : questions[0].text,
        questID: questions.length === 0 ? '' : questions[0].id,
        answers: questions.length === 0 ? [] : questions[0].answers
    });

    const [answerToQuest, setAnswerToQuest] = useState({
        questionsID: currentQuest.questID,
        answID: null
    });

    const [questAndAns, setQuestAndAns] = useState([]);

    const handleOnChangeAnswer = e => {
        setAnswerToQuest({
            ...answerToQuest,
            answID: e.target.value
        });
    };

    const handleOnSumbitQuestin = e => {
        e.preventDefault();

        if (countQuestions < questions.length - 1) {
            setQuestAndAns([
                ...questAndAns,
                {
                    question: answerToQuest.questionsID,
                    answer: answerToQuest.answID
                }
            ]);

            setCountQuestions(countQuestions + 1);

            setCurrentQuest({
                quest: questions[countQuestions + 1].text,
                questID: questions[countQuestions + 1].id,
                answers: questions[countQuestions + 1].answers
            });
            setAnswerToQuest({
                questionsID: questions[countQuestions + 1].id,
                answID: null
            });
        } else if (countQuestions === questions.length - 1) {
            const arrOfQandA = [...questAndAns];
            arrOfQandA.push({
                question: answerToQuest.questionsID,
                answer: answerToQuest.answID
            });

            const answers = {
                userId: localStorage.getItem('user'),
                answers: arrOfQandA
            };

            getResults(answers);

            localStorage.removeItem('user');
            history.push('/results');
        }
    };
    const [timesUp, setTimesUp] = useState(false);

    if (timesUp) {
        const answers = {
            userId: localStorage.getItem('user'),
            answers: questAndAns
        };
        console.log(answers);
        getResults(answers);
        localStorage.removeItem('user');
        history.push('/results');
    }

    return (
        <Fragment>
            {validUser === false || validUser === null ? (
                <Fragment>{history.push('/')}</Fragment>
            ) : (
                <Fragment>
                    {questionsImporting ||
                    currentQuest === undefined ||
                    questions === null ? (
                        <Spinner />
                    ) : (
                        <Fragment>
                            <Prompt
                                when={countQuestions !== questions.length - 1}
                                message="You're leaving the quiz. If you leave your result will be 0 and you will not be able to play again. Are you sure you want to leave?"
                            />
                            <div className="questions">
                                <div className="questions-timer">
                                    <Timer
                                        formatValue={value =>
                                            `${
                                                value < 10 ? `0${value}` : value
                                            }`
                                        }
                                        initialTime={timer * 60000}
                                        startImmediately={true}
                                        direction="backward"
                                        checkpoints={[
                                            {
                                                time: 0 * 0 * 0,
                                                callback: () => {
                                                    setTimesUp(true);
                                                }
                                            }
                                        ]}
                                    >
                                        {() => (
                                            <Fragment>
                                                <Timer.Minutes />:
                                                <Timer.Seconds />
                                            </Fragment>
                                        )}
                                    </Timer>
                                </div>
                                <div className="questions-question">
                                    <h1>
                                        {countQuestions + 1}.{' '}
                                        {currentQuest.quest}{' '}
                                    </h1>
                                </div>

                                <form onSubmit={e => handleOnSumbitQuestin(e)}>
                                    <div className="questions-answers">
                                        <div className="questions-answers-inner">
                                            {currentQuest.answers.map(ans => (
                                                <Fragment key={ans.id}>
                                                    <label
                                                        htmlFor={`${ans.id}`}
                                                    >
                                                        <input
                                                            className="option-input radio"
                                                            type="radio"
                                                            value={ans.id}
                                                            id={`${ans.id}`}
                                                            checked={
                                                                answerToQuest.answID ===
                                                                ans.id.toString()
                                                            }
                                                            onChange={e =>
                                                                handleOnChangeAnswer(
                                                                    e
                                                                )
                                                            }
                                                        />
                                                        {ans.body} <br />
                                                    </label>
                                                </Fragment>
                                            ))}
                                        </div>
                                    </div>

                                    {answerToQuest.answID !== null ? (
                                        <button
                                            className="questions-button"
                                            type="submit"
                                        >
                                            {countQuestions ===
                                            questions.length - 1
                                                ? 'Get results'
                                                : 'Next question'}
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}
                                </form>
                            </div>
                        </Fragment>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

Questions.propTypes = {
    questions: PropTypes.array.isRequired,
    validUser: PropTypes.bool,
    getResults: PropTypes.func.isRequired,
    questionsImporting: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    questions: state.questions.questions,
    timer: state.questions.settings.timer,
    validUser: state.questions.validUser,
    questionsImporting: state.questions.questionsImporting
});

export default connect(mapStateToProps, { getResults })(Questions);
