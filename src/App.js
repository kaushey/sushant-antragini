import React, { useState } from 'react';
import './index.css';

function ContactListApp() {
    const [contacts, setContacts] = useState([]);
    const [newContactName, setNewContactName] = useState('');
    const [newContactEmail, setNewContactEmail] = useState('');
    const [newContactNumber, setNewContactNumber] = useState('');
    const [newContactImage, setNewContactImage] = useState(null);
    const [emailError, setEmailError] = useState('');
    const [editingContactId, setEditingContactId] = useState(null);

    const handleNameChange = (event) => {
        setNewContactName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setNewContactEmail(event.target.value);
        if (!validateEmail(event.target.value)) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
        }
    };

    const handleNumberChange = (event) => {
        setNewContactNumber(event.target.value);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setNewContactImage(file);
    };

    const validateEmail = (email) => {
        // Basic email validation regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const addContact = (event) => {
        event.preventDefault();
        if (editingContactId !== null) {
            // Update existing contact
            const updatedContacts = contacts.map(contact => {
                if (contact.id === editingContactId) {
                    return {
                        ...contact,
                        name: newContactName,
                        email: newContactEmail,
                        number: newContactNumber,
                        image: newContactImage ? URL.createObjectURL(newContactImage) : contact.image
                    };
                }
                return contact;
            });
            setContacts(updatedContacts);
            setEditingContactId(null);
        } else {
            // Add new contact
            if (newContactName.trim() === '' || newContactEmail.trim() === '' || !validateEmail(newContactEmail) || newContactNumber.trim() === '') {
                return;
            }
            const newContact = {
                id: contacts.length + 1,
                name: newContactName,
                email: newContactEmail,
                number: newContactNumber,
                image: newContactImage ? URL.createObjectURL(newContactImage) : 'placeholder.png'
            };
            setContacts([...contacts, newContact]);
        }
        setNewContactName('');
        setNewContactEmail('');
        setNewContactNumber('');
        setNewContactImage(null);
    };

    const editContact = (id) => {
        const contactToEdit = contacts.find(contact => contact.id === id);
        if (contactToEdit) {
            setNewContactName(contactToEdit.name);
            setNewContactEmail(contactToEdit.email);
            setNewContactNumber(contactToEdit.number);
            setNewContactImage(null); // Clear image on edit (can be changed if you want to keep the existing image)
            setEditingContactId(id);
        }
    };

    const cancelEdit = () => {
        setEditingContactId(null);
        setNewContactName('');
        setNewContactEmail('');
        setNewContactNumber('');
        setNewContactImage(null);
    };

    const removeContact = (id) => {
        const updatedContacts = contacts.filter(contact => contact.id !== id);
        setContacts(updatedContacts);
    };

    return (
        <div className="container">
            <h1>Contact List</h1>
            <form onSubmit={addContact}>
                <div className="input-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={newContactName}
                        onChange={handleNameChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="text"
                        value={newContactEmail}
                        onChange={handleEmailChange}
                        required
                    />
                    {emailError && <span className="error">{emailError}</span>}
                </div>
                <div className="input-group">
                    <label>Contact Number:</label>
                    <input
                        type="number"
                        value={newContactNumber}
                        onChange={handleNumberChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Choose Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="input-group">
                    <input type="submit" className="button" value={editingContactId !== null ? 'Update Contact' : 'Add Contact'} />
                    {editingContactId !== null &&
                        <button type="button" className="button button-secondary" onClick={cancelEdit}>Cancel</button>
                    }
                </div>
            </form>
            
            {/* Saved Contacts Container */}
            <div className="saved-contacts-container">
                <h2>Saved Contacts</h2>
                <div className="saved-contacts">
                    {contacts.map(contact => (
                        <div key={contact.id} className="saved-contact-card">
                            <img 
                                src={contact.image ? contact.image : 'placeholder.png'} 
                                alt={contact.name} 
                                className="contact-image"
                            />
                            <div className="contact-details">
                                <strong>{contact.name}</strong>
                                <span>Email: {contact.email}</span>
                                <span>Phone: {contact.number}</span>
                            </div>
                            <div className="contact-actions">
                                <button className="button" onClick={() => editContact(contact.id)}>Edit</button>
                                <button className="button" onClick={() => removeContact(contact.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ContactListApp;
