import NavBar from "./navbar";
import Body from "./body"

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