/*eslint-disable*/

const login = async (email, password) => {
  console.log('login', email, password);
  const response = await axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/api/v1/users/login',
    data: {
      email,
      password,
    },
  });
  document.cookie = `jwt=${response.data.token}`;
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
