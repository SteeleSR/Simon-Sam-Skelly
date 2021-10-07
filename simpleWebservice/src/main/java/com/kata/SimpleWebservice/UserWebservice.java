package com.kata.SimpleWebservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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
    @ResponseStatus(HttpStatus.OK)
    public Optional<User> getUserById(@PathVariable long id) {
        return userRepository.findById(id);
    }
}