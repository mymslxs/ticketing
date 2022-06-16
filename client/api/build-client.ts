import axios, { AxiosRequestHeaders } from 'axios';
import { GetServerSidePropsContext, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';

const buildClient = ({
  req,
}: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
  return axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    headers: req.headers as AxiosRequestHeaders,
  });
};

export default buildClient;
