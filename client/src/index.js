
import React from 'react';
import {render} from 'react-dom';
import {Router, BrowserRouter, Switch, Route} from 'react-router-dom';
import history from './history';
import App from './components/App';
import Blocks from './components/Blocks';
import ConductTransaction from './components/ConductTransaction';
import './index.css';

render(
    <Router history={history}>
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={App}/>
                <Route path='/blocks' component={Blocks}/>
                <Route path='/conduct-transaction' component={ConductTransaction}/>
            </Switch>
        </BrowserRouter>
    </Router>, 
    document.getElementById('root')
);