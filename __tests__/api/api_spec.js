const frisby = require('frisby');

let url = 'http://localhost:8000'

it('should be a teapot', function () {
  return frisby.get('http://httpbin.org/status/418')
    .expect('status', 418);
})

it('Get questions should succeed', function() {
  return frisby.get(url + '/qa/questions?product_id=66642')
    .expect('status', 200);
})

it('Get answer should succeed', function() {
  return frisby.get(url + '/qa/answers?question_id=234325')
    .expect('status', 200);
})

//FIXME: doesn't work with parameter in path
it('Add question should succeed', function() {
  return frisby.post(url + '/qa/questions?product_id=234325',
  {
    body: 'This is an question!',
    name: 'grompler',
    email: 'grompler@grompo.com'
  })
    .expect('status', 201);
})


//FIXME: doesn't work using params
it('Add answer should succeed', function() {
  return frisby.post(url + '/qa/answers',
  {
    body: 'This is an answer!',
    name: 'grompler',
    email: 'grompler@grompo.com'
  },
  {
    params: {
      question_id: 3518966
    }
  })
    .expect('status', 201);
})

it('Mark a question helpful should succeed', function() {
  return frisby.put(url + '/qa/questions/3518967/helpful')
    .expect('status', 204);
})

it('Report a question should succeed', function() {
  return frisby.put(url + '/qa/questions/3518967/report')
    .expect('status', 204);
})

it('Mark an answer helpful should succeed', function() {
  return frisby.put(url + '/qa/questions/3518967/helpful')
    .expect('status', 204);
})

it('Report an answer should succeed', function() {
  return frisby.put(url + '/qa/questions/3518967/report')
    .expect('status', 204);
})