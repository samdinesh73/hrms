import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../src/utils/auth.js"

const prisma = new PrismaClient()

async function seed() {
  try {
    console.log("🌱 Seeding database...")

    // Create departments
    const departments = await prisma.department.createMany({
      data: [
        { name: "Information Technology", description: "IT and Software Development" },
        { name: "Human Resources", description: "HR and Administration" },
        { name: "Finance", description: "Finance and Accounting" },
        { name: "Sales", description: "Sales and Business Development" },
        { name: "Marketing", description: "Marketing and Communications" },
        { name: "Digital Marketing", description: "Digital Marketing and Online Campaigns" },
        { name: "E-commerce", description: "E-commerce and Online Sales" },
        { name: "Accounts", description: "Accounts and Receivables" },
      ],
      skipDuplicates: true,
    })

    console.log(`✅ Created ${departments.count} departments`)

    // Get all departments for assigning employees
    const itDept = await prisma.department.findUnique({
      where: { name: "Information Technology" },
    })
    const saleDept = await prisma.department.findUnique({
      where: { name: "Sales" },
    })
    const hrDept = await prisma.department.findUnique({
      where: { name: "Human Resources" },
    })
    const digitalMarketingDept = await prisma.department.findUnique({
      where: { name: "Digital Marketing" },
    })
    const ecommerceDept = await prisma.department.findUnique({
      where: { name: "E-commerce" },
    })
    const accountsDept = await prisma.department.findUnique({
      where: { name: "Accounts" },
    })

    // Create users (or get existing ones)
    let adminUser = await prisma.user.findUnique({
      where: { email: "admin@company.com" },
    })
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: "admin@company.com",
          password: await hashPassword("admin123"),
          firstName: "Admin",
          lastName: "User",
          role: "ADMIN",
        },
      })
    }

    let managerUser = await prisma.user.findUnique({
      where: { email: "manager@company.com" },
    })
    if (!managerUser) {
      managerUser = await prisma.user.create({
        data: {
          email: "manager@company.com",
          password: await hashPassword("manager123"),
          firstName: "Manager",
          lastName: "User",
          role: "MANAGER",
        },
      })
    }

    console.log("✅ Created/Found users")

    // Create admin (if doesn't exist)
    let adminRecord = await prisma.admin.findUnique({
      where: { userId: adminUser.id },
    })
    if (!adminRecord) {
      adminRecord = await prisma.admin.create({
        data: {
          userId: adminUser.id,
          firstName: "Admin",
          lastName: "User",
          email: "admin@company.com",
          permissions: ["ALL"],
        },
      })
    }

    // Create manager (if doesn't exist)
    let managerRecord = await prisma.manager.findUnique({
      where: { userId: managerUser.id },
    })
    if (!managerRecord) {
      managerRecord = await prisma.manager.create({
        data: {
          userId: managerUser.id,
          firstName: "Manager",
          lastName: "User",
          email: "manager@company.com",
          departmentId: itDept!.id,
          designation: "Team Lead",
          joinDate: new Date("2022-01-15"),
        },
      })
    }

    const manager = managerRecord
    console.log("✅ Created/Found admin and manager")

    // Create 46 employees with real data - Thanjavur based
    const thanjavurAreas = [
      "Anna Nagar, Thanjavur",
      "R.S. Puram, Thanjavur",
      "Ayyaram Palayam, Thanjavur",
      "Papanasam Road, Thanjavur",
      "Grand Anicut Colony, Thanjavur",
      "Town Hall Road, Thanjavur",
      "Aarumugam Street, Thanjavur",
      "Madurai Road, Thanjavur",
      "Kumbakonam Road, Thanjavur",
      "Tanjore Big Temple Road, Thanjavur",
    ]

    const employeesData = [
      // Sales Department - 12 employees
      { empId: "SR0162", firstName: "Aarthi", lastName: "", email: "aarthi@sellersrocket.com", dept: saleDept, designation: "Sales Executive", salary: 320000, address: "Anna Nagar, Thanjavur" },
      { empId: "SR0231", firstName: "Abdul", lastName: "Ajees", email: "abdul@sellersrocket.com", dept: saleDept, designation: "Sales Executive", salary: 320000, address: "R.S. Puram, Thanjavur" },
      { empId: "SR0237", firstName: "Abharna", lastName: "V", email: "abharna@sellersrocket.com", dept: saleDept, designation: "Sales Executive", salary: 320000, address: "Ayyaram Palayam, Thanjavur" },
      { empId: "SR0160", firstName: "Akshaya", lastName: "Saravanan", email: "akshaya@sellersrocket.com", dept: saleDept, designation: "Sales Manager", salary: 420000, address: "Papanasam Road, Thanjavur" },
      { empId: "SR0243", firstName: "Atchaya", lastName: "", email: "atchaya@sellersrocket.com", dept: saleDept, designation: "Sales Executive", salary: 320000, address: "Grand Anicut Colony, Thanjavur" },
      { empId: "SR0257", firstName: "Bavatharani", lastName: "M", email: "bavadharani@sellersrocket.com", dept: saleDept, designation: "Sales Executive", salary: 300000, address: "Town Hall Road, Thanjavur" },
      { empId: "SR0178", firstName: "Bavithran", lastName: "", email: "bavithran@sellersrocket.com", dept: saleDept, designation: "Sales Representative", salary: 280000, address: "Aarumugam Street, Thanjavur" },
      { empId: "SR0169", firstName: "Dinesh", lastName: "Kumar", email: "dinesh@sellersrocket.com", dept: saleDept, designation: "Sales Executive", salary: 320000, address: "Madurai Road, Thanjavur" },
      { empId: "SR0258", firstName: "Divya", lastName: "G", email: "divya@sellersrocket.com", dept: saleDept, designation: "Sales Executive", salary: 300000, address: "Kumbakonam Road, Thanjavur" },
      { empId: "SR0252", firstName: "Doughlas", lastName: "Martin P", email: "doughlas@sellersrocket.com", dept: saleDept, designation: "Sales Executive", salary: 320000, address: "Tanjore Big Temple Road, Thanjavur" },
      { empId: "SR0157", firstName: "Elangkumaran", lastName: "", email: "elangkumaran@sellersrocket.com", dept: saleDept, designation: "Sales Executive", salary: 320000, address: "Anna Nagar, Thanjavur" },
      { empId: "SR0167", firstName: "Jothika", lastName: "", email: "jothika@sellersrocket.com", dept: saleDept, designation: "Sales Executive", salary: 300000, address: "R.S. Puram, Thanjavur" },
      
      // HR Department - 9 employees
      { empId: "SR0262", firstName: "Farhana", lastName: "mohamad farook", email: "farhana@sellersrocket.com", dept: hrDept, designation: "HR Manager", salary: 380000, address: "Ayyaram Palayam, Thanjavur" },
      { empId: "SR0251", firstName: "Hafsa", lastName: "nasrin H", email: "hafsa@sellersrocket.com", dept: hrDept, designation: "HR Executive", salary: 300000, address: "Papanasam Road, Thanjavur" },
      { empId: "SR0176", firstName: "Hasmath", lastName: "Naseera", email: "hasmath@sellersrocket.com", dept: hrDept, designation: "HR Coordinator", salary: 280000, address: "Grand Anicut Colony, Thanjavur" },
      { empId: "SR0250", firstName: "Hemavathi", lastName: "", email: "hemavathi@sellersrocket.com", dept: hrDept, designation: "HR Executive", salary: 300000, address: "Town Hall Road, Thanjavur" },
      { empId: "SR0166", firstName: "Kannan", lastName: "A", email: "kannan@sellersrocket.com", dept: hrDept, designation: "HR Executive", salary: 300000, address: "Aarumugam Street, Thanjavur" },
      { empId: "SR0209", firstName: "Kather", lastName: "Batcha", email: "kather@sellersrocket.com", dept: hrDept, designation: "Training Specialist", salary: 320000, address: "Madurai Road, Thanjavur" },
      { empId: "SR0174", firstName: "Maheshwaran", lastName: "", email: "maheshwaran@sellersrocket.com", dept: hrDept, designation: "HR Executive", salary: 300000, address: "Kumbakonam Road, Thanjavur" },
      { empId: "SR0223", firstName: "Mohamed", lastName: "Ashik kalimullah", email: "mohamed@sellersrocket.com", dept: hrDept, designation: "HR Coordinator", salary: 280000, address: "Tanjore Big Temple Road, Thanjavur" },
      { empId: "SR0230", firstName: "Syed", lastName: "Raffic Aslam K", email: "syed@sellersrocket.com", dept: hrDept, designation: "HR Business Partner", salary: 350000, address: "Anna Nagar, Thanjavur" },
      
      // Digital Marketing Department - 10 employees
      { empId: "SR0200", firstName: "Mukesh", lastName: "K", email: "mukesh@sellersrocket.com", dept: digitalMarketingDept, designation: "Digital Marketing Manager", salary: 400000, address: "R.S. Puram, Thanjavur" },
      { empId: "SR0118", firstName: "Mukesh", lastName: "S", email: "mukesh.s@sellersrocket.com", dept: digitalMarketingDept, designation: "Digital Marketing Specialist", salary: 320000, address: "Ayyaram Palayam, Thanjavur" },
      { empId: "SR0260", firstName: "Parvezzia", lastName: "S", email: "parvezzia@sellersrocket.com", dept: digitalMarketingDept, designation: "Content Creator", salary: 280000, address: "Papanasam Road, Thanjavur" },
      { empId: "SR0255", firstName: "Prakash", lastName: "R", email: "prakash.r@sellersrocket.com", dept: digitalMarketingDept, designation: "SEO Specialist", salary: 320000, address: "Grand Anicut Colony, Thanjavur" },
      { empId: "SR0217", firstName: "Prakash", lastName: "V", email: "prakash.v@sellersrocket.com", dept: digitalMarketingDept, designation: "Social Media Manager", salary: 300000, address: "Town Hall Road, Thanjavur" },
      { empId: "SR0180", firstName: "Prasanna", lastName: "", email: "prasanna@sellersrocket.com", dept: digitalMarketingDept, designation: "Digital Marketing Specialist", salary: 320000, address: "Aarumugam Street, Thanjavur" },
      { empId: "SR0170", firstName: "Prince", lastName: "Bossco", email: "prince@sellersrocket.com", dept: digitalMarketingDept, designation: "Marketing Analyst", salary: 300000, address: "Madurai Road, Thanjavur" },
      { empId: "SR0212", firstName: "Raghul", lastName: "SSP", email: "raghul@sellersrocket.com", dept: digitalMarketingDept, designation: "Email Marketing Specialist", salary: 280000, address: "Kumbakonam Road, Thanjavur" },
      { empId: "SR0226", firstName: "Sanofar", lastName: "Jahan Safiudeen", email: "sanofar@sellersrocket.com", dept: digitalMarketingDept, designation: "Brand Manager", salary: 350000, address: "Tanjore Big Temple Road, Thanjavur" },
      { empId: "SR0263", firstName: "Karthikeyan", lastName: "", email: "karthikeyan@sellersrocket.com", dept: digitalMarketingDept, designation: "Digital Marketing Specialist", salary: 320000, address: "Anna Nagar, Thanjavur" },
      
      // E-commerce Department - 10 employees
      { empId: "SR0242", firstName: "Ramya", lastName: "R", email: "ramya@sellersrocket.com", dept: ecommerceDept, designation: "E-commerce Manager", salary: 400000, address: "R.S. Puram, Thanjavur" },
      { empId: "SR0246", firstName: "Saranya", lastName: "", email: "saranya@sellersrocket.com", dept: ecommerceDept, designation: "Product Manager", salary: 380000, address: "Ayyaram Palayam, Thanjavur" },
      { empId: "SR0247", firstName: "Sargunan", lastName: "", email: "sargunan@sellersrocket.com", dept: ecommerceDept, designation: "E-commerce Coordinator", salary: 300000, address: "Papanasam Road, Thanjavur" },
      { empId: "SR0259", firstName: "Srinithi", lastName: "", email: "srinithi@sellersrocket.com", dept: ecommerceDept, designation: "Inventory Manager", salary: 320000, address: "Grand Anicut Colony, Thanjavur" },
      { empId: "SR0244", firstName: "Subalakshmi", lastName: "", email: "subalakshmi@sellersrocket.com", dept: ecommerceDept, designation: "Supply Chain Specialist", salary: 320000, address: "Town Hall Road, Thanjavur" },
      { empId: "SR0245", firstName: "Venkatesh", lastName: "", email: "venkatesh@sellersrocket.com", dept: ecommerceDept, designation: "Customer Service Manager", salary: 300000, address: "Aarumugam Street, Thanjavur" },
      { empId: "SR0266", firstName: "Janaki", lastName: "T", email: "janaki@sellersrocket.com", dept: ecommerceDept, designation: "Warehouse Executive", salary: 280000, address: "Madurai Road, Thanjavur" },
      { empId: "SR0267", firstName: "Vigneshwaran", lastName: "P", email: "vigneshwaran@sellersrocket.com", dept: ecommerceDept, designation: "Operations Assistant", salary: 250000, address: "Kumbakonam Road, Thanjavur" },
      { empId: "SR0268", firstName: "Priyadhrshini", lastName: "murugan", email: "priyadhrshini@sellersrocket.com", dept: ecommerceDept, designation: "E-commerce Coordinator", salary: 300000, address: "Tanjore Big Temple Road, Thanjavur" },
      { empId: "SR0272", firstName: "Bharath", lastName: "", email: "bharath@sellersrocket.com", dept: ecommerceDept, designation: "Inventory Manager", salary: 320000, address: "Anna Nagar, Thanjavur" },
      
      // Accounts Department - 5 employees
      { empId: "SR0269", firstName: "Sriram", lastName: "", email: "sriram@sellersrocket.com", dept: accountsDept, designation: "Accounts Manager", salary: 380000, address: "R.S. Puram, Thanjavur" },
      { empId: "SR0270", firstName: "Malleshwar", lastName: "", email: "malleshwar@sellersrocket.com", dept: accountsDept, designation: "Accounts Executive", salary: 300000, address: "Ayyaram Palayam, Thanjavur" },
      { empId: "SR0271", firstName: "Ranjani", lastName: "", email: "ranjani@sellersrocket.com", dept: accountsDept, designation: "Accounts Coordinator", salary: 280000, address: "Papanasam Road, Thanjavur" },
    ]

    const createdEmployees = []
    for (let i = 0; i < employeesData.length; i++) {
      const empData = employeesData[i]
      
      const user = await prisma.user.create({
        data: {
          email: empData.email,
          password: await hashPassword("emp123456"),
          firstName: empData.firstName,
          lastName: empData.lastName,
          role: "EMPLOYEE",
        },
      })

      const employee = await prisma.employee.create({
        data: {
          userId: user.id,
          employeeId: empData.empId,
          firstName: empData.firstName,
          lastName: empData.lastName,
          email: empData.email,
          phone: `98765${String(i).padStart(5, "0")}`,
          address: empData.address,
          departmentId: empData.dept!.id,
          reportingManagerId: manager.id,
          designation: empData.designation,
          joinDate: new Date(2022 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          baseSalary: empData.salary,
          allowances: Math.floor(empData.salary * 0.1),
          totalLeaveBalance: 20,
          gender: Math.random() > 0.5 ? "Male" : "Female",
          panNumber: `PAN${String(i).padStart(6, "0")}`,
          employmentType: "Full-time",
          employmentStatus: "ACTIVE",
        },
      })

      createdEmployees.push(employee)

      // Create leave balance for each employee
      await prisma.leaveBalance.create({
        data: {
          employeeId: employee.id,
          year: new Date().getFullYear(),
          earnedLeave: 20,
          casualLeave: 12,
          sickLeave: 10,
        },
      })
    }

    console.log(`✅ Created 46 employees`)
    console.log("✅ Created 1 admin and 1 manager")

    // Create a task
    await prisma.task.create({
      data: {
        title: "Complete API Development",
        description: "Develop RESTful API endpoints for HRMS",
        assignedToId: createdEmployees[0].id,
        assignedById: createdEmployees[0].id,
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        startDate: new Date(),
        estimatedHours: 40,
      },
    })

    console.log("✅ Created 1 task")

    console.log("✨ Database seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
