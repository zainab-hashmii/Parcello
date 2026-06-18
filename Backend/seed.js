require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Rider = require('./models/Rider');
const Customer = require('./models/Customer');
const Vehicle = require('./models/Vehicle');
const Location = require('./models/Location');
const Route = require('./models/Route');
const Batch = require('./models/Batch');
const Parcel = require('./models/Parcel');
const ParcelLog = require('./models/ParcelLog');
const Payment = require('./models/Payment');
const Rating = require('./models/Rating');

const CITIES = [
  { city: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011 },
  { city: 'Lahore', country: 'Pakistan', lat: 31.5497, lng: 74.3436 },
  { city: 'Islamabad', country: 'Pakistan', lat: 33.6844, lng: 73.0479 },
  { city: 'Faisalabad', country: 'Pakistan', lat: 31.4504, lng: 73.1350 },
  { city: 'Multan', country: 'Pakistan', lat: 30.1575, lng: 71.5249 },
  { city: 'Peshawar', country: 'Pakistan', lat: 34.0151, lng: 71.5249 },
];

// basePayment = price per kg
const ROUTES = [
  ['Karachi', 'Lahore', 45],
  ['Lahore', 'Karachi', 45],
  ['Karachi', 'Islamabad', 55],
  ['Islamabad', 'Karachi', 55],
  ['Lahore', 'Islamabad', 30],
  ['Islamabad', 'Lahore', 30],
  ['Lahore', 'Faisalabad', 20],
  ['Faisalabad', 'Lahore', 20],
  ['Karachi', 'Multan', 40],
  ['Multan', 'Karachi', 40],
  ['Islamabad', 'Peshawar', 25],
  ['Peshawar', 'Islamabad', 25],
];

const RIDERS = [
  { name: 'Bilal Ahmed', email: 'bilal.rider@parcello.test', phone: '03011112222', vehicleType: 'TRUCK', model: 'Hino 500', plate: 'KHI-1234', capacity: 1200 },
  { name: 'Sana Tariq', email: 'sana.rider@parcello.test', phone: '03022223333', vehicleType: 'TRUCK', model: 'Isuzu NPR', plate: 'LHR-5678', capacity: 900 },
  { name: 'Usman Raza', email: 'usman.rider@parcello.test', phone: '03033334444', vehicleType: 'SHIP', model: 'Cargo Vessel C-12', plate: 'SHIP-001', capacity: 50000 },
  { name: 'Ayesha Khan', email: 'ayesha.rider@parcello.test', phone: '03044445555', vehicleType: 'AIRPLANE', model: 'Cessna 208', plate: 'PLN-220', capacity: 1300 },
];

const CUSTOMERS = [
  { name: 'Hamza Sheikh', email: 'hamza.customer@parcello.test', phone: '03111111111', address: 'House 12, DHA Phase 5, Karachi' },
  { name: 'Mariam Iqbal', email: 'mariam.customer@parcello.test', phone: '03122222222', address: 'Flat 3B, Gulberg, Lahore' },
  { name: 'Fahad Malik', email: 'fahad.customer@parcello.test', phone: '03133333333', address: 'Street 9, F-7, Islamabad' },
];

