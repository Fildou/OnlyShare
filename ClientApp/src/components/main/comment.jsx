import React from "react";
import { Card, CardBody, CardSubtitle, CardText, CardTitle, CardLink } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser ,faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import "./comment.css";

const CommentComponent = ({ title, text, date, username, likes, dislikes, onLike, onDislike }) => {
  return (
    <Card className="card mt-2">
      <CardBody className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <CardTitle className="card-title">{title}</CardTitle>
          <CardSubtitle className="card-subtitle mb-2 text-muted">{date}</CardSubtitle>
          <CardText><FontAwesomeIcon icon={faUser} /> {username}</CardText>
        </div>
        <CardText className="card-text">{`${text.substring(0, 100)}`}</CardText>
        <div className="reactions">
          <button className={`reaction-button like-button`} onClick={onLike}>
            <FontAwesomeIcon icon={faThumbsUp} /> Like {likes}
          </button>
          <button className={`reaction-button dislike-button`} onClick={onDislike}>
            <FontAwesomeIcon icon={faThumbsDown} /> Dislike {dislikes}
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

export default CommentComponent;
