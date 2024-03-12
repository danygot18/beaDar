import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { registers, clearErrors } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Header from '../layout/Header'
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import HttpsIcon from '@mui/icons-material/Https';
import PhotoIcon from '@mui/icons-material/Photo';

import { Button, Container, Typography, TextField, Checkbox } from '@mui/material';
import { styled } from '@mui/system';

import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBInput,
    MDBIcon,
    MDBCheckbox
}
    from 'mdb-react-ui-kit';
import { FormGroup } from "react-bootstrap";

const StyledContainer = styled(Container)({
    padding: '100px',
    height: '80vh',
    width: '500px',
    margin: '100px auto',
    backgroundColor: '#e2daeb',
    borderRadius: '25px',
});

const StyledButton = styled(Button)({
    marginTop: '20px',
});


function Register() {

    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState("");

    // const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(
        "/images/default_avatar.jpg"
    );

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm(
        {
            mode: "onChange",
            defaultValues:
            {
                name: name,
                email: email,
                password: password
            }
        }
    );

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { isAuthenticated, error, loading } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }

        if (error) {
            dispatch(clearErrors());
        }
    }, [dispatch, isAuthenticated, error, navigate]);

    const submitHandler = (data) => {
        // e.preventDefault();

        const formData = new FormData();
        formData.set("name", data.name);
        formData.set("email", data.email);
        formData.set("password", data.password);
        formData.set("avatar", avatar);

        dispatch(registers(formData));
    };

    const onChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        } else {
            // setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    //Avatar Functions
    // const [avatar, setAvatar] = useState(null);

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        setAvatarPreview(URL.createObjectURL(file));
        setAvatar(file);
    };

    //Paper CSS/Style
    const paperStyle = {
        padding: 100,
        height: '80vh',
        width: 500,
        margin: "100px auto",
        backgroundColor: "#e2daeb"
    }

    const errorStyle = {
        color: "red"
    }

    return (
        <StyledContainer style={{ background: "white" }}>
            <Header />
            <MetaData title={"Register User"} />

            <Container>
                <Typography variant="h4" align="center" fontWeight="bold" mb={1}>
                    Sign up
                </Typography>
                <MDBCardBody>
                    <MDBRow>
                            <p classNAme="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                            <form onSubmit={handleSubmit(submitHandler)} encType="multipart/form-data">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon fontSize='large' />
                                        <TextField
                                            label='Your Name'
                                            type='text'
                                            fullWidth
                                            {...register("name", {
                                                required: "Name is required."
                                            })}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    {errors.name && <Typography color="red" variant="body1">{errors.name.message}</Typography>}

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <EmailIcon fontSize='large' />
                                        <TextField
                                            label='Your Email'
                                            type='email'
                                            fullWidth
                                            {...register("email", {
                                                required: "Email is required."
                                            })}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    {errors.email && <Typography color="red" variant="body1">{errors.email.message}</Typography>}

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <HttpsIcon fontSize='large' />
                                        <TextField
                                            label='Password'
                                            type='password'
                                            fullWidth
                                            {...register("password", {
                                                required: "Password is required."
                                            })}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    {errors.password && <Typography color="red" variant="body1">{errors.password.message}</Typography>}

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <PhotoIcon fontSize='large' />
                                        <input
                                            type="file"
                                            name="avatar"
                                            accept="image/*"
                                            onChange={onChange}
                                        />
                                    </div>
                                    {avatarPreview && (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar Preview"
                                            style={{ maxWidth: "100%", maxHeight: "150px" }}
                                        />
                                    )}

                                    <div>
                                        <Checkbox name='flexCheck' />
                                        <label>Subscribe to our newsletter</label>
                                    </div>

                                    <StyledButton variant="contained" color="primary" type="submit">
                                        Register
                                    </StyledButton>
                                </div>

                            </form>
                        

                        <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                            <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid />
                        </MDBCol>

                    </MDBRow>
                </MDBCardBody>
            </Container>

        </StyledContainer>
    );
}

export default Register;