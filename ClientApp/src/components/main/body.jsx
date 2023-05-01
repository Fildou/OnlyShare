import React from "react";
import styled from "@emotion/styled";

const MainContainer = styled.div`
  min-height: calc(100vh - 12rem);
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: auto;
`;

const Body = ({ children }) => {
    return (
        <>
            <MainContainer className="mb-5">
                <ContentContainer>{children}</ContentContainer>
            </MainContainer>
        </>
    );
};

export default Body;