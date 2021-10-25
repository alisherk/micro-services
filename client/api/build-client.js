import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server

    // to make request to services inside of k8s cluster specifically ingress-ngnx
    // http://[servicename].[servicename].svc.cluster.local
    return axios.create({
      baseURL:'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: '/',
    });
  }
};
