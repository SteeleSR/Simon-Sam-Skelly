package com.kata.SimpleWebservice;

import org.junit.jupiter.api.Test;

import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static java.util.Arrays.asList;
import static java.util.Optional.of;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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

        given(userRepository.findAll()).willReturn(List.of(user));

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
        User user = new User();
        user.setId(2);

        given(userRepository.save(any(User.class))).willReturn(user);
        this.mockMvc.perform(post("/createUser")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Jane Doe\",\"age\":35,\"dateOfBirth\":\"1986-04-01\"}"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);

        verify(userRepository).save(captor.capture());
        assertEquals("Jane Doe", captor.getValue().getName());
    }

    @Test
    void return_a_user_by_id() throws Exception {
        // given
        User requestedUser = new User("Fulanito", 26, "1970-12-31");
        long id = 1L;
        given(userRepository.findById(id)).willReturn(of(requestedUser));

        // then
        this.mockMvc.perform(get("/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"name\":\"Fulanito\",\"age\":26,\"dateOfBirth\":\"1970-12-31\"}"));
    }

    @Test
    void return_404_if_no_user_found() throws Exception {
        Optional<User> notAUser = Optional.empty();
        long id = 5L;
        given(userRepository.findById(id)).willReturn(notAUser);

        this.mockMvc.perform(get("/users/5"))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_user_by_id() throws Exception {
        long id = 10;

        this.mockMvc.perform(delete("/users/10"))
                .andExpect(status().isNoContent());

        verify(userRepository).deleteById(id);
    }

    @Test
    void update_user_by_id() throws Exception {
        User user = new User("Bob Geldof", 70, "1950-12-31");
        long id = 5L;

        given(userRepository.findById(id)).willReturn(of(user));
        given(userRepository.save(user)).willReturn(user);

        this.mockMvc.perform(put("/users/5")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Robert Geldof\",\"age\":50,\"dateOfBirth\":\"1970-12-31\"}"))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"name\":\"Robert Geldof\",\"age\":50,\"dateOfBirth\":\"1970-12-31\"}"));

    }
}