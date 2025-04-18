import appLogo from "../../assets/images/logo.png";
import NotificationBell from "./NotificationBell";
import Icon from "./Icon";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "../util/http";

export default function HeaderBar({ title, onSearchClick }) {
  const accountEmail = useSelector((state) => state.auth.email);

  const {
    data: notifsData,
  } = useQuery({
    queryKey: ["notifications", accountEmail],
    queryFn: ({ signal }) =>
      fetchNotifications({
        signal,
        accountEmail
      }),
  });

  console.log(notifsData);

  return (
    <header className="header-bar">
      <div className="header-left">
        <img src={appLogo} alt="URoute Logo" className="header-logo" />
        <span className="header-title">{title}</span>
      </div>
      <div className="header-right">
        <NotificationBell items={notifsData}/>
        <Icon label="Search" onClick={onSearchClick}>
          <AiOutlineSearch size={24} />
        </Icon>
      </div>
    </header>
  );
}
