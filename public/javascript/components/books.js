import { html, render } from 'uhtml';
import menu from '../extensions/menu';
import { getApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocsFromServer, query, deleteDoc } from 'firebase/firestore';

export default {
  path: '/books',
  label: 'Books',
  callback: async (update) => {
    let content = html`<p>There are no books available</p>`;
    try {
      const database = getFirestore(getApp());
      console.log('thelog database', database)
      const books = await getDocsFromServer(query(collection(database, 'books')));
      console.log('thelog books', books)

      function thumbnail(item) {
        const { isbn } = item.data();
        if (isbn) {
          const url = `https://covers.openlibrary.org/b/isbn/${ item.data().isbn }-S.jpg`;
          return html`<img src="${ url }" />`;
        }
        return '';
      }

      async function deleteBook (id) {
        await deleteDoc(doc(database, 'books', id))
        window.location.reload()
      }

      function editBook (editedBook) {
        console.log('thelog editedBook', editedBook)
        const { title, author, isbn } = editedBook.data()
        update(`/add-book?id=${editedBook.id}&title=${title}&author=${author}&isbn=${isbn}`)
      }

      if (!books.empty) {
        content = html`<ul class="booksContainer">
          ${ books.docs.map(item => html.for(item)`
            <div style="display:flex;">
              <div style="width: 47px">
                ${ thumbnail(item) }
              </div>
              <div>
                ${ console.log('thelog books',item.data())}
                <h1>${ item.data().title }</h1>
                <p>${ item.data().author }</p>
                <button onclick="${() => deleteBook(item.id)}">delete</button>
                <button onclick="${() => editBook(item)}">edit</button>
              </div>
            </div>
          `) }
        </ul>`;
      }
    } catch (error) {
      console.log('thelog error', error)
      content = html`<p>We found an error. Please contact the administrator.</p>`;
    }

    render(document.querySelector('.container'), html`
      ${ menu(update) }
      <h1>Books</h1>
      ${ content }
    `);
  }
};