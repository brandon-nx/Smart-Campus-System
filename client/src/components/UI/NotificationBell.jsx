import { useState, useEffect, Fragment } from "react";
import { AiOutlineBell } from "react-icons/ai";
import Icon from "./Icon";
import { useNavigate } from "react-router-dom";
import { convertEventTimeToDateLabel } from "../util/converter";
import { useMutation } from "@tanstack/react-query";
import { markNotifRead, queryClient } from "../util/http";

export default function NotificationBell({ items = {} }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);

  // 1) default to empty arrays
  const notifications = items.notifications || [];
  const announcements = items.announcements || [];

  const grouped = groupByDate(notifications);

  // 2) compute unread count
  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const hasUnread = unreadCount > 0;
  const hasAnns = announcements.length > 0;
  const showBadge = hasUnread || hasAnns;

  // 3) pick badge class
  const badgeClass = hasUnread
    ? "notif-badge"
    : hasAnns
    ? "notif-badge-small"
    : "";

  // helper to navigate
  function handleAnnRedirect(url) {
    navigate(url);
    setOpen(false);
  }

  const { mutate } = useMutation({
    mutationFn: (id) => markNotifRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  async function handleNotifRedirect(url, id) {
    if (id && notifications.find((n) => n.id === id)?.status === "unread") {
      mutate(id);
    }
    if (url) {
      navigate(url);
      setOpen(false);
    }
  }

  function groupByDate(notifs) {
    return notifs.reduce((acc, n) => {
      const lbl = convertEventTimeToDateLabel(n.created_at);
      if (!acc[lbl]) acc[lbl] = [];
      acc[lbl].push(n);
      return acc;
    }, {});
  }

  // close on outside click
  useEffect(() => {
    function onClick(e) {
      if (!e.target.closest(".notif-wrapper")) setOpen(false);
    }
    document.addEventListener("pointerdown", onClick);
    return () => document.removeEventListener("pointerdown", onClick);
  }, []);

  return (
    <div className="notif-wrapper">
      <div className="bell-wrapper">
        <Icon label="Notifications" onClick={toggle}>
          <AiOutlineBell size={24} />
        </Icon>

        {showBadge && (
          <span
            className={badgeClass}
            {...(hasUnread
              ? { "data-badge": unreadCount > 9 ? "9+" : unreadCount }
              : {})}
          />
        )}
      </div>

      {open && (
        <div className="notif-dropdown">
          <header>
            <span>Notifications</span>
            <button className="close" onClick={() => setOpen(false)}>
              ×
            </button>
          </header>

          <ul>
            {/* Global announcements */}
            {hasAnns && (
              <>
                <li className="notif-date-label">Notices</li>
                {announcements.map((a) => (
                  <li
                    key={a.id}
                    onClick={() => a.url && handleAnnRedirect(a.url)}
                  >
                    <span className="notif-dot" />
                    <div>
                      <p className="notif-title">{a.title}</p>
                      <p className="notif-desc">{a.message}</p>
                    </div>
                  </li>
                ))}
              </>
            )}

            {/* Personal notifications */}
            {notifications.length > 0 ? (
              <>
                {Object.entries(grouped).map(([label, group]) => (
                  <Fragment key={label}>
                    <li className="notif-date-label">{label}</li>
                    {group.map((n) => (
                      <li
                        key={n.id}
                        onClick={() => handleNotifRedirect(n.url, n.id)}
                      >
                        {n.status === "unread" && (
                          <span className="notif-dot" />
                        )}
                        <div>
                          <p className="notif-title">{n.title}</p>
                          <p className="notif-desc">{n.message}</p>
                        </div>
                      </li>
                    ))}
                  </Fragment>
                ))}
              </>
            ) : !hasAnns ? (
              <li className="empty">No notifications</li>
            ) : null}
          </ul>
        </div>
      )}
    </div>
  );
}
