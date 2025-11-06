import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";

const FiltersOverlay = () => {
  return (
    <Container id="filters" className="my-4">
      <Row>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Select Place:</Form.Label>
            <Form.Select>
              <option>Goa</option>
              <option>Vembanad</option>
              <option>Chilika</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Debris Level:</Form.Label>
            <Form.Select>
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

export default FiltersOverlay;
