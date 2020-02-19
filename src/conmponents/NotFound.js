import React, { Fragment } from 'react';

const NotFound = () => {
    return (
        <Fragment>
            <div className="notfound">
                <div className="notfound-inner">
                    <h1 className="x-large text-primary">Page Not Found!</h1>
                    <p className="large">Sorry, this page does not exist.</p>
                </div>
            </div>
        </Fragment>
    );
};

export default NotFound;
