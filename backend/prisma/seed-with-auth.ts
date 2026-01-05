import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Employee data
const employeeData = [
  { code: "SR0162", name: "Aarthi", dept: "E-COM", email: "aarthi@sellersrocket.com", password: "Sellerrocket#162@aarthi" },
  { code: "SR0231", name: "Abdul Ajees", dept: "Digital Marketing", email: "abdul@sellersrocket.com", password: "Sellerrocket#231@abdul" },
  { code: "SR0237", name: "Abharna V", dept: "E-COM", email: "abharna@sellersrocket.com", password: "Sellerrocket#237@abharna" },
  { code: "SR0160", name: "Akshaya Saravanan", dept: "E-COM", email: "akshaya@sellersrocket.com", password: "Sellerrocket#160@akshaya" },
  { code: "SR0243", name: "Atchaya", dept: "E-COM", email: "atchaya@sellersrocket.com", password: "Sellerrocket#243@atchaya" },
  { code: "SR0257", name: "Bavatharani M", dept: "E-COM", email: "bavadharani@sellersrocket.com", password: "Sellerrocket#257@bavadharani" },
  { code: "SR0178", name: "Bavithran", dept: "E-COM", email: "bavithran@sellersrocket.com", password: "Sellerrocket#178@bavithran" },
  { code: "SR0169", name: "Dinesh Kumar", dept: "Digital Marketing", email: "dinesh@sellersrocket.com", password: "Sellerrocket#169@dinesh" },
  { code: "SR0258", name: "Divya G", dept: "E-COM", email: "divya@sellersrocket.com", password: "Sellerrocket#258@divya" },
  { code: "SR0252", name: "Doughlas Martin P", dept: "E-COM", email: "doughlas@sellersrocket.com", password: "Sellerrocket#252@doughlas" },
  { code: "SR0157", name: "Elangkumaran", dept: "E-COM", email: "elangkumaran@sellersrocket.com", password: "Sellerrocket#157@elangkumaran" },
  { code: "SR0262", name: "Farhana mohamad farook", dept: "E-COM", email: "farhana@sellersrocket.com", password: "Sellerrocket#262@farhana" },
  { code: "SR0251", name: "Hafsa nasrin H", dept: "E-COM", email: "hafsa@sellersrocket.com", password: "Sellerrocket#251@hafsa" },
  { code: "SR0176", name: "Hasmath Naseera", dept: "Sales", email: "hasmath@sellersrocket.com", password: "Sellerrocket#176@hasmath" },
  { code: "SR0250", name: "Hemavathi", dept: "Digital Marketing", email: "hemavathi@sellersrocket.com", password: "Sellerrocket#250@hemavathi" },
  { code: "SR0167", name: "Jothika", dept: "E-COM", email: "jothika@sellersrocket.com", password: "Sellerrocket#167@jothika" },
  { code: "SR0166", name: "Kannan A", dept: "E-COM", email: "kannan@sellersrocket.com", password: "Sellerrocket#166@kannan" },
  { code: "SR0209", name: "Kather Batcha", dept: "E-COM", email: "kather@sellersrocket.com", password: "Sellerrocket#209@kather" },
  { code: "SR0174", name: "Maheshwaran", dept: "Digital Marketing", email: "maheshwaran@sellersrocket.com", password: "Sellerrocket#174@maheshwaran" },
  { code: "SR0223", name: "Mohamed Ashik kalimullah", dept: "E-COM", email: "mohamed@sellersrocket.com", password: "Sellerrocket#223@mohamed" },
  { code: "SR0200", name: "Mukesh K", dept: "E-COM", email: "mukesh@sellersrocket.com", password: "Sellerrocket#200@mukesh" },
  { code: "SR0118", name: "Mukesh.S", dept: "E-COM", email: "mukesh.s@sellersrocket.com", password: "Sellerrocket#118@mukesh" },
  { code: "SR0260", name: "Parvezzia S", dept: "Digital Marketing", email: "parvezzia@sellersrocket.com", password: "Sellerrocket#260@parvezzia" },
  { code: "SR0255", name: "Prakash R", dept: "E-COM", email: "prakash.r@sellersrocket.com", password: "Sellerrocket#255@prakash" },
  { code: "SR0217", name: "PRAKASH V", dept: "E-COM", email: "prakash.v@sellersrocket.com", password: "Sellerrocket#217@prakash" },
  { code: "SR0180", name: "Prasanna", dept: "Digital Marketing", email: "prasanna@sellersrocket.com", password: "Sellerrocket#180@prasanna" },
  { code: "SR0170", name: "Prince Bossco", dept: "Digital Marketing", email: "prince@sellersrocket.com", password: "Sellerrocket#170@prince" },
  { code: "SR0212", name: "Raghul SSP", dept: "E-COM", email: "raghul@sellersrocket.com", password: "Sellerrocket#212@raghul" },
  { code: "SR0242", name: "Ramya R", dept: "HR", email: "ramya@sellersrocket.com", password: "Sellerrocket#242@ramya" },
  { code: "SR0226", name: "Sanofar Jahan Safiudeen", dept: "Accounts", email: "sanofar@sellersrocket.com", password: "Sellerrocket#226@sanofar" },
  { code: "SR0246", name: "Saranya", dept: "E-COM", email: "saranya@sellersrocket.com", password: "Sellerrocket#246@saranya" },
  { code: "SR0247", name: "Sargunan", dept: "E-COM", email: "sargunan@sellersrocket.com", password: "Sellerrocket#247@sargunan" },
  { code: "SR0259", name: "Srinithi", dept: "E-COM", email: "srinithi@sellersrocket.com", password: "Sellerrocket#259@srinithi" },
  { code: "SR0244", name: "Subalakshmi", dept: "E-COM", email: "subalakshmi@sellersrocket.com", password: "Sellerrocket#244@subalakshmi" },
  { code: "SR0230", name: "Syed Raffic Aslam K", dept: "E-COM", email: "syed@sellersrocket.com", password: "Sellerrocket#230@syed" },
  { code: "SR0245", name: "Venkatesh", dept: "E-COM", email: "venkatesh@sellersrocket.com", password: "Sellerrocket#162@venkatesh" },
  { code: "SR0263", name: "Karthikeyan", dept: "E-COM", email: "karthikeyan@sellersrocket.com", password: "Sellerrocket#263@karthikeyan" },
  { code: "SR0266", name: "Janaki T", dept: "E-COM", email: "janaki@sellersrocket.com", password: "Sellerrocket#266@janaki" },
  { code: "SR0267", name: "Vigneshwaran P", dept: "E-COM", email: "vigneshwaran@sellersrocket.com", password: "Sellerrocket#267@vigneshwaran" },
  { code: "SR0268", name: "Priyadhrshini murugan", dept: "E-COM", email: "priyadhrshini@sellersrocket.com", password: "Sellerrocket#268@priyadharshini" },
  { code: "SR0269", name: "Sriram", dept: "E-COM", email: "sriram@sellersrocket.com", password: "Sellerrocket#269@sriram" },
  { code: "SR0270", name: "Malleshwar", dept: "E-COM", email: "malleshwar@sellersrocket.com", password: "Sellerrocket#270@malleshwar" },
  { code: "SR0271", name: "Ranjani", dept: "E-COM", email: "ranjani@sellersrocket.com", password: "Sellerrocket#271@ranjani" },
  { code: "SR0272", name: "Bharath", dept: "E-COM", email: "bharath@sellersrocket.com", password: "Sellerrocket#272@bharath" },
  { code: "SR001", name: "ADMIN", dept: "Admin", email: "admin@sellerrocket.in", password: "Sellerrocket@2025", role: "ADMIN" },
  { code: "SR002", name: "manager", dept: "Admin", email: "manager@sellerrocket.in", password: "Sellerrocket@2025", role: "MANAGER" },
]

