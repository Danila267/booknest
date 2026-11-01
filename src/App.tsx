export function App() {
  return (
    <>
      <a className="skip-link" href="#content">
        К содержанию
      </a>
      <main id="content" className="page">
        <h1>Каталог книжного клуба</h1>
      </main>
      <footer className="site-footer">
        <p className="site-footer__note">
          BookNest — книжный клуб университета. Каталог для читателей и библиотекарей.
        </p>
        <p className="site-footer__meta">
          <small>Учебный проект. Заявки и отзывы проверяются в браузере и никуда не отправляются.</small>
        </p>
      </footer>
    </>
  );
}
