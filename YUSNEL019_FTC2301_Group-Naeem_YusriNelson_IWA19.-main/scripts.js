import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

/**
 * @typedef {object} data - data attributes
 * @property {object} header - Header data attributes
 * @property {object} list - List data attributes
 * @property {object} search - Search data attributes
 * @property {object} settings - Settings data attributes
 */

/**
 * Data object containing various data attributes
 * @type {data}
 */
const data = {
    header: {
        search: document.querySelector("[data-header-search]"),
        settings: document.querySelector("[data-header-settings]"),
    },

    list: {
        items:document.querySelector("[data-list-items]"),
        message:document.querySelector("[data-list-message]"),
        button:document.querySelector("[data-list-button]"),
        active: document.querySelector("[data-list-active]"),
        blur: document.querySelector("[data-list-blur]"),
        image:document.querySelector("[data-list-image]"),
        title: document.querySelector("[data-list-title]"),
        subtitle: document.querySelector("[data-list-subtitle]"),
        description:document.querySelector("[data-list-description]"),
        close:document.querySelector("[data-list-close]"),
    },

    search: {
        overlay:document.querySelector("[data-search-overlay]"),
        form:document.querySelector("[data-search-form]"),
        title:document.querySelector("[data-search-title]"),
        genres: document.querySelector("[data-search-genres]"),
        authors: document.querySelector("[data-search-authors]"),
        cancel: document.querySelector("[data-search-cancel]"),

    },

    settings: {
        overlay: document.querySelector("[data-settings-overlay]"),
        form:document.querySelector("[data-settings-form]"),
        theme:document.querySelector("[data-settings-theme]"),
        cancel: document.querySelector("[data-settings-cancel]"),
    }
}

const range = [0, BOOKS_PER_PAGE];
let matches = books;
let page = 1;

/**css object has with 2 properties for night and day theme*/
const css = {
    day: ["255, 255, 255", "10, 10, 20"],
    night: ["10, 10, 20", "255, 255, 255"],
};
/**dataSettingsTheme switches between night and day */
data.settings.theme.value = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "night": "day";

//**this is a submit event listener. after the user submits either night or day the theme will correspond to css object with properties night/day */
function changeThemes(event, data) {
    event.preventDefault();
    const formSubmit = new FormData(event.target);
    const option = Object.fromEntries(formSubmit);

    function setThemeColors(theme, css) {
        document.documentElement.style.setProperty("--color-light", css[theme][0]);
        document.documentElement.style.setProperty("--color-dark", css[theme][1]);
      }
      
      if (option.theme === "night") {
        setThemeColors(option.theme, css);
      } else {
        setThemeColors(option.theme, css);
      }

    data.settings.overlay.close();
};

data.settings.form.addEventListener("submit", (event) => {
    changeThemes(event, data, )
});

data.settings.cancel.addEventListener("click", () => {
    //"cancel" clicked closes settingbar
    data.settings.overlay.close();
});

data.header.settings.addEventListener("click", () => {
    data.settings.overlay.showModal();
});

/*----------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * for loop below creates a list of books showing only 36 previews at a time.
 */
const fragment = document.createDocumentFragment();
const extracted = books.slice(0, 36);

for (let i = 0; i < extracted.length; i++) {
    const { author: authorId, id, image, title } = extracted[i];

    const extractedBooks = document.createElement("button"); //creates a button for button effect
    extractedBooks.classList = "preview";
    extractedBooks.setAttribute("data-preview", id);

    extractedBooks.innerHTML = /* html */ `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[authorId]}</div>
        </div>
    `;

    fragment.appendChild(extractedBooks);
}
data.list.items.appendChild(fragment);
  
  
/*----------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * create a dropdown list of the genres options
 */
const bookGenre = document.createDocumentFragment();
const theGenres = document.createElement("option");
theGenres.value = "any";
theGenres.textContent = "All Genres";
bookGenre.appendChild(theGenres);

const genreArray = Object.entries(genres);
for (let i = 0; i < genreArray.length; i++) {
    const [id, name] = genreArray[i];
    const genreOp = document.createElement("option");
    genreOp.value = id;
    genreOp.textContent = name;
    bookGenre.appendChild(genreOp);
}
data.search.genres.appendChild(bookGenre);

/**
 * creates a dropdown list of the author names options
 */
const bookAuthors = document.createDocumentFragment();
const theAuthors = document.createElement("option");
theAuthors.value = "any";
theAuthors.innerText = "All Authors";
bookAuthors.appendChild(theAuthors);

