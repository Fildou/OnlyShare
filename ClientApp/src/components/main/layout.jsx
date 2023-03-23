import NavBar from "./navbar";
import Body from "./body"
import { Outlet } from "react-router";

export const Layout = ({children}) => {
    return (
        <>
            <NavBar />
            <Body>
                {children}
            </Body>
        </>
    );
};