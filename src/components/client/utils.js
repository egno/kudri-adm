export function newClient() {
  return {
    id: undefined,
    business_id: undefined,
    user_id: undefined,
    name: { forename: undefined, surname: undefined },
    phone: undefined,
    email: undefined,
    birth_date: undefined,
    discount: undefined,
    sex: undefined,
    notes: undefined
  };
}

export function clientPrefill(client) {
  if (!client) {
    client = newClient();
  }
  if (!client.name) {
    client.name = {};
  }
  return client;
}

export function clientToAPI(client) {
  let o = clientPrefill(client);
  o['id'] = undefined;
  o['business_id'] = undefined;
  o['user_id'] = undefined;
  return {
    id: client.id,
    business_id: client.business_id,
    user_id: client.user_id,
    j: o
  };
}

export function clientFromAPI(data) {
  let o = clientPrefill(data.j);
  o['id'] = data.id;
  o['business_id'] = data.business_id;
  o['user_id'] = data.user_id;
  return o;
}
