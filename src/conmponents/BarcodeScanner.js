import Dynamsoft from '../util/Dynamsoft';
import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

//actions
import { checkIDandImportQuestions, getSettings } from '../actions/questions';
import Spinner from './Spinner';

const BarcodeScanner = ({
    checkIDandImportQuestions,
    questions,
    history,
    getSettings
}) => {
    const [state, setState] = useState({
        bDestroyed: false,
        scanner: null,
        elRef: React.createRef(),
        loading: true
    });

    const destroy = async () => {
        setState({ ...state, bDestroyed: true });
        if (state.scanner) {
            state.scanner.close();
            state.scanner.destroy();
            setState({ ...state, scanner: null });
        }
    };

    useEffect(() => {
        getSettings();

        (async () => {
            try {
                // (state.scanner =
                //     state.scanner ||)

                let scanner = await Dynamsoft.BarcodeScanner.createInstance();
                setState({ ...state, loading: false });

                if (state.bDestroyed) {
                    destroy();
                    return;
                }

                //! For testing purpose, delete it for final build
                //checkIDandImportQuestions('180302052');

                scanner.setUIElement(state.elRef.current);
                scanner.onFrameRead = async results => {
                    if (results.length) {
                        scanner.pauseScan();

                        checkIDandImportQuestions(results[0].barcodeText);
                        localStorage.setItem('user', results[0].barcodeText);
                    }
                };

                await scanner.open();

                if (state.bDestroyed) {
                    destroy();
                    return;
                }
            } catch (err) {
                console.error(err);
            }
        })();

        return () => {
            destroy();
        };
    }, [checkIDandImportQuestions, getSettings]);

    useEffect(() => {
        if (questions.validUser !== null) {
            if (questions.validUser) {
                history.push('/questions');
            } else if (!questions.validUser) {
                alert('You already played quiz!');
                history.push('/');
            }
        }
    }, [questions.validUser, history]);

    if (questions.validUser) {
        return <Redirect to="/" />;
    }

    return (
        <Fragment>
            {questions.isBlocked ? (
                (alert('Sorry, quiz currently is not available!'),
                history.push('/'))
            ) : (
                <Fragment>
                    <div className="scanner">
                        <div className="scanner-text">
                            <h5>
                                Please scan barcode on back of your Student Card
                                to start the quiz!
                            </h5>
                        </div>
                        <div className="scanner-link">
                            <Link to="/">Go to homepage</Link>
                        </div>

                        {state.loading ? (
                            <Spinner />
                        ) : (
                            <div ref={state.elRef} className="scanner-video">
                                <video className="dbrScanner-video"></video>
                            </div>
                        )}
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

BarcodeScanner.propTypes = {
    checkIDandImportQuestions: PropTypes.func.isRequired,
    questions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    questions: state.questions
});

export default connect(mapStateToProps, {
    checkIDandImportQuestions,
    getSettings
})(withRouter(BarcodeScanner));
