import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';

const routes = [{
    path: '/curd',
    models: () => [import('./models/curdM')],
    component: () => import('./routes/CURD'),
}, {
    path: '/empty',
    models: () => [import('./models/emptyM')],
    component: () => import('./routes/Empty'),
}];

function RouterConfig({ history, app }) {
    return (
        <Router history={history}>
            <Switch>
                {
                    routes.map(({ path, ...dynamics }, key) => (
                        <Route
                            key={key}
                            exact
                            path={path}
                            component={dynamic({
                            app,
                            ...dynamics,
                            })}
                        />
                    ))
                }
                <Redirect from='/' to='/curd' />
            </Switch>
        </Router>
    );
}

export default RouterConfig;
