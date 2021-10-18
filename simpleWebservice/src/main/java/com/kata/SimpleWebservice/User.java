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

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
}
