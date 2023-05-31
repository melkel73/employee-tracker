DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title varchar(30),
    salary decimal,
    department_id int not null,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE cascade
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name varchar(30) not null ,
    last_name  varchar(30) not null,
    manager_id int,
    constraint fk_manager FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE set null,
    role_id int not null,
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE cascade
);
