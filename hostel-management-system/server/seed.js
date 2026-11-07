const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Room = require('./models/Room');
const Student = require('./models/Student');
const Payment = require('./models/Payment');
const Complaint = require('./models/Complaint');
const Visitor = require('./models/Visitor');
const Amenity = require('./models/Amenity');
const Mess = require('./models/Mess');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_management';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
    console.log('Seeding database with exact demo records...');

    // Clear existing data
    await User.deleteMany({});
    await Room.deleteMany({});
    await Student.deleteMany({});
    await Payment.deleteMany({});
    await Complaint.deleteMany({});
    await Visitor.deleteMany({});
    await Amenity.deleteMany({});
    await Mess.deleteMany({});

    // 1. Create Users
    console.log('Creating Admin, Warden, and Student accounts...');
    const adminUser = await User.create({
      name: 'Admin Supervisor',
      email: 'admin@hostel.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98765 00001',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    });

    const wardenUser = await User.create({
      name: 'Ramesh Sharma (Chief Warden)',
      email: 'warden@hostel.com',
      password: 'warden123',
      role: 'warden',
      phone: '+91 98765 00002',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });

    // 2. Create 12 Rooms (Total Properties: 12)
    // 4 Occupied, 8 Vacant
    console.log('Creating 12 Rooms (8 vacant, 4 occupied)...');
    const roomsData = [
      { roomNumber: '101', block: 'Green PG Wing A', floor: 1, type: 'Double', capacity: 2, pricePerMonth: 8000, occupiedCount: 0, status: 'available' },
      { roomNumber: '102', block: 'Green PG Wing A', floor: 1, type: 'Single', capacity: 1, pricePerMonth: 12000, occupiedCount: 0, status: 'available' },
      { roomNumber: '103', block: 'Green PG Wing A', floor: 1, type: 'Triple', capacity: 3, pricePerMonth: 6000, occupiedCount: 0, status: 'available' },
      { roomNumber: '104', block: 'Green PG Wing A', floor: 1, type: 'Double', capacity: 2, pricePerMonth: 8000, occupiedCount: 0, status: 'available' },
      { roomNumber: '105', block: 'Green PG Wing A', floor: 1, type: 'Single', capacity: 1, pricePerMonth: 8000, occupiedCount: 1, status: 'full' },
      { roomNumber: '201', block: 'City Nest Wing B', floor: 2, type: 'Double', capacity: 2, pricePerMonth: 7500, occupiedCount: 0, status: 'available' },
      { roomNumber: '202', block: 'City Nest Wing B', floor: 2, type: 'Single', capacity: 1, pricePerMonth: 6500, occupiedCount: 1, status: 'full' },
      { roomNumber: '203', block: 'City Nest Wing B', floor: 2, type: 'Double', capacity: 2, pricePerMonth: 7500, occupiedCount: 0, status: 'available' },
      { roomNumber: '204', block: 'City Nest Wing B', floor: 2, type: 'Triple', capacity: 3, pricePerMonth: 5500, occupiedCount: 0, status: 'available' },
      { roomNumber: '301', block: 'Sunrise PG Wing C', floor: 3, type: 'Double', capacity: 2, pricePerMonth: 8500, occupiedCount: 0, status: 'available' },
      { roomNumber: '305', block: 'Sunrise PG Wing C', floor: 3, type: 'Single', capacity: 1, pricePerMonth: 9000, occupiedCount: 0, status: 'available' },
      { roomNumber: '310', block: 'Sunrise PG Wing C', floor: 3, type: 'Single', capacity: 1, pricePerMonth: 5200, occupiedCount: 1, status: 'full' },
    ];

    const createdRooms = await Room.insertMany(roomsData);
    const roomMap = {};
    createdRooms.forEach((r) => {
      roomMap[r.roomNumber] = r;
    });

    // 3. Create Students & Link to Rooms
    console.log('Creating Students matching UI screenshot...');
    const studentsData = [
      {
        name: 'Rahul Sharma',
        email: 'rahul@hostel.com',
        phone: '+91 98765 43211',
        studentId: 'STU202401',
        gender: 'Male',
        department: 'Computer Science',
        yearOfStudy: '3rd Year',
        room: roomMap['105']._id,
        bedNumber: 1,
        guardianName: 'Manoj Sharma',
        guardianPhone: '+91 98111 22233',
        photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        admissionDate: new Date('2024-04-10'),
      },
      {
        name: 'Sneha Patel',
        email: 'sneha@hostel.com',
        phone: '+91 98765 43212',
        studentId: 'STU202402',
        gender: 'Female',
        department: 'Electronics',
        yearOfStudy: '2nd Year',
        room: roomMap['202']._id,
        bedNumber: 1,
        guardianName: 'Kirit Patel',
        guardianPhone: '+91 98111 22234',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        admissionDate: new Date('2024-04-08'),
      },
      {
        name: 'Amit Verma',
        email: 'amit@hostel.com',
        phone: '+91 98765 43213',
        studentId: 'STU202403',
        gender: 'Male',
        department: 'Mechanical',
        yearOfStudy: '4th Year',
        room: roomMap['310']._id,
        bedNumber: 1,
        guardianName: 'Sanjay Verma',
        guardianPhone: '+91 98111 22235',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        admissionDate: new Date('2024-04-05'),
      },
      {
        name: 'Priya Singh',
        email: 'priya@hostel.com',
        phone: '+91 98765 43214',
        studentId: 'STU202404',
        gender: 'Female',
        department: 'Information Technology',
        yearOfStudy: '1st Year',
        room: roomMap['104']._id,
        bedNumber: 1,
        guardianName: 'Rajendra Singh',
        guardianPhone: '+91 98111 22236',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
        admissionDate: new Date('2024-04-01'),
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun@hostel.com',
        phone: '+91 98765 43215',
        studentId: 'STU202405',
        gender: 'Male',
        department: 'Civil Engineering',
        yearOfStudy: '2nd Year',
        room: roomMap['101']._id,
        bedNumber: 1,
        guardianName: 'Vikram Mehta',
        guardianPhone: '+91 98111 22237',
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        admissionDate: new Date('2024-04-10'),
      },
      {
        name: 'Neha Gupta',
        email: 'neha@hostel.com',
        phone: '+91 98765 43216',
        studentId: 'STU202406',
        gender: 'Female',
        department: 'Data Science',
        yearOfStudy: '3rd Year',
        room: roomMap['204']._id,
        bedNumber: 1,
        guardianName: 'Sunil Gupta',
        guardianPhone: '+91 98111 22238',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        admissionDate: new Date('2024-04-08'),
      },
      {
        name: 'Vikram Rao',
        email: 'vikram@hostel.com',
        phone: '+91 98765 43217',
        studentId: 'STU202407',
        gender: 'Male',
        department: 'Aerospace',
        yearOfStudy: '4th Year',
        room: roomMap['305']._id,
        bedNumber: 1,
        guardianName: 'Mohan Rao',
        guardianPhone: '+91 98111 22239',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        admissionDate: new Date('2024-04-05'),
      },
    ];

    const createdStudents = [];
    for (const s of studentsData) {
      const student = await Student.create(s);
      createdStudents.push(student);

      // Create linked user login
      await User.create({
        name: student.name,
        email: student.email,
        password: 'student123',
        role: 'student',
        phone: student.phone,
        avatar: student.photo,
        studentProfile: student._id,
      });

      // Update room students array
      await Room.findByIdAndUpdate(student.room, {
        $push: { students: student._id },
      });
    }

    const studentMap = {};
    createdStudents.forEach((st) => {
      studentMap[st.name] = st;
    });

    // 4. Create Payments
    // Exactly matches Pending Payments ₹24,300:
    // Rahul Sharma: ₹8,000 (Due in 2 Days)
    // Sneha Patel: ₹6,500 (Due in 4 Days)
    // Amit Verma: ₹5,200 (Due in 5 Days)
    // Priya Singh: ₹4,600 (Due in 6 Days)
    // Sum = 8000 + 6500 + 5200 + 4600 = ₹24,300!
    console.log('Creating Payments matching UI screenshot (Total Pending: ₹24,300)...');
    const now = new Date();
    const paymentsData = [
      {
        student: studentMap['Rahul Sharma']._id,
        room: roomMap['105']._id,
        title: 'Monthly Hostel & Mess Fee - April',
        amount: 8000,
        month: 'April 2024',
        dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        status: 'Pending',
        remarks: 'Monthly room & mess subscription',
      },
      {
        student: studentMap['Sneha Patel']._id,
        room: roomMap['202']._id,
        title: 'Monthly Hostel Fee - April',
        amount: 6500,
        month: 'April 2024',
        dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        status: 'Pending',
        remarks: 'Single room fee',
      },
      {
        student: studentMap['Amit Verma']._id,
        room: roomMap['310']._id,
        title: 'Monthly Hostel Fee - April',
        amount: 5200,
        month: 'April 2024',
        dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        status: 'Pending',
        remarks: 'Special student concession applied',
      },
      {
        student: studentMap['Priya Singh']._id,
        room: roomMap['104']._id,
        title: 'Monthly Hostel Fee - April',
        amount: 4600,
        month: 'April 2024',
        dueDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
        status: 'Pending',
        remarks: 'Double sharing allocation',
      },
      // Paid fees for reporting
      {
        student: studentMap['Arjun Mehta']._id,
        room: roomMap['101']._id,
        title: 'Hostel Admission & Security Fee',
        amount: 45000,
        month: 'March 2024',
        dueDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        paidDate: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
        status: 'Paid',
        paymentMethod: 'UPI',
        transactionId: 'UPI984729184712',
        remarks: 'Received via GPay',
      },
      {
        student: studentMap['Neha Gupta']._id,
        room: roomMap['204']._id,
        title: 'Hostel Admission & Security Fee',
        amount: 45000,
        month: 'March 2024',
        dueDate: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000),
        paidDate: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000),
        status: 'Paid',
        paymentMethod: 'NetBanking',
        transactionId: 'HDFC982371982',
        remarks: 'Received via HDFC Netbanking',
      },
      {
        student: studentMap['Vikram Rao']._id,
        room: roomMap['305']._id,
        title: 'Hostel Term 1 Fee',
        amount: 58500,
        month: 'March 2024',
        dueDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        paidDate: new Date(now.getTime() - 26 * 24 * 60 * 60 * 1000),
        status: 'Paid',
        paymentMethod: 'Bank Transfer',
        transactionId: 'NEFT491823719',
        remarks: 'Received via NEFT',
      },
    ];

    await Payment.insertMany(paymentsData);

    // 5. Create Maintenance Requests / Complaints (Matching UI Screenshot)
    // - AC Repair - Building A -> In Progress
    // - Plumbing Issue - Room 203 -> Pending
    // - WIFI Problem - 2nd Floor -> Resolved
    console.log('Creating Maintenance Requests matching UI screenshot...');
    const complaintsData = [
      {
        title: 'AC Repair',
        category: 'AC Repair',
        location: 'Building A',
        student: studentMap['Rahul Sharma']._id,
        studentName: 'Rahul Sharma',
        description: 'AC cooling coil freezing up intermittently in Room 105.',
        priority: 'High',
        status: 'In Progress',
        assignedTo: 'HVAC Technician - Ramesh',
      },
      {
        title: 'Plumbing Issue',
        category: 'Plumbing Issue',
        location: 'Room 203',
        room: roomMap['203']._id,
        student: studentMap['Amit Verma']._id,
        studentName: 'Amit Verma',
        description: 'Low water pressure in attached washroom shower.',
        priority: 'Medium',
        status: 'Pending',
        assignedTo: 'Plumbing Department',
      },
      {
        title: 'WIFI Problem',
        category: 'WiFi Problem',
        location: '2nd Floor',
        student: studentMap['Sneha Patel']._id,
        studentName: 'Sneha Patel',
        description: 'Repeated signal drops near corridor router access point.',
        priority: 'Urgent',
        status: 'Resolved',
        assignedTo: 'IT Support Team',
        resolutionNotes: 'Router firmware upgraded and access point channel optimized.',
        resolvedAt: new Date(),
      },
    ];

    await Complaint.insertMany(complaintsData);

    // 6. Create Visitors
    console.log('Creating Visitors...');
    const visitorsData = [
      {
        visitorName: 'Rajesh Mehta',
        relation: 'Father',
        phone: '+91 98220 11223',
        student: studentMap['Arjun Mehta']._id,
        studentName: 'Arjun Mehta',
        roomNumber: '101',
        purpose: 'Bringing semester study essentials',
        checkInTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        status: 'In Premises',
      },
      {
        visitorName: 'Sunita Gupta',
        relation: 'Mother',
        phone: '+91 98220 11224',
        student: studentMap['Neha Gupta']._id,
        studentName: 'Neha Gupta',
        roomNumber: '204',
        purpose: 'Weekend family greeting',
        checkInTime: new Date(now.getTime() - 5 * 60 * 60 * 1000),
        checkOutTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        status: 'Checked Out',
      },
    ];

    await Visitor.insertMany(visitorsData);

    // 7. Seed Amenities & Mess
    const amenityController = require('./controllers/amenityController');
    await amenityController.getAmenities({ query: {} }, { status: () => ({ json: () => {} }) });

    const messController = require('./controllers/messController');
    await messController.getWeeklyMenu({ query: {} }, { status: () => ({ json: () => {} }) });

    console.log('✅ DATABASE SEED COMPLETE!');
    console.log('----------------------------------------------------');
    console.log('Admin login:   admin@hostel.com  / admin123');
    console.log('Warden login:  warden@hostel.com / warden123');
    console.log('Student login: rahul@hostel.com  / student123');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
};

if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}

module.exports = seedDatabase;

