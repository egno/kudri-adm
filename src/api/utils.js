function alert(message, info) {
  let a = {
    message: message
  };
  if (info) {
    a.info = info;
  }
  return a;
}

export function makeAlert(err) {
  if (!err) {
    return alert('Ой! Что-то пошло не так...');
  }
  if (!err.response) {
    return alert('Сервер недоступен', err.message);
  }
  if (err.response.status === 401) {
    return;
  }
  if (err.response.status === 403) {
    return alert('Неправильный логин или пароль', err.response);
  }
  return alert(err.message, err.response);
}
