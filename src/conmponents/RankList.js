import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { getRankList } from '../actions/adminQuestions';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import { Link, Redirect } from 'react-router-dom';

const RankList = ({
    getRankList,
    isAuthenticated,
    isRankListVisible,
    loading,
    rankList
}) => {
    useEffect(() => {
        getRankList();
    }, [getRankList]);

    if (!isAuthenticated && !isRankListVisible) {
        return <Redirect to="/" />;
    }

    return (
        <Fragment>
            {loading || rankList === undefined ? (
                <Spinner />
            ) : (
                <Fragment>
                    <div className="ranklist">
                        <table>
                            <tbody>
                                <tr>
                                    <th className="table-first">Position</th>
                                    <th>ID</th>
                                    <th className="table-last">Score</th>
                                </tr>
                                {rankList.map((user, index) => (
                                    <Fragment key={index}>
                                        <tr id={`tablerow${index}`}>
                                            <td className="table-first">
                                                {index + 1}.
                                            </td>
                                            <td>{user.userId}</td>
                                            <td className="table-last">
                                                {user.score} /
                                                {user.questionsNumber}
                                            </td>
                                        </tr>
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                        <div className="ranklist-link">
                            <Link to="/">
                                <span>Homepage</span>
                            </Link>{' '}
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

RankList.propTypes = {
    isAuthenticated: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
    rankList: PropTypes.array
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.adminQuestions.loading,
    rankList: state.adminQuestions.rankList,
    isRankListVisible: state.questions.settings.isRankListVisible
});

export default connect(mapStateToProps, { getRankList })(RankList);
