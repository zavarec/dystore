import { NextApiRequest, NextApiResponse } from 'next';
import { requireCsrf } from '@/lib/csrf';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface CustomerInfo {
  email: string;
  phone: string;
}

interface OrderData {
  items: OrderItem[];
  totalAmount: number;
  customerInfo: CustomerInfo;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!requireCsrf(req, res)) return;

  try {
    const orderData: OrderData = req.body;

    // Валидация данных заказа
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ message: 'Корзина не может быть пустой' });
    }

    if (!orderData.customerInfo || !orderData.customerInfo.email) {
      return res.status(400).json({ message: 'Необходимо указать email' });
    }

    // Здесь можно добавить логику сохранения заказа в базу данных
    // Например, отправка на бэкенд сервер

    // Имитируем отправку на сервер (в реальном приложении здесь будет axios.post к серверу)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Возвращаем успешный ответ
    res.status(201).json({
      success: true,
      message: 'Заказ успешно создан',
      orderId: generateOrderId(),
    });
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
    });
  }
}

// Функция для генерации ID заказа
function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}
