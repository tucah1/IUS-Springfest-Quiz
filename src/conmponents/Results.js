import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';

const Results = ({
    question: { results, loading, resultsLoading },
    validUser,
    history
}) => {
    return (
        <Fragment>
            {!validUser ? (
                history.push('/')
            ) : (
                <Fragment>
                    {results === undefined || loading || resultsLoading ? (
                        <Spinner />
                    ) : (
                        <Fragment>
                            <div className="results">
                                <div className="results-inner">
                                    <h4>
                                        Thank you for participation{' '}
                                        {results.userId}
                                    </h4>
                                    <p>
                                        Your score is <br />{' '}
                                        <b>
                                            {results.score}/
                                            {results.questionsNumber}{' '}
                                        </b>{' '}
                                        <br />
                                        and your current rank is{' '}
                                        <b>{results.rank}</b> <br />
                                    </p>
                                    <Link to="/">
                                        <span>Go to Homepage</span>
                                    </Link>
                                </div>
                            </div>
                        </Fragment>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

Results.propTypes = {
    question: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    question: state.questions,
    validUser: state.questions.validUser
});

export default connect(mapStateToProps, {})(Results);
