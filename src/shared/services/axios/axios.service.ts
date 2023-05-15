import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export default class AxiosService {
  API_URL = 'https://apibioidprototipo.cloudmed.io/api/';

  Api = axios.create({
    headers: {
      Authorization:
        'Bearer cmtBNXhUVEI1ZUlpWDlWMU53Vyt0bE1FYzhjd3RBbmlJV1ltRTE2aXJ3OTJnWkpicVpNMEduZXBsUmpRY2NFUQ==',
    },
    baseURL: this.API_URL,
  });
}
