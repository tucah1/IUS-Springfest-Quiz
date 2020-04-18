import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';

//redux
import { Provider } from 'react-redux';
import store from './store';
import { loadAdmin } from './actions/auth';

//css
import './App.css';
//components
import PrivateRoute from './util/PrivateRoute';
import Homepage from './conmponents/Homepage';
import Credits from './conmponents/Credits';
import Questions from './conmponents/Questions';
import Login from './conmponents/Login';
import AdminQuestions from './conmponents/AdminQuestions';
import AddQuestion from './conmponents/AddQuestion';
import Results from './conmponents/Results';
import Alert from './conmponents/Alert';
import EditQuestion from './conmponents/EditQuestion';
import BarcodeScanner from './conmponents/BarcodeScanner';
import RankList from './conmponents/RankList';
import NotFound from './conmponents/NotFound';

//for deployment
axios.defaults.baseURL =
    'https://europe-west1-iusspringfestquiz.cloudfunctions.net/api';

if (localStorage.token) {
    axios.defaults.headers.common['Authorization'] = localStorage.token;
} else {
    delete axios.defaults.headers.common['Authorization'];
}

function App() {
    useEffect(() => {
        store.dispatch(loadAdmin());
    }, []);
    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <section className="App">
                        <section className="content-wrap">
                            <Alert />
                            <Switch>
                                <Route exact path="/" component={Homepage} />
                                <Route
                                    exact
                                    path="/questions"
                                    component={Questions}
                                />
                                <Route exact path="/admin" component={Login} />
                                <Route
                                    exact
                                    path="/results"
                                    component={Results}
                                />
                                <Route
                                    exact
                                    path="/scanid"
                                    component={BarcodeScanner}
                                />
                                <Route
                                    exact
                                    path="/ranklist"
                                    component={RankList}
                                />
                                <PrivateRoute
                                    exact
                                    path="/quiz-settings"
                                    component={AdminQuestions}
                                />
                                <PrivateRoute
                                    exact
                                    path="/add-question"
                                    component={AddQuestion}
                                />

                                <PrivateRoute
                                    exact
                                    path="/edit-question/:id"
                                    component={EditQuestion}
                                />

                                <Route component={NotFound} />
                            </Switch>
                        </section>
                        <Credits />
                    </section>
                </Fragment>
            </Router>
        </Provider>
    );
}

export default App;
