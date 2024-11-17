import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Modal } from 'react-bootstrap';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [otpButtonText, setOtpButtonText] = useState("Send OTP");
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();

    const handleOtpClick = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/users/forgot-password`, { email });
            setOtpButtonText("Resend OTP");
            setOtpSent(true);
            console.log("OTP Sent!");
        } catch (error) {
            console.error("Error sending OTP", error);
        }
    };

    const handleVerifyOtpClick = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/users/verify-otp`, { email, otp });
            if (response.data === 'OTP verified. You can now reset your password.') {
                setShowModal(true);
            }
        } catch (error) {
            console.error("Error verifying OTP", error);
        }
    };

    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        try {
            await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/users/update-password`, { email, newPassword });
            alert('Password updated successfully.');
            setShowModal(false);
            navigate('/login');
            
        } catch (error) {
            console.error("Error updating password", error);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Row className="w-75">
                <Col md={6} style={{ marginTop: '7%' }}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Body>
                            <h2 className="text-center mb-4">Forgot Password</h2>
                            <Form>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} 
                                    />
                                </Form.Group>
                                {otpSent && (
                                    <Form.Group className="mb-3" controlId="formOTP">
                                        <Form.Label>OTP</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter the OTP" 
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)} 
                                        />
                                    </Form.Group>
                                )}
                                <Row className="mt-3">
                                    <Col>
                                        <Button
                                            variant="primary"
                                            type="button"
                                            className="w-100"
                                            onClick={handleOtpClick}
                                        >
                                            {otpButtonText}
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button variant="secondary" type="button" className="w-100" onClick={handleVerifyOtpClick}>
                                            Verify OTP
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="d-none d-md-block" style={{ marginTop: '2%' }}>
                    <img
                        src="forgot_password.jpg"
                        alt="Forgot Password Illustration"
                        className="img-fluid"
                    />
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
                        <Form.Group className="mb-3" controlId="formConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Confirm new password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                            />
                        </Form.Group>
                        <Button variant="primary" type="button" className="w-100" onClick={handleUpdatePassword}>
                            Update Password
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ForgotPassword;