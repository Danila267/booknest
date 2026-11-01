const shelf = [
  {
    id: "evgeniy-onegin",
    title: "Евгений Онегин",
    author: "Александр Пушкин",
    genre: "Поэзия",
    year: 1833,
    available: false,
    cover: "images/covers/evgeniy-onegin.svg",
    description:
      "Роман в стихах, который клуб читает вслух короткими главами. Этот экземпляр сейчас на руках до конца месяца.",
  },
  {
    id: "master-i-margarita",
    title: "Мастер и Маргарита",
    author: "Михаил Булгаков",
    genre: "Роман",
    year: 1967,
    available: true,
    cover: "images/covers/master-i-margarita.svg",
    description:
      "Клуб читает роман о визите Воланда в Москву и о рукописи Мастера. Экземпляр свободен и стоит на полке весеннего цикла.",
  },
  {
    id: "prestuplenie-i-nakazanie",
    title: "Преступление и наказание",
    author: "Фёдор Достоевский",
    genre: "Роман",
    year: 1866,
    available: true,
    cover: "images/covers/prestuplenie-i-nakazanie.svg",
    description:
      "История Родиона Раскольникова для медленного чтения по частям. Экземпляр свободен, в нём закладки прошлых обсуждений.",
  },
  {
    id: "priklyucheniya-sherloka-holmsa",
    title: "Приключения Шерлока Холмса",
    author: "Артур Конан Дойл",
    genre: "Детектив",
    year: 1892,
    available: true,
    cover: "images/covers/priklyucheniya-sherloka-holmsa.svg",
    description:
      "Сборник рассказов для детективного цикла клуба. Экземпляр свободен и рассчитан на чтение по одному рассказу за встречу.",
  },
  {
    id: "solaris",
    title: "Солярис",
    author: "Станислав Лем",
    genre: "Фантастика",
    year: 1961,
    available: true,
    cover: "images/covers/solaris.svg",
    description:
      "Контакт с разумным океаном на далёкой станции. Клубный экземпляр на русском языке свободен.",
  },
  {
    id: "sapiens",
    title: "Sapiens. Краткая история человечества",
    author: "Юваль Ной Харари",
    genre: "Нон-фикшн",
    year: 2011,
    available: false,
    cover: "images/covers/sapiens.svg",
    description:
      "Обзор истории человека от древних обществ до современности. Экземпляр сейчас на руках у участника нон-фикшн группы.",
  },
];

export const books = Object.freeze(shelf.map((book) => Object.freeze(book)));

export function getBooks() {
  return books.map((book) => ({ ...book }));
}
