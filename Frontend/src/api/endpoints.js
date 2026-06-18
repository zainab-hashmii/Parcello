import api from './client'

// User / auth
export const login = (email, password) => api.post('/user/login', { email, password })
export const signUp = (payload) => api.post('/user/signUp', payload)
export const getUserByEmail = (email) => api.get('/user/getuserfromemail', { params: { email } })
export const getAllUsers = () => api.get('/user')

// Customer
export const getCustomers = () => api.get('/Customer')

// Rider
export const getRiders = () => api.get('/rider')
export const registerVehicle = (payload) => api.post('/rider/registerVehicle', payload)

// Parcel
export const addParcel = (payload) => api.post('/parcel/addParcel', payload)
export const getParcelsOfCustomer = (customerId) =>
  api.get('/parcel/getparcelsofcustomer', { params: { customerId } })
export const getParcelsOfBatch = (batchId) =>
  api.get('/parcel/getparcelsofbatch', { params: { batchId } })

// Batch
export const getBatches = () => api.get('/Batch')
export const getBatchesByLocation = (city, country) =>
  api.get('/Batch/byLocation', { params: { city, country } })
export const getRiderBatches = (riderId) => api.get('/Batch/getriderbatches', { params: { riderId } })
export const createBatch = (payload) => api.post('/Batch', payload)
export const dropBatch = (batchId) => api.post('/Batch/dropBatch', null, { params: { batchId } })
export const changeCurrentRider = (batchId, riderId) =>
  api.post('/Batch/changeCurrentRider', { batchId, riderId })
export const changeBatchLocation = (batchId, riderId, location) =>
  api.post('/Batch/changeLocation', { batchId, riderId, location })
export const assignRider = (batchId, riderId) => api.post('/Batch/assignRider', { batchId, riderId })

// Parcel log (tracking)
export const getParcelLog = (parcelID) => api.get('/parcelLog', { params: { parcelID } })
export const changeParcelStatus = (parcelId, status) =>
  api.post('/parcelLog/changeStatus', { parcelId, status })
export const changeDeliveredDate = (parcelId, deliveredDate) =>
  api.post('/parcelLog/changeDeliveredDate', { parcelId, deliveredDate })

// Payment
export const getPayments = () => api.get('/Payment')
export const getPaymentForParcel = (id) => api.get('/Payment/getpaymentfromparcel', { params: { id } })
export const createPayment = (payload) => api.post('/Payment', payload)

// Location
export const getLocations = () => api.get('/Location')
export const createLocation = (payload) => api.post('/Location', payload)

// Rating
export const getRatings = () => api.get('/Rating')
export const createRating = (payload) => api.post('/Rating', payload)

// Route
export const getRoutes = () => api.get('/route')
export const createRoute = (payload) => api.post('/route', payload)

// Pricing
export const getPricingConfig = () => api.get('/pricing')
export const updatePricingConfig = (payload) => api.post('/pricing', payload)
export const getPriceQuote = (originId, destinationId, weight) =>
  api.get('/pricing/quote', { params: { originId, destinationId, weight } })
export const getPriceQuoteByCoords = (origin, destination, weight) =>
  api.get('/pricing/quote', {
    params: {
      originLat: origin.lat,
      originLng: origin.lng,
      destinationLat: destination.lat,
      destinationLng: destination.lng,
      weight,
    },
  })
