import React,{useState,useEffect}from "react";
import {BrowserRouter as Router,Switch,Route} from "react-router-dom"
import uuid from 'uuidv4';
import './App.css';
import Header from "./Header";
import AddContact from "./AddContact";
import ContactList from "./ContactList";
import ContactDetail  from "./ContactDetail";
import api from '../api/contacts';
import EditContact from "./EditContact";

function App() {
  const LOCAL_STORAGE_KEY="contacts";
  const [contacts,setContacts]=useState([]);
  const[searchTerm,setSearchTerm]=useState("");
  const[searchResults,setSearchResults]=useState([]);

  const retriveContacts=async()=>{
    const response= await api.get("/contacts");
    return response.data;
  };
  


  const addContactHandler= async (contact) =>{
    console.log(contact);
    const request={
      id: uuid(),
      ...contact
    }
    const response=await api.post("/contacts",request)
    setContacts([...contacts, response.data]);
    window.location.reload();
  };


  const updateContactHandler = async (contact) => {
    const response=await api.put(`/contacts/${contact.id}`,contact)
    const {id,name,email}=response.data;
    setContacts(
      contacts.map((contact) => {
        return contact.id===id ? {...response.data} : contact;
      })
    );
    window.location.reload();

  };

  const removeContactHandler=async (id) => {
    await api.delete(`/contacts/${id}`);
    const newContactList=contacts.filter((contact)=>{
      return contact.id !== id;
    });
    setContacts(newContactList);
    window.location.reload();
  };
  const searchHandler=(searchTerm)=>{
    setSearchTerm(searchTerm);
    if(searchTerm!==""){
      const newContactList=contacts.filter((contact)=>{
        return Object.values(contact).join(" ").toLowerCase().includes(searchTerm.toLowerCase());
      });
      setSearchResults(newContactList);
    }else{
      setSearchResults(contacts);
    }
  };


  useEffect( ()=>{
    // const retriveContacts=JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    // if(retriveContacts) setContacts(retriveContacts);
    const getAllContacts= async ()=> {
      const allContacts = await retriveContacts();
      if (allContacts) setContacts(allContacts);
    };

    getAllContacts();
  },[]);

  

  return (
    <div className="ui container">
      <Router>
        <Header />
        <Switch>
            <Route
              path="/"
              exact
              render={(props) => (
                <ContactList
                  {...props}
                  contacts={searchTerm.length<1 ? contacts: searchResults} 
                  getContactId={removeContactHandler}
                  term={searchTerm}
                  searchKeyword={searchHandler}
                />
              )}
            />
            <Route
              path="/add"
              render={(props)=>(
                <AddContact {...props} addContactHandler={addContactHandler}/>
              )}
            />
            <Route
              path="/edit"
              render={(props)=>(
                <EditContact {...props} updateContactHandler={updateContactHandler}/>
              )}
            />
            <Route path="/contact/:id" component={ContactDetail} />
        </Switch>
        
      </Router>
      
    </div>
  );
}
export default App;

