import React, { useState } from "react";
import axios from 'axios';

export default function UpdateForm() {

    const[successMessage, setSuccessMessage] = useState("");
    const [user, setUser] = useState({
        id: "",
        name: "",
        age: "",
        dateOfBirth: ""
    })

    function updateForm(event) {
        const name = event.target.name;
        const value = event.target.value;
        setUser({
            ...user,
            [name]: value
        });
    }

    async function updateUser(event) {
        event.preventDefault();
        await axios.put(`http://localhost:8080/users/${user.id}`, {
            name: user.name,
            age: parseInt(user.age),
            dateOfBirth: user.dateOfBirth
        });

        setUser({
            id: "",
            name: "",
            age: "",
            dateOfBirth: "",
        })
    }

    return (
        <form onSubmit={updateUser}>
            <input type="number" name="id" value={user.id} onChange={updateForm} placeholder="ID to update"/>
            <input type="text" name="name" value={user.name} onChange={updateForm} placeholder="Updated Name"/>
            <input type="number" name="age" value={user.age} onChange={updateForm} placeholder="Updated Age"/>
            <input type="text" name="dateOfBirth" value={user.dateOfBirth} onChange={updateForm} placeholder="Updated Date of Birth"/>
            <button type="submit">Update User</button>
        </form>
    )
}