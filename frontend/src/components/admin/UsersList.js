import React, { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { allUsers, clearErrors, deleteUser } from "../../actions/userActions";
import { DELETE_USER_RESET } from "../../constants/userConstants";
import { Box, Typography, Button, Divider } from '@mui/material';
import { Card, Col, Row } from "react-bootstrap";

const UsersList = () => {

    
    const dispatch = useDispatch();

    let navigate = useNavigate();

    const { loading, error, users } = useSelector((state) => state.allUsers);

    const { isDeleted } = useSelector((state) => state.user);

    const errMsg = (message = "") =>
        toast.error(message, {
            position: toast.POSITION.BOTTOM_CENTER,
        });

    const successMsg = (message = "") =>
        toast.success(message, {
            position: toast.POSITION.BOTTOM_CENTER,
        });

    useEffect(() => {
        dispatch(allUsers());

        if (error) {
            errMsg(error);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            successMsg("User deleted successfully");
            navigate("/admin/users");
            dispatch({ type: DELETE_USER_RESET });
        }
    }, [dispatch, alert, error, isDeleted, navigate]);

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    };

    const setUsers = () => {
        const data = {
            columns: [
                {
                    label: "User ID",
                    field: "id",
                    sort: "asc",
                },

                {
                    label: "Name",
                    field: "name",
                    sort: "asc",
                },

                {
                    label: "Email",
                    field: "email",
                    sort: "asc",
                },

                {
                    label: "Role",
                    field: "role",
                    sort: "asc",
                },

                {
                    label: "Actions",
                    field: "actions",
                },
            ],

            rows: [],
        };

        users.forEach((user) => {
            data.rows.push({
                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role,

                actions: (
                    <Fragment>
                        <Link
                            to={`/admin/users/update/${user._id}`}
                            className="btn btn-primary py-1 px-2"
                        >
                            <i className="fa fa-pencil"></i>
                        </Link>

                        <button
                            className="btn btn-danger py-1 px-2 ml-2"
                            onClick={() => deleteUserHandler(user._id)}
                        >
                            <i className="fa fa-trash"></i>
                        </button>

                    </Fragment>
                ),
            });
        });

        return data;
    };
    const fetchData = async (endpoint, setData) => {
        try {
    
          const { data } = await axios.get(`/api/v1/admin/${endpoint}`);
          setData(data[endpoint]);
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
    
      useEffect(() => {
        fetchData("users", setUsers);
        // fetchAnswer("answers", setAllAnswers )
      }, []);

    return (
        <Box sx={{ height: 730, width: "90%", paddingTop: 5 }} style={{ background: 'white' }}>
            {/* <Typography variant="h3">Products</Typography> */}
            <Fragment>
            <Row className="pr-5 mt-5">
                    
                  </Row>
                <MetaData title={"All Users"} />

                <div className="row">
                    <div className="col-12 col-md-2">
                        <Sidebar />
                    </div>

                    <div className="col-18 col-md-10">
                    {[
                      { label: "Users", data: users, link: "/admin/users" },
                    ].map((item, index) => (
                      <Col key={index} xl={3} sm={6} mb={3}>
                        <Card
                          className={`bg-${index % 4 === 0
                            ? "success"
                            : index % 4 === 1
                              ? "danger"
                              : index % 4 === 2
                                ? "info"
                                : "warning"
                            } text-white o-hidden h-100`}
                        >
                          <Card.Body>
                            <div className="text-center card-font-size">
                              {item.label}
                              <br /> <b>{item.data && item.data.length}</b>
                            </div>
                          </Card.Body>
                          <Link
                            className="card-footer text-white clearfix small z-1"
                            to={item.link}
                          >
                            <span className="float-left">View Details</span>
                            <span className="float-right">
                              <i className="fa fa-angle-right"></i>
                            </span>
                          </Link>
                        </Card>
                      </Col>
                    ))}
                        {/* <h1 style={{ paddingTop: 60 }}>All Products</h1> */}
                        <br /><br />
                        <h1>Users</h1>
                        {/* <Typography variant="h3" sx={{ paddingTop: 10 }}>Users</Typography> */}
                        {/* <Divider sx={{ marginBottom: 3 }}></Divider> */}
                        <hr
                            style={{
                                color: "#95bfae",
                                backgroundColor: "#95bfae",
                                height: 5
                            }}
                        />
                        <Button size="large" variant="contained" color="primary"
                            sx={{ marginBottom: 2 }} href="/admin/users/new"> New User</Button>
                        {loading ? (
                            <Loader />
                        ) : (
                            <MDBDataTable
                                data={setUsers()}
                                className="px-3"
                                bordered
                                striped
                                hover
                                noBottomColumns
                            />
                        )}
                    </div>
                </div>
            </Fragment>
        </Box >
    );
};

export default UsersList;