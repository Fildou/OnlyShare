import React from "react";
import { Card, CardBody, CardSubtitle, CardText, CardTitle, CardLink } from "reactstrap";

const CardComponent = ({ title, text, date, postId }) => {
  return (
    <Card className="card">
      <CardBody className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <CardTitle className="card-title">{title}</CardTitle>
          <CardSubtitle className="card-subtitle mb-2 text-muted">{date}</CardSubtitle>
        </div>
        <CardText className="card-text">{`${text.substring(0, 100)}...`}</CardText>
        <CardLink href={`/post/${postId}`} className="card-link">Read More</CardLink>
      </CardBody>
    </Card>
  );
};

export default CardComponent;
