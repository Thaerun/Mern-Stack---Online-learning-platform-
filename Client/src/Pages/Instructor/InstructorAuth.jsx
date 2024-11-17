import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Modal, Nav } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function InstructorAuth({ setInstructorToken }) {
    const [currentView, setCurrentView] = useState('login');
    const [otpButtonText, setOtpButtonText] = useState("Send OTP");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/instructors/login`, { email, password });
            localStorage.setItem('instructorToken', response.data.token);
            localStorage.setItem('instructorEmail', email);
            setInstructorToken(response.data.token);
            navigate('/instructor-dashboard'); // Redirect to instructor dashboard
        } catch (error) {
            if (error.response && error.response.data === 'Please verify your email before logging in') {
                alert('Please verify your email before logging in.');
            } else {
                console.error('Error logging in', error);
            }
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/instructors/signup`, { email, password });
            alert('Account created successfully! Please log in to continue.');
            setCurrentView('login'); // Switch to login view after signup
        } catch (error) {
            console.error('Error signing up', error);
        }
    };

    const handleOtpClick = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/instructors/forgot-password`, { email });
            setOtpButtonText("Resend OTP");
            setOtpSent(true);
            console.log("OTP Sent!");
        } catch (error) {
            console.error("Error sending OTP", error);
        }
    };

    const handleVerifyOtpClick = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/instructors/verify-otp`, { email, otp });
            if(response.data === 'OTP verified. You can now reset your password.'){
                setShowModal(true);
            }
        } catch (error) {
            console.error("Error verifying OTP", error);
        }
    };

    const handleUpdatePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            alert('Passwords do not match!');
            return;
        }
        try {
            await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/instructors/update-password`, { email, newPassword });
            alert('Password updated successfully.');
            setShowModal(false);
            setCurrentView('login');
        } catch (error) {
            console.error("Error updating password", error);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Row>
                <Col md={12}>
                    <Nav variant="tabs" activeKey={currentView} className="mb-4">
                        <Nav.Item>
                            <Nav.Link eventKey="login" onClick={() => setCurrentView('login')}>Login</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="signup" onClick={() => setCurrentView('signup')}>Sign Up</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col md={8} lg={10} className='mx-auto'> {/* Make the card wider */}
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded" style={{ maxWidth: '900px', width: '100%' }}>
                        <Card.Body>
                            <h2 className="text-center mb-4">{currentView === 'login' ? 'Login' : currentView === 'signup' ? 'Sign Up' : 'Forgot Password'}</h2>
                            {currentView === 'login' && (
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
                                    <Button className="w-100 mt-3" type="submit">Sign In</Button>
                                    <div className="w-100 text-center mt-3 d-flex justify-content-center align-items-center">
                                        Don’t Have an Account? <Button variant="link" className='p-0' onClick={() => { setCurrentView('signup'); setEmail(''); setPassword(''); setConfirmPassword(''); }}>Signup</Button>
                                    </div>
                                    <div className="text-right mt-2">
                                        <Button variant="link" onClick={() => {
                                            setCurrentView('forgot-password');
                                            setOtpSent(false);
                                            setEmail('');
                                            setOtp('');
                                        }}>Forgot Password?</Button>
                                    </div>
                                </Form>
                            )}
                            {currentView === 'signup' && (
                                <Form onSubmit={handleSignup}>
                                    <Form.Group id="signup-email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group id="signup-password" className='mt-2'>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group id="confirm-password" className='mt-2'>
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
                                    <div className="w-100 text-center mt-3  d-flex justify-content-center align-items-center">
                                        Already Have an Account? 
                                        <Button variant="link" className='p-0 ml-1' onClick={() => { 
                                            setEmail(''); setPassword(''); setCurrentView('login');
                                            }}>Login</Button>
                                    </div>
                                </Form>
                            )}
                            {currentView === 'forgot-password' && (
                                <div>
                                    <Form.Group id="forgot-password-email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control 
                                            type="email" 
                                            placeholder="Enter your email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)} 
                                            required
                                        />
                                    </Form.Group>
                                    {otpSent ? (
                                        <>
                                            <Form.Group id="otp">
                                                <Form.Label>OTP</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    placeholder="Enter the OTP" 
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)} 
                                                    required
                                                />
                                            </Form.Group>
                                            <Button variant="primary" type="button" className="w-100 mt-3" onClick={handleVerifyOtpClick}>
                                                Verify OTP
                                            </Button>
                                            <Button variant="secondary" type="button" className="w-100 mt-2" onClick={handleOtpClick}>
                                                Resend OTP
                                            </Button>
                                            <div className="text-right mt-2">
                                                <Button variant="link" onClick={() => {
                                                    setCurrentView('login');
                                                    setOtpSent(false);
                                                    setEmail('');
                                                    setOtp('');
                                                }}>Back to Login</Button>
                                            </div>
                                        </>
                                    ) : (
                                        <Button variant="primary" type="button" className="w-100 mt-3" onClick={handleOtpClick}>
                                            Send OTP
                                        </Button>
                                    )}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal for updating password */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formNewPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter new password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formConfirmNewPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Confirm new password" 
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)} 
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleUpdatePassword}>
                            Update Password
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}
