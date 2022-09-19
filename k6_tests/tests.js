import http from 'k6/http';
import { check } from'k6';

export default function () {
  const response = http.get('http://localhost:8000/qa/questions?product_id=66642');
  check(response, {
    'status code should be 200': res => res.status === 200;
  })
}