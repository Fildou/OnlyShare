import React from "react";
import { Card, CardBody, CardSubtitle, CardText, CardTitle, CardLink } from "reactstrap";

const CommentComponent = ({ title, text, date,  username}) => {
  return (
    <Card className="card">
      <CardBody className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <CardTitle className="card-title">{title}</CardTitle>
          <CardSubtitle className="card-subtitle mb-2 text-muted">{date}</CardSubtitle>
          <CardText>Answer by user: {username}</CardText>
        </div>
        <CardText className="card-text">{`${text.substring(0, 100)}`}</CardText>

        
      </CardBody>
    </Card>
  );
};

export default CommentComponent;
