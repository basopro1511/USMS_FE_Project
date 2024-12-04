import LogoFPT from "../../assets/images/Logo-FPT.svg";

function Header() {
  return (
    <header className="flex border-pink-900 border-solid border-4 w-screen h-1/6">
      <div className="w-1/2 h-full">
        <img src={LogoFPT} className=""/>
      </div>
      <div className="w-1/2 h-full">
        <img src={LogoFPT} className=""/>
      </div>
    </header>
  );
}

export default Header;
