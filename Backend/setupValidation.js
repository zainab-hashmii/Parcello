require('dotenv').config();
const mongoose = require('mongoose');

// Applies MongoDB-level JSON Schema validation + indexes to every collection.
// Safe to re-run: uses collMod (or creates the collection first) and createIndex,
// both idempotent.

const VALIDATORS = {
  users: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password', 'accountType'],
      properties: {
        name: { bsonType: 'string', minLength: 1 },
        email: { bsonType: 'string', pattern: '^.+@.+\\..+$' },
        phone: { bsonType: ['string', 'null'] },
        password: { bsonType: 'string', minLength: 1 },
        accountType: { enum: ['Rider', 'Customer', 'Admin'] },
        // Customer
        address: { bsonType: ['string', 'null'] },
        // Rider
        vehicle: { bsonType: ['objectId', 'null'] },
        accountNo: { bsonType: ['string', 'null'] },
        dueAmount: { bsonType: ['number', 'null'] },
        // Admin
        authority: { bsonType: ['string', 'null'] },
      },
    },
  },

  vehicles: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['model', 'licenseNumber', 'vehicleType'],
      properties: {
        model: { bsonType: 'string', minLength: 1 },
        licenseNumber: { bsonType: 'string', minLength: 1 },
        status: { enum: ['IN_TRANSIT', 'AVAILABLE', 'NOT_AVAILABLE'] },
        vehicleType: { enum: ['TRUCK', 'SHIP', 'AIRPLANE'] },
        truckCapacity: { bsonType: ['number', 'null'] },
        cargoCapacity: { bsonType: ['number', 'null'] },
        maxLoad: { bsonType: ['number', 'null'] },
      },
    },
  },

  locations: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['country', 'city'],
      properties: {
        country: { bsonType: 'string', minLength: 1 },
        city: { bsonType: 'string', minLength: 1 },
      },
    },
  },

  routes: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['origin', 'destination', 'basePayment'],
      properties: {
        origin: { bsonType: 'objectId' },
        destination: { bsonType: 'objectId' },
        basePayment: { bsonType: 'number', minimum: 0 },
      },
    },
  },

  batches: {
    $jsonSchema: {
      bsonType: 'object',
      properties: {
        weight: { bsonType: 'number', minimum: 0 },
        destination: { bsonType: ['objectId', 'null'] },
        currentLocation: { bsonType: ['objectId', 'null'] },
        status: { enum: ['Pending', 'Ready', 'IN_TRANSIT', 'Delivered'] },
        rider: { bsonType: ['objectId', 'null'] },
      },
    },
  },

  parcels: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['weight', 'customer'],
      properties: {
        type: { bsonType: ['string', 'null'] },
        weight: { bsonType: 'number', minimum: 0, exclusiveMinimum: true },
        origin: { bsonType: ['objectId', 'null'] },
        destination: { bsonType: ['objectId', 'null'] },
        address: { bsonType: ['string', 'null'] },
        sendAddress: { bsonType: ['string', 'null'] },
        customer: { bsonType: 'objectId' },
        batch: { bsonType: ['objectId', 'null'] },
      },
    },
  },

  parcellogs: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['parcel'],
      properties: {
        parcel: { bsonType: 'objectId' },
        status: {
          enum: ['PICKED_UP', 'WAITING', 'IN_TRANSIT', 'AT_WAREHOUSE', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_DELIVERY'],
        },
        placementDate: { bsonType: ['string', 'null'] },
        location: { bsonType: ['objectId', 'null'] },
        deliveredDate: { bsonType: ['string', 'null'] },
      },
    },
  },

  payments: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['amount', 'parcel'],
      properties: {
        amount: { bsonType: 'number', minimum: 0 },
        paymentDate: { bsonType: ['string', 'null'] },
        paymentStatus: { enum: ['Paid', 'Pending', 'Partially_Paid'] },
        parcel: { bsonType: 'objectId' },
      },
    },
  },

  ratings: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['stars', 'rider'],
      properties: {
        stars: { bsonType: 'number', minimum: 1, maximum: 5 },
        review: { bsonType: ['string', 'null'] },
        rider: { bsonType: 'objectId' },
      },
    },
  },
};

const INDEXES = {
  users: [
    { keys: { email: 1 }, options: { unique: true, name: 'uniq_email' } },
    { keys: { accountType: 1 }, options: { name: 'idx_accountType' } },
  ],
  vehicles: [{ keys: { licenseNumber: 1 }, options: { unique: true, name: 'uniq_licenseNumber' } }],
  locations: [{ keys: { city: 1, country: 1 }, options: { unique: true, name: 'uniq_city_country' } }],
  routes: [{ keys: { origin: 1, destination: 1 }, options: { unique: true, name: 'uniq_origin_destination' } }],
  batches: [
    { keys: { status: 1 }, options: { name: 'idx_status' } },
    { keys: { currentLocation: 1, status: 1 }, options: { name: 'idx_location_status' } },
    { keys: { rider: 1 }, options: { name: 'idx_rider' } },
  ],
  parcels: [
    { keys: { customer: 1 }, options: { name: 'idx_customer' } },
    { keys: { batch: 1 }, options: { name: 'idx_batch' } },
  ],
  parcellogs: [
    { keys: { parcel: 1 }, options: { unique: true, name: 'uniq_parcel' } },
    { keys: { status: 1 }, options: { name: 'idx_status' } },
  ],
  payments: [{ keys: { parcel: 1 }, options: { name: 'idx_parcel' } }],
  ratings: [{ keys: { rider: 1 }, options: { name: 'idx_rider' } }],
};

async function ensureCollection(db, name) {
  const existing = await db.listCollections({ name }).toArray();
  if (existing.length === 0) {
    await db.createCollection(name);
    console.log(`  created collection ${name}`);
  }
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  console.log(`Connected to ${db.databaseName}`);

  console.log('\nApplying JSON Schema validation...');
  for (const [collection, validator] of Object.entries(VALIDATORS)) {
    await ensureCollection(db, collection);
    await db.command({
      collMod: collection,
      validator,
      validationLevel: 'moderate', // validate new inserts/updates, don't break existing docs
      validationAction: 'error',
    });
    console.log(`  validator set on ${collection}`);
  }

  console.log('\nCreating indexes...');
  for (const [collection, indexes] of Object.entries(INDEXES)) {
    const coll = db.collection(collection);
    for (const { keys, options } of indexes) {
      try {
        await coll.createIndex(keys, options);
        console.log(`  index ${options.name} on ${collection}`);
      } catch (err) {
        if (err.codeName === 'IndexOptionsConflict' || err.codeName === 'IndexKeySpecsConflict') {
          console.log(`  index on ${Object.keys(keys).join(',')} already exists on ${collection} (skipped)`);
        } else {
          throw err;
        }
      }
    }
  }

  console.log('\nDone. Validation level is "moderate" (only validates inserts and updates to already-valid docs), so existing data is untouched but new writes are enforced.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
