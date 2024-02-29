/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import { when } from "jquery";
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression

    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      console.log(dates)
      const antiChrono = (a, b) => ( (new Date(a) < new Date(b) ) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      console.log(datesSorted)
      expect(dates).toEqual(datesSorted)
    })
  })


// //  HANDLECLICK NEWBILL
//   describe("When i click to the new expense report button" , ()=>{

//     // doit appeller le bon chemin de page
//     test("Then it should call onNavigate with the correct route", ()=>{

//       // simuler une fonction
//       const mockOnNavigate = jest.fn()

      
//       // je cree un objet de test
//       const billsObject = new Bills({

//         // document, onNavigate, store, localStorage
//         document,
//         onNavigate : mockOnNavigate, 
//         store :{}, 
//         localStorage : {}
//       })

//       // handleclick
//       billsObject.handleClickNewBill();
  
//       // je vérifie si onNavigate a été appelée avec la bonne route
//       expect(mockOnNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);

//     })



//     // 2) renvoie la date non formatée si erreur
//     test("Then return unformatted date, if corrupted data was introduced", ()=>{

//       // creation de données corrompues
//       const corruptedBills = [{
//         "status": "refused",
//         "date": "unformatted date"
//       }];


//       // importer fichier mock
//       // Crée un objet storeMock  qui retourne les factures corrompues
//       const storeMock = {
//         bills: () => {
//           return {
//             // simule la récupération des factures à partir du storemock
//             list: () => {
//               return {
//                 then: (fn) => fn(corruptedBills),
//               };
//             },
//           };
//         },
//       };

//       // Crée une instance simulée de la classe Bills avec les mocks
//       const billsObject = new Bills({
//         document,
//         onNavigate: {},
//         store: storeMock,
//         localStorage: {},
//       });


//       // Appelle la méthode getBills() pour obtenir les factures corrompues
//       const testBillsError = billsObject.getBills();

//       // Définit les données de factures attendues
//       const expectedBillsError = [{ status: 'Refused', date: 'unformatted date' }];
      
//       // Vérifie si les factures obtenues correspondent aux données attendues
//       expect(testBillsError).toEqual(expectedBillsError);


//     });
//   })


//   // HANDLECLICKEYE
//   describe("When the function handleClickIconEye() is used",()=>{

//     // la modale doit souvrir
//     test("then it should open modal", ()=>{

//       // Crée un élément simulé pour la fenêtre modale
//       const modal = document.createElement("div");
//       modal.setAttribute("id", "modaleFile");
  
//       // Crée un élément simulé pour le contenu de la fenêtre modale
//       const modalContent = document.createElement("div");
//       modalContent.setAttribute("class", "modal-body");
//       modal.append(modalContent);
//       document.body.append(modal);


//       // A CONTINUERRRRR
//     })
//   })


})
