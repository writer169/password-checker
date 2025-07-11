export default function handler(req, res) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обрабатываем preflight запросы
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Получаем мастер-пароль из переменных окружения
    const masterPassword = process.env.MASTER_PASSWORD;
    
    if (!masterPassword) {
      console.error('MASTER_PASSWORD environment variable not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Получаем пароль из запроса
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Проверяем пароль
    if (password === masterPassword) {
      // Генерируем простой токен (в продакшене используйте JWT)
      const token = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
      
      return res.status(200).json({ 
        success: true, 
        token: token,
        message: 'Authentication successful' 
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid password' 
      });
    }

  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}