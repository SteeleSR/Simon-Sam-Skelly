package com.kata.SimpleWebservice;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;

@Setter
@Getter
@Entity
@NoArgsConstructor
@Table(name = "example_user")
public class User {
    @JsonIgnore
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private int age;
    @Column(name="dateofbirth")
    private LocalDate dateOfBirth;

    public User(String name, int age, String dateOfBirth){
        this.name = name;
        this.age = age;
        this.dateOfBirth = LocalDate.parse(dateOfBirth);
    }
}