const PARCEL_TYPES = [
  { type: 'SMALL', weight: 2 },
  { type: 'MEDIUM', weight: 6 },
  { type: 'LARGE', weight: 12 },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding');

  // 1. Locations
  const locationByCity = {};
  for (const loc of CITIES) {
    const doc = await Location.findOneAndUpdate(
      { city: loc.city, country: loc.country },
      loc,
      { upsert: true, new: true }
    );
    locationByCity[loc.city] = doc;
  }
  console.log(`Locations ready: ${Object.keys(locationByCity).join(', ')}`);

  // 2. Routes
  for (const [originCity, destCity, basePayment] of ROUTES) {
    await Route.findOneAndUpdate(
      { origin: locationByCity[originCity]._id, destination: locationByCity[destCity]._id },
      { origin: locationByCity[originCity]._id, destination: locationByCity[destCity]._id, basePayment },
      { upsert: true }
    );
  }
  console.log(`Routes ready: ${ROUTES.length}`);

  // 3. Riders + vehicles
  const riders = [];
  for (const r of RIDERS) {
    let rider = await Rider.findOne({ email: r.email });
    if (!rider) {
      rider = await Rider.create({
        name: r.name,
        email: r.email,
        phone: r.phone,
        password: 'password123',
        accountType: 'Rider',
        dueAmount: 0,
      });
    }
    if (!rider.vehicle) {
      const vehicleData = { vehicleType: r.vehicleType, model: r.model, licenseNumber: r.plate, status: 'AVAILABLE' };
      if (r.vehicleType === 'TRUCK') vehicleData.truckCapacity = r.capacity;
      if (r.vehicleType === 'SHIP') vehicleData.cargoCapacity = r.capacity;
      if (r.vehicleType === 'AIRPLANE') vehicleData.maxLoad = r.capacity;
      const vehicle = await Vehicle.create(vehicleData);
      rider.vehicle = vehicle._id;
      await rider.save();
    }
    riders.push(rider);
  }
  console.log(`Riders ready: ${riders.map((r) => r.name).join(', ')}`);

  // 4. Customers
  const customers = [];
  for (const c of CUSTOMERS) {
    let customer = await Customer.findOne({ email: c.email });
    if (!customer) {
      customer = await Customer.create({
        name: c.name,
        email: c.email,
        phone: c.phone,
        password: 'password123',
        accountType: 'Customer',
        address: c.address,
      });
    }
    customers.push(customer);
  }
  console.log(`Customers ready: ${customers.map((c) => c.name).join(', ')}`);

  // 5. Ratings for riders
  for (const rider of riders) {
    const existing = await Rating.findOne({ rider: rider._id });
    if (!existing) {
      await Rating.create({
        stars: 4 + Math.round(Math.random()),
        review: 'Delivered on time, handled the package with care.',
        rider: rider._id,
      });
    }
  }
  console.log('Ratings ready');

  // 6. Parcels + batches + logs + payments (a handful of realistic shipments)
  const shipments = [
    { customer: customers[0], origin: 'Karachi', destination: 'Lahore', parcel: PARCEL_TYPES[1], status: 'IN_TRANSIT', riderIdx: 0 },
    { customer: customers[1], origin: 'Lahore', destination: 'Islamabad', parcel: PARCEL_TYPES[0], status: 'DELIVERED', riderIdx: 1 },
    { customer: customers[2], origin: 'Islamabad', destination: 'Karachi', parcel: PARCEL_TYPES[2], status: 'WAITING', riderIdx: null },
    { customer: customers[0], origin: 'Karachi', destination: 'Multan', parcel: PARCEL_TYPES[0], status: 'OUT_FOR_DELIVERY', riderIdx: 2 },
    { customer: customers[1], origin: 'Lahore', destination: 'Faisalabad', parcel: PARCEL_TYPES[1], status: 'AT_WAREHOUSE', riderIdx: null },
  ];

  for (const s of shipments) {
    const origin = locationByCity[s.origin];
    const destination = locationByCity[s.destination];

    const existingParcel = await Parcel.findOne({
      customer: s.customer._id,
      origin: origin._id,
      destination: destination._id,
      weight: s.parcel.weight,
    });
    if (existingParcel) continue; // already seeded this one

    const rider = s.riderIdx !== null ? riders[s.riderIdx] : null;
    const parcelArrived = s.status === 'DELIVERED' || s.status === 'OUT_FOR_DELIVERY';
    const batch = await Batch.create({
      weight: s.parcel.weight,
      destination: destination._id,
      currentLocation: parcelArrived ? destination._id : origin._id,
      status: rider ? 'IN_TRANSIT' : 'Pending',
      rider: rider ? rider._id : null,
    });

    const parcel = await Parcel.create({
      type: s.parcel.type,
      weight: s.parcel.weight,
      origin: origin._id,
      destination: destination._id,
      address: `Delivery address in ${s.destination}`,
      sendAddress: `Pickup address in ${s.origin}`,
      customer: s.customer._id,
      batch: batch._id,
    });

    // Parcel.post('save') trigger already created a default WAITING log and a
    // Pending payment — overwrite them with the seed's intended final state
    // instead of inserting duplicates.
    await ParcelLog.findOneAndUpdate(
      { parcel: parcel._id },
      {
        parcel: parcel._id,
        status: s.status,
        placementDate: new Date().toISOString(),
        location: parcelArrived ? destination._id : origin._id,
        deliveredDate: s.status === 'DELIVERED' ? new Date().toISOString() : null,
      },
      { upsert: true }
    );

    const route = await Route.findOne({ origin: origin._id, destination: destination._id });
    const amount = route ? route.basePayment * s.parcel.weight : s.parcel.weight * 40;
    await Payment.findOneAndUpdate(
      { parcel: parcel._id },
      {
        amount,
        paymentStatus: s.status === 'DELIVERED' ? 'Paid' : 'Pending',
        paymentDate: s.status === 'DELIVERED' ? new Date().toISOString() : null,
        parcel: parcel._id,
      },
      { upsert: true }
    );
  }
  console.log(`Shipments ready: ${shipments.length}`);

  console.log('\nSeed complete. Sample login credentials (password: password123):');
  for (const c of customers) console.log(`  Customer: ${c.email}`);
  for (const r of riders) console.log(`  Rider:    ${r.email}`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
