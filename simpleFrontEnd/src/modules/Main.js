import React, { useState } from "react";
import axios from 'axios';

function Main() {

    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        name: "",
        age: "",
        dateOfBirth: "",
    });

    const getUsers = async () => {
        const res = await axios.get(`http://localhost:8080/getUsers`);
        setUsers(res.data)
    }

    async function createUser(event) {
        event.preventDefault();
        await axios.post('http://localhost:8080/createUser', {
            ...newUser,
            age: parseInt(newUser.age),
        });

        setNewUser({
            name: "",
            age: "",
            dateOfBirth: "", 
        })
    }

    function updateForm(event) {
        const name = event.target.name;
        const value = event.target.value;
        setNewUser({
            ...newUser,
            [name]: value    
        });
    }

    return (
        <div className="App">
            <header className="App-header">
                <h2>
                    This is a simple webpage
                </h2>
                <p>
                    Click this button to get user data:
                    <button onClick={getUsers}>Get Users</button>
                </p>
                {users.map(user => (
                    <>
                        <ul>
                            <li>Name: {user.name}</li>
                            <li>Age: {user.age}</li>
                            <li>Date of birth: {user.dateOfBirth}</li>
                        </ul>
                    </>
                ))}
            </header>
            <form onSubmit={createUser}>
                    <input type="text" name="name" value={newUser.name} onChange={updateForm} placeholder="Name"/>
                    <input type="number" name="age" value={newUser.age} onChange={updateForm} placeholder="Age"/>
                    <input type="text" name="dateOfBirth" value={newUser.dateOfBirth} onChange={updateForm} placeholder="Date of Birth"/>
                    <button type="submit">Create User</button>
            </form>
        </div>
    )
}

export { Main }