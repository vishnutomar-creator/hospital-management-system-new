const http = require("http");

const request = (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 8000,
      path: "/api" + path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    
    if (body) {
      body = JSON.stringify(body);
      options.headers["Content-Length"] = Buffer.byteLength(body);
    }

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on("error", (e) => reject(e));
    if (body) req.write(body);
    req.end();
  });
};

const runTests = async () => {
  try {
    const results = [];
    console.log("Starting tests...");

    // 1. Create User
    const ts = Date.now();
    const userRes = await request("POST", "/users", {
      name: "Test User",
      email: `test${ts}@example.com`,
      password: "password123",
      role: "patient",
      phone: "1234567890"
    });
    console.log("Create User:", userRes.status);
    results.push({ module: "User", action: "Create", status: userRes.status, ok: userRes.status === 201 });
    const userId = userRes.data?.data?._id;

    // Get Users
    const usersRes = await request("GET", "/users");
    results.push({ module: "User", action: "Get All", status: usersRes.status, ok: usersRes.status === 200 });

    // Get User By ID
    const userByIdRes = await request("GET", `/users/${userId}`);
    results.push({ module: "User", action: "Get By ID", status: userByIdRes.status, ok: userByIdRes.status === 200 });

    // Update User
    const userUpdateRes = await request("PUT", `/users/${userId}`, { name: "Updated User" });
    results.push({ module: "User", action: "Update", status: userUpdateRes.status, ok: userUpdateRes.status === 200 });

    // 2. Create Patient
    const patientRes = await request("POST", "/patients/createpatient", {
      patientId: `PAT-${ts}`,
      userId: userId,
      gender: "Male"
    });
    console.log("Create Patient:", patientRes.status);
    results.push({ module: "Patient", action: "Create", status: patientRes.status, ok: patientRes.status === 201 });
    const patientId = patientRes.data?.data?._id;

    // Get Patients
    const patientsRes = await request("GET", "/patients/getpatients");
    results.push({ module: "Patient", action: "Get All", status: patientsRes.status, ok: patientsRes.status === 200 });

    // Get Patient By ID
    const patientByIdRes = await request("GET", `/patients/getpatientby/${patientId}`);
    results.push({ module: "Patient", action: "Get By ID", status: patientByIdRes.status, ok: patientByIdRes.status === 200 });

    // 3. Create Department
    const deptRes = await request("POST", "/departments", {
      departmentId: `DEP-${ts}`,
      name: `Cardiology ${ts}`,
      description: "Heart related issues"
    });
    console.log("Create Department:", deptRes.status, deptRes.status !== 201 ? deptRes.data : "");
    results.push({ module: "Department", action: "Create", status: deptRes.status, ok: deptRes.status === 201 });
    const deptId = deptRes.data?.data?.id || deptRes.data?.data?._id;

    // 4. Create Doctor User
    const docUserRes = await request("POST", "/users", {
      name: "Test Doctor",
      email: `doc${ts}@example.com`,
      password: "password123",
      role: "doctor",
    });
    const docUserId = docUserRes.data?.data?.id || docUserRes.data?.data?._id;

    // Create Doctor
    const doctorRes = await request("POST", "/doctors", {
      doctorId: `DOC-${ts}`,
      userId: docUserId,
      name: "Test Doctor",
      email: `doc${ts}@example.com`,
      phone: "0987654321",
      gender: "Male",
      specialization: "Cardiology",
      qualification: "MD",
      department: deptId,
      registrationNumber: `REG-${ts}`
    });
    console.log("Create Doctor:", doctorRes.status, doctorRes.status !== 201 ? doctorRes.data : "");
    results.push({ module: "Doctor", action: "Create", status: doctorRes.status, ok: doctorRes.status === 201 });
    const doctorId = doctorRes.data?.data?.id || doctorRes.data?.data?._id;

    // 5. Create Appointment
    const aptRes = await request("POST", "/appointments", { 
      patientId: patientId,
      doctorId: doctorId,
      appointmentDate: new Date().toISOString(),
      appointmentTime: "10:00 AM",
      reason: "Checkup"
    });
    console.log("Create Appointment:", aptRes.status, aptRes.status !== 201 ? aptRes.data : "");
    results.push({ module: "Appointment", action: "Create", status: aptRes.status, ok: aptRes.status === 201 });
    const aptId = aptRes.data?.data?.id || aptRes.data?.data?._id;

    // 6. Create Billing
    const billRes = await request("POST", "/billings", {
      patientId: patientId,
      appointmentId: aptId,
      items: [{ description: "Consultation", quantity: 1, unitPrice: 500, totalPrice: 500 }]
    });
    console.log("Create Billing:", billRes.status, billRes.status !== 201 ? billRes.data : "");
    results.push({ module: "Billing", action: "Create", status: billRes.status, ok: billRes.status === 201 });
    const billId = billRes.data?.data?._id;

    // Get Billings
    const billsRes = await request("GET", "/billings");
    results.push({ module: "Billing", action: "Get All", status: billsRes.status, ok: billsRes.status === 200 });

    // Get Billing By ID
    const billByIdRes = await request("GET", `/billings/${billId}`);
    results.push({ module: "Billing", action: "Get By ID", status: billByIdRes.status, ok: billByIdRes.status === 200 });

    // 7. Create Payment
    const payRes = await request("POST", "/payments", {
      billingId: billId,
      patientId: patientId,
      amount: 500,
      paymentMethod: "online",
      status: "success"
    });
    console.log("Create Payment:", payRes.status, payRes.status !== 201 ? payRes.data : "");
    results.push({ module: "Payment", action: "Create", status: payRes.status, ok: payRes.status === 201 });
    const payId = payRes.data?.data?._id;

    // Get Payments
    const paysRes = await request("GET", "/payments");
    results.push({ module: "Payment", action: "Get All", status: paysRes.status, ok: paysRes.status === 200 });

    // Negative testing
    const invalidIdRes = await request("GET", "/billings/invalid-id-format");
    results.push({ module: "Billing", action: "Invalid ID", status: invalidIdRes.status, ok: invalidIdRes.status === 400 });

    const nonExistingIdRes = await request("GET", "/billings/65b1234567890abcdef12345");
    console.log("Billing Not Found response:", nonExistingIdRes);
    results.push({ module: "Billing", action: "Not Found", status: nonExistingIdRes.status, ok: nonExistingIdRes.status === 404 });

    // Print Report
    console.table(results);
    console.log("\n--- Preserved Test Data IDs ---");
    console.log("User ID:", userId);
    console.log("Patient ID:", patientId);
    console.log("Doctor User ID:", docUserId);
    console.log("Doctor ID:", doctorId);
    console.log("Department ID:", deptId);
    console.log("Appointment ID:", aptId);
    console.log("Billing ID:", billId);
    console.log("Payment ID:", payId);
    
  } catch (err) {
    console.error("Test failed:", err);
  }
};

runTests();
