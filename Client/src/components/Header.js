import Button from "./Button";
import AppLinks from "./AppLinks";
import Logo from "./Logo";

function Header() {
  return (
    <header className="flex justify-between items-center sm:px-20 px-5 py-5">
      <Logo />
      <AppLinks />
      <img src="./menu.png" alt="menu button" className="lg:hidden" />
      <div className="hidden basis-96 justify-end gap-2 lg:flex">
        <Button>Login</Button>
        <Button type="cta">Get Started</Button>
      </div>
    </header>
  );
}

export default Header;
