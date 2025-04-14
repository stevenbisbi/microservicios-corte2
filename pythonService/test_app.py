import unittest
from app import app

class TestCalculation(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_calculo_valor_total(self):
        res = self.client.post('/CalculateValueTotal', json={
            "unit_price": 100,
            "quantity": 2
        })
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()["valueTotal"], 200)

if __name__ == '__main__':
    unittest.main()
