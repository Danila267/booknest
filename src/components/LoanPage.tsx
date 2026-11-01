import { useState } from "react";
import { LoanForm } from "./LoanForm";

export function LoanPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <header className="page-intro">
        <h1>Заявка на выдачу</h1>
        <p className="lead">
          Заполните анкету. В настоящем клубе её подтвердил бы библиотекарь. Этот учебный макет никуда её не отправляет.
        </p>
      </header>
      <section className="layout-loan">
        <article className="loan">
          <h2>Анкета</h2>
          <LoanForm onValid={() => setSubmitted(true)} />
          <p className="loan-note" id="loan-note" hidden={!submitted}>
            Заявка проверена в браузере и никуда не отправлена.
          </p>
        </article>
        <aside className="loan-aside" id="loan-aside">
          <h2>Для библиотекаря</h2>
          <figure className="loan-figure">
            <img
              src="images/library-card.svg"
              width={320}
              height={200}
              alt="Макет читательского билета BookNest: имя читателя и срок выдачи 14 дней"
            />
            <figcaption>Макет билета. Клуб не выпускает настоящие билеты в этом проекте.</figcaption>
          </figure>
          <dl className="facts">
            <dt>Срок</dt>
            <dd>
              <time dateTime="P14D">14 дней</time>
            </dd>
            <dt>Кто подтверждает</dt>
            <dd>Библиотекарь клуба</dd>
            <dt>Где</dt>
            <dd>Читальный зал, учебный макет</dd>
          </dl>
        </aside>
      </section>
    </>
  );
}
