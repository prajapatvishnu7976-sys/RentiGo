const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Location = require("../models/Location");
const Booking = require("../models/Booking");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/rentigo";
  await mongoose.connect(uri);
  console.log("✅ MongoDB Connected");
};

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const genPlate = (sc) => {
  const L = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  return `${sc}${String(randNum(1, 99)).padStart(2, "0")}${L[randNum(0, L.length - 1)]}${L[randNum(0, L.length - 1)]}${randNum(1000, 9999)}`;
};

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Location.deleteMany({});
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});
    console.log("🗑️  Cleared old data");

    // ═══════════════════════════════════════════════
    // 📍 LOCATIONS (60+ Cities)
    // ═══════════════════════════════════════════════
    const allLocations = [
      // GUJARAT
      { name: "SG Highway Hub", city: "Ahmedabad", state: "Gujarat", pincode: "380054", address: "SG Highway, Pakwan", sc: "GJ" },
      { name: "CG Road Center", city: "Ahmedabad", state: "Gujarat", pincode: "380006", address: "CG Road, Navrangpura", sc: "GJ" },
      { name: "Satellite Hub", city: "Ahmedabad", state: "Gujarat", pincode: "380015", address: "Satellite, Jodhpur Cross", sc: "GJ" },
      { name: "Adajan Hub", city: "Surat", state: "Gujarat", pincode: "395009", address: "Adajan, VR Mall", sc: "GJ" },
      { name: "Vesu Center", city: "Surat", state: "Gujarat", pincode: "395007", address: "Vesu, VIP Road", sc: "GJ" },
      { name: "Alkapuri Center", city: "Vadodara", state: "Gujarat", pincode: "390007", address: "Alkapuri, Race Course", sc: "GJ" },
      { name: "Manjalpur Hub", city: "Vadodara", state: "Gujarat", pincode: "390011", address: "Manjalpur, NH8", sc: "GJ" },
      { name: "Kalawad Road Hub", city: "Rajkot", state: "Gujarat", pincode: "360005", address: "Kalawad Road", sc: "GJ" },
      { name: "University Hub", city: "Rajkot", state: "Gujarat", pincode: "360005", address: "University Road", sc: "GJ" },
      { name: "Sector 21 Hub", city: "Gandhinagar", state: "Gujarat", pincode: "382021", address: "Sector 21, Infocity", sc: "GJ" },
      { name: "Waghawadi Hub", city: "Bhavnagar", state: "Gujarat", pincode: "364001", address: "Waghawadi Road", sc: "GJ" },
      { name: "Patel Colony Hub", city: "Jamnagar", state: "Gujarat", pincode: "361001", address: "Patel Colony", sc: "GJ" },
      { name: "Junagadh Center", city: "Junagadh", state: "Gujarat", pincode: "362001", address: "MG Road", sc: "GJ" },
      { name: "Anand Hub", city: "Anand", state: "Gujarat", pincode: "388001", address: "V.V. Nagar Road", sc: "GJ" },
      { name: "Mehsana Center", city: "Mehsana", state: "Gujarat", pincode: "384001", address: "Highway Road", sc: "GJ" },

      // MAHARASHTRA
      { name: "Andheri Hub", city: "Mumbai", state: "Maharashtra", pincode: "400053", address: "Andheri West, Metro", sc: "MH" },
      { name: "Bandra Center", city: "Mumbai", state: "Maharashtra", pincode: "400050", address: "Bandra West, Hill Road", sc: "MH" },
      { name: "Powai Hub", city: "Mumbai", state: "Maharashtra", pincode: "400076", address: "Powai, Hiranandani", sc: "MH" },
      { name: "Navi Mumbai Center", city: "Mumbai", state: "Maharashtra", pincode: "400703", address: "Vashi, Palm Beach", sc: "MH" },
      { name: "Hinjewadi Hub", city: "Pune", state: "Maharashtra", pincode: "411057", address: "Hinjewadi IT Park", sc: "MH" },
      { name: "Kothrud Center", city: "Pune", state: "Maharashtra", pincode: "411038", address: "Kothrud, Karve Road", sc: "MH" },
      { name: "Viman Nagar Hub", city: "Pune", state: "Maharashtra", pincode: "411014", address: "Viman Nagar", sc: "MH" },
      { name: "Dharampeth Hub", city: "Nagpur", state: "Maharashtra", pincode: "440010", address: "Dharampeth", sc: "MH" },
      { name: "College Road Hub", city: "Nashik", state: "Maharashtra", pincode: "422005", address: "College Road", sc: "MH" },
      { name: "CIDCO Hub", city: "Aurangabad", state: "Maharashtra", pincode: "431001", address: "CIDCO", sc: "MH" },
      { name: "Ghodbunder Hub", city: "Thane", state: "Maharashtra", pincode: "400601", address: "Ghodbunder Road", sc: "MH" },
      { name: "Rajarampuri Hub", city: "Kolhapur", state: "Maharashtra", pincode: "416001", address: "Rajarampuri", sc: "MH" },

      // DELHI NCR
      { name: "Connaught Place Hub", city: "Delhi", state: "Delhi", pincode: "110001", address: "Block A, CP", sc: "DL" },
      { name: "Saket Center", city: "Delhi", state: "Delhi", pincode: "110017", address: "Select City Walk", sc: "DL" },
      { name: "Dwarka Hub", city: "Delhi", state: "Delhi", pincode: "110075", address: "Sector 21, Dwarka", sc: "DL" },
      { name: "Karol Bagh Hub", city: "Delhi", state: "Delhi", pincode: "110005", address: "Karol Bagh Market", sc: "DL" },
      { name: "Cyber Hub Center", city: "Gurgaon", state: "Haryana", pincode: "122002", address: "DLF Cyber Hub", sc: "HR" },
      { name: "Sohna Road Hub", city: "Gurgaon", state: "Haryana", pincode: "122018", address: "Sohna Road", sc: "HR" },
      { name: "Sector 62 Hub", city: "Noida", state: "Uttar Pradesh", pincode: "201301", address: "Sector 62", sc: "UP" },
      { name: "Sector 15 Hub", city: "Faridabad", state: "Haryana", pincode: "121007", address: "Sector 15", sc: "HR" },
      { name: "Vaishali Hub", city: "Ghaziabad", state: "Uttar Pradesh", pincode: "201010", address: "Vaishali", sc: "UP" },

      // KARNATAKA
      { name: "Koramangala Hub", city: "Bangalore", state: "Karnataka", pincode: "560034", address: "5th Block, Koramangala", sc: "KA" },
      { name: "Whitefield Center", city: "Bangalore", state: "Karnataka", pincode: "560066", address: "ITPL Main Road", sc: "KA" },
      { name: "Electronic City Hub", city: "Bangalore", state: "Karnataka", pincode: "560100", address: "Electronic City Phase 1", sc: "KA" },
      { name: "Indiranagar Hub", city: "Bangalore", state: "Karnataka", pincode: "560038", address: "100 Feet Road, Indiranagar", sc: "KA" },
      { name: "VV Mohalla Hub", city: "Mysore", state: "Karnataka", pincode: "570002", address: "VV Mohalla", sc: "KA" },
      { name: "Hampankatta Hub", city: "Mangalore", state: "Karnataka", pincode: "575001", address: "Hampankatta", sc: "KA" },
      { name: "Hubli Center", city: "Hubli", state: "Karnataka", pincode: "580020", address: "Lamington Road", sc: "KA" },

      // TAMIL NADU
      { name: "Anna Nagar Hub", city: "Chennai", state: "Tamil Nadu", pincode: "600040", address: "2nd Avenue, Anna Nagar", sc: "TN" },
      { name: "T Nagar Center", city: "Chennai", state: "Tamil Nadu", pincode: "600017", address: "T Nagar, Usman Road", sc: "TN" },
      { name: "Velachery Hub", city: "Chennai", state: "Tamil Nadu", pincode: "600042", address: "Velachery Main Road", sc: "TN" },
      { name: "RS Puram Hub", city: "Coimbatore", state: "Tamil Nadu", pincode: "641002", address: "RS Puram", sc: "TN" },
      { name: "KK Nagar Hub", city: "Madurai", state: "Tamil Nadu", pincode: "625020", address: "KK Nagar", sc: "TN" },
      { name: "Salem Hub", city: "Salem", state: "Tamil Nadu", pincode: "636001", address: "Junction Road", sc: "TN" },
      { name: "Trichy Center", city: "Tiruchirappalli", state: "Tamil Nadu", pincode: "620001", address: "Cantonment", sc: "TN" },

      // RAJASTHAN
      { name: "MI Road Hub", city: "Jaipur", state: "Rajasthan", pincode: "302001", address: "MI Road", sc: "RJ" },
      { name: "Mansarovar Center", city: "Jaipur", state: "Rajasthan", pincode: "302020", address: "Mansarovar", sc: "RJ" },
      { name: "C Scheme Hub", city: "Jaipur", state: "Rajasthan", pincode: "302001", address: "C Scheme", sc: "RJ" },
      { name: "Fateh Sagar Hub", city: "Udaipur", state: "Rajasthan", pincode: "313001", address: "Fateh Sagar Lake", sc: "RJ" },
      { name: "City Palace Hub", city: "Udaipur", state: "Rajasthan", pincode: "313001", address: "City Palace Road", sc: "RJ" },
      { name: "Sardarpura Hub", city: "Jodhpur", state: "Rajasthan", pincode: "342001", address: "Sardarpura", sc: "RJ" },
      { name: "Fort Road Hub", city: "Jaisalmer", state: "Rajasthan", pincode: "345001", address: "Fort Road", sc: "RJ" },
      { name: "Ajmer Hub", city: "Ajmer", state: "Rajasthan", pincode: "305001", address: "Dargah Road", sc: "RJ" },
      { name: "Kota Center", city: "Kota", state: "Rajasthan", pincode: "324001", address: "Talwandi", sc: "RJ" },
      { name: "Bikaner Hub", city: "Bikaner", state: "Rajasthan", pincode: "334001", address: "Station Road", sc: "RJ" },

      // UTTAR PRADESH
      { name: "Hazratganj Hub", city: "Lucknow", state: "Uttar Pradesh", pincode: "226001", address: "Hazratganj", sc: "UP" },
      { name: "Gomti Nagar Center", city: "Lucknow", state: "Uttar Pradesh", pincode: "226010", address: "Gomti Nagar", sc: "UP" },
      { name: "Taj East Gate Hub", city: "Agra", state: "Uttar Pradesh", pincode: "282001", address: "Taj East Gate", sc: "UP" },
      { name: "Sadar Bazar Hub", city: "Agra", state: "Uttar Pradesh", pincode: "282001", address: "Sadar Bazar", sc: "UP" },
      { name: "Dashashwamedh Hub", city: "Varanasi", state: "Uttar Pradesh", pincode: "221001", address: "Dashashwamedh Ghat", sc: "UP" },
      { name: "Swaroop Nagar Hub", city: "Kanpur", state: "Uttar Pradesh", pincode: "208002", address: "Swaroop Nagar", sc: "UP" },
      { name: "Civil Lines Hub", city: "Allahabad", state: "Uttar Pradesh", pincode: "211001", address: "Civil Lines", sc: "UP" },
      { name: "Meerut Hub", city: "Meerut", state: "Uttar Pradesh", pincode: "250001", address: "Abu Lane", sc: "UP" },
      { name: "Bareilly Center", city: "Bareilly", state: "Uttar Pradesh", pincode: "243001", address: "Civil Lines", sc: "UP" },

      // TELANGANA / AP
      { name: "Banjara Hills Hub", city: "Hyderabad", state: "Telangana", pincode: "500034", address: "Road No. 12", sc: "TS" },
      { name: "HITEC City Center", city: "Hyderabad", state: "Telangana", pincode: "500081", address: "HITEC City", sc: "TS" },
      { name: "Gachibowli Hub", city: "Hyderabad", state: "Telangana", pincode: "500032", address: "Gachibowli", sc: "TS" },
      { name: "Beach Road Hub", city: "Visakhapatnam", state: "Andhra Pradesh", pincode: "530002", address: "Beach Road", sc: "AP" },
      { name: "Vijayawada Hub", city: "Vijayawada", state: "Andhra Pradesh", pincode: "520001", address: "MG Road", sc: "AP" },
      { name: "Tirupati Center", city: "Tirupati", state: "Andhra Pradesh", pincode: "517501", address: "Car Street", sc: "AP" },

      // KERALA
      { name: "MG Road Hub", city: "Kochi", state: "Kerala", pincode: "682016", address: "MG Road", sc: "KL" },
      { name: "Marine Drive Center", city: "Kochi", state: "Kerala", pincode: "682031", address: "Marine Drive", sc: "KL" },
      { name: "East Fort Hub", city: "Thiruvananthapuram", state: "Kerala", pincode: "695023", address: "East Fort", sc: "KL" },
      { name: "Kozhikode Hub", city: "Kozhikode", state: "Kerala", pincode: "673001", address: "SM Street", sc: "KL" },

      // MADHYA PRADESH
      { name: "MP Nagar Hub", city: "Bhopal", state: "Madhya Pradesh", pincode: "462011", address: "MP Nagar Zone 2", sc: "MP" },
      { name: "Vijay Nagar Hub", city: "Indore", state: "Madhya Pradesh", pincode: "452010", address: "Vijay Nagar Square", sc: "MP" },
      { name: "Wright Town Hub", city: "Jabalpur", state: "Madhya Pradesh", pincode: "482001", address: "Wright Town", sc: "MP" },
      { name: "Gwalior Center", city: "Gwalior", state: "Madhya Pradesh", pincode: "474001", address: "City Center", sc: "MP" },
      { name: "Ujjain Hub", city: "Ujjain", state: "Madhya Pradesh", pincode: "456001", address: "Freeganj", sc: "MP" },

      // WEST BENGAL
      { name: "Salt Lake Hub", city: "Kolkata", state: "West Bengal", pincode: "700091", address: "Sector V, Salt Lake", sc: "WB" },
      { name: "Park Street Center", city: "Kolkata", state: "West Bengal", pincode: "700016", address: "Park Street", sc: "WB" },
      { name: "Newtown Hub", city: "Kolkata", state: "West Bengal", pincode: "700156", address: "Newtown Action Area", sc: "WB" },
      { name: "Siliguri Hub", city: "Siliguri", state: "West Bengal", pincode: "734001", address: "Hill Cart Road", sc: "WB" },
      { name: "Durgapur Hub", city: "Durgapur", state: "West Bengal", pincode: "713201", address: "City Center", sc: "WB" },

      // GOA
      { name: "Calangute Hub", city: "Goa", state: "Goa", pincode: "403516", address: "Calangute Beach Road", sc: "GA" },
      { name: "Panjim Center", city: "Goa", state: "Goa", pincode: "403001", address: "Panjim City Center", sc: "GA" },
      { name: "Margao Hub", city: "Goa", state: "Goa", pincode: "403601", address: "Margao Market", sc: "GA" },

      // PUNJAB / CH
      { name: "Sector 17 Hub", city: "Chandigarh", state: "Chandigarh", pincode: "160017", address: "Sector 17", sc: "CH" },
      { name: "Golden Temple Hub", city: "Amritsar", state: "Punjab", pincode: "143001", address: "Near Golden Temple", sc: "PB" },
      { name: "Ferozepur Road Hub", city: "Ludhiana", state: "Punjab", pincode: "141001", address: "Ferozepur Road", sc: "PB" },
      { name: "Jalandhar Center", city: "Jalandhar", state: "Punjab", pincode: "144001", address: "Model Town", sc: "PB" },

      // UTTARAKHAND
      { name: "Rajpur Road Hub", city: "Dehradun", state: "Uttarakhand", pincode: "248001", address: "Rajpur Road", sc: "UK" },
      { name: "Mall Road Mussoorie", city: "Mussoorie", state: "Uttarakhand", pincode: "248179", address: "Mall Road", sc: "UK" },
      { name: "Tapovan Hub", city: "Rishikesh", state: "Uttarakhand", pincode: "249137", address: "Tapovan", sc: "UK" },
      { name: "Har Ki Pauri Hub", city: "Haridwar", state: "Uttarakhand", pincode: "249401", address: "Near Har Ki Pauri", sc: "UK" },

      // HP / J&K
      { name: "Mall Road Shimla", city: "Shimla", state: "Himachal Pradesh", pincode: "171001", address: "Mall Road", sc: "HP" },
      { name: "McLeodganj Hub", city: "Dharamsala", state: "Himachal Pradesh", pincode: "176219", address: "McLeodganj", sc: "HP" },
      { name: "Dal Lake Hub", city: "Srinagar", state: "Jammu & Kashmir", pincode: "190001", address: "Near Dal Lake", sc: "JK" },

      // ODISHA / BIHAR / JHARKHAND
      { name: "Janpath Hub", city: "Bhubaneswar", state: "Odisha", pincode: "751001", address: "Janpath", sc: "OD" },
      { name: "Cuttack Center", city: "Cuttack", state: "Odisha", pincode: "753001", address: "Buxi Bazaar", sc: "OD" },
      { name: "Boring Road Hub", city: "Patna", state: "Bihar", pincode: "800001", address: "Boring Road", sc: "BR" },
      { name: "Main Road Hub", city: "Ranchi", state: "Jharkhand", pincode: "834001", address: "Main Road", sc: "JH" },
      { name: "Bistupur Hub", city: "Jamshedpur", state: "Jharkhand", pincode: "831001", address: "Bistupur", sc: "JH" },

      // OTHERS
      { name: "Pandri Hub", city: "Raipur", state: "Chhattisgarh", pincode: "492001", address: "Pandri", sc: "CG" },
      { name: "GS Road Hub", city: "Guwahati", state: "Assam", pincode: "781005", address: "GS Road", sc: "AS" },
      { name: "White Town Hub", city: "Pondicherry", state: "Puducherry", pincode: "605001", address: "White Town", sc: "PY" },
    ];

    const locations = await Location.insertMany(
      allLocations.map((l) => ({
        name: l.name, city: l.city, state: l.state,
        pincode: l.pincode, address: l.address, isActive: true,
      }))
    );
    console.log(`📍 Locations: ${locations.length}`);

    const cityLocMap = {};
    const citySCMap = {};
    allLocations.forEach((al, i) => {
      if (!cityLocMap[al.city]) cityLocMap[al.city] = [];
      cityLocMap[al.city].push(locations[i]);
      citySCMap[al.city] = al.sc;
    });

    // ═══════════════════════════════════════════════
    // 👑 USERS - SINGLE OWNER SETUP
    // ═══════════════════════════════════════════════
    const admin = await User.create({
      name: "RentiGo Admin",
      email: "admin@rentigo.com",
      password: "Admin@123",
      phone: "9000000001",
      role: "admin",
      isActive: true,
      isVerified: true,
    });

    // 🔥 SINGLE OWNER - Handles ALL vehicles
    const owners = await User.create([
      {
        name: "Rajesh Kumar",
        email: "owner@rentigo.com",
        password: "Owner@123",
        phone: "9000000002",
        role: "owner",
        businessName: "RentiGo Fleet Services",
        isActive: true,
        isVerified: true,
      },
    ]);

    await User.create({
      name: "Test Customer",
      email: "customer@rentigo.com",
      password: "Customer@123",
      phone: "9111111111",
      role: "customer",
      isActive: true,
    });

    console.log(`👑 Admin: admin@rentigo.com`);
    console.log(`🏢 Owner: owner@rentigo.com (RentiGo Fleet Services)`);
    console.log(`👤 Customer: customer@rentigo.com`);

    // ═══════════════════════════════════════════════
    // 🚗 TOP POPULAR CARS (27 models)
    // ═══════════════════════════════════════════════
    const cars = [
      // MARUTI SUZUKI (8)
      { brand: "Maruti Suzuki", model: "Swift", yr: 2024, fuel: "petrol", trans: "manual", seats: 5, d: 1499, w: 8999, m: 29999 },
      { brand: "Maruti Suzuki", model: "Dzire", yr: 2024, fuel: "petrol", trans: "manual", seats: 5, d: 1599, w: 9499, m: 31999 },
      { brand: "Maruti Suzuki", model: "Baleno", yr: 2024, fuel: "petrol", trans: "manual", seats: 5, d: 1699, w: 9999, m: 33999 },
      { brand: "Maruti Suzuki", model: "WagonR", yr: 2024, fuel: "petrol", trans: "manual", seats: 5, d: 1199, w: 6999, m: 23999 },
      { brand: "Maruti Suzuki", model: "Brezza", yr: 2024, fuel: "petrol", trans: "automatic", seats: 5, d: 1999, w: 11999, m: 39999 },
      { brand: "Maruti Suzuki", model: "Ertiga", yr: 2024, fuel: "petrol", trans: "manual", seats: 7, d: 2499, w: 14999, m: 49999 },
      { brand: "Maruti Suzuki", model: "Alto K10", yr: 2024, fuel: "petrol", trans: "manual", seats: 5, d: 899, w: 5499, m: 17999 },
      { brand: "Maruti Suzuki", model: "Grand Vitara", yr: 2024, fuel: "hybrid", trans: "automatic", seats: 5, d: 2999, w: 17999, m: 59999 },

      // HYUNDAI (4)
      { brand: "Hyundai", model: "i20", yr: 2024, fuel: "petrol", trans: "manual", seats: 5, d: 1699, w: 9999, m: 33999 },
      { brand: "Hyundai", model: "Creta", yr: 2024, fuel: "diesel", trans: "automatic", seats: 5, d: 2799, w: 16999, m: 54999 },
      { brand: "Hyundai", model: "Venue", yr: 2024, fuel: "petrol", trans: "manual", seats: 5, d: 1799, w: 10999, m: 35999 },
      { brand: "Hyundai", model: "Verna", yr: 2024, fuel: "petrol", trans: "automatic", seats: 5, d: 2299, w: 13999, m: 45999 },

      // TATA (5)
      { brand: "Tata", model: "Nexon", yr: 2024, fuel: "petrol", trans: "manual", seats: 5, d: 1999, w: 11999, m: 39999 },
      { brand: "Tata", model: "Punch", yr: 2024, fuel: "petrol", trans: "manual", seats: 5, d: 1399, w: 7999, m: 27999 },
      { brand: "Tata", model: "Harrier", yr: 2024, fuel: "diesel", trans: "automatic", seats: 5, d: 2999, w: 17999, m: 59999 },
      { brand: "Tata", model: "Safari", yr: 2024, fuel: "diesel", trans: "automatic", seats: 7, d: 3299, w: 19999, m: 64999 },
      { brand: "Tata", model: "Altroz", yr: 2024, fuel: "petrol", trans: "manual", seats: 5, d: 1299, w: 7499, m: 24999 },

      // MAHINDRA (4)
      { brand: "Mahindra", model: "Thar", yr: 2024, fuel: "diesel", trans: "manual", seats: 4, d: 2999, w: 17999, m: 59999 },
      { brand: "Mahindra", model: "XUV700", yr: 2024, fuel: "diesel", trans: "automatic", seats: 7, d: 3499, w: 20999, m: 69999 },
      { brand: "Mahindra", model: "Scorpio N", yr: 2024, fuel: "diesel", trans: "manual", seats: 7, d: 2799, w: 16999, m: 54999 },
      { brand: "Mahindra", model: "Bolero", yr: 2024, fuel: "diesel", trans: "manual", seats: 7, d: 1999, w: 11999, m: 39999 },

      // KIA (2)
      { brand: "Kia", model: "Seltos", yr: 2024, fuel: "petrol", trans: "automatic", seats: 5, d: 2499, w: 14999, m: 49999 },
      { brand: "Kia", model: "Sonet", yr: 2024, fuel: "diesel", trans: "automatic", seats: 5, d: 1999, w: 11999, m: 39999 },

      // TOYOTA (2)
      { brand: "Toyota", model: "Innova Crysta", yr: 2023, fuel: "diesel", trans: "manual", seats: 7, d: 3499, w: 20999, m: 69999 },
      { brand: "Toyota", model: "Fortuner", yr: 2024, fuel: "diesel", trans: "automatic", seats: 7, d: 4999, w: 29999, m: 99999 },

      // HONDA (2)
      { brand: "Honda", model: "City", yr: 2024, fuel: "petrol", trans: "manual", seats: 5, d: 1999, w: 11999, m: 39999 },
      { brand: "Honda", model: "Amaze", yr: 2024, fuel: "petrol", trans: "manual", seats: 5, d: 1499, w: 8999, m: 29999 },
    ];

    // ═══════════════════════════════════════════════
    // 🏍️ TOP POPULAR BIKES (16 models)
    // ═══════════════════════════════════════════════
    const bikes = [
      { brand: "Royal Enfield", model: "Classic 350", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 999, w: 5999, m: 19999 },
      { brand: "Royal Enfield", model: "Bullet 350", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 899, w: 5499, m: 17999 },
      { brand: "Royal Enfield", model: "Meteor 350", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 1099, w: 6499, m: 21999 },
      { brand: "Bajaj", model: "Pulsar 150", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 599, w: 3499, m: 11999 },
      { brand: "Bajaj", model: "Pulsar NS200", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 799, w: 4799, m: 15999 },
      { brand: "Bajaj", model: "Avenger 220", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 799, w: 4799, m: 15999 },
      { brand: "Hero", model: "Splendor Plus", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 349, w: 1999, m: 6999 },
      { brand: "Hero", model: "HF Deluxe", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 299, w: 1799, m: 5999 },
      { brand: "Hero", model: "Glamour", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 449, w: 2699, m: 8999 },
      { brand: "Honda", model: "Shine", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 449, w: 2699, m: 8999 },
      { brand: "Honda", model: "Unicorn", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 499, w: 2999, m: 9999 },
      { brand: "Honda", model: "Hornet 2.0", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 699, w: 3999, m: 13999 },
      { brand: "TVS", model: "Apache RTR 160", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 599, w: 3499, m: 11999 },
      { brand: "TVS", model: "Apache RR 310", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 1299, w: 7799, m: 25999 },
      { brand: "Yamaha", model: "FZ-S", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 599, w: 3499, m: 11999 },
      { brand: "Yamaha", model: "R15 V4", yr: 2024, fuel: "petrol", trans: "manual", seats: 2, d: 999, w: 5999, m: 19999 },
    ];

    // ═══════════════════════════════════════════════
    // 🛵 TOP POPULAR SCOOTERS (4 models)
    // ═══════════════════════════════════════════════
    const scooters = [
      { brand: "Honda", model: "Activa 6G", yr: 2024, fuel: "petrol", trans: "automatic", seats: 2, d: 399, w: 2299, m: 7999 },
      { brand: "Honda", model: "Dio", yr: 2024, fuel: "petrol", trans: "automatic", seats: 2, d: 399, w: 2299, m: 7999 },
      { brand: "TVS", model: "Jupiter", yr: 2024, fuel: "petrol", trans: "automatic", seats: 2, d: 399, w: 2299, m: 7999 },
      { brand: "Suzuki", model: "Access 125", yr: 2024, fuel: "petrol", trans: "automatic", seats: 2, d: 399, w: 2299, m: 7999 },
    ];

    const allV = [
      ...cars.map((c) => ({ ...c, type: "4W" })),
      ...bikes.map((b) => ({ ...b, type: "2W" })),
      ...scooters.map((s) => ({ ...s, type: "2W" })),
    ];

    console.log(`\n📦 Total unique vehicle models: ${allV.length}`);
    console.log(`   Cars: ${cars.length}, Bikes: ${bikes.length}, Scooters: ${scooters.length}`);

    const colors4W = ["Pearl White", "Midnight Black", "Starlight Blue", "Fiery Red", "Silver Metallic", "Grey Metallic", "Burgundy", "Sunset Orange", "Arctic White", "Deep Blue"];
    const colors2W = ["Matte Black", "Racing Red", "Sapphire Blue", "Pearl White", "Neon Green", "Grey", "Wine Red", "Stealth Black", "Orange", "Silver"];
    const feat4W = ["Apple CarPlay", "Android Auto", "Rear Camera", "Keyless Entry", "Cruise Control", "ABS", "6 Airbags", "Alloy Wheels", "Automatic Climate Control", "Push Button Start", "Sunroof", "Parking Sensors", "LED Headlights", "Touchscreen Infotainment", "USB Charging", "Bluetooth Audio", "Fog Lamps", "Rain Sensing Wipers"];
    const feat2W = ["LED Headlight", "USB Charging", "Digital Console", "Tubeless Tyres", "Disc Brake", "ABS", "Side Stand Cut-off", "Alloy Wheels", "Under Seat Storage", "Mobile Charger", "Bluetooth Connectivity"];

    console.log("\n🚗 Creating vehicles with CITY-WISE VARIETY...");
    const cities = Object.keys(cityLocMap);
    const vehicleDocs = [];
    const usedPlates = new Set();

    // City-wise variety
    const bigCities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Surat"];
    const mediumCities = ["Lucknow", "Nagpur", "Indore", "Bhopal", "Vadodara", "Chandigarh", "Kochi", "Goa", "Coimbatore", "Visakhapatnam"];

    cities.forEach((city) => {
      const locs = cityLocMap[city];
      const sc = citySCMap[city];

      let percentage;
      if (bigCities.includes(city)) {
        percentage = randNum(75, 95);
      } else if (mediumCities.includes(city)) {
        percentage = randNum(55, 75);
      } else {
        percentage = randNum(35, 60);
      }

      const shuffledVehicles = shuffle(allV);
      const numVehiclesForCity = Math.floor((allV.length * percentage) / 100);
      const selectedVehicles = shuffledVehicles.slice(0, numVehiclesForCity);

      selectedVehicles.forEach((v) => {
        const numInstances = randNum(1, 2);

        for (let n = 0; n < numInstances; n++) {
          const loc = rand(locs);

          let plate;
          let tries = 0;
          do {
            plate = genPlate(sc);
            tries++;
          } while (usedPlates.has(plate) && tries < 200);

          if (usedPlates.has(plate)) continue;
          usedPlates.add(plate);

          const isCar = v.type === "4W";
          vehicleDocs.push({
            // 🔥 SINGLE OWNER - All vehicles owned by Rajesh Kumar (RentiGo Fleet Services)
            owner: owners[0]._id,
            location: loc._id,
            vehicleNumber: plate,
            brand: v.brand,
            model: v.model,
            modelYear: v.yr,
            type: v.type,
            fuelType: v.fuel,
            transmission: v.trans,
            seatingCapacity: v.seats,
            color: rand(isCar ? colors4W : colors2W),
            description: `${v.brand} ${v.model} ${v.yr} available for rent in ${city}. Well maintained vehicle with full insurance and 24x7 support.`,
            features: [...(isCar ? feat4W : feat2W)].sort(() => Math.random() - 0.5).slice(0, randNum(4, 7)),
            images: [],
            pricing: { daily: v.d, weekly: v.w, monthly: v.m },
            status: "available",
            listingStatus: "approved",
            isActive: true,
            totalBookings: randNum(0, 50),
            totalRevenue: randNum(5000, 200000),
            averageRating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
            totalReviews: randNum(0, 30),
          });
        }
      });
    });

    console.log(`📦 Total vehicles to insert: ${vehicleDocs.length}`);

    const batch = 500;
    for (let i = 0; i < vehicleDocs.length; i += batch) {
      const chunk = vehicleDocs.slice(i, i + batch);
      try {
        await Vehicle.insertMany(chunk, { ordered: false });
      } catch (e) {
        // Skip dupes
      }
      console.log(`  ✅ ${Math.min(i + batch, vehicleDocs.length)}/${vehicleDocs.length}`);
    }

    const total = await Vehicle.countDocuments();
    console.log(`\n🎉 ═══════════════════════════════════════`);
    console.log(`   ✅ SEED COMPLETE!`);
    console.log(`═══════════════════════════════════════════`);
    console.log(`📍 Cities: ${cities.length}`);
    console.log(`📍 Locations: ${locations.length}`);
    console.log(`🚗 Total Vehicles: ${total}`);
    console.log(`🚙 Unique Models: ${allV.length}`);
    console.log(`   • Cars: ${cars.length}`);
    console.log(`   • Bikes: ${bikes.length}`);
    console.log(`   • Scooters: ${scooters.length}`);
    console.log(`\n═══ 🔐 LOGIN CREDENTIALS ═══`);
    console.log(`👑 Admin:    admin@rentigo.com    / Admin@123`);
    console.log(`🏢 Owner:    owner@rentigo.com    / Owner@123`);
    console.log(`👤 Customer: customer@rentigo.com / Customer@123`);
    console.log(`\n🏢 Owner Details:`);
    console.log(`   Name: Rajesh Kumar`);
    console.log(`   Business: RentiGo Fleet Services`);
    console.log(`   Owns ALL ${total} vehicles`);
    console.log(`═══════════════════════════════════════════\n`);

    console.log("📊 City-wise Vehicle Variety:");
    for (const city of cities) {
      const locs = cityLocMap[city];
      const cnt = await Vehicle.countDocuments({ location: { $in: locs.map((l) => l._id) } });
      const uniqueModels = await Vehicle.distinct("model", { location: { $in: locs.map((l) => l._id) } });
      console.log(`   📍 ${city.padEnd(20)} → ${cnt} vehicles, ${uniqueModels.length} unique models`);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
};

seedData();