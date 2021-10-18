    import { Main } from './Main'
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as axios from 'axios';
import { act } from 'react-dom/test-utils';
import { when } from 'jest-when'

jest.mock('axios');

const renderPage = async () => render(<Main />);
const mockUsers = [
    {
        name: 'John Doe',
        age: 26,
        dateOfBirth: '1970-12-31'
    },
    {
        name: 'Jordan Doe',
        age: 35,
        dateOfBirth: '2021-01-01'
    }
];

const mockFetchUsers = results => {
    axios.get.mockImplementation(() => Promise.resolve({
        data: results
    }));
}

describe('Main', () => {

    it('displays welcome text and a button on the page', async () => {
        await renderPage()
        const button = screen.getByText('Get Users', { selector: 'button' });

        expect(screen.getByText('This is a simple webpage')).toBeInTheDocument();
        expect(screen.getByText('Click this button to get user data:')).toBeInTheDocument();
        expect(button).toBeInTheDocument(); 
    });

    it('shows user information on the page when we click the get users button', async () => {
        mockFetchUsers(mockUsers);
        const expectedTextFromAPI = [
            ['Name: Jordan Doe', 'Age: 35', 'Date of birth: 2021-01-01'],
            ['Name: John Doe', 'Age: 26', 'Date of birth: 1970-12-31']
        ];

        await act(async () => {
            await renderPage();
        });

        await act(async () => {
            userEvent.click(screen.getByText('Get Users', { selector: 'button' }));
        });

        expectedTextFromAPI.forEach(user => {
            user.forEach(content => {
                expect(screen.getByText(content)).toBeInTheDocument();
            })
        });
    });

    it('perform create user request when create user button clicked', async() => {
        await act(async () => {
            await renderPage();
        });
        inputText('Name', 'Jane Doe');
        inputText('Age', '35');
        inputText('Date of Birth', '2021-01-01');

        await act(async () => {
            userEvent.click(screen.getByText('Create User', { selector: 'button' }));
        });

        expect(axios.post).toBeCalledWith('http://localhost:8080/createUser', {name: 'Jane Doe', age: 35, dateOfBirth: '2021-01-01'});
    });

    it('perform update user request when update user button is clicked', async() => {
        await act(async () => {
            await renderPage();
        });

        inputText('ID to update', '5');
        inputText('Updated Name', 'Updated Name');
        inputText('Updated Age', '52');
        inputText('Updated Date of Birth', '1958-10-09');

        await act(async () => {
            userEvent.click(screen.getByText('Update User', { selector: 'button' }));
        });

        expect(axios.put).toBeCalledWith('http://localhost:8080/users/5', {name: 'Updated Name', age: 52, dateOfBirth: '1958-10-09'});
        // expect(screen.getByText("User successfully updated.")).toBeInTheDocument();
    });

    it('get user by ID when find user button', async () => {
        await act(async () => {
            await renderPage();
        });

        inputText('User ID', '1');

        await act(async () => {
            userEvent.click(screen.getByText('Find user', { selector: 'button'}));
        });

        expect(axios.get).toBeCalledWith('http://localhost:8080/users/1');
})

    it('display the requested user data if found', async () => {
        await act(async () => {
            await renderPage();
        });

        when(axios.get).calledWith('http://localhost:8080/users/1').mockReturnValue({ data: {
                name: "Fulanito",
                age: 73,
                dateOfBirth: "1955-01-01"
            }
        })

        inputText('User ID', '1');

        await act(async () => {
            userEvent.click(screen.getByText('Find user', { selector: 'button'}));
        });

        expect(screen.getByText('Name: Fulanito')).toBeInTheDocument();
        expect(screen.getByText('Age: 73')).toBeInTheDocument();
        expect(screen.getByText('Date of birth: 1955-01-01')).toBeInTheDocument();
    })

    it('not display anything id no user found', async () => {
        await act(async () => {
            await renderPage();
        });

        when(axios.get).calledWith('http://localhost:8080/users/1').mockReturnValue({ data: null })

        inputText('User ID', '1');

        await act(async () => {
            userEvent.click(screen.getByText('Find user', { selector: 'button'}));
        });

        expect(screen.queryByText('Name:')).toBeNull()
        expect(screen.queryByText('Age:')).toBeNull()
        expect(screen.queryByText('Date of birth:')).toBeNull()
    })

    it('display a not found message when not found user', async () => {
        await act(async () => {
            await renderPage();
        });

        when(axios.get).calledWith('http://localhost:8080/users/1').mockRejectedValue({
            response: {
                data: {
                    message: 'User with ID 1 not found'
                }
            }
        })

        inputText('User ID', '1');

        await act(async () => {
            userEvent.click(screen.getByText('Find user', { selector: 'button'}));
        });

        expect(screen.queryByText('User with ID 1 not found')).toBeInTheDocument()
    })

    it('delete a requested user by ID', async () => {
        await act(async () => {
            await renderPage();
        });

        inputText('User ID to delete', '6');

        await act(async () => {
            userEvent.click(screen.getByText('Delete user', { selector: 'button'}));
        });

        expect(axios.delete).toBeCalledWith('http://localhost:8080/users/6');
    })

    const inputText = (placeholderName, value) => userEvent.type(screen.getByPlaceholderText(placeholderName), value);
});