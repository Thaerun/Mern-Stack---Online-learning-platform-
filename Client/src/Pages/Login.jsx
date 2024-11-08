import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';

export default function Login({ setStudentToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Updated to useNavigate
    

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/login`, { email, password });
            const { token } = response.data;
            localStorage.setItem('studentToken', token);
            localStorage.setItem('userEmail', email);
            setStudentToken(token);
            navigate('/dashboard'); // Updated to navigate after login
        } catch (error) {
            if (error.response && error.response.data === 'Please verify your email before logging in') {
                alert('Please verify your email before logging in.');
            } else {
                console.error('Error logging in', error);
            }
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh',display:'flex' }}>
            <Row>
                <Col md={6}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Body>
                            <h2 className="text-center mb-4">Login</h2>
                            <Form onSubmit={handleLogin}>
                                <Form.Group id="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="username@gmail.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                    />
                                </Form.Group>
                                <Form.Group id="password" className='mt-2'>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                </Form.Group>
                                <div className="text-right mt-2">
                                    <a href="/forgot-password">Forgot Password?</a>
                                </div>
                                <Button className="w-100 mt-3" type="submit">Sign In</Button>
                            </Form>
                            <div className="w-100 text-center mt-3">
                                Don’t Have an Account? <a href="/signup">Signup</a>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="d-none d-md-block" style={{marginTop:'7%'}}>
                    <img
                        src="login.png"
                        alt="Login illustration"
                        className="img-fluid"
                    />
                </Col>
            </Row>
        </Container>
    );
};

