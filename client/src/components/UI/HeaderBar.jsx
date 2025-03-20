import appLogo from "../../assets/images/logo.png";
import Icon from "./Icon";
import { AiOutlineSearch, AiOutlineBell } from "react-icons/ai";

export default function HeaderBar({ title, onSearchClick }) {
  return (
    <header className="header-bar">
      <div className="header-left">
        <img src={appLogo} alt="URoute Logo" className="header-logo" />
        <span className="header-title">{title}</span>
      </div>
      <div className="header-right">
        <Icon label="Notifications" onClick={() => {}}>
          <AiOutlineBell size={24} />
        </Icon>
        <Icon
          label="Search"
          onClick={() => {
            onSearchClick;
          }}
        >
          <AiOutlineSearch size={24} />
        </Icon>
      </div>
    </header>
  );
}
