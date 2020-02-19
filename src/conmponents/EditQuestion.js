import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSingleQuestion, editQuestion } from '../actions/adminQuestions';
import Spinner from './Spinner';
import { Link } from 'react-router-dom';

const EditQuestion = ({
    match,
    getSingleQuestion,
    question,
    validQuestion,
    loading,
    history,
    editQuestion
}) => {
    useEffect(() => {
        getSingleQuestion(match.params.id);
    }, [getSingleQuestion, match.params.id]);

    useEffect(() => {
        setNewQuestion({
            text: loading || !question ? '' : question.text,
            answers: [
                {
                    body:
                        loading || !question || question.answers === undefined
                            ? ''
                            : question.answers[0].body,
                    isTrue:
                        loading || !question || question.answers === undefined
                            ? false
                            : question.answers[0].isTrue
                },
                {
                    body:
                        loading || !question || question.answers === undefined
                            ? ''
                            : question.answers[1].body,
                    isTrue:
                        loading || !question || question.answers === undefined
                            ? false
                            : question.answers[1].isTrue
                },
                {
                    body:
                        loading || !question || question.answers === undefined
                            ? ''
                            : question.answers[2].body,
                    isTrue:
                        loading || !question || question.answers === undefined
                            ? false
                            : question.answers[2].isTrue
                },
                {
                    body:
                        loading || !question || question.answers === undefined
                            ? ''
                            : question.answers[3].body,
                    isTrue:
                        loading || !question || question.answers === undefined
                            ? false
                            : question.answers[3].isTrue
                }
            ]
        });
        if (
            question !== null &&
            question !== undefined &&
            question.answers !== undefined
        ) {
            function test() {
                question.answers.forEach((element, index) => {
                    if (element.isTrue) {
                        setTrueAns(index.toString());
                    }
                });
            }
            test();
        }
    }, [loading, question]);

    const [newQuestion, setNewQuestion] = useState({
        text: '',
        answers: [
            {
                body: '',
                isTrue: false
            },
            {
                body: '',
                isTrue: false
            },
            {
                body: '',
                isTrue: false
            },
            {
                body: '',
                isTrue: false
            }
        ]
    });

    const [trueAns, setTrueAns] = useState('');

    const onChange = e => {
        setNewQuestion({
            ...newQuestion,
            [e.target.name]: e.target.value
        });
    };

    const onChangeAnswers = e => {
        let newAnswers = [...newQuestion.answers];
        newAnswers[e.target.name].body = e.target.value;

        setNewQuestion({ ...newQuestion, answers: newAnswers });
    };

    const onChangeRadio = e => {
        setTrueAns(e.target.value);
    };

    const onClickRadio = e => {
        let newAns = [...newQuestion.answers];
        newAns.forEach(element => (element.isTrue = false));

        newAns[e.target.name].isTrue = true;

        setNewQuestion({ ...newQuestion, answers: newAns });
    };

    const onSubmitForm = e => {
        e.preventDefault();
        editQuestion(newQuestion, match.params.id);
        history.push('/quiz-settings');
    };

    return (
        <Fragment>
            {loading || question === undefined ? (
                <Spinner />
            ) : (
                <Fragment>
                    {validQuestion === false ? (
                        <Fragment>
                            {
                                (alert(
                                    "This question doesn't exist.\n You will be redirected to questions list page."
                                ),
                                history.push('/admin-questions'))
                            }{' '}
                        </Fragment>
                    ) : (
                        <Fragment>
                            <div className="add-question">
                                <div className="add-question-form">
                                    <form onSubmit={e => onSubmitForm(e)}>
                                        <div className="add-question-question">
                                            <h5>Question:</h5>
                                            <input
                                                type="textarea"
                                                name="text"
                                                placeholder="How are you?"
                                                value={newQuestion.text}
                                                onChange={e => onChange(e)}
                                                required
                                            />{' '}
                                        </div>
                                        <div className="add-question-answers">
                                            <h5>Answers:</h5>
                                            <input
                                                type="text"
                                                name="0"
                                                placeholder="First answer"
                                                value={
                                                    newQuestion.answers[0].body
                                                }
                                                onChange={e =>
                                                    onChangeAnswers(e)
                                                }
                                                required
                                            />{' '}
                                            <input
                                                type="text"
                                                name="1"
                                                placeholder="Second answer"
                                                value={
                                                    newQuestion.answers[1].body
                                                }
                                                onChange={e =>
                                                    onChangeAnswers(e)
                                                }
                                                required
                                            />{' '}
                                            <input
                                                type="text"
                                                name="2"
                                                placeholder="Third answer"
                                                value={
                                                    newQuestion.answers[2].body
                                                }
                                                onChange={e =>
                                                    onChangeAnswers(e)
                                                }
                                                required
                                            />{' '}
                                            <input
                                                type="text"
                                                name="3"
                                                placeholder="Fourth answer"
                                                value={
                                                    newQuestion.answers[3].body
                                                }
                                                onChange={e =>
                                                    onChangeAnswers(e)
                                                }
                                                required
                                            />{' '}
                                        </div>
                                        <div className="add-questions-correct">
                                            <h5>Set correct answer:</h5>
                                            <input
                                                className="option rad"
                                                type="radio"
                                                name="0"
                                                value="0"
                                                id="0"
                                                checked={trueAns === '0'}
                                                onChange={e => onChangeRadio(e)}
                                                onClick={e => onClickRadio(e)}
                                            />
                                            <label htmlFor="0">1</label>
                                            <input
                                                className="option rad"
                                                type="radio"
                                                name="1"
                                                value="1"
                                                id="1"
                                                checked={trueAns === '1'}
                                                onChange={e => onChangeRadio(e)}
                                                onClick={e => onClickRadio(e)}
                                            />
                                            <label htmlFor="1">2</label>
                                            <input
                                                className="option rad"
                                                type="radio"
                                                name="2"
                                                value="2"
                                                id="2"
                                                checked={trueAns === '2'}
                                                onChange={e => onChangeRadio(e)}
                                                onClick={e => onClickRadio(e)}
                                            />
                                            <label htmlFor="2">3</label>
                                            <input
                                                className="option rad"
                                                type="radio"
                                                name="3"
                                                value="3"
                                                id="3"
                                                checked={trueAns === '3'}
                                                onChange={e => onChangeRadio(e)}
                                                onClick={e => onClickRadio(e)}
                                            />
                                            <label htmlFor="3">4</label>
                                        </div>

                                        <button type="submit">
                                            Edit question
                                        </button>
                                    </form>
                                    <div className="add-question-link">
                                        <Link to="/quiz-settings">
                                            <span>Cancel</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    )}
                </Fragment>
            )}{' '}
        </Fragment>
    );
};

EditQuestion.propTypes = {
    question: PropTypes.object,
    validQuestion: PropTypes.bool,
    loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    question: state.adminQuestions.question,
    validQuestion: state.adminQuestions.validQuestion,
    loading: state.adminQuestions.loading
});

export default connect(mapStateToProps, { getSingleQuestion, editQuestion })(
    EditQuestion
);
