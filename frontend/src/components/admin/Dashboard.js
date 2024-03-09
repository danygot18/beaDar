import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Card, Col, Row } from "react-bootstrap";
import axios from "axios";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import Header from "../layout/Header";


const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  return (
    <Fragment>
      <Row>
        <Col md={2}>
          <Sidebar />
        </Col>

        <Col md={10}>
          <Card className="my-4" style={{ width: "100%", minHeight: "100vh" }}>
            <Card.Body>
              <h1 className="mb-4">Dashboard</h1>
              {loading ? (
                <Loader />
              ) : (
                <Fragment>
                  <MetaData title={"Admin Dashboard"} />
                  <Row className="pr-5 mt-5">
                    {[
                      { label: "Users", data: users, link: "/admin/users" },
                    ].map((item, index) => (
                      <Col key={index} xl={3} sm={6} mb={3}>
                        <Card
                          className={`bg-${
                            index % 4 === 0
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
                  </Row>
                </Fragment>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};
export default Dashboard;
