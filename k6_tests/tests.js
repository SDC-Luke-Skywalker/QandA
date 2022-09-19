import http from 'k6/http';
import { check, group, sleep, fail } from'k6';

// export default function () {
//    http.get('http://localhost:8000/qa/questions?product_id=66642');
// }

export const options = {
  vus: 1000,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate< 0.05'],
    http_req_duration: ['p(95)<100']
  },
  // iterations: 100
  // ext: {
  //   loadimpact: {
  //     projectID: 3601538,
  //     name: "Load Testing"
  //   }
  // }
}

export default function() {
  const res = http.get(`http://localhost:8000/qa/questions?product_id=3521570`);
  check(res, {
    'is status 200': (r) => r.status === 200,
  })
  // const res2 = http.put(`http://localhost:8000/qa/questions/3158967/report`);
  // check(res2, {
  //   'is status 204': (r) => r.status === 204,
  // })
  // const res3 = http.post(`http://localhost:8000/qa/questions?product_id=234325`, {
  //   body: 'This is an question!',
  //   name: 'grompler',
  //   email: 'grompler@grompo.com'
  // });
  // check(res3, {
  //   'is status 201': (r) => r.status === 201,
  // })
  sleep(0.5);
}
