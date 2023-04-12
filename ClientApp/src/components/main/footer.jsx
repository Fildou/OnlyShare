import React from "react";
import { Container, Row, Col } from "reactstrap";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col className="text-center">
            <p>© 2023 OnlyShare</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
