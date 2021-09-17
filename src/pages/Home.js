import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Navbar, Container, Row, Col, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import auth from "../auth/auth";
import Product from "../components/details";
import ListOrder from "../components/list-order";
import logo from "../images/SR.TKNK.png";

export const Home = () => {
  // History hook
  const history = useHistory();
  //List product and detail
  const [order, setOrder] = useState([]);
  // Current product
  const [current, setCurrent] = useState(null);
  // User information hook
  const [user, setUser] = useState({
    userId: "",
    email: "",
    isVIP: false,
    firstName: "",
    lastName: "",
  });

  // Fetch user information on page load
  useEffect(() => {
    const fetchData = async () => {
      if (auth.isAuthenticated()) {
        const data = await auth.getUser();
        setUser(data);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  // Function to call logout
  const callLogout = async () => {
    auth.logout(() => {
      history.push("/");
    });
  };

  return (
    <>
      <Navbar
        className="align-middle justify-content-between"
        bg="dark"
        variant="dark"
      >
        <div>
          <Navbar.Brand href="/">
            <img
              alt=""
              src={logo}
              width="40"
              height="40"
              className="d-inline-block align-top"
            />
            <Navbar.Brand>
              <strong>Project</strong>
            </Navbar.Brand>
          </Navbar.Brand>
        </div>
        <div>
          <label className="ml-4 text-white" style={{}}>
            <FaUserCircle size={21} />
          </label>
          <label className="ml-4 text-white">
            {user.firstName + " " + user.lastName}
          </label>
          <Button className="ml-4" variant="outline-light" onClick={callLogout}>
            Log Out
          </Button>
        </div>
      </Navbar>
      <Container fluid className="mt-4">
        <Row>
          <Col>
            <Product current={current} />
          </Col>
          <Col>
            <ListOrder
              current={current}
              setCurrent={setCurrent}
              order={order}
              setOrder={setOrder}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};
