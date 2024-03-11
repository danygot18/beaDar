import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import { Card, Col, Row } from "react-bootstrap";
import axios from "axios";
import Loader from "../../layout/Loader";
import MetaData from "../../layout/MetaData";

import ResultByConsumerQuestionChart from "../../charts/ResultByConsumerQuestionChart";
import SurveyForm from "../../Question/Survey";



const ConsumerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [answers, setAllAnswers] = useState([]);


  // const fetchAnswer = async (endpoint, setData) => {
  //   try {

  //     const { data } = await axios.get(`/api/v1/allFarmeranswer`);
  //     setData(data[endpoint]);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  



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
    <Fragment>
      <Row>
        <Col md={2} style={{ background: "white", border: "none" }}>

          <Sidebar />
        </Col>

        <Col md={10} style={{ background: "white", border: "none" }}>
          <Card className="my-4" style={{ width: "100%", minHeight: "100vh" }}>
            <Card.Body>
              <h1 className="mb-4 mt-5">Survey and Analysis for Consumer</h1>
              {loading ? (
                <Loader />
              ) : (
                <Fragment>

                  <MetaData title={"Admin Dashboard"} />
                  
                  
                  <Row className="mt-5 pb-5">
                    <Col md={12}>
                      <ResultByConsumerQuestionChart />


                    </Col>
                  </Row>
                  <Row className="mt-5 pb-5">
                    <Col md={12}>

                      <SurveyForm />

                    </Col>
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
export default ConsumerDashboard;
