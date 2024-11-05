import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Updated to useNavigate

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate(); // Updated to useNavigate

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            if (password!== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/signup`, {email, password });

            alert('Account created successfully! Please log in to continue.');
            navigate('/login');
        } catch (error) {
            console.error('Error signing up', error);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', display: 'flex' }}>
            <Row>
                <Col md={6}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Body>
                            <h2 className="text-center mb-4">Sign Up</h2>
                            <Form onSubmit={handleSignup}>
                                
                                <Form.Group id="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
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
                                <Form.Group id="confirmPassword" className='mt-2'>
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Repeat your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button className="w-100 mt-3" type="submit">Sign Up</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                
                
                
                </Col>
                <Col md={6} className="d-none d-md-block" style={{marginTop:'7%'}}>
                    <img
                        src="login.png"
                        alt="Sign Up illustration"
                        className="img-fluid"
                    />
                </Col>
            </Row>
        </Container>
    );
}
