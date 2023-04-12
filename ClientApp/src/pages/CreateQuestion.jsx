import React, { useState } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Input, Label, FormText } from "reactstrap";

const CreateQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/question/addquestion", { title, description });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Create question</h1>
      <Form onSubmit={handleSave}>
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
          <FormText>
            Please enter a detailed description of your question
          </FormText>
        </FormGroup>
        <Button type="submit" className="">
          Save
        </Button>
      </Form>
    </div>
  );
};

export default CreateQuestion;
