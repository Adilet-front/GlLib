/**
 * Карточка профиля: загрузка профиля через getProfile, отображение email/роли и ссылки на настройки.
 */
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../../entities/user/api/userApi";

export const ProfileCard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
  });

  if (isLoading) {
    return (
      <section className="profile">
        <header className="profile-header">
          <div>
            <h1>Личный кабинет</h1>
            <p>Загрузка...</p>
          </div>
        </header>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="profile">
        <header className="profile-header">
          <div>
            <h1>Личный кабинет</h1>
            <p>Не удалось загрузить профиль. Проверьте авторизацию.</p>
          </div>
        </header>
      </section>
    );
  }

  return (
    <section className="profile">
      <header className="profile-header">
        <div>
          <h1>Личный кабинет</h1>
          <p>Добрый день, {data.email}.</p>
        </div>
      </header>

      <div className="tabs">
        <button className="tab is-active" type="button">
          Данные профиля
        </button>
      </div>

      <form className="profile-form">
        <div className="profile-fields">
          <label className="field">
            <span>Email</span>
            <input type="email" value={data.email} readOnly />
          </label>
          <label className="field">
            <span>Роль</span>
            <input type="text" value={data.role} readOnly />
          </label>
        </div>
        <div className="profile-actions">
          <button className="button primary" type="button" disabled>
            Сохранить изменения
          </button>
        </div>
      </form>
    </section>
  );
};
