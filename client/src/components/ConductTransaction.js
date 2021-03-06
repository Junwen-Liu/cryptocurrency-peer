import React, {Component} from 'react';
import {FormGroup, FormControl, Button} from 'react-bootstrap';
import {Link, withRouter} from 'react-router-dom';

class ConductTransaction extends Component {
    state = {recipient: '', amount: 0, knownAddress: []};

    componentDidMount(){
        fetch(`${document.location.origin}/api/known-addresses`)
        .then(response=>response.json())
        .then(json=>this.setState({knownAddress: json}));
    }

    updateRecipient = event =>{
        this.setState({recipient: event.target.value});
    }

    updateAmount = event =>{
        this.setState({amount: Number(event.target.value)});
    }

    conductTransaction = () =>{

        fetch(`${document.location.origin}/api/transact`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({recipient:this.state.recipient, amount:this.state.amount})

        }).then(response=>response.json()).then(json=>{
            alert(json.message || json.type);
            this.props.history.push('/transaction-pool');
        });
    }

    render(){

        return (
            <div className='ConductTransaction'>
                <Link to='/'>Home</Link>
                <h3>Conduct a Transaction</h3>
                <br/>
                <h4>Known Address:</h4>
                {
                    this.state.knownAddress.map(knownAddress=>{
                        return(
                            <div key={knownAddress}>
                                <div>{knownAddress}</div>
                                <br/>
                            </div>
                        )
                    })
                }
                <br/>
                <FormGroup>
                    <FormControl
                        input='text'
                        placeholder='recipient'
                        value={this.state.recipient}
                        onChange={this.updateRecipient}
                    />
                </FormGroup>
                <FormGroup>
                <FormControl
                        input='number'
                        placeholder='amount'
                        value={this.state.amount}
                        onChange={this.updateAmount}
                    />
                </FormGroup>
                <div>
                    <Button variant="danger" size="sm" onClick={this.conductTransaction}>Submit</Button>
                </div>
            </div>
        )
    }
}

export default withRouter(ConductTransaction);