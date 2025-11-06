import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";

const debrisData = [
  { location: "Vembanad Lake", level: "High", confidence: "92%" },
  { location: "Goa Coast", level: "Medium", confidence: "75%" },
  { location: "Chilika Lake", level: "Low", confidence: "60%" },
];

const DebrisCards = () => {
  return (
    <Container id="debris" className="my-4">
      <h3 className="text-center mb-4 fw-bold">Detected Debris Locations</h3>
      <Row>
        {debrisData.map((debris, index) => (
          <Col md={4} key={index} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{debris.location}</Card.Title>
                <Card.Text>Debris Level: {debris.level}</Card.Text>
                <Card.Text>Model Confidence: {debris.confidence}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default DebrisCards;
