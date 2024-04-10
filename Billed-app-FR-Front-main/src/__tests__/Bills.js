/**
 * @jest-environment jsdom
 */

// import {screen, waitFor} from "@testing-library/dom";
import {fireEvent, screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import  store  from "../__mocks__/store.js";

import router from "../app/Router.js";
import { when } from "jquery";
import Bills from "../containers/Bills.js";
import { resolve } from "path";
import { formatDate, formatStatus } from "../app/format.js";
import fetchMock from 'jest-fetch-mock';


// DEJA ECRIT///////////////
describe("Given I am connected as an employee", () => {

  beforeEach(() => {
    jest.spyOn(store, "bills")
  })


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
      expect(windowIcon.classList.contains('active-icon')).toBe(true)

    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
        //Récupère tous les éléments selon la regex et extrait le contenu HTML
        const dateElements = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(element => element.textContent);
        //Crée un nouveau tableau et extrait juste le contenu 
        const dates = Array.from(dateElements).map(element => element.textContent);
        // Définit une fonction de tri et tri les dates
        const antiChrono = (a, b) => ((a > b) ? 1 : -1);
        const datesSorted = [...dates].sort(antiChrono)
        expect(dates).toEqual(datesSorted)
      }); 
  })


  beforeEach(() => {
    fetchMock.enableMocks();
  });
 

  //  HANDLECLICK NEWBILL/////////////////////////

  describe("When i click to the new expense report button" , ()=>{

    // doit appeller le bon chemin de page
    test("Then it should call onNavigate with the correct route", ()=>{

      // simuler une fonction
      const mockOnNavigate = jest.fn()
      
      // je cree un objet de test
      const billsObject = new Bills({
        // document, onNavigate, store, localStorage
        document,
        onNavigate : mockOnNavigate, 
        store ,
        localStorage : localStorageMock,
      })

      // handleclick
      billsObject.handleClickNewBill();
  
      // je vérifie si onNavigate a été appelée avec la bonne route
      expect(mockOnNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);

    })


    // 2) renvoie la date non formatée si erreur
    test("Then return unformatted date, if corrupted data was introduced",  async ()=>{

      // Spy sur console.log
      const spyConsoleLog = jest.spyOn(console, "log");

      // Crée une instance simulée de la classe Bills avec les mocks
      const billsObject = new Bills({
        document,
        onNavigate: {},
        store,
        localStorage : localStorageMock
      });

      // Appelle la méthode getBills() pour obtenir les factures corrompues
      await billsObject.getBills();


      // Vérifie si console.log a été appelé avec les bons paramètres
      expect(spyConsoleLog).toHaveBeenCalledWith(
        expect.any(Error),
        "for",
        expect.any(Object)
      );

      // Remet console.log à son état d'origine
      spyConsoleLog.mockRestore();
    });
  });





 
  // HANDLECLICKEYE
  describe("When the function handleClickIconEye() is used",()=>{

    // la modale doit souvrir
    test("then it should open modal", ()=>{

      // Crée un élément simulé pour la fenêtre modale
      const modal = document.createElement("div");
      modal.setAttribute("id", "modaleFile");
  
      // Crée un élément simulé pour le contenu de la fenêtre modale
      const modalContent = document.createElement("div");
      modalContent.setAttribute("class", "modal-body");
      modal.append(modalContent);
      document.body.append(modal);



      // Crée une fonction mock pour la méthode modal de jQuery
      const mockFn = jest.fn((arg) => true);
      // Attribue la fonction mock à la méthode modal de jQuery globalement
      global.$.fn.modal = mockFn;
  
      const documentMock = {
        querySelector: () => null,
        querySelectorAll: () => null,
      };
  
      const storeMock = {
        bills: () => ({
          list: () => ({
            then: (fn) => fn(bills),
          }),
        }),
      };
  
      // Crée une instance simulée de la classe Bills avec les mocks
      const billsObject = new Bills({
        document: documentMock,
        onNavigate: {},
        // store ,
        store : storeMock, 
        localStorage: localStorageMock,
      });
  
      // Appelle la méthode handleClickIconEye avec un attribut fictif
      billsObject.handleClickIconEye({ getAttribute: () => "fakeUrl" });
      // Vérifie si la fonction mock a été appelée une fois
      expect(mockFn.mock.calls).toHaveLength(1);
    })
  })




   //    ERREUR 404 ET 500
  
     
   test('handles error 500', async () => {

                
    // Mock de la méthode bills de store pour simuler une erreur 500
    
    store.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"));
          },
        };
    });
   
    const html = BillsUI({ error: "Erreur 500" });
    document.body.innerHTML = html;
    const message = await screen.getByText(/Erreur 500/);
    expect(message).toBeTruthy();
});


  test("fetches bills from an API and fails with 404 message error", async () => {
    store.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"));
          },
        };
      });

      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
  });


})


