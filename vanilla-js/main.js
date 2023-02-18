// AXIOS GLOBAL
// what if we want some customization for every call? we can have global for that
axios.defaults.headers.common['X-Auth-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';



// GET REQUEST
function getTodos() {

  // Approach 1:
  /*
    axios({
      method: 'get',
      url: 'https://jsonplaceholder.typicode.com/todos',
      params: {
        _limit: 5
      }
    })
      .then (res => showOutput(res))
      .catch (err => console.log(err))
  */

  // Approach 2:
  /* 
    axios
      .get('https://jsonplaceholder.typicode.com/todos', {
        params: { _limit: 5 }
      })
      .then (res => showOutput(res))
      .catch (err => console.log(err))
  */

  // Approach 3:
    axios('https://jsonplaceholder.typicode.com/todos?_limit=5', {    // default method is get
      timeout: 5000                // we can have custom properties
    })
      .then (res => showOutput(res))
      .catch (err => console.log(err))
}



// POST REQUEST
function addTodo() {
  // Approach 1
  /*
    axios({
      method: 'post',
      url: 'https://jsonplaceholder.typicode.com/todos',
      data: {
        title: 'New Todo 27',
        completed: false
      }
    })
      .then (res => showOutput(res))
      .catch (err => console.log(err))
  */

  // Approach 2
    axios
      .post('https://jsonplaceholder.typicode.com/todos', {
        title: 'New Todo',
        completed: false
      })
      .then (res => showOutput(res))
      .catch (err => console.log(err))
}



// PUT/PATCH REQUEST - for updating data
function updateTodo() {
  // PUT = entirely replace the existing resource
  // PATCH = update existing resource incrementally

  axios
    .patch('https://jsonplaceholder.typicode.com/todos/1', {
      title: 'Updated todo',
      completed: true
    })
    .then (res => showOutput(res))
    .catch (err => console.log(err))
}



// DELETE REQUEST
function removeTodo() {
  axios
    .delete('https://jsonplaceholder.typicode.com/todos/1')
    .then (res => showOutput(res))
    .catch (err => console.log(err))
}



// SIMULTANEOUS DATA
function getData() {
  // axios.all() will take an array of requests and once all those requests (promises) are fulfilled then we get our response.
  
  // Approach 1
  /*
    axios
      .all([
        axios.get('https://jsonplaceholder.typicode.com/todos'),
        axios.get('https://jsonplaceholder.typicode.com/posts')
      ])
      .then (res => {
        console.log(res[0]);
        console.log(res[1]);
        showOutput(res[1]);
      })
      .catch (err => console.log(err))
  */

  // Approach 2 - we can add names for each of req in the request array using axios.spread()
  axios
    .all([
      axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
      axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
    ])
    .then (axios.spread((todos, posts) => showOutput(posts)))
    .catch (err => console.log(err))
}



// CUSTOM HEADERS
function customHeaders() {
  /*
   - when we have an authentication, like JWT
   - we might make request to login, validate it and give back a token 
   - which has to be sent that in header to access protected resources
   */
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'someJWTToken'
    }
  };

  axios
    .post(      // method
      'https://jsonplaceholder.typicode.com/todos',     // request url 
      {                       // request body data
        title: 'New Todo',
        completed: false,
      },
      config      // custom headers
    )
    .then (res => showOutput(res))
    .catch (err => console.log(err))
    
}



// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const options = {
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: {
      title: 'New todo',
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title = data.title.toUpperCase();
      return data;
    })
  }

  axios(options)
    .then (res => showOutput(res));
}



// ERROR HANDLING
function errorHandling() {
  axios
    .get('https://jsonplaceholder.typicode.com/todoss?_limit=5', {
      validateStatus: function(status) {      // validateStatus is a property with a value function having param status
        return status < 500;    // reject only if status is greater or equal to 500
      }
    })
    .then (res => showOutput(res))
    .catch (err => {
      if (err.response) {
        // Server responded with a status other than 200 range
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);

        if (err.response.status === 404) {
          alert ("Error: Page Not Found!");
        } else if (err.request) {
          // Request was made but no response
          console.log(err.request);
        } else {
          console.log(err.message);
        }
      }
    })
}



// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();

  axios
    .get('https://jsonplaceholder.typicode.com/todoss?_limit=5', {
      cancelToken: source.token
    })
    .then (res => showOutput(res))
    .catch (thrown => {
      if (axios.isCancel(thrown)) {
        console.log("Request cancelled", thrown.message);
      }
    })
  
  // when some condition is met we can cancel the above request
  if (true) {
    source.cancel('Request Cancelled as some condition is met');
  }
}



// INTERCEPTING REQUESTS & RESPONSES
// allow us to run some kind of functionality like a logger. eg: create a little logger for any req we make.
axios.interceptors.request.use(
  (config) => {
    // we have access to anything in the config object such as the method, url, params,...
    console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
)



// AXIOS INSTANCES
// we can have axios instances to have custom settings
const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

axiosInstance.get('/comments?_limit=5').then(res => showOutput(res));



// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}



// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);