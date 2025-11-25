
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- CONEXIÓN A MONGODB ---
// Conexión actualizada con tu contraseña y base de datos específica 'oasis_db'
const MONGO_URI = 'mongodb+srv://nmoreavi:F4d3S2a1008@oasisdb.afi1bjg.mongodb.net/oasis_db?retryWrites=true&w=majority&appName=OasisDB';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// --- MODELOS (SCHEMAS) ---

// 1. Usuario (Simple para prototipo)
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: String
});
const User = mongoose.model('User', UserSchema);

// 2. Sistema (Invernadero)
const SystemSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referencia a User
    name: String,
    created_at: { type: Date, default: Date.now }
});
const System = mongoose.model('System', SystemSchema);

// 3. Sensor
const SensorSchema = new mongoose.Schema({
    hardware_id: { type: Number, required: true }, // ID físico del NodeMCU
    system_id: { type: mongoose.Schema.Types.ObjectId, ref: 'System' },
    name: String,
    location: String,
    created_at: { type: Date, default: Date.now }
});
const Sensor = mongoose.model('Sensor', SensorSchema);

// 4. Lecturas (Con AUTO-LIMPIEZA / TTL)
const ReadingSchema = new mongoose.Schema({
    sensor_id: { type: Number, required: true }, // Referencia al hardware_id
    temperature: Number,
    humidity: Number,
    created_at: { 
        type: Date, 
        default: Date.now,
        expires: 2592000 // REQUISITO PROFESOR: Se borra automáticamente tras 30 días (en segundos)
    } 
});
const Reading = mongoose.model('Reading', ReadingSchema);

// 5. Calendario de Riego
const ScheduleSchema = new mongoose.Schema({
    system_id: { type: mongoose.Schema.Types.ObjectId, ref: 'System' },
    next_watering_time: Date,
    frequency_days: Number,
    is_active: Boolean
});
const Schedule = mongoose.model('Schedule', ScheduleSchema);


// --- RUTAS API (ENDPOINTS) ---

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        // Devolvemos estructura similar a Supabase para no romper el frontend
        res.json({ user: { id: user._id, email: user.email } });
    } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
    }
});

// Registro
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const newUser = new User({ email, password });
        await newUser.save();
        res.json({ user: { id: newUser._id, email: newUser.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener Sistemas
app.get('/api/systems/:userId', async (req, res) => {
    try {
        const systems = await System.find({ user_id: req.params.userId });
        // Mapeamos _id a id para compatibilidad con frontend
        const mapped = systems.map(s => ({ id: s._id, name: s.name, user_id: s.user_id, created_at: s.created_at }));
        res.json(mapped);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Crear Sistema
app.post('/api/systems', async (req, res) => {
    const { user_id, name } = req.body;
    const newSystem = new System({ user_id, name });
    await newSystem.save();
    res.json({ id: newSystem._id, name, user_id });
});

// Obtener Sensores
app.get('/api/sensors/:systemId', async (req, res) => {
    try {
        const sensors = await Sensor.find({ system_id: req.params.systemId });
        const mapped = sensors.map(s => ({ id: s.hardware_id, name: s.name, location: s.location, system_id: s.system_id }));
        res.json(mapped);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Crear Sensor
app.post('/api/sensors', async (req, res) => {
    const { id, system_id, name, location } = req.body;
    try {
        const newSensor = new Sensor({ hardware_id: id, system_id, name, location });
        await newSensor.save();
        res.json({ id, system_id, name, location });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Obtener Lecturas (Con Joins simulados para traer nombre del sensor)
app.get('/api/readings/:systemId', async (req, res) => {
    try {
        // 1. Buscamos todos los sensores de este sistema
        const systemSensors = await Sensor.find({ system_id: req.params.systemId });
        const hardwareIds = systemSensors.map(s => s.hardware_id);

        // 2. Buscamos lecturas que coincidan con esos IDs de hardware
        const readings = await Reading.find({ sensor_id: { $in: hardwareIds } })
            .sort({ created_at: -1 })
            .limit(100);

        // 3. Combinamos datos para el frontend
        const mappedReadings = readings.map(r => {
            const sensor = systemSensors.find(s => s.hardware_id === r.sensor_id);
            return {
                id: r._id, // Usamos el ID de mongo
                sensor_id: r.sensor_id,
                created_at: r.created_at,
                temperature: r.temperature,
                humidity: r.humidity,
                sensors: { name: sensor ? sensor.name : 'Desconocido' }
            };
        });
        
        res.json(mappedReadings);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Endpoint IoT (Para el NodeMCU)
app.post('/api/readings', async (req, res) => {
    const { sensor_id, temperature, humidity } = req.body;
    try {
        const newReading = new Reading({ sensor_id, temperature, humidity });
        await newReading.save();
        res.json({ message: 'Dato guardado en MongoDB', id: newReading._id });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Calendario
app.get('/api/schedule/:systemId', async (req, res) => {
    const schedule = await Schedule.findOne({ system_id: req.params.systemId });
    if (!schedule) return res.status(404).json(null);
    res.json({ 
        id: schedule._id, 
        system_id: schedule.system_id, 
        next_watering_time: schedule.next_watering_time,
        frequency_days: schedule.frequency_days,
        is_active: schedule.is_active
    });
});

app.post('/api/schedule', async (req, res) => {
    const { system_id, next_watering_time, frequency_days, is_active } = req.body;
    const filter = { system_id };
    const update = { next_watering_time, frequency_days, is_active };
    // Upsert: Actualiza si existe, crea si no
    const result = await Schedule.findOneAndUpdate(filter, update, { new: true, upsert: true });
    res.json({
        id: result._id,
        system_id: result.system_id,
        next_watering_time: result.next_watering_time,
        frequency_days: result.frequency_days,
        is_active: result.is_active
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor MERN corriendo en http://localhost:${PORT}`);
    console.log(`📦 Esperando conexión a MongoDB...`);
});
