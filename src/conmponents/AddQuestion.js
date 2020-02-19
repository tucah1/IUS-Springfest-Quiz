import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addQuestion } from '../actions/adminQuestions';
import { Redirect, Link } from 'react-router-dom';

const AddQuestion = ({ isAuthenticated, addQuestion, history }) => {
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
    const [ansSelected, setAnsSelected] = useState(false);

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
        setAnsSelected(true);
        let newAns = [...newQuestion.answers];
        newAns.forEach(element => (element.isTrue = false));

        newAns[e.target.name].isTrue = true;

        setNewQuestion({ ...newQuestion, answers: newAns });
    };

    const onSubmitForm = e => {
        e.preventDefault();
        addQuestion(newQuestion);

        //reset states to initial states
        setNewQuestion({
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
        setTrueAns('');
        setAnsSelected(false);
    };

    if (!isAuthenticated) {
        return <Redirect to="/" />;
    }
    return (
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
                                value={newQuestion.answers[0].body}
                                onChange={e => onChangeAnswers(e)}
                                required
                            />{' '}
                            <input
                                type="text"
                                name="1"
                                placeholder="Second answer"
                                value={newQuestion.answers[1].body}
                                onChange={e => onChangeAnswers(e)}
                                required
                            />{' '}
                            <input
                                type="text"
                                name="2"
                                placeholder="Third answer"
                                value={newQuestion.answers[2].body}
                                onChange={e => onChangeAnswers(e)}
                                required
                            />{' '}
                            <input
                                type="text"
                                name="3"
                                placeholder="Fourth answer"
                                value={newQuestion.answers[3].body}
                                onChange={e => onChangeAnswers(e)}
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
                        {ansSelected !== false ? (
                            <button type="submit">Add question</button>
                        ) : (
                            <div></div>
                        )}
                    </form>
                    <div className="add-question-link">
                        <Link to="/quiz-settings">
                            <span>Cancel</span>
                        </Link>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

AddQuestion.propTypes = {
    isAuthenticated: PropTypes.bool,
    addQuestion: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { addQuestion })(AddQuestion);
