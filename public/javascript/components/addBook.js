import { html, render } from 'uhtml';
import menu from '../extensions/menu';
import { getApp } from 'firebase/app';
import { getFirestore, query, collection, setDoc, where, getDocs, getDoc, doc, addDoc } from 'firebase/firestore';

export default {
  path: '/add-book',
  label: 'Add Book',
  callback(update) {
    console.log("thelog window.location", window.location)
    console.log("thelog window.history", window.history)

    const URLSearchParam = new URLSearchParams(window.location.search)
    const defaultData = {
      id: URLSearchParam.get('id'),
      title: URLSearchParam.get('title'),
      author: URLSearchParam.get('author'),
      isbn: URLSearchParam.get('isbn'),
    }

    console.log('thelog URLSearchParam', defaultData)

    async function add (e) {
      e.preventDefault()
      const inputAsFormData = new FormData(e.target)
      const inputAsObject = Object.fromEntries(inputAsFormData) 
      console.log('thelog inputAsObject', inputAsObject)

      const currentAuthor = defaultData.author || inputAsObject.author
      const currentTitle = defaultData.title || inputAsObject.title

      try {
        const database = getFirestore(getApp());

        const bookRef = collection(database, 'books')
        const queryFindBook = query(bookRef,
          where("author", "==", currentAuthor),
          where("title", "==", currentTitle)
        )
        // Need a better way to get only one doc
        const foundBook = await getDocs(queryFindBook)
        console.log("thelog foundBook", foundBook)

        if (foundBook.docs.length > 0) {
          const foundDoc = foundBook.docs[0]
          await setDoc(doc(database, 'books', foundDoc.id), inputAsObject) 
        } else {
          await addDoc(bookRef, inputAsObject)
        }

        // Navigate to books after creation
        update('/books')
      } catch (error) {
        console.log('thelog error', error)
      }
    }

    render(document.querySelector('.container'), html`
      ${ menu(update) }
      <h1>Add/Update Book</h1>
      <form onSubmit="${add}" class="formElement">
        <div class="form-item">
            <label for="author">Author</label>
            <input value="${defaultData.author || undefined}" name="author" required />
        </div>
        <div class="form-item">
            <label for="title">Title</label>
            <input value="${defaultData.title || undefined}" name="title" required />
        </div>
        <div class="form-item">
            <label for="isbn">ISBN</label>
            <input value="${defaultData.isbn || undefined}" name="isbn" required />
        </div>
        <div class="form-item">
            <span />
            <div>
              <button type="reset">Reset</button>
              <button type="submit">${defaultData.id ? 'Update' : 'Add'}</button>
            </div>
        </div>
      </form?
    `);
  }
};