import React from "react";
import { Card, CardBody, CardSubtitle, CardText, CardTitle, CardLink } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSquareCaretDown } from '@fortawesome/free-solid-svg-icons';

const CardComponent = ({username, title, text, date, postId }) => {
  return (
    <Card className="card">
      <CardBody className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <CardTitle className="card-title capitalize-text">{title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()}</CardTitle>
          <CardSubtitle className="card-subtitle mb-2 text-muted">{date}</CardSubtitle>
        </div>
        <CardText className="card-text capitalize-text">{`${text.charAt(0).toUpperCase() + text.slice(1).toLowerCase().substring(0, 100)}...`}</CardText>
        <div className="d-flex align-items-baseline justify-content-between">
          <CardLink style={{ textDecoration: 'none' }} href={`/post/${postId}`} className="card-link"><FontAwesomeIcon icon={faSquareCaretDown}/> Read more</CardLink>
          <CardText className="capitalize-text"><FontAwesomeIcon icon={faUser} /> {username}</CardText>
        </div>
      </CardBody>
    </Card>
  );
};

export default CardComponent;
