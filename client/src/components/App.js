import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import logo1 from '../assets/logo_1.jpg';

class App extends Component{
    state = {walletInfo:{}};

    componentDidMount(){
        fetch(`${document.location.origin}/api/wallet-info`).then(response=>response.json()).then(json=>this.setState({walletInfo: json}));
    }

    render(){
        const {address, balance} = this.state.walletInfo;

        return (
            <div className='App'>
                <img className='logo' src={logo1}></img>
                <br/>
                <div>Welcome to the block chain!!!</div>
                <br/>
                <div><Link to='/blocks'>Blocks</Link></div>
                <div><Link to='/conduct-transaction'>Conduct a Transaction</Link></div>
                <div><Link to='/transaction-pool'>Transaction Pool</Link></div>
                <br/>
                <div className='WalletInfo'>
                    <div>Address: {address}</div>
                    <div>Balance: {balance}</div>
                </div>
            </div>
        );
    }
}

export default App;