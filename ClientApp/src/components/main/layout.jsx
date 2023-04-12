import NavBar from "./navbar";
import Body from "./body"
import Footer from "./footer"
export const Layout = ({children}) => {
    return (
        <>
            <NavBar />
            <Body>
                {children}
            </Body>
            <Footer/>
        </>
    );
};