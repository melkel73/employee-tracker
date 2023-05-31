const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
require('console.table');



// Connect to database
const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'root',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

function main(){
    inquirer.prompt([
        {
       type:"list",
        name:"options",
        message:"What doy you want to do",
        choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role'],
        }
    ]).then(answers =>{
        if (answers.options === 'view all departments'){
        viewAllDepartments();
        } else if (answers.options === 'add an employee') {
        addEmployee();
        } else if (answers.options === 'add a department') {
        addDepartment();
       } else if (answers.options === 'add a role') {
        addRole(); 
       } else if (answers.options === 'update an employee role') {
        updateEmployee(); 
        } else if (answers.options === 'view all employees') {
            viewAllEmployees();
        } else if (answers.options === 'view all roles') {
            viewAllRoles();
            }
        
    })
}  
async function viewAllDepartments(){
    const [departments] = await db.promise().query('select * from department');
    console.table(departments);
    main();
}

async function viewAllEmployees(){
    const [employees] = await db.promise().query('select * from employee');
    console.table(employees);
    main();
}

async function viewAllRoles(){
    const [roles] = await db.promise().query('select * from role');
    console.table(roles);
    console.log("in view roles")
    main();
}

async function addEmployee(){
    const [roles] = (await db.promise().query('select * from role'));
    const [roles2] = (await db.promise().query('select * from role'));
    console.table(roles);
    console.table(roles2);
   
    const [employees] = (await db.promise().query('select * from employee'));
    console.log(employees);
    console.table(roles);
    inquirer.prompt([
        {
       type:"input",
        name:"first_name",
        message:"What is the employees first name",
        },
        {
            type:"input",
             name:"last_name",
             message:"What is the employees last name",
      },
      {
        type:"list",
         name:"manager_id",
         message:"Please select a manager",
         choices:employees.map(({first_name,last_name,id})=>({name:`${first_name} ${last_name}`,value:id}))
         },
         {
            type:"list",
             name:"role_id",
             message:"Please select a role",
             choices:roles.map(({title,id})=>({name:title,value:id}))
             }
    ]).then(async answers=>{
        const {first_name, last_name, manager_id, role_id} = answers;
    
       await db.promise().query(`insert into employee (first_name, last_name, manager_id, role_id) values ('${first_name}', '${last_name}', ${manager_id}, ${role_id})`)
       viewAllEmployees();
    })
};

    function addDepartment(){
        console.log('adding dept');
        inquirer.prompt([
            {
           type:"input",
            name:"name",
            message:"What is the new Department name"
            },
        
        ]).then(async answers=>{
            const {name} = answers;
            // console.log(answers);
           await db.promise().query(`insert into department ( name) values ('${name}')`);
        //    console.log(name);
           viewAllDepartments();
        //    console.log(name);
        })
    
};

async function addRole(){
    
    const [depts]=(await db.promise().query('select * from department'));
    console.log(depts);
    inquirer.prompt([
        {
       type:"input",
        name:"title",
        message:"What is the title",
        },
        {
            type:"input",
             name:"salary",
             message:"What is the salary",
      },
      {
        type:"list",
         name:"dept_id",
         message:"Please select a dept",
         choices:depts.map(({name,id})=>({name:name,value:id}))
         }
    ]).then(async answers=>{
        console.log(answers);
        const {title, salary, dept_id} = answers;
    
       await db.promise().query(`insert into role (title, salary, department_id) values ('${title}', ${salary}, ${dept_id})`)
       viewAllRoles();
    })
};

async function updateEmployee(){
    const [roles] = (await db.promise().query('select * from role'));
    const [employees] = (await db.promise().query('select * from employee'));
    const employee = await inquirer.prompt({
        type:"list",
        name:"employee",
        message:"Please select the employee to update",
        choices:employees.map(({first_name,last_name,id})=>({name:`${first_name} ${last_name}`,value:id}))
       
    });
    console.log(employee);
    inquirer.prompt([
    //     {
    //    type:"input",
    //     name:"first_name",
    //     message:"What is the employees first name",
    //     },
    //     {
    //         type:"input",
    //          name:"last_name",
    //          message:"What is the employees last name",
    //   },
    //   {
    //     type:"list",
    //      name:"manager_id",
    //      message:"Please select a manager",
    //      choices:employees.map(({first_name,last_name,id})=>({name:`${first_name} ${last_name}`,value:id}))
    //      },
         {
            type:"list",
             name:"role_id",
             message:"Please select a new role role",
             choices:roles.map(({title,id})=>({name:title,value:id}))
             }
    ]).then(async answers=>{
        const {first_name, last_name, manager_id, role_id} = answers;
    
       await db.promise().query(`UPDATE employee SET role_id = ${role_id} WHERE id = ${employee.employee};`)
       viewAllEmployees();
    })
};
main();
