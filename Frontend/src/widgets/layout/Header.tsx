import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../features/auth/model/useAuth";
import styles from "./Header.module.scss";

// type ActionLinkProps = {
//   to: string;
//   label: string;
//   icon: string;
//   badge?: number;
//   onClick?: () => void;
// };

// const ActionLink = ({ to, label, icon, badge, onClick }: ActionLinkProps) => (
//   <Link to={to} className={styles.actionLink} onClick={onClick}>
//     <span className={styles.actionIcon} aria-hidden="true">
//       {icon}
//     </span>
//     <span className={styles.actionLabel}>{label}</span>
//     {badge ? <span className={styles.badge}>{badge}</span> : null}
//   </Link>
// );

const shuffleList = (items: string[]) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled;
};

export const Header = () => {
  const { t } = useTranslation();
  const { isAuthenticated, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimerRef = useRef<number | null>(null);
  const suggestions = useMemo(
    () => [
      "татьяна устинова",
      "сергей лукьяненко",
      "стивен кинг",
      "андрей васильев",
      "вебтун",
    ],
    [],
  );
  const [shuffledSuggestions, setShuffledSuggestions] =
    useState<string[]>(suggestions);
  const normalizedQuery = query.trim().toLowerCase();
  const suggestionItems = useMemo(() => {
    if (!normalizedQuery) {
      return shuffledSuggestions;
    }

    return suggestions.filter((item) => item.includes(normalizedQuery));
  }, [normalizedQuery, suggestions, shuffledSuggestions]);

  // const cartTarget = "/cart";

  const canUseDom = typeof document !== "undefined";
  const handleSignOut = () => {
    if (!confirm("Вы уверены, что хотите выйти из аккаунта?")) return;
    signOut();
    navigate("/");
  };

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        window.clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const submitSearch = (term: string) => {
    const normalized = term.trim();
    if (!normalized) return;
    setIsSearching(true);
    setIsSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(normalized)}`);
    if (searchTimerRef.current) {
      window.clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = window.setTimeout(() => {
      setIsSearching(false);
    }, 900);
  };

  return (
    <>
      <header
        className={styles.header}
        data-search-open={isSearchOpen ? "true" : "false"}
      >
        <div className={styles.row}>
          <div className={styles.left}>
            <button
              className={styles.burger}
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              data-open={isMenuOpen ? "true" : "false"}
            >
              <span />
              <span />
              <span />
            </button>
            <Link to="/" className={styles.logo}>
              {t("appName")}
            </Link>
            <NavLink to="/catalog" className={styles.catalogButton}>
              {t("header.catalogButton")}
            </NavLink>
          </div>
          <form
            className={styles.search}
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch(query);
            }}
            onFocusCapture={() => {
              setIsSearchOpen(true);
              if (!normalizedQuery) {
                setShuffledSuggestions(shuffleList(suggestions));
              }
            }}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setIsSearchOpen(false);
              }
            }}
          >
            <input
              type="search"
              placeholder={t("search.placeholder")}
              value={query}
              onChange={(event) => {
                const next = event.target.value;
                setQuery(next);
                if (!next.trim()) {
                  setShuffledSuggestions(shuffleList(suggestions));
                }
              }}
            />
            <button
              className={styles.searchSubmit}
              type="submit"
              data-loading={isSearching ? "true" : "false"}
            >
              {isSearching ? (
                <span className={styles.searchLoader} aria-hidden="true" />
              ) : null}
              <span className={styles.searchLabel}>Искать</span>
            </button>
            {isSearchOpen ? (
              <div className={styles.searchDropdown}>
                {suggestionItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={styles.searchItem}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setQuery(item);
                      submitSearch(item);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
          </form>
          {/* <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? `${styles.navLink} ${styles.navLinkActive}`
                : styles.navLink
            }
          >
            {t("nav.new")}
          </NavLink>
          <NavLink
            to="/popular"
            className={({ isActive }) =>
              isActive
                ? `${styles.navLink} ${styles.navLinkActive}`
                : styles.navLink
            }
          >
            {t("nav.popular")}
          </NavLink>
          <NavLink
            to="/lists"
            className={({ isActive }) =>
              isActive
                ? `${styles.navLink} ${styles.navLinkActive}`
                : styles.navLink
            }
          >
            {t("nav.picks")}
          </NavLink>
        </nav> */}
          <div className={styles.actions}>
            {/* <ActionLink
            to={cartTarget}
            label={t("nav.cart")}
            icon="C"
            badge={isAuthenticated ? 2 : undefined}
          /> */}
            <details className={styles.navDropdown}>
              <summary className={styles.navSummary}>
                {t("nav.myBooks")}
              </summary>
              <div className={styles.navMenu}>
                <NavLink to="/my">{t("nav.myBooks")}</NavLink>
                <NavLink to="/wishlist">{t("nav.wishlist")}</NavLink>
                <NavLink to="/lists">{t("nav.lists")}</NavLink>
              </div>
            </details>

            {!isAuthenticated ? (
              <Link to="/auth/login" className={styles.loginButton}>
                {t("nav.login")}
              </Link>
            ) : (
              <details className={styles.profileMenu}>
                <summary className={styles.profileSummary}>
                  <span className={styles.profileAvatar} aria-hidden="true" />
                  <span className={styles.profileMeta}>
                    <span className={styles.profileEmail}>
                      {user?.email ?? "Профиль"}
                    </span>
                    {user?.role ? (
                      <span className={styles.profileRole}>{user.role}</span>
                    ) : null}
                  </span>
                </summary>
                <div className={styles.profileDropdown}>
                  <div className={styles.profileInfo}>
                    <div className={styles.profileInfoEmail}>
                      {user?.email ?? "—"}
                    </div>
                    {user?.role ? (
                      <div className={styles.profileInfoRole}>{user.role}</div>
                    ) : null}
                  </div>
                  <NavLink to="/profile">Профиль</NavLink>
                  <NavLink to="/profile/credentials">
                    Вход и безопасность
                  </NavLink>
                  <NavLink to="/profile/notifications">Уведомления</NavLink>
                  <button
                    type="button"
                    className={styles.profileLogout}
                    onClick={handleSignOut}
                  >
                    Выйти
                  </button>
                </div>
              </details>
            )}
          </div>
        </div>
        <div
          className={styles.mobilePanel}
          data-open={isMenuOpen ? "true" : "false"}
        >
          <nav className={styles.mobileNav}>
            <NavLink to="/catalog" onClick={() => setIsMenuOpen(false)}>
              {t("nav.catalog")}
            </NavLink>
            <NavLink to="/my" onClick={() => setIsMenuOpen(false)}>
              {t("nav.myBooks")}
            </NavLink>
            <NavLink to="/wishlist" onClick={() => setIsMenuOpen(false)}>
              {t("nav.wishlist")}
            </NavLink>
          </nav>
          <div className={styles.mobileActions}>
            {!isAuthenticated ? (
              <Link 
                to="/auth/login" 
                className={styles.mobileLoginButton}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.login")}
              </Link>
            ) : (
              <>
                <div className={styles.mobileProfileCard}>
                  <div className={styles.mobileProfileAvatar} />
                  <div className={styles.mobileProfileInfo}>
                    <div className={styles.mobileProfileEmail}>
                      {user?.email ?? "—"}
                    </div>
                    {user?.role ? (
                      <div className={styles.mobileProfileRole}>{user.role}</div>
                    ) : null}
                  </div>
                </div>
                <div className={styles.mobileProfileLinks}>
                  <NavLink to="/profile" onClick={() => setIsMenuOpen(false)}>
                    Профиль
                  </NavLink>
                  <NavLink to="/profile/credentials" onClick={() => setIsMenuOpen(false)}>
                    Безопасность
                  </NavLink>
                </div>
                <button
                  type="button"
                  className={styles.mobileLogoutButton}
                  onClick={handleSignOut}
                >
                  Выйти
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      {isSearchOpen && canUseDom
        ? createPortal(
            <div
              className={styles.searchOverlay}
              aria-hidden="true"
              onMouseDown={() => setIsSearchOpen(false)}
            />,
            document.body,
          )
        : null}
    </>
  );
};