const authorArray = Object.entries(authors);
for (let i = 0; i < authorArray.length; i++) {
    const [id, name] = authorArray[i];
    const authOp = document.createElement("option");
    authOp.value = id;
    authOp.textContent = name;
    bookAuthors.appendChild(authOp);
}
data.search.authors.appendChild(bookAuthors);

/**---------------------------------------------------------------------------------------------------------------------------------------------- */

//close list items preview
data.list.close.addEventListener("click", () => {
    data.list.active.close();
});

/**
 * this click event listener allows a user to click on a book 
 * where active is a nullish value which returns books with an image and full description
 */
function bookPreview(event, data, books, authors) {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    for (let i = 0; i < pathArray.length; i++) {
        const node = pathArray[i];
        if (active) {
            break;
        }
        const previewId = node?.dataset?.preview;

        for (let i = 0; i < books.length; i++) {
            const singleBook = books[i];
            if (singleBook.id === previewId) {
                active = singleBook;
                break;
            }
        }
    }

    if (!active) {
        return;
    }

    data.list.active.open = true;
    data.list.blur.src = active.image;
    data.list.image.src = active.image;
    data.list.title.textContent = active.title;

    data.list.subtitle.textContent = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
    data.list.description.textContent = active.description;
};

data.list.items.addEventListener("click", (event) => {
    bookPreview(event, data, books, authors)
})
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
//more books

if (!books && !Array.isArray(books)) {
    throw new Error("Source required");
}
if (!range && range.length < 2) {
    throw new Error("Range must be an array with two numbers");
}

data.list.button.innerHTML =
    /* html */
    `<span> Show more books </span>
    <span class="list__remaining"> (${matches.length - page * BOOKS_PER_PAGE > 0 ? matches.length - page * BOOKS_PER_PAGE : 0})</span>`;

    data.list.button.addEventListener("click", () => {
    const start = page * BOOKS_PER_PAGE
    const end = start + (BOOKS_PER_PAGE)
    const newBook = books.slice(start, end)
    const newBookFragment = document.createDocumentFragment();                   //contains all the book previews which is appended to a container element in the DOM
    /** creates a preview of the book by calling the function createPreview()
     * 
    */
    for (let i = 0; i < newBook.length; i++) {
        const morebooks = newBook[i];
        const showPreview = createPreview(morebooks);
        newBookFragment.appendChild(showPreview);
    }
    data.list.items.appendChild(newBookFragment);

    const remaining = matches.length - page * BOOKS_PER_PAGE;
    data.list.button.innerHTML = /* HTML */ `
      <span>Show more</span>
      <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
    `;
    data.list.button.disabled = remaining <= 0;
    page =  page + 1;
});



function createPreview(preview) {
    const { author: authorId, id, image, title } = preview;
    
    const morebooks = document.createElement("button");
    morebooks.classList = "preview";
    morebooks.setAttribute("data-preview", id);

    morebooks.innerHTML = /* html */ `
              <img
                  class="preview__image"
                  src="${image}"
              />
              <div class="preview__info">
                  <h3 class="preview__title">${title}</h3>
                  <div class="preview__author">${authors[authorId]}</div>
              </div>
          `;
    return morebooks;
}


/**---------------------------------------------------------------------------------------------------------------------------------------------------------- */

data.header.search.addEventListener("click", () => {
    //opens searchbar and focuses on title
    data.search.title.focus();
    data.search.overlay.showModal();
});

data.search.cancel.addEventListener("click", () => {
    //"cancel" clicked closes searchbar
    data.search.overlay.close();
});

data.search.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];
    const booksList = books;

    for (let i = 0; i < booksList.length; i++) {
        const book = booksList[i];
        let titleMatch =
            filters.title.trim() !== "" && book.title.toLowerCase().includes(filters.title.toLowerCase());
        let authorMatch =
            filters.author !== "any" && book.author.includes(filters.author);
        let genreMatch =
            filters.genre !== "any" && book.genres.includes(filters.genre);

        if (titleMatch || authorMatch || genreMatch) {
            result.push(book);
        }
    }

    if (result.length > 0) {
        data.list.message.classList.remove("list__message_show");
        data.list.button.disabled = true
        data.list.items.innerHTML = ""
        const searchBook = document.createDocumentFragment();
        /**creates and displays the book preview of books that matches the filters in the result array */
        for (let i = 0; i < result.length; i++) {
            const book = result[i];
            const bookPreview = createPreview(book);
            searchBook.appendChild(bookPreview);
        }
        data.list.items.appendChild(searchBook);
    } else {
        data.list.message.classList.add("list__message_show");
        data.list.button.disabled = true
        data.list.items.innerHTML = "";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    data.search.overlay.close();
    data.search.form.reset();
});

/////////////////////////////////////////////////////////////