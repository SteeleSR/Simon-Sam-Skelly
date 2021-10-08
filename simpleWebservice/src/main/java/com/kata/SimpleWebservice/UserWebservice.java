package com.kata.SimpleWebservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static java.lang.String.format;

@RestController
public class UserWebservice {

    @Autowired
    private UserRepository userRepository;

    @RequestMapping("/getUsers")
    @ResponseBody
    public List<User> getUsersFromDatabase() {
        return (List<User>) userRepository.findAll();
    }

    @PostMapping(value = "/createUser", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ResponseStatus(HttpStatus.CREATED)
    public Map createUser(@RequestBody User user) {
        User savedUser =  userRepository.save(user);
        return Collections.singletonMap("id", savedUser.getId());
    }

    @RequestMapping("users/{id}")
    @ResponseBody
    public Optional<User> getUserById(@PathVariable long id) {
        Optional<User> user = userRepository.findById(id);
//        if(user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, format("User with ID %d not found.", id));

        if(user.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, format("User with ID %d not found.", id));
        }



        return user;
    }

}