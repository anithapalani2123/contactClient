import React,{useRef} from "react";
import ContactCard from "./ContactCard";
import {Link} from "react-router-dom";
const ContactList = (props) => {
    console.log(props)
    const inputEl=useRef("");
    const deleteContactHandler = (id)=>{
        props.getContactId(id);
    };
    const renderContactList=props.contacts.map((contact) =>{
        return(
            <ContactCard contact={contact} clickHandler={deleteContactHandler} key={contact.id}/>

        );
    });
    const getSearchTerm=()=>{
        props.searchKeyword(inputEl.current.value);
    };
    return(
        <div class="main" style={{margin: '50px 0 0 0'}}>
            <h2>Contact List
                <Link to="/add">
                <button className="ui button blue right" style={{margin: '0 0 0 10px'}}>Add contact</button>
                </Link>
            </h2>
            <div className="ui search">
                <div className="ui icon input">
                    <input ref={inputEl} type="text" placeholder="Search Contacts" className="prompt" value={props.term} onChange={getSearchTerm}/>
                    <i className="search icon"></i>
                </div>

            </div>
            <div className="ui celled list">{renderContactList.length>0 ?renderContactList : "No contact available"} </div>
        </div>
        
    );

}
export default ContactList;