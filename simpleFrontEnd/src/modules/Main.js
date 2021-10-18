import React, { useState } from "react";
import axios from 'axios';
import UpdateForm from './UpdateForm';

function Main() {

    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [deleteID, setDeleteID] = useState('');
    const [foundUser, setFoundUser] = useState(null)
    const [error, setError] = useState('')
    const [newUser, setNewUser] = useState({
        name: "",
        age: "",
        dateOfBirth: "",
    });

    const getUsers = async () => {
        const res = await axios.get(`http://localhost:8080/getUsers`);
        setUsers(res.data)
    }

    const deleteUser = async (event) => {
        event.preventDefault();
        await axios.delete(`http://localhost:8080/users/${deleteID}`);
        setDeleteID('');
    }

    const findUserById = async (event) => {
        event.preventDefault();
        setError('')
        setFoundUser('')

        try {
            const response = await axios.get(`http://localhost:8080/users/${userId}`)
            setFoundUser(response.data)
        } catch(error) {
            setError(error.response.data.message)
        }
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
            <form onSubmit={findUserById}>
                <input type="number" name="id" placeholder="User ID" value={userId} onChange={event => setUserId(event.target.value)}/>
                <button type="submit">Find user</button>
            </form>
            {foundUser && (
                <div>
                    <p>Name: {foundUser.name}</p>
                    <p>Age: {foundUser.age}</p>
                    <p>Date of birth: {foundUser.dateOfBirth}</p>
                </div>
            )}
            {error && (
                <p>{error}</p>
            )}
            <UpdateForm />
            <form onSubmit={deleteUser}>
                <input type="number" name="id" placeholder="User ID to delete" value={deleteID} onChange={event => setDeleteID(event.target.value)}/>
                <button type="submit">Delete user</button>
            </form>
        </div>
    )
}

export { Main }