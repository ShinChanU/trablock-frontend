import client from './client';

// 로그인
export const login = ({ username, password }) =>
  client.post('/api/auth/login', { username, password });

// 회원가입
export const signup = ({
  username,
  password,
  realName,
  nickname,
  birthday,
  phoneNum,
  gender,
  email,
}) =>
  client
    .post('/api/auth/signup', {
      username,
      password,
      realName,
      nickname,
      birthday,
      phoneNum,
      gender,
      email,
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

// // 로그인 상태 확인
export const check = () => client.get('/api/auth/check');

// 로그아웃
export const logout = () => client.post('/api/logout');
