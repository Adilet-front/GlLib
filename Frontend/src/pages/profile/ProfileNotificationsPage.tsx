import styles from "./ProfileSettingsPage.module.scss";

export const ProfileNotificationsPage = () => (
  <section className={styles.page}>
    <div className={styles.header}>
      <h1>Уведомления</h1>
      <p>Настройте напоминания о сроках и новости библиотеки.</p>
    </div>
    <div className={styles.card}>
      <div>
        <h3>Напоминания о возврате</h3>
        <p>Мы будем писать за 14 и 28 дней.</p>
      </div>
      <label className={styles.toggle}>
        <input type="checkbox" defaultChecked />
        <span />
      </label>
    </div>
    <div className={styles.card}>
      <div>
        <h3>Бронь и статус книги</h3>
        <p>Сообщим, когда бронь активна или истекла.</p>
      </div>
      <label className={styles.toggle}>
        <input type="checkbox" defaultChecked />
        <span />
      </label>
    </div>
    <div className={styles.card}>
      <div>
        <h3>Новости библиотеки</h3>
        <p>Анонсы новых коллекций и подборок.</p>
      </div>
      <label className={styles.toggle}>
        <input type="checkbox" />
        <span />
      </label>
    </div>
  </section>
);

export default ProfileNotificationsPage;
