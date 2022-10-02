import { html, render } from 'uhtml';
import menu from '../extensions/menu';
import { getApp } from 'firebase/app';
import { getFirestore, addDoc, collection, getDocsFromServer, query } from 'firebase/firestore'
import { getFunctions, httpsCallable } from "firebase/functions"

export default {
  path: '/convert',
  label: 'Convert',
  callback: async (update) => {

    const database = getFirestore(getApp());
    const linksRef = collection(database, 'links')
    const functions = getFunctions(getApp())
    const convertISBNNumberToURL = httpsCallable(functions, 'convertISBNNumberToURL')

    const links = await getDocsFromServer(query(linksRef));
    let content = null
    if (!links.empty) {
      content = html`
        <ul>
          ${
            links.docs.map(item => html.for(item)`
              <li>
                <a href="${item.data().link}">${item.data().isbn} (${item.data().imgSize})</a>
              </li>
            `)
          }
        </ul>
      `;
    }

    const convert = async (e) => {
      e.preventDefault()
      try {

        const inputAsFormData = new FormData(e.target)
        const inputAsObject = Object.fromEntries(inputAsFormData) 
        const convertRes = await convertISBNNumberToURL(inputAsObject)
        console.log('thelog convertRes', convertRes)

        const addRes = await addDoc(linksRef, convertRes.data)
        console.log('thelog addRes', addRes)

        window.location.reload()
      } catch (error) {
        // to do: to handle fail convert
        console.log('thelog error convert', error)
      }
    }

    render(document.querySelector('.container'), html`
      ${ menu(update) }
      <h1>Convert ISBN to URL</h1>
      <form onsubmit="${convert}">
          <label for="isbn">ISBN</label>
          <input name="isbn" required />
          <select placeholder="Select size" name="imgSize" style="width: 100px; display: inline">
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </select>
          <button type="submit">Convert and Add</button>
      </form>
      <br />
      <h2>Links</h2>
      ${content}
    `);
  }
};