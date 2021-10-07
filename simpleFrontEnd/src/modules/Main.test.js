import { Main } from './Main'
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as axios from 'axios';
import { act } from 'react-dom/test-utils';

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

    const inputText = (placeholderName, value) => userEvent.type(screen.getByPlaceholderText(placeholderName), value) 
});