import React from "react";
import {Link} from "react-router-dom";
import {Button} from "reactstrap";

const HomePage = () => {
    return (
        <div>
            <h1>HELLO</h1>
            <Link to="/createQuestion">
                <Button >Create</Button>
            </Link>
            
        </div>
    );
};

export default HomePage;