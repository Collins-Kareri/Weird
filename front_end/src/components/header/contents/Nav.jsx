import SearchBarIcons from "./searchBarIcons";
import Logo from "./logo";
import Menu from "./menu";

function Nav() {
    return ( <nav id="navContainer" 
    className="wrapper" role="navigation">
        <SearchBarIcons/>
        <Logo/>
        <Menu/>
    </nav> );
}

export default Nav;