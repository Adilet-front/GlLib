import styles from "./ProfileSettingsPage.module.scss";

export const ProfileCredentialsPage = () => (
  <section className={styles.page}>
    <div className={styles.header}>
      <h1>Вход и безопасность</h1>
      <p>Управляйте паролем, почтой и активными сессиями.</p>
    </div>
    <div className={styles.card}>
      <div>
        <h3>Пароль</h3>
        <p>Последнее изменение: 2 недели назад</p>
      </div>
      <button type="button" className={styles.actionButton}>
        Изменить
      </button>
    </div>
    <div className={styles.card}>
      <div>
        <h3>Почта</h3>
        <p>alina@litres.local</p>
      </div>
      <button type="button" className={styles.actionButton}>
        Обновить
      </button>
    </div>
    <div className={styles.card}>
      <div>
        <h3>Активные устройства</h3>
        <p>MacBook · Сейчас онлайн</p>
      </div>
      <button type="button" className={styles.actionButtonGhost}>
        Завершить
      </button>
    </div>
  </section>
);

export default ProfileCredentialsPage;
