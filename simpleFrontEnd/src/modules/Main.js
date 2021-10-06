import React, { useState } from "react";
import axios from 'axios';

function Main() {

    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        const res = await axios.get(`http://localhost:8080/getUsers`);
        setUsers(res.data)
    }

    return (
        <div className="App">
            <header className="App-header">
                <h2>
                    This is a simple webpage
                </h2>
                <p>
                    Click this button to get user data:
                    <button onClick={getUsers}>button</button>
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
        </div>
    )
}

export { Main }