require('dotenv').config();
console.log('🔗 DATABASE_URL =', process.env.DATABASE_URL);

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', require('./routes/auth.routes'));
app.use('/users', require('./routes/users.routes'));
app.use('/companies', require('./routes/companies.routes'));
app.use('/sites', require('./routes/sites.routes'));
app.use('/products', require('./routes/products.routes'));
app.use('/lots', require('./routes/lots.routes'));
app.use('/transfers', require('./routes/transfers.routes'));
app.use('/costs', require('./routes/costs.routes'));
app.use('/alerts', require('./routes/alerts.routes'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno' });
});

app.listen(PORT, () => console.log(`🚀 Backend en puerto ${PORT}`));

const db = require('./config/database');
db.query('SELECT NOW()', []).then(res => {
  console.log('🗄️ Conexión OK, hora:', res.rows[0]);
}).catch(err => console.error('❌ Error de conexión:', err));