async function main() {
  console.log("Starting database seed with real employee data...")

  // Delete all existing data
  await prisma.user.deleteMany({})
  await prisma.department.deleteMany({})
  await prisma.manager.deleteMany({})
  await prisma.employee.deleteMany({})
  console.log("✅ Cleared existing data")

  // Get unique departments
  const uniqueDepts = [...new Set(employeeData.map(e => e.dept))]
  
  // Create departments
  const departments: Record<string, any> = {}
  for (const deptName of uniqueDepts) {
    departments[deptName] = await prisma.department.create({
      data: {
        name: deptName,
        description: `${deptName} Department`,
        budget: 500000,
      },
    })
  }
  console.log(`✅ Created ${uniqueDepts.length} departments`)

  // Create users and store references
  const users: Record<string, any> = {}
  let adminUser: any = null
  let managerUser: any = null

  for (const emp of employeeData) {
    const hashedPassword = await bcrypt.hash(emp.password, 10)
    const role = emp.role || "EMPLOYEE"

    const user = await prisma.user.create({
      data: {
        email: emp.email,
        password: hashedPassword,
        firstName: emp.name.split(" ")[0],
        lastName: emp.name.split(" ").slice(1).join(" ") || emp.name,
        role: role as any,
        isActive: true,
      },
    })

    users[emp.code] = user

    if (emp.code === "SR001") {
      adminUser = user
    }
    if (emp.code === "SR002") {
      managerUser = user
    }
  }
  console.log(`✅ Created ${Object.keys(users).length} users`)

  // Create admin manager record
  let adminManager: any = null
  if (adminUser) {
    adminManager = await prisma.manager.create({
      data: {
        userId: adminUser.id,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
        departmentId: departments["Admin"].id,
        designation: "Administrator",
        joinDate: new Date(),
        teamSize: 1,
      },
    })
  }

  // Create manager manager record
  let teamManager: any = null
  if (managerUser && adminManager) {
    teamManager = await prisma.manager.create({
      data: {
        userId: managerUser.id,
        firstName: managerUser.firstName,
        lastName: managerUser.lastName,
        email: managerUser.email,
        departmentId: departments["Admin"].id,
        designation: "Manager",
        joinDate: new Date(),
        teamSize: employeeData.filter(e => !e.role).length,
      },
    })
  }

  // Create employees
  for (const emp of employeeData) {
    const user = users[emp.code]
    const dept = departments[emp.dept]

    let reportingManagerId = null
    if (emp.code === "SR002" && adminManager) {
      reportingManagerId = adminManager.id
    } else if (emp.code !== "SR001" && emp.code !== "SR002" && teamManager) {
      reportingManagerId = teamManager.id
    }

    await prisma.employee.create({
      data: {
        employeeId: emp.code,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        departmentId: dept.id,
        designation: emp.code === "SR001" ? "Administrator" : emp.code === "SR002" ? "Manager" : "Associate",
        baseSalary: 50000,
        joinDate: new Date(),
        reportingManagerId: reportingManagerId,
        employmentStatus: "ACTIVE",
        totalLeaveBalance: 20,
      },
    })
  }
  console.log(`✅ Created ${employeeData.length} employees`)

  console.log("\n✨ Database seeded successfully!")
  console.log("\n📊 Summary:")
  console.log(`   - Departments: ${uniqueDepts.length}`)
  console.log(`   - Users: ${Object.keys(users).length}`)
  console.log(`   - Employees: ${employeeData.length}`)
  console.log("\n🔐 Test Credentials:")
  console.log(`   - Admin: admin@sellerrocket.in / Sellerrocket@2025`)
  console.log(`   - Manager: manager@sellerrocket.in / Sellerrocket@2025`)
  console.log(`   - All passwords are securely hashed using bcrypt`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
