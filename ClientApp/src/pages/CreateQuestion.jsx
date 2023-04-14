import React, { useState } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Input, Label, FormText } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateQuestion.css";
import { useNavigate } from "react-router-dom";

const CreateQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();

    // validate title and description
    setTitleError(validateField(title));
    setDescriptionError(validateField(description));

    if (title && description) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.post(
          "/api/questions/AddQuestion",
          { title, description },
          config
        );

        toast.success("Question created successfully!");
        setTimeout(() => {
          navigate("/");
        }, 850);
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while creating the question.");
      }
    }
  };

  const validateField = (value) => {
    if (!value) {
      return "This field is required.";
    } else {
      return "";
    }
  };

  return (
    <div  className="container form-create">
      <h1>Create question</h1>
      <Form  onSubmit={handleSave}>

        <FormGroup>
          <Label for="title">Title</Label>
          <Input
            type="text"
            name="title"
            id="title"
            placeholder="Enter a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {titleError && <div className="error">{titleError}</div>}
          <FormText>Please enter a title for your question</FormText>
        </FormGroup>

        <FormGroup>
          <Label for="description">Description</Label>
          <Input
            type="textarea"
            name="description"
            id="description"
            placeholder="Enter a description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {descriptionError && (
            <div className="error">{descriptionError}</div>
          )}
          <FormText>
            Please enter a detailed description of your question
          </FormText>
        </FormGroup>

        <Button type="submit" className="">
          Save
        </Button>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default CreateQuestion;



