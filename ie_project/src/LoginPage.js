import React from "react";
import {Button} from "react-bootstrap";
import Form from 'react-bootstrap/Form'
import "./LoginPage.css";
import axios from 'axios'
import Cookies from 'js-cookie'
import history from './history.js'

class LoginPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email : "",
            password : "",
            loggIn: false,
            error:"",
        };
        document.title="YIC Schedule";


        this.validateForm = this.validateForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 5;
    }

     handleSubmit(event) {
         event.preventDefault();
         axios.post("https://ie2020.kisim.eu.org/api/auth", {}, {
            auth: {
                username: this.state.email,
                password: this.state.password
            },
        }).then((response) => {
            if (response.status !== 201) {
                throw response;
            } else {
                this.setState({loggIn: true});
                const user = response.data.user;
                Cookies.set("user",{
                    id: user.id, token: response.data.token, email: this.state.email
                });
                history.push('./monday');

            }
        }).catch((e) => {

            if (e.response.status === 401) {
                this.setState({error:"Wrong username or password"});
            }
            else if(e.response.status === 400){
                this.setState({error: "Enter valid email address"});
            }
        });
    }

    render() {
        return (
            <div className="Login">
                <h1>LOGIN PAGE</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label>Email  </Form.Label>
                        <Form.Control
                            autoFocus
                            type="text"
                            value={this.state.email}
                            placeholder="Enter email"
                            onChange={e => this.setState({email: e.target.value})}
                        />
                    </Form.Group>
                    <Form.Group controlId="password" >
                        <Form.Label>Password  </Form.Label>
                        <Form.Control
                            value={this.state.password}
                            placeholder="Enter password"
                            onChange={e => this.setState({password: e.target.value})}
                            type="password"
                        />
                        <div className="error">{this.state.error}</div>
                    </Form.Group>
                    <Button disabled={!this.validateForm()} type="submit"> Login </Button>
                </Form>
            </div>
        );}
}


export default LoginPage