import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"
import { bills } from '../fixtures/bills.js'
// import { format } from 'path'


export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon))
    })
    new Logout({ document, localStorage, onNavigate })



    // Exemple d'utilisation :
    this.dates = "";
    this.formatDate = formatDate


  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url")
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
    $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
    $('#modaleFile').modal('show')
  }



  
  
  getBills = () => {
    if (this.store) {
      return this.store
      .bills()
      .list()
      .then(snapshot => {
        const bills = snapshot
          .map(doc => {
            console.log('Date before formatting:', doc.date);
            try {
              return {
                ...doc,
                date:  formatDate(doc.date),
                // .sort((a, b) => ((a.date > b.date) ? 1 : -1)),
                status: formatStatus(doc.status)
              }
            } catch(e) {
              // if for some reason, corrupted data was introduced, we manage here failing formatDate function
              // log the error and return unformatted date in that case
              console.log(e,'for',doc)
              return {
                ...doc,
                date: doc.date,
                status: formatStatus(doc.status)
              }
            }
          })
           // TICKET 2 / TRI FACTURES 
          // Trier les dates du plus lointain au plus proche
          // .sort((a, b) => (a.date > b.date ? 1 : -1));
          .sort((a, b) => (a.date > b.date ? 1 : -1));
            
          console.log('length',bills.length)
          console.log(bills)

          return bills
        })
      .catch(error => {
        console.error("Error fetching bills:", error)
        // Gérer l'erreur ici si nécessaire
        throw error; // Rejeter l'erreur pour la capturer à l'endroit où la fonction `getBills` est appelée
      })
    }
  }
}