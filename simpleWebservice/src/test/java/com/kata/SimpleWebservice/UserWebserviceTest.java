package com.kata.SimpleWebservice;

import org.junit.jupiter.api.Test;

import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static java.util.Arrays.asList;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserWebservice.class)
public class UserWebserviceTest {

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void defaultWebserviceEndpointShouldReturnGenericMessage() throws Exception {
        User user = new User("John Doe", 26, "1970-12-31");

        given(userRepository.findAll()).willReturn(asList(user));

        this.mockMvc.perform(get("/getUsers"))
                .andExpect(status().isOk())
                .andExpect(content().json("[{\"name\":\"John Doe\",\"age\":26,\"dateOfBirth\":\"1970-12-31\"}]"));
    }

    @Test
    public void respondWithCreatedUserId() throws Exception {
        User user = new User();
        user.setId(2);
        given(userRepository.save(any(User.class))).willReturn(user);

        this.mockMvc.perform(post("/createUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Jane Doe\",\"age\":35,\"dateOfBirth\":\"1986-04-01\"}"))
                .andExpect(status().isCreated())
                .andExpect(content().json("{\"id\": 2}"));
    }

    @Test
    void savedParsedUserInCreateRequest() throws Exception {
        this.mockMvc.perform(post("/createUser")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Jane Doe\",\"age\":35,\"dateOfBirth\":\"1986-04-01\"}"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);

        verify(userRepository).save(captor.capture());
        assertEquals("Jane Doe", captor.getValue().getName());
    }
}