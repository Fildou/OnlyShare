import React from "react";
import {Button, Form, FormGroup, Input, Label, FormText, Container} from "reactstrap";

const CreateQuestion = () => {
    return (
        <div className="container">
            <h1>Create question</h1>
            <Form>
                <FormGroup>
                    <Label for="title">Title</Label>
                    <Input type="text" name="title" id="title" placeholder="Enter a title" />
                    <FormText>Please enter a title for your question</FormText>
                </FormGroup>
                <FormGroup>
                    <Label for="description">Description</Label>
                    <Input type="textarea" name="description" id="description" placeholder="Enter a description" />
                    <FormText>Please enter a detailed description of your question</FormText>
                </FormGroup>
                <Button className="">Save</Button>
                <Button className="ms-2">Cancel</Button>
            </Form>
        </div>
    );
};

export default CreateQuestion;
